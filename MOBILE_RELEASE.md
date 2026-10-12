# Shipping StoryFlow AI to Google Play and the App Store

The web app is wrapped with [Capacitor 8](https://capacitorjs.com). The same React code runs in the browser, in
`android/` and in `ios/`. GitHub Actions builds both apps, so you don't need a Mac or Android Studio to ship.

| | |
|---|---|
| App name | StoryFlow AI |
| Bundle / package ID | `com.mayanknext.storyflow` |
| Auth deep link | `com.mayanknext.storyflow://auth-callback` |
| Version | tag `vX.Y.Z` → version name; GitHub run number → build number |

## What already happens automatically

On every push, the **Android** workflow builds an installable debug APK (under the run's *Artifacts*) and the
**iOS** workflow compiles the app for the Simulator. You don't need any accounts or secrets for this.

When you push a tag such as `v1.0.0` (or click **Run workflow**), and the secrets below are set:
- **Android:** builds a signed `.aab` and uploads it to the Play Console *internal testing* track.
- **iOS:** archives, signs (Xcode cloud signing) and uploads to App Store Connect, so it lands in TestFlight.

## One-time setup (you have to do these yourself)

### 1. Supabase redirect URL (needed for Google sign-in and email confirmation in the apps)
Add `com.mayanknext.storyflow://auth-callback` to the project's allowed **Redirect URLs** (Lovable Cloud →
Users → Auth settings, or Supabase → Authentication → URL Configuration).

### 2. Account-deletion database function
Both stores require in-app account deletion, so **My stories → Delete account** calls `delete_own_account()`.
Apply `supabase/migrations/20261012070000_delete_own_account.sql` to the database, for example by asking
Lovable to run it or pasting it into the SQL editor.

### 3. Google Play ($25 one-time)
1. Create a developer account at <https://play.google.com/console> and create the app with package name
   `com.mayanknext.storyflow`.
2. Run `./scripts/create-android-keystore.sh` (needs a JDK) and add the four printed secrets to the GitHub repo.
3. Run the **Android** workflow once with *Run workflow*. Download `storyflow-release-aab` from the run and upload
   it **by hand** in Play Console → Testing → Internal testing. Google only accepts API uploads after the
   first manual one.
4. Create a service account with **Release manager** access (Play Console → Users and permissions), download its
   JSON key, and save the whole JSON as the `PLAY_SERVICE_ACCOUNT_JSON` secret. From then on, every tag uploads by
   itself.

### 4. Apple App Store ($99/year)
1. Join the Apple Developer Program: <https://developer.apple.com/programs/>.
2. In App Store Connect, create the app (**My Apps → +**) with bundle ID `com.mayanknext.storyflow`. Register
   the ID first under Certificates, Identifiers & Profiles → Identifiers if it isn't offered.
3. Go to App Store Connect → Users and Access → Integrations → **App Store Connect API**. Create a key with
   **Admin** access (Admin is required for cloud signing) and download the `.p8` file.
4. Add the GitHub secrets:
   - `APPLE_TEAM_ID`: the 10-character team ID from <https://developer.apple.com/account> → Membership
   - `ASC_KEY_ID`: the key ID
   - `ASC_ISSUER_ID`: the issuer ID shown above the keys list
   - `ASC_KEY_P8_BASE64`: the output of `base64 -i AuthKey_XXXX.p8 | tr -d '\n'`
5. Push a tag (`git tag v1.0.0 && git push origin v1.0.0`). The build shows up in TestFlight after Apple
   finishes processing it (usually 10–30 minutes).

### 5. Store listings (both stores, manual)
Both stores need this before you can submit for review:
- Screenshots (phone, plus iPad for iOS, since the app supports iPad).
- Short and full description, category, contact email.
- A **privacy policy URL**. The app stores email, display name and saved stories, and it sends
  pasted or uploaded text to an AI service to generate stories and narration.
- Data-safety (Play) / App Privacy (Apple) questionnaires, answered to match the point above.
- Content rating questionnaire (Play) and age rating (Apple).
- A demo account for reviewers: create one in the app and give the credentials in the review notes.

## Changes made for the native apps

- `src/lib/native.ts` is the only place that talks to Capacitor. On the web every helper falls back to the
  original browser behaviour, so the Lovable web app keeps working unchanged.
- **Google sign-in** opens in the system browser and returns through the deep link, because Google blocks OAuth
  inside embedded WebViews. On **iOS the Google button is hidden**: App Store guideline 4.8 would also require
  Sign in with Apple. Email/password works on every platform.
- **Download text / Export MP3** open the native share sheet (Save to Files, Drive, etc.), because
  `<a download>` does nothing inside a WebView. **Copy** uses the native clipboard.
- **Delete account** has been added to the library page (required by both stores).
- Safe-area padding for notches and the home indicator, status-bar text that follows the light or dark theme,
  and Android back-button handling.

## Day-to-day commands

```sh
npm run cap:sync      # build the web app and copy it into android/ and ios/
npm run android       # open in Android Studio (run on emulator/device from there)
npm run ios           # open in Xcode (Mac only)
npm run cap:assets    # regenerate icons/splash screens after editing files in assets/
```

## Keeping in sync with Lovable

This repository is a copy of the Lovable project taken on 2026-10-12. Lovable can't push here, so changes made
in Lovable won't show up in the apps automatically. Either keep editing in this repo, or connect the Lovable
project to GitHub (Lovable → GitHub → Connect) and copy these files into that repo:
`capacitor.config.ts`, `android/`, `ios/`, `assets/`, `scripts/`, `.github/workflows/`, `src/lib/native.ts`, plus
the small edits in `src/App.tsx`, `src/pages/Auth.tsx`, `src/pages/Library.tsx`,
`src/components/StoryOutput.tsx`, `src/index.css`, `index.html` and `package.json`.
