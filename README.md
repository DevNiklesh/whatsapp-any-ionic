## To set capacitor android studio path

```bash
$ export CAPACITOR_ANDROID_STUDIO_PATH=/snap/android-studio/current/android-studio/bin/studio.sh
```

## Androin SDK location

Open Android Studio code -> Tools -> SDK Manager -> SDK path is available in the popup

```bash
$ export ANDROID_SDK_ROOT=/home/dev/Android/Sdk
```

## Build Android With Icons

Step 1: 

1. Create resources folder at the Root of the project
2. Copy icon to resource folder
  - icon.png
  - splash.png
  - icon-background.png
  - icon-foreground.png
3. Copy icon-background.png & icon-foreground.png into android folder

Step 2:
run,

```bash
$ cordova-res android --skip-config --copy
```
