# <img src="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.svg?v=2" width="40"> Cookiemunch

Its a simple, customizable, minimal setup cookie plugin that allows your users to select which cookies to accept or decline. Go to [Cookiemunch](https://cookiemunch.dunks1980.com/) for documentation and demos.
<br />

If you wish to support this project please [buy me a coffee.](https://www.buymeacoffee.com/dunks1980) ☕
<br />
<br />

## Installation:

<br />

Download the ZIP or:
```
git clone https://github.com/Dunks1980/Cookiemunch.git
```
Then install dev dependencies:
```
npm install
```
<br />

## Development:
<br />

To start a local server with live-reload and make changes to the custom theme:
```
npm run custom
```
These are the custom theme files:

```
src/js/cookiemunch_custom.js

src/scss/cookiemunch_custom.scss

src/scss/cookiemunch_common_custom.scss

src/images/cookiemunch_custom.svg
```
<br />

From line 15 of src/scss/cookiemunch_custom.scss, these are the main colour controls. Making a change to just $main-body-bg and $main-body-text can drastically change its appearance.
```scss
// override theme:
$main-body-bg: #1b1d35;
$main-body-text: rgb(184, 178, 235);
$main-body-border-shadow: 0 10px 30px 0px rgba(0, 0, 0, 0.4);
$btn-border: 0px solid #fff;
$btn-text: #fff;
$btn-bg-decline: rgb(197, 49, 49);
$btn-bg-accept_select: #4b4b4b;
$btn-bg-accept_selected: rgb(49, 91, 197);
$btn-bg-accept_all: rgb(36, 146, 64);
$switch-on-bg: $btn-bg-accept_selected; 
$mix-btn-bg-with: $main-body-text;
$mix-btn-bg-with-percent: 65%;
```
All colour variables are in the file src/scss/cookiemunch_custom.scss but if you need further changes, they can be made in src/scss/cookiemunch_common_custom.scss.<br />

For the cookie image 3 options are included, If you choose to use your own design its ideal ratio is square 1:1, any type of image can be used but for best results .svg or .png with transparency are recommended.<br />

For any js customizations the file is src/js/cookiemunch_custom.js, if you add anything cool please send me a pull request and I will consider adding it to the main branch.

<br />

To start a local server and view/edit the default themes:
```
npm run default
```

<br />

## Building for production:
<br />

```
npm run build
```
Then answer 1 for custom (this will compile only the \*_custom\* files), or 2 for default (this will build the bundled default themes and not custom). Once complete the auto pre-fixed and minifed files will be available in ./dist. <br/>

Custom:
```
cookiemunch.min.js
cookiemunch_custom.min.css
cookiemunch_custom.svg
```
Default:
```
cookiemunch_flat_dark.min.css
cookiemunch_flat_dark.svg
cookiemunch_flat_light.min.css
cookiemunch_flat_light.svg
cookiemunch.min.css
cookiemunch.min.js
cookiemunch.svg
```

To test the build ./dist:
```
npm run dist
```
<br />

More information on configuring Cookiemunch can be found <a href="https://cookiemunch.dunks1980.com/">here</a>. 
