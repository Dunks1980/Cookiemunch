# <img src="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.svg?v=2" width="40"> Cookiemunch

Its a simple, customizable, minimal setup cookie plugin that allows your users to select which cookies to accept or decline. Go to [Cookiemunch](https://cookiemunch.dunks1980.com/) for documentation and demos.
<br />

If you wish to support this project please [buy me a coffee.](https://www.buymeacoffee.com/dunks1980) ☕
<br />
<br />
## How do I install it?
```javascript
npm i @dunks1980/cookiemunch --save
```

<br />

As a custom element:

Add the following element and script tag to the body of your web page.

The custom element option is best for preventing CSS on the page interfering with Cookiemunch's CSS.

```html
<cookie-munch css-file="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.min.css"></cookie-munch>
<script src="https://unpkg.com/@dunks1980/cookiemunch/cookie_munch_element.min.js"></script>
```

<br />

Without package manager: 

Add the following script and style tags inside the head of your web page.

```html
<script src="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.min.css">
```

<br />

Optional themes: 
```html
<!-- https://unpkg.com/@dunks1980/cookiemunch/cookiemunch_flat_light.min.css -->
<!-- https://unpkg.com/@dunks1980/cookiemunch/cookiemunch_flat_dark.min.css --> 
```



<br />

Boilderplate settings:

This code should run after Cookiemunch scripts have loaded.

Settings are optional, tweak to your needs.

```html
<script>
cookiemunch_options = {
  settings: {
    reload: false,
    required: false,
    hide_icon: false,
    cookies_to_exclude: [],
    keep_all_cookies: false,
    first_visit_checked: false,
    start_dropdown_closed: false,
    check_switch_icons: false,
    cookies_duration: 365,
    cookies_secure: false,
    cookie_image: 'https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.svg',
    cookie_title: 'Cookies settings',
    cookie_optional: 'Optional',
    cookie_required: 'Required',
    cookie_accept_label: 'Allow Cookies:',
    cookie_required_label: 'These Cookies are required in order for the site to function.',
    cookie_button_none: 'None',
    cookie_button_required: 'Required',
    cookie_button_select: 'Select',
    cookie_button_selected: 'Selected',
    cookie_button_all: 'All',
    cookie_button_no: 'No',
    cookie_button_yes: 'Yes',
    cookie_button_agree: 'Close'
  },
  cookies: [
    {
      id: 'Optional Example',
      group: '',
      name: 'Optional Example',
      used_for: 'Description or what this cookie is for.',
      url_text: 'Read more',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
      accepted_function: accepted_function,
      declined_function: declined_function
    }
  ],
  required_cookies: [
    {
      name: 'Essential cookies',
      used_for: 'these are cookies that are either: used solely to carry out or facilitate the transmission of communications over a network; or. strictly necessary to provide an online service (e.g. our website or a service on our website) which you have requested.',
      url_text: 'Read more',
      url: 'https://gdprprivacypolicy.org/cookies-policy/'
    }
  ]
};

function accepted_function() {
  console.log("accepted_function");
}

function declined_function() {
  console.log("declined_function");
}

// loads Cookiemunch with the above settings
cookiemunch(cookiemunch_options);
</script>
```