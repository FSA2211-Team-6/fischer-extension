# Fischer Chrome Extension

## Description

The extension app for Fischer fact checker.

Run to build:

```bash:bash
npm run export
```

## Usage

If you want to use the ChromeAPI, you will need to use `dynamic import`.

If you get webpack errors during the build, please change the import path in `/src/scripts` to a relative path.

If you are not using the ChromeAPI, you can develop with `npm run dev`

Follow Next.js for routing.

Select `/extensions`.

## TODO

If you are using the ChromeAPI, you have to `npm run export` every time you want to check, which is not very efficient for development.
