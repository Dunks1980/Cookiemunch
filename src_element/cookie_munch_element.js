"use strict";

var CustomElement_name = 'cookie-munch';



renderComponent();

function renderComponent() {

  class CustomElement extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({
        mode: 'open'
      });
      var CM = this.shadowRoot;
      var template = document.createElement('template');
      CM.appendChild(template.content.cloneNode(true));
      var style = document.createElement('style');
      CM.appendChild(style);
      CM.cookiemunch_loaded = false;
    }

    setCSS(fileLocation) {
      var CM = this.shadowRoot;
      if (!CM.cookiemunch_loaded) {
        return false;
      }
      var style = CM.querySelector('style');
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          var status = xhr.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            style.innerHTML = xhr.responseText;
            if (CM.querySelector('.cookie_munch_title_wrap')) {
              CM.querySelector('.cookie_munch_title_wrap').style.opacity = 1;
              CM.querySelector('#cookie_munch_element').style.display = null;
              CM.querySelector('#cookie_munch_element').style.opacity = 1;
            } else {
              console.log("cookie munch hasent loaded, please make sure cookie munch options are set and call: cookiemunch(options); , more inforamtion: https://cookiemunch.dunks1980.com/");
            }
          } else {
            console.log("error loading css file");
          }
        }
      };
      xhr.open("GET", fileLocation, true);
      xhr.send();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        //console.log(CustomElement_name + ', ' + name + ' attributes changed, from: ' + oldValue + ' to: ' + newValue);
        this.updateTemplateWithAttribute(name);
      }
    }

    connectedCallback() {
      this.templateAppended();
      //console.log('connectedCallback');
    }


    templateAppended() {
      var CM_this = this;
      var CM = this.shadowRoot;

      var cookiemunch_function = function cookiemunch_function(options_passed, block_functions, callback) {
        var cookies_object = void 0,
          required_cookies = void 0,
          plugin_settings = void 0,
          toggle_view_el = void 0,
          duration = 300,
          has_grouping = void 0,
          state_map = [],
          cookie_expire = "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;",
          classOnAll = 'cookiemunch_wrapper';
        var cookiemunch_set_settings = function cookiemunch_set_settings() {
          if (!options_passed.settings) {
            options_passed.settings = {};
          }
          plugin_settings = {
            reload: options_passed.settings.reload || false,
            required: options_passed.settings.required || false,
            hide_icon: options_passed.settings.hide_icon || false,
            cookies_to_exclude: options_passed.settings.cookies_to_exclude || [],
            keep_all_cookies: options_passed.settings.keep_all_cookies || false,
            first_visit_checked: options_passed.settings.first_visit_checked || false,
            start_dropdown_closed: options_passed.settings.start_dropdown_closed || false,
            check_switch_icons: options_passed.settings.check_switch_icons || false,
            cookies_duration: options_passed.settings.cookies_duration || 365,
            cookies_secure: options_passed.settings.cookies_secure || false,
            cookie_image: options_passed.settings.cookie_image || 'https://unpkg.com/@dunks1980/cookiemunch/cookiemunch.svg',
            cookie_title: options_passed.settings.cookie_title || 'Cookies settings',
            cookie_optional: options_passed.settings.cookie_optional || 'Optional',
            cookie_required: options_passed.settings.cookie_required || 'Required',
            cookie_accept_label: options_passed.settings.cookie_accept_label || 'Allow Cookies:',
            cookie_required_label: options_passed.settings.cookie_required_label || 'These Cookies are required in order for the site to function.',
            cookie_button_none: options_passed.settings.cookie_button_none || 'None',
            cookie_button_required: options_passed.settings.cookie_button_required || 'Required',
            cookie_button_select: options_passed.settings.cookie_button_select || 'Select',
            cookie_button_selected: options_passed.settings.cookie_button_selected || 'Selected',
            cookie_button_all: options_passed.settings.cookie_button_all || 'All',
            cookie_button_no: options_passed.settings.cookie_button_no || 'No',
            cookie_button_yes: options_passed.settings.cookie_button_yes || 'Yes',
            cookie_button_agree: options_passed.settings.cookie_button_close || 'Close'
          };
        };

        var setCookie = function setCookie(cname, cvalue, exdays, secure) {
          var d = new Date();
          d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
          var expires = "expires=" + d.toUTCString();
          var isSecure = '';
          secure ? isSecure = 'secure' : isSecure = '';
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;" + isSecure;
        };

        var getCookie = function getCookie(cname) {
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
        };

        var checkCookie = function checkCookie(val) {
          var has_cookie = getCookie(val);
          if (has_cookie != "") {
            return has_cookie;
          } else {
            return false;
          }
        };

        var deleteCookie = function deleteCookie(val) {
          document.cookie = val + cookie_expire + " path=/;";
        };

        var deleteAllCookies = function deleteAllCookies() {
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
                var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + cookie_expire + ' domain=' + d.join('.') + ' ;path=';
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
        };

        var remove_all_cookies = function remove_all_cookies() {
          deleteAllCookies();
          for (var i = 0; i < cookies_object.length; i++) {
            var check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
            deleteCookie(check_this_cookie);
            var el = this.shadowRoot.getElementById(check_this_cookie);
            if (el) {
              el.checked = false;
            }
            if (!plugin_settings.reload) {
              try {
                var declined_function_func;
                if (typeof cookies_object[i].declined_function === 'function') {
                  declined_function_func = cookies_object[i].declined_function;
                } else if (typeof cookies_object[i].declined_function === 'string') {
                  declined_function_func = new Function(cookies_object[i].declined_function);
                }
                declined_function_func();
              } catch (err) {
                console.log('cookiemunch declined_function error for id: ' + cookies_object[i].id);
                console.log(err.message);
              }
            }
          }
        };

        window.cookiemunch_remove_all_cookies = function () {
          if (!CM.getElementById("cookie_munch_element")) {
            return false;
          }
          remove_all_cookies();
          deleteCookie('cookiemunch_option_selected');
          cookiemunch_load_plugin();
        };

        var remove_required_wrapper = function () {
          var el = CM.getElementById('cookiemunch_cookies_required');
          if (el) {
            el.setAttribute('class', 'accepted');
            CM.classList.remove("cookiemunch_scroll_block");
            setTimeout(function () {
              var cookie_munch_element = CM.querySelector('#cookie_munch_element');
              if (cookie_munch_element) {
                CM.appendChild(cookie_munch_element);
                var cookiemunch_cookies_required = CM.getElementById('cookiemunch_cookies_required');
                if (cookiemunch_cookies_required) {
                  cookiemunch_cookies_required.parentNode.removeChild(cookiemunch_cookies_required);
                }
              }
            }, 350);
          }
        };

        window.cookiemunch_decline = function () {
          if (!CM.getElementById("cookie_munch_element")) return false;
          for (var i = 0; i < cookies_object.length; i++) {
            var check_this_el = CM.getElementById('cookiemunch_' + cookies_object[i].id);
            if (check_this_el) {
              check_this_el.checked = false;
            }
          }
          cookiemunch_accept_selected();
          remove_required_wrapper();
        };

        window.cookiemunch_accept_all = function () {
          if (!CM.getElementById("cookie_munch_element")) return false;

          for (var i = 0; i < cookies_object.length; i++) {
            var check_this_el = CM.getElementById('cookiemunch_' + cookies_object[i].id);
            if (check_this_el) {
              check_this_el.checked = true;
            }
          }
          cookiemunch_accept_selected();
          remove_required_wrapper();
        };

        window.cookiemunch_accept_selected = function () {
          if (!CM.getElementById("cookie_munch_element")) return false;
          if (state_map_match() && checkCookie('cookiemunch_option_selected')) {
            slideUp(toggle_view_el, duration);
            return false;
          }
          deleteAllCookies();
          for (var i = 0; i < cookies_object.length; i++) {
            var check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
            var el = CM.getElementById(check_this_cookie);
            if (el && el.checked) {
              setCookie(check_this_cookie, true, plugin_settings.cookies_duration, plugin_settings.cookies_secure);
              if (!plugin_settings.reload) {
                try {
                  var accepted_function_func;
                  if (typeof cookies_object[i].accepted_function === 'function') {
                    accepted_function_func = cookies_object[i].accepted_function;
                  } else if (typeof cookies_object[i].accepted_function === 'string') {
                    accepted_function_func = new Function(cookies_object[i].accepted_function);
                  }
                  accepted_function_func();
                } catch (err) {
                  console.log('cookiemunch accepted_function error for id: ' + cookies_object[i].id);
                  console.log(err.message);
                }
              }
            } else {
              deleteCookie(check_this_cookie);
              if (!plugin_settings.reload) {
                try {
                  var declined_function_func;
                  if (typeof cookies_object[i].declined_function === 'function') {
                    declined_function_func = cookies_object[i].declined_function;
                  } else if (typeof cookies_object[i].declined_function === 'string') {
                    declined_function_func = new Function(cookies_object[i].declined_function);
                  }
                  declined_function_func();
                } catch (err) {
                  console.log('cookiemunch declined_function error for id: ' + cookies_object[i].id);
                  console.log(err.message);
                }
              }
            }
          }
          slideUp(toggle_view_el, duration);
          setCookie('cookiemunch_option_selected', true, plugin_settings.cookies_duration, plugin_settings.cookies_secure);
          if (plugin_settings.reload) {
            setTimeout(function () {
              location.reload();
            }, Number(duration + 100));
          } else {
            remove_required_wrapper();
          }
        };

        var state_map_record = function state_map_record() {
          state_map = [];
          [].forEach.call(cookies_object, function (item) {
            var el = CM.getElementById('cookiemunch_' + item.id);
            if (el) {
              state_map.push(el.checked);
            }
          });
        };

        var state_map_match = function state_map_match() {
          var match_map = [];
          [].forEach.call(cookies_object, function (item) {
            var el = CM.getElementById('cookiemunch_' + item.id);
            if (el) {
              match_map.push(el.checked);
            }
          });
          for (var i = 0; i < match_map.length; i++) {
            if (match_map.length !== state_map.length) return false;
            if (match_map[i] !== state_map[i]) return false;
          }
          return true;
        };

        /* TOOGLE */
        var toggling_cookiemunch_popup = void 0;
        window.cookiemunch_toggle_popup = function () {
          setTimeout(function () {
            if (!CM.getElementById("cookie_munch_element")) {
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
              if (CM.getElementById("cookie_munch_element").className === "closed-fully") {
                return slideDown(toggle_view_el, duration);
              } else {
                return slideUp(toggle_view_el, duration);
              }
            }
          }, 100);
        };

        /* closes panel */
        var slideUp = function slideUp(target, duration) {
          toggling_cookiemunch_popup = true;
          var cookie_munch_el = CM.getElementById("cookie_munch_element");
          if (plugin_settings.hide_icon) {
            //document.getElementById("cookie_munch_element").setAttribute("class", "closed");
            //cookie_munch_el.setAttribute("style", "transition: 0.3s ease-in-out; opacity:1;");
            cookie_munch_el.style.transition = "transition: 0.3s ease-in-out";
            cookie_munch_el.style.opacity = "1";

            window.setTimeout(function () {
              cookie_munch_el.setAttribute("class", "closed-fully");
              toggling_cookiemunch_popup = false;
            }, duration);
          } else {
            //cookie_munch_el.setAttribute("style", "");

            cookie_munch_el.style.transition = "transition: 0.3s ease-in-out";
            cookie_munch_el.style.opacity = "1";

            cookie_munch_el.setAttribute("class", "closed");
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.boxSizing = 'border-box';
            target.style.height = target.offsetHeight + 'px';
            var prevOffSetHeight = target.offsetHeight;
            target.style.height = prevOffSetHeight;
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
              cookie_munch_el.setAttribute("class", "closed-fully");
              toggling_cookiemunch_popup = false;
            }, duration);
          }
        };

        /* opens panel */
        var slideDown = function slideDown(target, duration) {
          toggling_cookiemunch_popup = true;
          var cookie_munch_el = CM.getElementById("cookie_munch_element");
          var close_panel = CM.querySelector(".close_panel");
          state_map_record();
          if (plugin_settings.hide_icon) {
            cookie_munch_el.setAttribute("class", "open");
            if (checkCookie('cookiemunch_' + 'option_selected')) {
              close_panel.setAttribute("style", "display: block;");
            } else {
              close_panel.setAttribute("style", "display: none;");
            }
            window.setTimeout(function () {
              cookie_munch_el.setAttribute("class", "open-fully");
              //cookie_munch_el.setAttribute("style", "transition: 1s ease-in-out; opacity:1;");
              toggling_cookiemunch_popup = false;
            }, duration);
          } else {
            cookie_munch_el.setAttribute("style", "");
            cookie_munch_el.setAttribute("class", "open");
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
            target.style.height = prevOffSetHeight;
            target.style.boxSizing = 'border-box';
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            if (checkCookie('cookiemunch_' + 'option_selected')) {
              close_panel.setAttribute("style", "display: block;");
            } else {
              close_panel.setAttribute("style", "display: none;");
            }
            window.setTimeout(function () {
              target.style.removeProperty('height');
              target.style.removeProperty('overflow');
              target.style.removeProperty('transition-duration');
              target.style.removeProperty('transition-property');
              cookie_munch_el.setAttribute("class", "open-fully");
              toggling_cookiemunch_popup = false;
            }, duration);
          }
        };

        // options slideup
        var slideUp_options = function (target, duration) {
          target.setAttribute('data-fade-switch', false);
          target.style.transitionProperty = 'height, margin, padding';
          target.style.transitionDuration = duration + 'ms';
          target.style.boxSizing = 'border-box';
          target.style.height = target.offsetHeight + 'px';
          var prevOffSetHeight = target.offsetHeight;
          target.style.height = prevOffSetHeight;
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
        };

        // options slidedown
        var slideDown_options = function (target, duration) {
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
          target.style.height = prevOffSetHeight;
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
        };

        window.cookiemunch_dropdown = function (uniqueClass) {
          if (!CM.getElementById("cookie_munch_element")) {
            return false;
          }
          var toggle_view_el = CM.querySelector("." + classOnAll + "." + uniqueClass);
          var close_toggle_view_el = CM.querySelectorAll('.' + classOnAll + ':not(.' + uniqueClass + ')');
          var cookiemunch_wrapper_chev = CM.querySelectorAll('.cookiemunch_wrapper_chev');
          var selectEl = CM.getElementById('cookiemunch_accept_select');
          var secectedEl = CM.getElementById('cookiemunch_accept_selected');
          [].forEach.call(cookiemunch_wrapper_chev, function (el) {
            el.removeAttribute("data-class-chev-seleted");
          });

          get_grouping();
          if (toggle_view_el) {
            if (window.getComputedStyle(toggle_view_el).display === 'none') {
              slideDown_options(toggle_view_el, duration);
              CM.querySelector('.cookiemunch_wrapper_dropdown.' + uniqueClass + ' .cookiemunch_wrapper_chev').setAttribute("data-class-chev-seleted", true);

              if (has_grouping) {
                if (secectedEl && selectEl) {
                  secectedEl.setAttribute('style', 'display: block;');
                  selectEl.setAttribute('style', 'display: none;');
                }
              } else {
                if (uniqueClass !== 'cookiemunch_wrapper_required') {
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
              }
            } else {
              slideUp_options(toggle_view_el, duration);
              CM.querySelector('.cookiemunch_wrapper_dropdown.' + uniqueClass + ' .cookiemunch_wrapper_chev').removeAttribute("data-class-chev-seleted");
              if (has_grouping) {
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
            }
          }
          if (close_toggle_view_el) {
            [].forEach.call(close_toggle_view_el, function (el) {
              slideUp_options(el, duration);
            });
          }
        };

        var get_grouping = function get_grouping() {
          if (!cookies_object.length) {
            return [];
          }
          var groups = [];
          for (var i = 0; i < cookies_object.length; i++) {
            if (cookies_object[i].group) {
              if (groups.indexOf(cookies_object[i].group) === -1) {
                groups.push(cookies_object[i].group);
                has_grouping = true;
              }
            } else {
              if (groups.indexOf('Optional') === -1) {
                groups.push('Optional');
              }
            }
          }
          return groups;
        };

        // create html --------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------

        var create_html_hot_cookie_options_fn = function () {
          var html = '';
          var grouping = get_grouping();

          for (var group = 0; group < grouping.length; group++) {

            if (grouping[group] !== 'Optional') {
              if (cookies_object.length && required_cookies.length) {
                var this_id = (grouping[group].replaceAll(/\s/g, '_') + '_group').toLowerCase();
                html += '<div class="cookiemunch_wrapper_dropdown cookiemunch_wrapper_' + this_id + '" data-cookiemunchdropdown="cookiemunch_wrapper_' + this_id + '"><span>' + grouping[group] + '</span><span class="cookiemunch_wrapper_chev"></span></div><div class="cookiemunch_wrapper cookiemunch_wrapper_' + this_id + '" style="display: none;">';
              } else {
                html += '<div class="cookiemunch_wrapper cookiemunch_wrapper_' + grouping[group] + '" data-fade-switch="true">';
              }
            }
            if (cookies_object.length > 1) {
              for (var i = 0; i < cookies_object.length; i++) {
                if (cookies_object[i].group === grouping[group]) {
                  html += '<div class="cookiemunch_container"><div class="cookiemunch_switch_title_container"><h2>' + cookies_object[i].name + '</h2><label class="cookiemunch_switch"><input id="cookiemunch_' + cookies_object[i].id + '" type="checkbox" value="cookiemunch_' + cookies_object[i].id + '" aria-label="check box for ' + cookies_object[i].name + ' cookies"><span class="cookiemunch_slider cookiemunch_round' + (plugin_settings.check_switch_icons ? ' cookiemunch_switch_icons' : '') + '" >' + (plugin_settings.check_switch_icons ? '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill:#4ADE80;transform:;-ms-filter:"><path d="M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill:#F87171;transform:;-ms-filter:"><path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"></path></svg>' : '') + '</span></label></div><p>' + cookies_object[i].used_for + '</p><a rel="noreferrer" target="_blank" href="' + cookies_object[i].url + '">' + cookies_object[i].url_text + '</a></div>';
                }
              }
            } else if (cookies_object.length === 1) {
              if (cookies_object[0].group === grouping[group]) {
                html += '<div class="cookiemunch_container"><div class="cookiemunch_switch_title_container"><h2>' + cookies_object[0].name + '</h2><label style="pointer-events: none; border-width: 0px;" class="cookiemunch_switch"><input id="cookiemunch_' + cookies_object[0].id + '" type="checkbox" value="cookiemunch_' + cookies_object[0].id + '" aria-label="check box for ' + cookies_object[0].name + ' cookies"><span class="checkmark"><div class="checkmark_stem"></div><div class="checkmark_kick"></div></span><span class="close"></span></label></div><p>' + cookies_object[0].used_for + '</p><a rel="noreferrer" target="_blank" href="' + cookies_object[0].url + '">' + cookies_object[0].url_text + '</a></div>';
              }
            }

            if (grouping[group] !== 'Optional') {
              if (cookies_object.length && required_cookies.length) {
                html += '</div>';
              }
            }
          } // for end

          // optional cookies section
          if (grouping.indexOf("Optional") > -1) {
            if (cookies_object.length && required_cookies.length) {
              html += '<div class="cookiemunch_wrapper_dropdown cookiemunch_wrapper_optional" data-cookiemunchdropdown="cookiemunch_wrapper_optional"><span>' + plugin_settings.cookie_optional + '</span><span class="cookiemunch_wrapper_chev"></span></div><div class="cookiemunch_wrapper cookiemunch_wrapper_optional" style="display: none;">';
            } else {
              html += '<div class="cookiemunch_wrapper cookiemunch_wrapper_optional" data-fade-switch="true">';
            }
            if (cookies_object.length > 1 && grouping.indexOf("Optional") > -1) {
              for (var _i = 0; _i < cookies_object.length; _i++) {
                if (!cookies_object[_i].group) {
                  html += '<div class="cookiemunch_container"><div class="cookiemunch_switch_title_container"><h2>' + cookies_object[_i].name + '</h2><label class="cookiemunch_switch"><input id="cookiemunch_' + cookies_object[_i].id + '" type="checkbox" value="cookiemunch_' + cookies_object[_i].id + '" aria-label="check box for ' + cookies_object[_i].name + ' cookies"><span class="cookiemunch_slider cookiemunch_round' + (plugin_settings.check_switch_icons ? ' cookiemunch_switch_icons' : '') + '">' + (plugin_settings.check_switch_icons ? '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill:#4ADE80;transform:;-ms-filter:"><path d="M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill:#F87171;transform:;-ms-filter:"><path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"></path></svg>' : '') + '</span></label></div><p>' + cookies_object[_i].used_for + '</p><a rel="noreferrer" target="_blank" href="' + cookies_object[_i].url + '">' + cookies_object[_i].url_text + '</a></div>';
                }
              }
            } else if (cookies_object.length === 1 && grouping.indexOf("Optional") > -1) {
              if (!cookies_object[0].group) {
                html += '<div class="cookiemunch_container"><div class="cookiemunch_switch_title_container"><h2>' + cookies_object[0].name + '</h2><label style="pointer-events: none; border-width: 0px;" class="cookiemunch_switch"><input id="cookiemunch_' + cookies_object[0].id + '" type="checkbox" value="cookiemunch_' + cookies_object[0].id + '" aria-label="check box for ' + cookies_object[0].name + ' cookies"><span class="checkmark"><div class="checkmark_stem"></div><div class="checkmark_kick"></div></span><span class="close"></span></label></div><p>' + cookies_object[0].used_for + '</p><a rel="noreferrer" target="_blank" href="' + cookies_object[0].url + '">' + cookies_object[0].url_text + '</a></div>';
              }
            }
            html += '</div>';
          }

          // required cookies section
          if (cookies_object.length && required_cookies.length) {
            html += '<div class="cookiemunch_wrapper_dropdown cookiemunch_wrapper_required" data-cookiemunchdropdown="cookiemunch_wrapper_required"><span>' + plugin_settings.cookie_required + '</span><span class="cookiemunch_wrapper_chev"></span></div><div class="cookiemunch_wrapper cookiemunch_wrapper_required" style="display: none;">';
          } else {
            html += '<div class="cookiemunch_wrapper cookiemunch_wrapper_required" data-fade-switch="true">';
          }
          if (required_cookies.length) {
            for (var j = 0; j < required_cookies.length; j++) {
              html += '<div class="cookiemunch_container"><div class="cookiemunch_switch_title_container"><h2>' + required_cookies[j].name + '</h2></div><p>' + required_cookies[j].used_for + '</p><a rel="noreferrer" target="_blank" href="' + required_cookies[j].url + '">' + required_cookies[j].url_text + '</a></div>';
            }
          }
          html += '</div>';

          // label above action buttons
          if (cookies_object.length) {
            html += '<span class="cookiemunch_actions_label">' + plugin_settings.cookie_accept_label + '</span>';
          } else if (required_cookies.length) {
            html += '<span class="cookiemunch_actions_label">' + plugin_settings.cookie_required_label + '</span>';
          }

          // action buttons
          html += '<div class="cookiemunch_actions">';
          if (cookies_object.length > 1) {
            if (required_cookies.length) {
              html += '<button id="cookiemunch_decline">' + plugin_settings.cookie_button_required + '</button><button id="cookiemunch_accept_selected" ' + (has_grouping ? '' : 'style="display: none;"') + '>' + plugin_settings.cookie_button_selected + '</button><button data-cookiemunchdropdown="cookiemunch_wrapper_optional" id="cookiemunch_accept_select" ' + (has_grouping ? 'style="display: none;"' : '') + '>' + plugin_settings.cookie_button_select + '</button>';
            } else {
              html += '<button id="cookiemunch_decline">' + plugin_settings.cookie_button_none + '</button><button id="cookiemunch_accept_selected">' + plugin_settings.cookie_button_selected + '</button>';
            }
            html += '<button id="cookiemunch_accept_all">' + plugin_settings.cookie_button_all + '</button>';
          } else if (cookies_object.length === 1) {
            if (required_cookies.length) {
              html += '<button class="width-half" id="cookiemunch_decline">' + plugin_settings.cookie_button_required + '</button><button class="width-half" id="cookiemunch_accept_all">' + plugin_settings.cookie_button_all + '</button>';
            } else {
              html += '<button class="width-half" id="cookiemunch_decline">' + plugin_settings.cookie_button_no + '</button><button class="width-half" id="cookiemunch_accept_all">' + plugin_settings.cookie_button_yes + '</button>';
            }
          } else if (required_cookies.length) {
            html += '<button class="width-full" id="cookiemunch_accept_all">' + plugin_settings.cookie_button_agree + '</button>';
          }
          html += '</div>';
          return html;
        };

        // create cookiemunch -------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------------------------------------------

        var create_cookiemunch = function create_cookiemunch() {

          var create_html_hot_cookie_options = document.createElement('div');
          var cookie_munch_el = document.createElement('div');
          cookie_munch_el.style.display = 'none';
          cookie_munch_el.style.transition = '0.3s ease-in-out';

          cookie_munch_el.style.opacity = '0';

          cookie_munch_el.setAttribute("id", "cookie_munch_element");


          var cookie_munch_el_required = document.createElement('div');

          create_html_hot_cookie_options.setAttribute("class", "cookiemunch_toggle_view");
          create_html_hot_cookie_options.innerHTML = create_html_hot_cookie_options_fn();




          var cookie_svg = '<img width="100%" height="100%" alt="cookiemunch logo" src="' + plugin_settings.cookie_image + '">';
          var html = '<div style="opacity: 0; transition: opacity 0.3s ease-in-out;" class="cookie_munch_title_wrap"><div class="cookie_munch_svg">' + cookie_svg + '</div><h1>' + plugin_settings.cookie_title + '</h1></div><span style="display: none;" id="close_panel_btn" class="close_panel"></span>';

          cookie_munch_el.innerHTML = html;

          // required blocker
          cookie_munch_el_required.setAttribute("id", "cookiemunch_cookies_required");

          if (plugin_settings.required && !checkCookie('cookiemunch_option_selected')) {
            cookie_munch_el.appendChild(create_html_hot_cookie_options);
            cookie_munch_el_required.appendChild(cookie_munch_el);
            CM.appendChild(cookie_munch_el_required);
            CM.classList.add("cookiemunch_scroll_block");
          } else {
            cookie_munch_el.appendChild(create_html_hot_cookie_options);
            CM.appendChild(cookie_munch_el);
          }

          //cookie_munch_el.setAttribute("style", "transition: 0.3s ease-in-out; opacity:1;");
          toggle_view_el = CM.querySelector(".cookiemunch_toggle_view");
          CM.querySelector('.cookie_munch_title_wrap').addEventListener("click", function () {
            slideDown(toggle_view_el, duration);
          });
          if (checkCookie('cookiemunch_option_selected')) {
            slideUp(toggle_view_el, 0);
          }

          if (plugin_settings.hide_icon) {
            cookie_munch_el.setAttribute("data-class", "cookiemunch_hide_icon");
          }
          cookie_munch_el.setAttribute("class", "open-fully");


          var cookiemunch_dropdown_btns = CM.querySelectorAll('[data-cookiemunchdropdown]');
          [].forEach.call(cookiemunch_dropdown_btns, function (cookiemunch_dropdown) {
            cookiemunch_dropdown.onclick = function () {
              var dropdown = cookiemunch_dropdown.getAttribute('data-cookiemunchdropdown');
              window.cookiemunch_dropdown(dropdown);
            };
          });

          var cookiemunch_decline_btn = CM.getElementById('cookiemunch_decline');
          if (cookiemunch_decline_btn) {
            cookiemunch_decline_btn.onclick = function () {
              window.cookiemunch_decline();
            };
          }

          var cookiemunch_accept_selected_btn = CM.getElementById('cookiemunch_accept_selected');
          if (cookiemunch_accept_selected_btn) {
            cookiemunch_accept_selected_btn.onclick = function () {
              window.cookiemunch_accept_selected();
            };
          }

          var close_panel_btn = CM.getElementById('close_panel_btn');
          if (close_panel_btn) {
            close_panel_btn.onclick = function () {
              window.cookiemunch_accept_selected();
            };
          }

          var cookiemunch_accept_all_btn = CM.getElementById('cookiemunch_accept_all');
          if (cookiemunch_accept_all_btn) {
            cookiemunch_accept_all_btn.onclick = function () {
              window.cookiemunch_accept_all();
            };
          }

          //console.log(CM_this)
          CM.cookiemunch_loaded = true;
          CM_this.updateTemplateWithAttribute('css-file');

        };

        // set checked if cookies
        var set_checked_if_cookies = function set_checked_if_cookies() {
          for (var i = 0; i < cookies_object.length; i++) {
            var check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
            var el = CM.getElementById(check_this_cookie);
            if (!el) {
              return false;
            }
            if (checkCookie(check_this_cookie)) {
              el.checked = true;
            } else {
              el.checked = false;
            }
          }
        };

        // load scripts if cookies
        var load_scripts_if_cookies = function load_scripts_if_cookies() {
          var i = void 0;
          var check_this_cookie = void 0;
          if (checkCookie('cookiemunch_option_selected')) {
            if (plugin_settings.hide_icon) {
              CM.getElementById("cookie_munch_element").setAttribute("style", "transition: 0.3s ease-in-out; opacity:0;");
              CM.getElementById("cookie_munch_element").setAttribute("class", "closed-fully");
            }
            if (typeof block_functions === 'function' || block_functions === false || block_functions === undefined) {
              for (i = 0; i < cookies_object.length; i++) {
                check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
                if (checkCookie(check_this_cookie)) {
                  try {
                    var accepted_function_func;
                    if (typeof cookies_object[i].accepted_function === 'function') {
                      accepted_function_func = cookies_object[i].accepted_function;
                    } else if (typeof cookies_object[i].accepted_function === 'string') {
                      accepted_function_func = new Function(cookies_object[i].accepted_function);
                    }
                    accepted_function_func();
                  } catch (err) {
                    console.log('cookiemunch accepted_function error for id: ' + cookies_object[i].id);
                    console.log(err.message);
                  }
                } else {
                  try {
                    var declined_function_func;
                    if (typeof cookies_object[i].declined_function === 'function') {
                      declined_function_func = cookies_object[i].declined_function;
                    } else if (typeof cookies_object[i].declined_function === 'string') {
                      declined_function_func = new Function(cookies_object[i].declined_function);
                    }
                    declined_function_func();
                  } catch (err) {
                    console.log('cookiemunch declined_function error for id: ' + cookies_object[i].id);
                    console.log(err.message);
                  }
                }
              }
            }
          } else {
            for (i = 0; i < cookies_object.length; i++) {
              check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
              var el = CM.getElementById(check_this_cookie);
              if (plugin_settings.first_visit_checked) {
                el.checked = true;
              } else {
                el.checked = false;
              }
            }
          }
        };

        var load_dropdown = function load_dropdown() {
          if (!plugin_settings.start_dropdown_closed) {
            var first_group = get_grouping();
            if (!has_grouping) {
              cookiemunch_dropdown('cookiemunch_wrapper_optional');
            } else {
              cookiemunch_dropdown(('cookiemunch_wrapper_' + first_group[0].replaceAll(/\s/g, '_') + '_group').toLowerCase());
            }
          }
        };

        function cookiemunch_load_plugin() {
          //console.log(CM);
          var cookie_munch_element = CM.querySelector("#cookie_munch_element");
          if (cookie_munch_element) {
            CM.removeChild(cookie_munch_element);
          }
          cookiemunch_set_settings();
          create_cookiemunch();
          set_checked_if_cookies();
          load_scripts_if_cookies();
          if (cookies_object.length && required_cookies.length) {
            load_dropdown();
          }
          if (typeof block_functions === "function") {
            block_functions();
          } else if (typeof callback === "function") {
            callback();
          }
        };

        var startup = function startup() {
          if (!options_passed) {
            console.log("No cookiemunch object found.");
            console.log("Check documentation at https://cookiemunch.dunks1980.com#examples");
            return false;
          }
          cookies_object = options_passed.cookies || [];
          required_cookies = options_passed.required_cookies || [];
          if (cookies_object.length === 0 && required_cookies.length === 0) {
            return false;
          }
          setTimeout(function () {
            cookiemunch_load_plugin();
          }, 0);
        };
        startup();
      };

      window.cookiemunch = cookiemunch_function;

    }

    // Specify observed attributes for attributeChangedCallback
    static get observedAttributes() {
      return ['css-file'];
    }

    updateTemplateWithAttribute(name) {
      switch (name) {
        case 'css-file':
          this.setCSS(this.getAttribute('css-file'));
          //console.log(name);
          break;
      }
    }

  }

  window.customElements.define(CustomElement_name, CustomElement);

}