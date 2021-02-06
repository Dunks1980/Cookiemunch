# <img src="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.svg?v=2" width="40"> Cookiemunch

Its a simple, customizable, minimal setup cookie plugin that allows your users to select which cookies to accept or decline. Goto [Cookiemunch](https://cookiemunch.dunks1980.com/) for documentation and to see it in action.

<br />

## How do I install it?
```javascript
npm i @dunks1980/cookiemunch --save
```
<br />

Vue.js 3 example:
```javascript
<template>
    <img alt="Vue logo" src="./assets/logo.png" />
    <h1>{{ cookiemunch_message }}</h1>
</template>
    
<script>
    import { cookiemunch } from "@dunks1980/cookiemunch";
    import svgimage from "@dunks1980/cookiemunch/cookiemunch.svg";
    import "@dunks1980/cookiemunch/cookiemunch.min.css";
    
    export default {
    name: "App",
    data() {
        return {
            cookiemunch_options: undefined,
            cookiemunch_message: undefined,
        };
    },
    mounted() {
        let vm = this;
        this.cookiemunch_options = {
        settings: {
            first_visit_checked: true,
            cookie_title: "Cookiemunch cookies",
            cookie_image: svgimage,
            start_dropdown_closed: true,
        },
        cookies: [
            {
                id: "gtm",
                name: "Google tag manager",
                used_for: "To collect analyitical data and monitor performance.",
                url_text: "Privacy",
                url: "https://policies.google.com/privacy",
                accepted_function: () => {
                    window.dataLayer = window.dataLayer || [];
                    window["ga-disable-YOUR-ID"] = false;
                    function gtag() {window.dataLayer.push(arguments);}
                    gtag("js", new Date());
                    gtag("config", "YOUR-ID");
                    vm.cookiemunch_message =
                    "Accepted Google tag manager, function fires and 🍪 added!";
                },
                declined_function: () => {
                    window["ga-disable-YOUR-ID"] = true;
                    vm.cookiemunch_message =
                    "Declined Google tag manager, function fires and 🍪 removed!";
                },
            },
        ],
        required_cookies: [
                {
                    name: "Cloudflare",
                    used_for: "Cookie is set by Cloudflare to speed up their load times...",
                    url_text: "Privacy policy",
                    url: "https://www.cloudflare.com/en-gb/privacypolicy/",
                },
            ],
        };
        cookiemunch(this.cookiemunch_options);
        },
    };
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
```
<br />
<br />

Or can be used without package manager: 
```html
<link rel="stylesheet" href="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.min.css">
<script defer src="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.min.js"></script>
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

window.cookiemunch(options);

function add_example_script() {
    console.log("add_example_script fired!!!");
}
function remove_example_script() {
    console.log("remove_example_script fired!!!");
}
```

