# <img src="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.svg?v=2" width="40"> Cookiemunch

Its a simple, customizable, minimal setup cookie plugin that allows your users to select which cookies to accept or decline. Go to [Cookiemunch](https://cookiemunch.dunks1980.com/) for documentation and demos.
<br />

If you wish to support this project please [buy me a coffee.](https://www.buymeacoffee.com/dunks1980) ☕
<br />
<br />

## To set up and run your local development:

<br />

Get the repo:
```
git clone https://github.com/Dunks1980/Cookiemunch.git
```
Then install dev dependencies:
```
npm install
```

<br />

To start a local server and make modifications:
```
npm run serve
```

To build the production ready package:
```
npm run build
```

To view the default bundled themes bundled in the npm package:
```
npm run default
```
<br />
<br />

## Making changes:

<br />

Run "npm run serve" then make some changes to the following files, the changes will live-reload, these are the files that get compiled to ./dist.

```
src/js/cookiemunch_custom.js

src/scss/cookiemunch_custom.scss

src/scss/cookiemunch_common_custom.scss

src/images/cookiemunch_custom.svg
```

<br />

## Building for production:

<br />

Run "npm run build", once complete the auto pre-fixed and minifed files will be available in ./dist as:

```
cookiemunch_custom.min.js

cookiemunch_custom.min.css

cookiemunch_custom.svg
```

If you would like to test the dist files after running build, <a href="https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer">Live Server</a> or something similar can be used to view index_custom.html, this uses the \*_custom.\* files from ./dist.

<br />

More information on configuring Cookiemunch can be found <a href="https://cookiemunch.dunks1980.com/">here</a>. 
