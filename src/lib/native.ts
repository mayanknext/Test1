// Bridges the few browser APIs that don't work inside the iOS/Android WebView
// (file downloads, OAuth redirects, deep links) to Capacitor plugins.
// On the web every helper falls back to the original browser behaviour.
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Clipboard } from "@capacitor/clipboard";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { StatusBar, Style } from "@capacitor/status-bar";
import { supabase } from "@/integrations/supabase/client";

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

// Must match appId in capacitor.config.ts, the Android intent filter and the iOS URL scheme,
// and be listed under Supabase Auth → URL configuration → Redirect URLs.
export const AUTH_CALLBACK_URL = "com.mayanknext.storyflow://auth-callback";

/** Where Supabase should send the user back after OAuth or an email confirmation link. */
export const authRedirectUrl = () => (isNative ? AUTH_CALLBACK_URL : `${window.location.origin}/`);

export const copyText = async (text: string) => {
  if (isNative) {
    await Clipboard.write({ string: text });
  } else {
    await navigator.clipboard.writeText(text);
  }
};

const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/** Saves a file: a normal download on the web, the native share sheet ("Save to Files", Drive, etc.) in the app. */
export const saveFile = async (blob: Blob, filename: string) => {
  if (!isNative) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  const { uri } = await Filesystem.writeFile({
    path: filename,
    data: await blobToBase64(blob),
    directory: Directory.Cache,
  });
  await Share.share({ title: filename, files: [uri] });
};

/**
 * Google blocks OAuth inside embedded WebViews, so in the app we open the provider
 * in the system browser and come back through the AUTH_CALLBACK_URL deep link.
 */
export const signInWithGoogle = async () => {
  if (!isNative) {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: authRedirectUrl() },
    });
  }

  const result = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: AUTH_CALLBACK_URL, skipBrowserRedirect: true },
  });
  if (result.data?.url) await Browser.open({ url: result.data.url });
  return result;
};

// Supabase returns tokens in the fragment (implicit flow) or a ?code= (PKCE flow).
const completeAuthFromUrl = async (url: string) => {
  const parsed = new URL(url);
  const params = new URLSearchParams(parsed.hash.replace(/^#/, ""));
  parsed.searchParams.forEach((value, key) => params.set(key, value));

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const code = params.get("code");

  if (accessToken && refreshToken) {
    await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  } else if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
};

/** Call once at startup. Returns a cleanup function. */
export const initNativeShell = (onNavigate: (path: string) => void) => {
  if (!isNative) return () => {};

  document.documentElement.classList.add("native-app", `platform-${platform}`);

  const syncStatusBar = () => {
    const dark = document.documentElement.classList.contains("dark");
    StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {});
  };
  syncStatusBar();
  const themeObserver = new MutationObserver(syncStatusBar);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  const urlListener = App.addListener("appUrlOpen", async ({ url }) => {
    if (!url.startsWith(AUTH_CALLBACK_URL)) return;
    await Browser.close().catch(() => {});
    await completeAuthFromUrl(url);
    onNavigate("/library");
  });

  // Android hardware back button: go back in history, or leave the app from the home screen.
  const backListener = App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) window.history.back();
    else App.exitApp();
  });

  return () => {
    themeObserver.disconnect();
    urlListener.then((l) => l.remove());
    backListener.then((l) => l.remove());
  };
};
