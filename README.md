This is a hybrid iOS/Android/Web application built using [Capacitor.js](https://capacitorjs.com/) and [Ionic React Components](https://ionicframework.com/). The web app is bundled using [Parcel.js](https://parceljs.org/) into a bundle that is then loaded into the iOS and Android projects to run a web view. The app uses the NYPLQA library of qa-web.librarysimplified.org circulation manager as a backend.

## Getting Started

There are two ways to run the app. Development mode, and production mode.

### Production Mode
In production mode, you bundle the application into a set of html, css and js files in the `/out` directory. That bundle is then copied into the iOS and Android projects respectively, and then the native project is run via either XCode or Android Studio. The steps are:

1. Install node modules (if you haven't already): `npm i`
2. Ensure the `capacitor.config.ts` config is properly set up. The `server.hostname` should be `nypl-hybrid.com`, and should have no other properties (specifically not `url`, that is for development).
3. Sync the `capacitor.config.ts` file changes to the native projects: `npx cap sync`
4. Build the web app: `npm run build`
5. Copy the built files into the native projects: `npx cap copy`
6. Open the native project in XCode or Android Studio and run it.

**Note:** when switching between dev and production mode, for some reason it is occasionally necessary to delete the `.parcel-cache` directory before running `npm run build`. Do this if you notice that your changes are not being reflected as expected.

### Dev Mode
In dev mode, the web app files are served from you localhost and rebuilt on any code change. This means that when a change is made to the React code, it should almost instantly rebuild and be reflected in the iOS/Android/Web app running in dev mode. 

1. Install node modules (if you haven't already): `npm i`
2. Change `capacitor.config.ts` to tell the native apps that the web bundle is served from localhost, not found on the disk. Set `server.url` to `http://localhost:3000`
3. Sync the config changes to the native projects: `npx cap sync`
4. Start the development server at http://localhost:3000: `npm run dev`
5. Run the native project in XCode or Android Studio. You can also visit http://localhost:3000 to see the app running in the browser (also in the simulator).

**Android development:** Android does not allow you to load insecure content (over http instead of https), which means that it refuses to load from `http://localhost:3000`. I think there is a way to disable this security feature, but I wasn't able to figure it out personally. We could also serve the local files over https, but that would require setting up the proper certificate. I chose instead to only run android in production mode for now.

**Note:** when switching between dev and production mode, for some reason it is occasionally necessary to delete the `.parcel-cache` directory before running `npm run dev`. Do this if you notice that your changes are not being reflected as expected.

## Native Functionality

I am using a few [Capacitor Plugins](https://capacitorjs.com/docs/plugins), specifically [Storage](https://capacitorjs.com/docs/apis/storage) and [Filesystem](https://capacitorjs.com/docs/apis/filesystem). I use Storage to store the user's token upon sign in. This uses `UserDefaults` on iOS, `SharedPreferences` on Android, and `localStorage` on the web. I use Filesystem to save publication files to the filesystem after downloading. 

I also built a [custom plugin](https://capacitorjs.com/docs/plugins/creating-plugins) for iOS to open a local ePub file in the R2 Reader (`R2Plugin.swift`). You can access the reader by clicking "View sample" in the header of the "Browse" tab on iOS. 

## Functionality and errors

You can sign in, borrow books, download books, return books etc. I did not do any error handling really, so sometimes nothing will happen when trying to borrow/return/download, and it's usually because some error occurred during the request to the CM.

## Inspection and debugging

There are two places to inspect the application, depending what part you're trying to debug. You can open a web inspector to see the HTMl markup, js sources, console logs, network requests, etc. When running the iOS app in a simulator or local device, open safari, click develop, select the device/simulator, and then choose to inspect "localhost". You then have a web inspector just like a normal web page. 

On Android, open Chrome, go to `chrome://inspect`, and click "inspect" beneath the emulator device.

On both platforms, native logs and code can be debugged as normal via XCode or Android Studio.
