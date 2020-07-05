# PWA Creation Steps

## Manifest.json
Create a manifest.json file (in root directory or wherever you want) and specify the following key value pairs
- name: Name of the app
- short_name: Name of the app when downloaded (displayed under icon).
- start_url: Starting url of the app
- display: Browser UI to be shown. (standalone hides the URL address bar)
- background_color: Background color of the app. For splash screen.
- theme_color: Thematic color of the app. For splash screen.
- orientation: Orientation of the app. Can specify starting orientation or lock the orientation
- icons: Icons to be used. Common sizes (square): 72, 96, 128, 144, 152, 192, 384, 512

Link to the manifest.json file in every html file.

## IOS Support
For IOS support add the following to every html file

	<link rel="apple-touch-icon" href="/path/to/icon(96x96)" />
	<meta name="apple-mobile-web-app-status-bar" content="#XXXXXX" />

## Theme Color Meta Tag
Add the following to every html file

	<meta name="theme-color" content="#FFE1C4">

## Create a Service Worker file. 
Create a sw.js file to be registered later.

Service worker lifecycles & events:
- Install
- Activate
- Fetch

You need all three defined for Google to prompt users to download app as a PWA

## Register Service Workers
You can register service workers in any JavaScript file (e.g. app.js) with the following

	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("/route/to/sw.js")
			.then((reg) => console.log("This callback runs when sw is registered successfuly", reg))
			.catch((err) => console.log("This callback runs when sw is not registered ", err));
	}

## Pre-Caching Assets

