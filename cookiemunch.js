/*eslint no-self-assign: ["error", {"props": false}]*/
var cookiemunch_function = function (passed_opts, block_functions) {

  var cookies_object;
  var required_cookies;
  var plugin_settings;
  var toggle_view_el;
  var duration = 300;
  var state_map = [];

  function cookiemunch_set_settings() {
    if (passed_opts.settings) {
      plugin_settings = {
        reload: passed_opts.settings.reload || false,
        hide_icon: passed_opts.settings.hide_icon || false,
        cookies_to_exclude: passed_opts.settings.cookies_to_exclude || [],
        keep_all_cookies: passed_opts.settings.keep_all_cookies || false,
        first_visit_checked: passed_opts.settings.first_visit_checked || false,
        start_dropdown_closed: passed_opts.settings.start_dropdown_closed || false,
        cookie_image: passed_opts.settings.cookie_image || 'https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.svg',
        cookie_title: passed_opts.settings.cookie_title || 'Cookies settings',
        cookie_optional: passed_opts.settings.cookie_optional || 'Optional',
        cookie_required: passed_opts.settings.cookie_required || 'Required',
        cookie_accept_label: passed_opts.settings.cookie_accept_label || 'Allow Cookies:',
        cookie_required_label: passed_opts.settings.cookie_required_label || 'These Cookies are required in order for the site to function.',
        cookie_button_none: passed_opts.settings.cookie_button_none || 'None',
        cookie_button_required: passed_opts.settings.cookie_button_required || 'Required',
        cookie_button_select: passed_opts.settings.cookie_button_select || 'Select',
        cookie_button_selected: passed_opts.settings.cookie_button_selected || 'Selected',
        cookie_button_all: passed_opts.settings.cookie_button_all || 'All',
        cookie_button_no: passed_opts.settings.cookie_button_no || 'No',
        cookie_button_yes: passed_opts.settings.cookie_button_yes || 'Yes',
        cookie_button_agree: passed_opts.settings.cookie_button_close || 'Close'
      };
    } else {
      plugin_settings = {
        reload: false,
        hide_icon: false,
        cookies_to_exclude: [],
        keep_all_cookies: false,
        first_visit_checked: false,
        start_dropdown_closed: false,
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
      };
    }
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 500));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function checkCookie(val) {
    var has_cookie = getCookie(val);
    if (has_cookie != "") {
      return has_cookie;
    } else {
      return false;
    }
  }

  function deleteCookie(val) {
    document.cookie = val + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  function deleteAllCookies() {
    if (plugin_settings.keep_all_cookies) {
      return false;
    }
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
      var cookie = cookies[c];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (plugin_settings.cookies_to_exclude.indexOf(name.trim()) > -1) {
        // leave this cookie in
      } else {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
          var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
            '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
          var p = location.pathname.split('/');
          document.cookie = cookieBase + '/';
          while (p.length > 0) {
            document.cookie = cookieBase + p.join('/');
            p.pop();
          }
          d.shift();
        }
      }
    }
  }

  function cookie_value_selected() {
    var check_this_cookie = 'cookiemunch_' + 'option_selected';
    setCookie(check_this_cookie, true, 365);
  }

  function remove_all_cookies() {
    deleteAllCookies();
    for (var i = 0; i < cookies_object.length; i++) {
      var check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
      deleteCookie(check_this_cookie);
      document.getElementById(check_this_cookie).checked = false;
      if (!plugin_settings.reload) {
        cookies_object[i].declined_function();
      }
    }
  }

  window.cookiemunch_remove_all_cookies = function () {
    if (!document.getElementById("cookie_munch_element")) {
      return false;
    }
    remove_all_cookies();
    deleteCookie('cookiemunch_option_selected');
    cookiemunch_load_plugin();
  };

  window.cookiemunch_decline = function () {
    if (!document.getElementById("cookie_munch_element")) return false;
    for (var i = 0; i < cookies_object.length; i++) {
      var check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
      document.getElementById(check_this_cookie).checked = false;
    }
    cookiemunch_accept_selected();
  };

  window.cookiemunch_accept_all = function () {
    if (!document.getElementById("cookie_munch_element")) return false;
    for (var i = 0; i < cookies_object.length; i++) {
      var check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
      document.getElementById(check_this_cookie).checked = true;
    }
    cookiemunch_accept_selected();
  };

  window.cookiemunch_accept_selected = function () {
    if (!document.getElementById("cookie_munch_element")) return false;
    if (state_map_match() && checkCookie('cookiemunch_option_selected')) {
      slideUp(toggle_view_el, duration);
      return false;
    }
    deleteAllCookies();
    for (var i = 0; i < cookies_object.length; i++) {
      var check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
      var is_checked = document.getElementById(check_this_cookie).checked;
      if (is_checked) {
        setCookie(check_this_cookie, true, 365);
        if (!plugin_settings.reload) {
          cookies_object[i].accepted_function();
        }
      } else {
        deleteCookie(check_this_cookie);
        if (!plugin_settings.reload) {
          cookies_object[i].declined_function();
        }
      }
    }
    slideUp(toggle_view_el, duration);
    cookie_value_selected();
    if (plugin_settings.reload) {
      setTimeout(function () {
        location.reload();
      }, Number(duration + 100));
    }
  };

  function state_map_record() {
    state_map = [];
    [].forEach.call(cookies_object, function (item) {
      var is_checked = document.getElementById('cookiemunch_' + item.id).checked;
      state_map.push(is_checked);
    });
  }

  function state_map_match() {
    match_map = [];
    [].forEach.call(cookies_object, function (item) {
      var is_checked = document.getElementById('cookiemunch_' + item.id).checked;
      match_map.push(is_checked);
    });
    for (var i = 0; i < match_map.length; i++) {
      if (match_map.length !== state_map.length) return false;
      if (match_map[i] !== state_map[i]) return false;
    }
    return true;
  }


  /* TOOGLE */
  var toggling_cookiemunch_popup;
  window.cookiemunch_toggle_popup = function () {
    setTimeout(function () {
      if (!document.getElementById("cookie_munch_element")) {
        return false;
      }
      if (toggling_cookiemunch_popup) {
        return false;
      }
      if (!checkCookie('cookiemunch_option_selected')) {
        return false;
      }
      if (!plugin_settings.hide_icon) {
        if (window.getComputedStyle(toggle_view_el).display === 'none') {
          return slideDown(toggle_view_el, duration);
        } else {
          return slideUp(toggle_view_el, duration);
        }
      } else {
        if (document.getElementById("cookie_munch_element").className === "closed-fully") {
          return slideDown(toggle_view_el, duration);
        } else {
          return slideUp(toggle_view_el, duration);
        }
      }
    }, 100);
  };

  /* closes panel */
  var slideUp = function (target, duration) {
    toggling_cookiemunch_popup = true;

    if (plugin_settings.hide_icon) {
      //document.getElementById("cookie_munch_element").setAttribute("class", "closed");
      document.getElementById("cookie_munch_element").setAttribute("style", "transition: 0.3s ease-in-out; opacity:0;");
      window.setTimeout(function () {
        document.getElementById("cookie_munch_element").setAttribute("class", "closed-fully");
        toggling_cookiemunch_popup = false;
      }, duration);
    } else {
      document.getElementById("cookie_munch_element").setAttribute("style", "");
      document.getElementById("cookie_munch_element").setAttribute("class", "closed");
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.boxSizing = 'border-box';
      target.style.height = target.offsetHeight + 'px';
      var prevOffSetHeight = target.offsetHeight;
      target.offsetHeight = prevOffSetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(function () {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        document.getElementById("cookie_munch_element").setAttribute("class", "closed-fully");
        toggling_cookiemunch_popup = false;
      }, duration);
    }
  };

  /* opens panel */
  var slideDown = function (target, duration) {
    toggling_cookiemunch_popup = true;
    state_map_record();
    if (plugin_settings.hide_icon) {
      document.getElementById("cookie_munch_element").setAttribute("style", "transition: 1s ease-in-out; opacity:1;");
      document.getElementById("cookie_munch_element").setAttribute("class", "open");
      if (checkCookie('cookiemunch_' + 'option_selected')) {
        document.querySelector(".close_panel").setAttribute("style", "display: block;");
      } else {
        document.querySelector(".close_panel").setAttribute("style", "display: none;");
      }
      window.setTimeout(function () {
        document.getElementById("cookie_munch_element").setAttribute("class", "open-fully");
        toggling_cookiemunch_popup = false;
      }, duration);
    } else {
      document.getElementById("cookie_munch_element").setAttribute("style", "");
      document.getElementById("cookie_munch_element").setAttribute("class", "open");
      target.style.removeProperty('display');
      var display = window.getComputedStyle(target).display;
      if (display === 'none') display = 'block';
      target.style.display = display;
      var height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      var prevOffSetHeight = target.offsetHeight;
      target.offsetHeight = prevOffSetHeight;
      target.style.boxSizing = 'border-box';
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      if (checkCookie('cookiemunch_' + 'option_selected')) {
        document.querySelector(".close_panel").setAttribute("style", "display: block;");
      } else {
        document.querySelector(".close_panel").setAttribute("style", "display: none;");
      }
      window.setTimeout(function () {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        document.getElementById("cookie_munch_element").setAttribute("class", "open-fully");
        toggling_cookiemunch_popup = false;
      }, duration);
    }
  };

  // options slideup
  function slideUp_options(target, duration) {
    target.setAttribute('data-fade-switch', false);
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    var prevOffSetHeight = target.offsetHeight;
    target.offsetHeight = prevOffSetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(function () {
      target.style.display = 'none';
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  }

  // options slidedown
  function slideDown_options(target, duration) {
    target.style.removeProperty('display');
    var display = window.getComputedStyle(target).display;
    if (display === 'none') display = 'block';
    target.style.display = display;
    var height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    var prevOffSetHeight = target.offsetHeight;
    target.offsetHeight = prevOffSetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(function () {
      target.setAttribute('data-fade-switch', true);
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  }

  window.cookiemunch_dropdown = function (classOnAll, uniqueClass) {
    if (!document.getElementById("cookie_munch_element")) {
      return false;
    }
    var toggle_view_el = document.querySelector("." + classOnAll + "." + uniqueClass);
    var close_toggle_view_el = document.querySelectorAll('.' + classOnAll + ':not(.' + uniqueClass + ')');
    var cookiemunch_wrapper_chev = document.querySelectorAll('.cookiemunch_wrapper_chev');
    var selectEl = document.getElementById('cookiemunch_accept_select');
    var secectedEl = document.getElementById('cookiemunch_accept_selected');
    [].forEach.call(cookiemunch_wrapper_chev, function (el) {
      el.removeAttribute("data-class-chev-seleted");
    });
    if (toggle_view_el) {
      if (window.getComputedStyle(toggle_view_el).display === 'none') {
        slideDown_options(toggle_view_el, duration);
        document.querySelector('.cookiemunch_wrapper_dropdown.' + uniqueClass + ' .cookiemunch_wrapper_chev').setAttribute("data-class-chev-seleted", true);
        if (uniqueClass === 'cookiemunch_wrapper_optional') {
          if (secectedEl && selectEl) {
            secectedEl.setAttribute('style', 'display: block;');
            selectEl.setAttribute('style', 'display: none;');
          }
        } else {
          if (secectedEl && selectEl) {
            secectedEl.setAttribute('style', 'display: none;');
            selectEl.setAttribute('style', 'display: block;');
          }
        }
      } else {
        slideUp_options(toggle_view_el, duration);
        document.querySelector('.cookiemunch_wrapper_dropdown.' + uniqueClass + ' .cookiemunch_wrapper_chev').removeAttribute("data-class-chev-seleted");
        if (secectedEl && selectEl) {
          secectedEl.setAttribute('style', 'display: none;');
          selectEl.setAttribute('style', 'display: block;');
        }
      }
    }
    if (close_toggle_view_el) {
      [].forEach.call(close_toggle_view_el, function (el) {
        slideUp_options(el, duration);
      });
    }
  };

  function create_html_hot_cookie_options_fn() {
    var html = '';
    if (cookies_object.length && required_cookies.length) {
      html += '<div class="cookiemunch_wrapper_dropdown cookiemunch_wrapper_optional" onclick="cookiemunch_dropdown(\'cookiemunch_wrapper\',\'cookiemunch_wrapper_optional\')">' +
        '<span>' + plugin_settings.cookie_optional + '</span><span class="cookiemunch_wrapper_chev"></span></div>';
      html += '<div class="cookiemunch_wrapper cookiemunch_wrapper_optional" style="display: none;">';
    } else {
      html += '<div class="cookiemunch_wrapper cookiemunch_wrapper_optional" data-fade-switch="true">';
    }
    if (cookies_object.length > 1) {
      for (var i = 0; i < cookies_object.length; i++) {
        html += '' +
          '<div class="cookiemunch_container">' +
          '<div class="cookiemunch_switch_title_container"><h2>' + cookies_object[i].name + '</h2>' +
          '<label class="cookiemunch_switch">' +
          '<input id="cookiemunch_' + cookies_object[i].id + '" type="checkbox" value="cookiemunch_' + cookies_object[i].id + '">' +
          '<span class="cookiemunch_slider cookiemunch_round"></span>' +
          '</label></div>' +
          '<p>' + cookies_object[i].used_for + '</p>' +
          '<a rel="noreferrer" target="_blank" href=' + cookies_object[i].url + '>' + cookies_object[i].url_text + '</a>' +
          '</div>';
      }
    } else if (cookies_object.length === 1) {
      html += '' +
        '<div class="cookiemunch_container">' +
        '<div class="cookiemunch_switch_title_container"><h2>' + cookies_object[0].name + '</h2>' +
        '<label style="pointer-events: none;" class="cookiemunch_switch">' +
        '<input id="cookiemunch_' + cookies_object[0].id + '" type="checkbox" value="cookiemunch_' + cookies_object[0].id + '">' +
        '<span class="checkmark"><div class="checkmark_stem"></div><div class="checkmark_kick"></div></span>' +
        '<span class="close"></span>' +
        '</label></div>' +
        '<p>' + cookies_object[0].used_for + '</p>' +
        '<a rel="noreferrer" target="_blank" href=' + cookies_object[0].url + '>' + cookies_object[0].url_text + '</a>' +
        '</div>';
    }
    html += '</div>';
    if (cookies_object.length && required_cookies.length) {
      html += '<div class="cookiemunch_wrapper_dropdown cookiemunch_wrapper_required" onclick="cookiemunch_dropdown(\'cookiemunch_wrapper\',\'cookiemunch_wrapper_required\')">' +
        '<span>' + plugin_settings.cookie_required + '</span><span class="cookiemunch_wrapper_chev"></span></div>';
      html += '<div class="cookiemunch_wrapper cookiemunch_wrapper_required" style="display: none;">';
    } else {
      html += '<div class="cookiemunch_wrapper cookiemunch_wrapper_required" data-fade-switch="true">';
    }
    if (required_cookies.length) {
      for (var j = 0; j < required_cookies.length; j++) {
        html += '' +
          '<div class="cookiemunch_container">' +
          '<div class="cookiemunch_switch_title_container"><h2>' + required_cookies[j].name + '</h2></div>' +
          '<p>' + required_cookies[j].used_for + '</p>' +
          '<a rel="noreferrer" target="_blank" href=' + required_cookies[j].url + '>' + required_cookies[j].url_text + '</a>' +
          '</div>';
      }
    }
    html += '</div>';
    if (cookies_object.length) {
      html += '<span class="cookiemunch_actions_label">' + plugin_settings.cookie_accept_label + '</span>';
    } else if (required_cookies.length) {
      html += '<span class="cookiemunch_actions_label">' + plugin_settings.cookie_required_label + '</span>';
    }
    html += '<div class="cookiemunch_actions">';
    if (cookies_object.length > 1) {
      if (required_cookies.length) {
        html += '<button onclick="cookiemunch_decline()" id="cookiemunch_decline">' + plugin_settings.cookie_button_required + '</button>';
        html += '<button onclick="cookiemunch_accept_selected()" id="cookiemunch_accept_selected" style="display: none;">' + plugin_settings.cookie_button_selected + '</button>';
        html += '<button onclick="cookiemunch_dropdown(\'cookiemunch_wrapper\',\'cookiemunch_wrapper_optional\')" id="cookiemunch_accept_select">' + plugin_settings.cookie_button_select + '</button>';
      } else {
        html += '<button onclick="cookiemunch_decline()" id="cookiemunch_decline">' + plugin_settings.cookie_button_none + '</button>';
        html += '<button onclick="cookiemunch_accept_selected()" id="cookiemunch_accept_selected">' + plugin_settings.cookie_button_selected + '</button>';
      }
      html += '<button onclick="cookiemunch_accept_all()" id="cookiemunch_accept_all">' + plugin_settings.cookie_button_all + '</button>';
    } else if (cookies_object.length === 1) {
      if (required_cookies.length) {
        html += '<button class="width-half" onclick="cookiemunch_decline()" id="cookiemunch_decline">' + plugin_settings.cookie_button_required + '</button>';
        html += '<button class="width-half" onclick="cookiemunch_accept_all()" id="cookiemunch_accept_all">' + plugin_settings.cookie_button_all + '</button>';
      } else {
        html += '<button class="width-half" onclick="cookiemunch_decline()" id="cookiemunch_decline">' + plugin_settings.cookie_button_no + '</button>';
        html += '<button class="width-half" onclick="cookiemunch_accept_all()" id="cookiemunch_accept_all">' + plugin_settings.cookie_button_yes + '</button>';
      }
    } else if (required_cookies.length) {
      html += '<button class="width-full" onclick="cookiemunch_accept_all()" id="cookiemunch_accept_all">' + plugin_settings.cookie_button_agree + '</button>';
    }
    html += '</div>';
    return html;
  }

  function create_cookiemunch() {
    var create_html_hot_cookie_options = document.createElement('div');
    create_html_hot_cookie_options.setAttribute("class", "cookiemunch_toggle_view");
    create_html_hot_cookie_options.innerHTML = create_html_hot_cookie_options_fn();
    var cookie_svg = '<img width="100%" height="100%" alt="cookiemunch logo" src="' + plugin_settings.cookie_image + '">';
    var cookie_munch_el = document.createElement('div');
    cookie_munch_el.setAttribute("id", "cookie_munch_element");
    cookie_munch_el.setAttribute("style", "transition: 0.3s ease-in-out; opacity: 0;");
    if (plugin_settings.hide_icon) {
      cookie_munch_el.setAttribute("data-class", "cookiemunch_hide_icon");
    }
    cookie_munch_el.setAttribute("class", "open-fully");
    cookie_munch_el.innerHTML =
      '<div class="cookie_munch_title_wrap">' +
      '<div class="cookie_munch_svg">' + cookie_svg + '</div>' +
      '<h1>' + plugin_settings.cookie_title + '</h1>' +
      '</div>' +
      '<span onclick="cookiemunch_accept_selected()" style="display: none;" class="close_panel"></span>';
    cookie_munch_el.appendChild(create_html_hot_cookie_options);
    document.body.appendChild(cookie_munch_el);

    toggle_view_el = document.querySelector(".cookiemunch_toggle_view");
    document.querySelector('.cookie_munch_title_wrap').addEventListener("click", function () {
      slideDown(toggle_view_el, duration);
    });
    if (checkCookie('cookiemunch_option_selected')) {
      slideUp(toggle_view_el, 0);
    }
    setTimeout(function () {
      cookie_munch_el.setAttribute("style", "transition: 0.3s ease-in-out; opacity:1;");
    }, 200);
  }

  // set checked if cookies
  function set_checked_if_cookies() {
    for (var i = 0; i < cookies_object.length; i++) {
      var check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
      var el = document.getElementById(check_this_cookie);
      if (checkCookie(check_this_cookie)) {
        el.checked = true;
      } else {
        el.checked = false;
      }
    }
  }

  // load scripts if cookies
  function load_scripts_if_cookies() {
    var i;
    var check_this_cookie;
    if (checkCookie('cookiemunch_option_selected')) {
      if (plugin_settings.hide_icon) {
        document.getElementById("cookie_munch_element").setAttribute("class", "closed-fully");
      }
      if (!block_functions) {
        for (i = 0; i < cookies_object.length; i++) {
          check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
          if (checkCookie(check_this_cookie)) {
            cookies_object[i].accepted_function();
          } else {
            cookies_object[i].declined_function();
          }
        }
      }
    } else {
      for (i = 0; i < cookies_object.length; i++) {
        check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
        var el = document.getElementById(check_this_cookie);
        if (plugin_settings.first_visit_checked) {
          el.checked = true;
        } else {
          el.checked = false;
        }
      }
    }
  }

  function load_dropdown() {
    if (!plugin_settings.start_dropdown_closed) {
      cookiemunch_dropdown('cookiemunch_wrapper', 'cookiemunch_wrapper_optional');
    }
  }

  window.cookiemunch_load_plugin = function () {
    if (document.getElementById("cookie_munch_element")) {
      document.getElementById("cookie_munch_element").remove();
    }
    cookiemunch_set_settings();
    create_cookiemunch();
    set_checked_if_cookies();
    load_scripts_if_cookies();
    if (cookies_object.length && required_cookies.length) {
      load_dropdown();
    }
  };

  function startup() {
    if (!passed_opts) {
      console.log("No cookiemunch object found.");
      console.log("Check documentation at https://cookiemunch.dunks1980.com#examples");
      return false;
    }
    cookies_object = passed_opts.cookies || [];
    required_cookies = passed_opts.required_cookies || [];
    if (cookies_object.length === 0 && required_cookies.length === 0) {
      return false;
    }
    cookiemunch_set_settings();
    setTimeout(function () {
      cookiemunch_load_plugin();
    }, 0);
  }
  startup();
};

if (typeof exports != "undefined") {
  exports.cookiemunch = cookiemunch_function;
} else {
  window.cookiemunch = cookiemunch_function;
}