# Open eBooks Hybrid

This is a proof of concept of a hybrid mobile application for NYPL e-reading teams. It uses Capacitor to provide the web/native bridge and builds a simple web application using React and Parcel that is bundled into the native applications and run inside a webview.

The iOS example also has the ability to open a proof of concept EPUB from the local filesystem.

## Repository Structure

```
/
  index.html                  // web app entrypoint
  package.json                // web app package metadata and dependencies
  capacitor.config.ts         // Capacitor configuration settings
  App.tsx                     // web app router and TS entrypoint
  screens/                    // web app screens
  lib/                        // TS utilities and resources for web app
    r2Plugin.ts               // Defines the TS interface of R2Plugin.swift
  ios/                        // XCode iOS project
    App/App/R2Plugin.swift    // Capacitor plugin POC to open a local EPUB
  android/                    // Android project
```

## Development workflow

It might be first helpful to run the app in production mode, as it's a bit simpler:

1. Build the web app into a bundle of files starting from a single `index.html` file with `npm run build`.
2. Sync the bundled files from `out/` to the iOS and Android applications with `npx cap sync`. This will also sync the configuration specified in capacitor.config.ts to the respective iOS/Android config settings.
3. Run the app with `npx cap run iOS` or `npx cap run android`.

### A couple things to keep in mind:

1. When running the app this way (in production mode), the `config.server.url` field should be commented out in `capacitor.config.ts`. This setting is useful for running the app in development mode with live code reloading.
1. Once you have built the web code and sync'd it to the native projects, you can also run the app in XCode or Android Studio as you normally would. I found it easier to use Android Studio than `npx cap run android` personally.

### Live Reloading

The app can also be run in development mode so that code changes in the web code will be immediately reflected in the simulators. To do this, we start a development server to serve the web app at `http://localhost:3000` and tell the native projects to point their webviews to that url. To do this:

1. Start the local development server with `npm run dev`
1. You can now see the web app in a browser at `http://localhost:3000`
1. Add `http://localhost:3000` to the `config.server.url` setting in `capacitor.config.ts`
1. Run `npx cap sync` to sync this setting to the iOS and Android projects
1. Run `npx cap run ios` or `npx cap run android` to start the native projects pointed to the local dev server.

### A couple notes:

1. I was not able to get android to work in live mode because the security policy refused to load an insecure (http) server. Apparently there is a setting somewhere on android to allow it, but I didn't have time to investigate fully.

## Debugging

The web code can be debugged in Safari for the iOS simulator and Chrome for the Android simulator using normal devtools as if it were a website. The native code can be debugged as normal in XCode and Android Studio when you run the projects using those tools instead of `npx cap run ...`

**To debug iOS webview:**

1. Run the app in the iOS simulator using XCode or `npx cap run ios`
1. Open Safari, click `development` and then you will see a Simulators header listing `localhost` beneath. Clicking that will open Safari devtools.

**To debug Android in Chrome:**

... I actually can't remember right now and am running out of time. It is a similar process though that should be discoverable through capacitor docs.

---

I hope this helps, and good luck everyone!
