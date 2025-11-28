# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

### Mioty

To measure the step we need a smartphone with a built-in accelerometer and for position and speed we need an integrated GPS, after that we need to install those libraries
expo install expo-sensors expo-location

Run the following commands to build the apk of you app
npx expo prebuild
npx eas build -p android --profile preview

If you want to stop the build running run the command 
eas build:cancel

TO list the build in process run
eas build:list
To delete a build in process or in attent run 
eas build:cancel id_build_process

Rehefa lany ny quota ana built
npx expo prebuild
eas build --local -p android
./build/android/*.apk
Transformer mon .AAB eb un >APK installable
wget https://github.com/google/bundletool/releases/download/1.17.0/bundletool-all-1.17.0.jar -O bundletool.jar
Generer le fichier .apks
java -jar bundletool.jar build-apks \
  --bundle=/home/mioty/projet_fabrication_numerique/react_native/Be_my_eyes/build-1763616901744.aab \
  --output=app.apks \
  --mode=universal
Extraire l'APK depuis le apks
unzip app.apks -d output_apks
L'apk se trouve dans 
output_apks/universal.apk

eas build --local -p android --profile preview --output=app.apk

