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













<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />


















Vue.js 3 example:
```html
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h1>{{ cookiemunch_message }}</h1>
</template>
    
<script>
import { cookiemunch } from "@dunks1980/cookiemunch";
import svgimage from "@dunks1980/cookiemunch/cookiemunch.svg"; // optional
import "@dunks1980/cookiemunch/cookiemunch.min.css";

// Light & Dark themes: (replace css import)
// @dunks1980/cookiemunch/cookiemunch_flat_light.min.css
// @dunks1980/cookiemunch/cookiemunch_flat_dark.min.css

export default {
  name: "App",
  data() {
    return {
      cookiemunch_options: {
        settings: undefined,
        cookies: undefined, 
        required_cookies: undefined
      },
      cookiemunch_message: undefined,
    };
  },
  mounted() {
    let vm = this;

    this.cookiemunch_options.settings = {
      cookie_title: "Cookiemunch cookies",
      cookie_image: svgimage,
    };

    this.cookiemunch_options.cookies = [
      {
        id: "gtm",
        name: "Google tag manager",
        used_for: "To collect analyitical data and monitor performance.",
        url_text: "Privacy",
        url: "https://policies.google.com/privacy",
        accepted_function: () => {
          // example google tag code
          window.dataLayer = window.dataLayer || [];
          window["ga-disable-YOUR-ID"] = false;
          function gtag() {
            window.dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "YOUR-ID");
          vm.cookiemunch_message =
            "Accepted Google tag manager, function fires and 🍪 added!";
        },
        declined_function: () => {
          window["ga-disable-YOUR-ID"] = true;
          vm.cookiemunch_message =
            "Declined Google tag manager, function fires and 🍪 removed!";
        }
      }
    ];

    this.cookiemunch_options.required_cookies = [
      {
        name: "Cloudflare",
        used_for: "Cookie is set by Cloudflare to speed up their load times...",
        url_text: "Privacy policy",
        url: "https://www.cloudflare.com/en-gb/privacypolicy/",
      },
    ];

    cookiemunch(this.cookiemunch_options);
  }
}
</script>
```
<br />
<br />

Or can be used without package manager: 
```html
<script src="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.min.css">

<!-- Light & Darks themes (replace href above) -->
<!-- https://unpkg.com/@dunks1980/cookiemunch/cookiemunch_flat_light.min.css -->
<!-- https://unpkg.com/@dunks1980/cookiemunch/cookiemunch_flat_dark.min.css -->
```
example:
```javascript
var options = {
  settings: {
    cookie_title: 'My site cookies'
  },
  cookies: [
    {
      id: "unique_name_id_cookie_object",
      name: "example tag manager",
      used_for: "To collect analyitical data and monitor performance.",
      url_text: "Privacy",
      url: "https://google.com",
      accepted_function: add_example_script,
      declined_function: remove_example_script
    }
  ]
};

cookiemunch(options);

function add_example_script() {
  console.log("add_example_script fired!!!");
}
function remove_example_script() {
  console.log("remove_example_script fired!!!");
}
```

