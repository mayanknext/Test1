import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mayanknext.storyflow",
  appName: "StoryFlow AI",
  webDir: "dist",
  ios: {
    contentInset: "never",
    scheme: "StoryFlow",
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#FFFFFF",
      showSpinner: false,
    },
    SystemBars: {
      insetsHandling: "css",
      initialViewportFit: "cover",
    },
    Keyboard: {
      resize: "body",
    },
  },
};

export default config;
