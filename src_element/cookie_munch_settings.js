var cookiemunch_options = {
  cookies: [{
      id: "gtm",
      name: "Google tag manager",
      used_for: "To collect analyitical data and monitor performance.",
      url_text: "Privacy",
      url: "https://policies.google.com/privacy",
      accepted_function: cookiemunch_gtm,
      declined_function: cookiemunch_gtm_off
    },
    {
      id: "ga",
      name: "some analylitics",
      used_for: "Some description of what the cookie is used for.",
      url_text: "Privacy & Terms",
      url: "https://dunks1980.com/",
      accepted_function: cookiemunch_ga,
      declined_function: cookiemunch_ga_off
    },
    {
      id: "tracker1",
      name: "some tracker",
      used_for: "Some description of what the cookie is used for.",
      url_text: "Privacy & Terms",
      url: "https://dunks1980.com/",
      accepted_function: "console.log('tracker1 accepted_function')",
      declined_function: "console.log('tracker1 declined_function')"
    },
    {
      id: "tracker2",
      name: "some tracker",
      used_for: "Some description of what the cookie is used for.",
      url_text: "Privacy & Terms",
      url: "https://dunks1980.com/",
      accepted_function: some_tracker,
      declined_function: some_tracker_off
    },
  ],
  required_cookies: [{
      name: "Cloudflare",
      used_for: "Cookie is set by Cloudflare to speed up their load times and for threat defense services. It is does not collect or share user identification information.",
      url_text: "Privacy policy",
      url: "https://www.cloudflare.com/en-gb/privacypolicy/"
    },
    {
      name: "Cookiemunch",
      used_for: "Cookies are set by Cookiemunch to remeber users cookie preferences. It does not collect or share user identification information.",
      url_text: "More infomation",
      url: "https://cookiemunch.dunks1980.com/"
    },
    {
      name: "Cookiemunch",
      used_for: "Cookies are set by Cookiemunch to remeber users cookie preferences. It does not collect or share user identification information.",
      url_text: "More infomation",
      url: "https://cookiemunch.dunks1980.com/"
    }
  ],
};

cookiemunch(cookiemunch_options);

var message_el = document.getElementById("message-log");
var message = '';

function addmessage() {
  setTimeout(function () {
    message_el.innerHTML = '';
  }, 0);
  setTimeout(function () {
    message_el.innerHTML = message;
  }, 500);
  setTimeout(function () {
    message = '';
  }, 1000);
}

function cookiemunch_gtm() {
  message += '<div>Accepted Google tag manager, function fires and 🍪 added!</div>';
  addmessage();
}

function cookiemunch_gtm_off() {
  // window['ga-disable-G-5WC53Z2SLN'] = true;
  message += '<div>Declined Google tag manager, function fires and 🍪 removed!</div>';
  addmessage();
}

function cookiemunch_ga() {
  message += '<div>Accepted some analylitics, function fires and 🍪 added!</div>';
  addmessage();
}

function cookiemunch_ga_off() {
  message += '<div>Declined some analylitics, function fires and 🍪 removed!</div>';
  addmessage();
}

function some_tracker() {
  message += '<div>Accepted some tracker, function fires and 🍪 added!</div>';
  addmessage();
}

function some_tracker_off() {
  message += '<div>Declined some tracker, function fires and 🍪 removed!</div>';
  addmessage();
}




var switchThemeButton = document.getElementById('theme-change');
switchThemeButton.onclick = function() {
  switchTheme();
};


function switchTheme() {
  var ccookieMunchCustomElements = document.querySelectorAll('cookie-munch');
  [].forEach.call(ccookieMunchCustomElements, function(el) {
    var cssFile = el.getAttribute('css-file');
    console.log(cssFile);

    if (cssFile === 'https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.min.css') {
      el.setAttribute('css-file', 'https://unpkg.com/@dunks1980/cookiemunch/cookiemunch_flat_dark.min.css');
      document.body.style.background = '#101010';
      document.body.style.color = '#fff';


    } else {
      el.setAttribute('css-file', 'https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.min.css');
      document.body.style.background = null;
      document.body.style.color = null;
    }


  });
}


