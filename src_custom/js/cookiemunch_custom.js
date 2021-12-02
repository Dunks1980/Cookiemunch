const cookiemunch_function = (options_passed, block_functions, callback) => {

  let cookies_object,
    required_cookies,
    plugin_settings,
    toggle_view_el,
    duration = 300,
    has_grouping,
    state_map = [],
    cookie_expire = "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;",
    classOnAll = 'cookiemunch_wrapper';

  const cookiemunch_set_settings = () => {
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

  const setCookie = (cname, cvalue, exdays, secure) => {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    secure ? isSecure = 'secure' : isSecure = '';
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;" + isSecure;
  };

  const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  const checkCookie = (val) => {
    let has_cookie = getCookie(val);
    if (has_cookie != "") {
      return has_cookie;
    } else {
      return false;
    }
  };

  const deleteCookie = (val) => {
    document.cookie = val + cookie_expire + " path=/;";
  };

  const deleteAllCookies = () => {
    if (plugin_settings.keep_all_cookies) {
      return false;
    }
    let cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c++) {
      let cookie = cookies[c];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (plugin_settings.cookies_to_exclude.indexOf(name.trim()) > -1) {
        // leave this cookie in
      } else {
        let d = window.location.hostname.split(".");
        while (d.length > 0) {
          let cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
            cookie_expire + ' domain=' + d.join('.') + ' ;path=';
          let p = location.pathname.split('/');
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

  const remove_all_cookies = () => {
    deleteAllCookies();
    for (let i = 0; i < cookies_object.length; i++) {
      let check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
      deleteCookie(check_this_cookie);
      let el = document.getElementById(check_this_cookie);
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

  window.cookiemunch_remove_all_cookies = () => {
    if (!document.getElementById("cookie_munch_element")) {
      return false;
    }
    remove_all_cookies();
    deleteCookie('cookiemunch_option_selected');
    cookiemunch_load_plugin();
  };

  remove_required_wrapper = () => {
    let el = document.getElementById('cookiemunch_cookies_required');
    if (el) {
      el.setAttribute('class', 'accepted');
      document.body.classList.remove("cookiemunch_scroll_block");
      setTimeout(() => {
        let cookie_munch_element = document.querySelector('#cookie_munch_element');
        if (cookie_munch_element) {
          document.body.appendChild(cookie_munch_element);
          let cookiemunch_cookies_required = document.getElementById('cookiemunch_cookies_required');
          if (cookiemunch_cookies_required) {
            cookiemunch_cookies_required.parentNode.removeChild(cookiemunch_cookies_required);
          }
        }
      }, 350);
    }
  };

  window.cookiemunch_decline = () => {
    if (!document.getElementById("cookie_munch_element")) return false;
    for (let i = 0; i < cookies_object.length; i++) {
      let check_this_el = document.getElementById('cookiemunch_' + cookies_object[i].id);
      if (check_this_el) {
        check_this_el.checked = false;
      }
    }
    cookiemunch_accept_selected();
    remove_required_wrapper();
  };

  window.cookiemunch_accept_all = () => {
    if (!document.getElementById("cookie_munch_element")) return false;

    for (let i = 0; i < cookies_object.length; i++) {
      let check_this_el = document.getElementById('cookiemunch_' + cookies_object[i].id);
      if (check_this_el) {
        check_this_el.checked = true;
      }
    }
    cookiemunch_accept_selected();
    remove_required_wrapper();
  };

  window.cookiemunch_accept_selected = () => {
    if (!document.getElementById("cookie_munch_element")) return false;
    if (state_map_match() && checkCookie('cookiemunch_option_selected')) {
      slideUp(toggle_view_el, duration);
      return false;
    }
    deleteAllCookies();
    for (let i = 0; i < cookies_object.length; i++) {
      let check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
      let el = document.getElementById(check_this_cookie);
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
      setTimeout(() => {
        location.reload();
      }, Number(duration + 100));
    } else {
      remove_required_wrapper();
    }
  };

  const state_map_record = () => {
    state_map = [];
    [].forEach.call(cookies_object, (item) => {
      let el = document.getElementById('cookiemunch_' + item.id);
      if (el) {
        state_map.push(el.checked);
      }
    });
  };

  const state_map_match = () => {
    let match_map = [];
    [].forEach.call(cookies_object, (item) => {
      let el = document.getElementById('cookiemunch_' + item.id);
      if (el) {
        match_map.push(el.checked);
      }
    });
    for (let i = 0; i < match_map.length; i++) {
      if (match_map.length !== state_map.length) return false;
      if (match_map[i] !== state_map[i]) return false;
    }
    return true;
  };


  /* TOOGLE */
  let toggling_cookiemunch_popup;
  window.cookiemunch_toggle_popup = () => {
    setTimeout(() => {
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
  const slideUp = (target, duration) => {
    toggling_cookiemunch_popup = true;
    let cookie_munch_el = document.getElementById("cookie_munch_element");
    if (plugin_settings.hide_icon) {
      //document.getElementById("cookie_munch_element").setAttribute("class", "closed");
      cookie_munch_el.setAttribute("style", "transition: 0.3s ease-in-out; opacity:0;");
      window.setTimeout(() => {
        cookie_munch_el.setAttribute("class", "closed-fully");
        toggling_cookiemunch_popup = false;
      }, duration);
    } else {
      cookie_munch_el.setAttribute("style", "");
      cookie_munch_el.setAttribute("class", "closed");
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.boxSizing = 'border-box';
      target.style.height = target.offsetHeight + 'px';
      let prevOffSetHeight = target.offsetHeight;
      target.offsetHeight = prevOffSetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
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
  const slideDown = (target, duration) => {
    toggling_cookiemunch_popup = true;
    let cookie_munch_el = document.getElementById("cookie_munch_element");
    let close_panel = document.querySelector(".close_panel");
    state_map_record();
    if (plugin_settings.hide_icon) {
      cookie_munch_el.setAttribute("style", "transition: 1s ease-in-out; opacity:1;");
      cookie_munch_el.setAttribute("class", "open");
      if (checkCookie('cookiemunch_' + 'option_selected')) {
        close_panel.setAttribute("style", "display: block;");
      } else {
        close_panel.setAttribute("style", "display: none;");
      }
      window.setTimeout(() => {
        cookie_munch_el.setAttribute("class", "open-fully");
        toggling_cookiemunch_popup = false;
      }, duration);
    } else {
      cookie_munch_el.setAttribute("style", "");
      cookie_munch_el.setAttribute("class", "open");
      target.style.removeProperty('display');
      let display = window.getComputedStyle(target).display;
      if (display === 'none') display = 'block';
      target.style.display = display;
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      let prevOffSetHeight = target.offsetHeight;
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
        close_panel.setAttribute("style", "display: block;");
      } else {
        close_panel.setAttribute("style", "display: none;");
      }
      window.setTimeout(() => {
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
  const slideUp_options = (target, duration) => {
    target.setAttribute('data-fade-switch', false);
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    let prevOffSetHeight = target.offsetHeight;
    target.offsetHeight = prevOffSetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
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
  const slideDown_options = (target, duration) => {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none') display = 'block';
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    let prevOffSetHeight = target.offsetHeight;
    target.offsetHeight = prevOffSetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.setAttribute('data-fade-switch', true);
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  };





  window.cookiemunch_dropdown = (uniqueClass) => {
    if (!document.getElementById("cookie_munch_element")) {
      return false;
    }
    let toggle_view_el = document.querySelector("." + classOnAll + "." + uniqueClass);
    let close_toggle_view_el = document.querySelectorAll('.' + classOnAll + ':not(.' + uniqueClass + ')');
    let cookiemunch_wrapper_chev = document.querySelectorAll('.cookiemunch_wrapper_chev');
    let selectEl = document.getElementById('cookiemunch_accept_select');
    let secectedEl = document.getElementById('cookiemunch_accept_selected');
    [].forEach.call(cookiemunch_wrapper_chev, (el) => {
      el.removeAttribute("data-class-chev-seleted");
    });

    get_grouping();
    if (toggle_view_el) {
      if (window.getComputedStyle(toggle_view_el).display === 'none') {
        slideDown_options(toggle_view_el, duration);
        document.querySelector('.cookiemunch_wrapper_dropdown.' + uniqueClass + ' .cookiemunch_wrapper_chev').setAttribute("data-class-chev-seleted", true);

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
        document.querySelector('.cookiemunch_wrapper_dropdown.' + uniqueClass + ' .cookiemunch_wrapper_chev').removeAttribute("data-class-chev-seleted");
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
      [].forEach.call(close_toggle_view_el, (el) => {
        slideUp_options(el, duration);
      });
    }
  };



  const get_grouping = () => {
    if (!cookies_object.length) {
      return [];
    }
    groups = [];
    for (let i = 0; i < cookies_object.length; i++) {
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

  const create_html_hot_cookie_options_fn = () => {
    let html = ``;
    let grouping = get_grouping();

    for (let group = 0; group < grouping.length; group++) {

      if (grouping[group] !== 'Optional') {
        if (cookies_object.length && required_cookies.length) {
          let this_id = `${grouping[group].replaceAll(/\s/g,'_')}_group`.toLowerCase();
          html += /*html*/ `
          <div 
            class="cookiemunch_wrapper_dropdown cookiemunch_wrapper_${this_id}"
            data-cookiemunchdropdown="cookiemunch_wrapper_${this_id}"
            >
            <span>${grouping[group]}</span><span class="cookiemunch_wrapper_chev"></span>
          </div>
          <div class="cookiemunch_wrapper cookiemunch_wrapper_${this_id}" style="display: none;">
          `;
        } else {
          html += /*html*/ `
          <div class="cookiemunch_wrapper cookiemunch_wrapper_${grouping[group]}" data-fade-switch="true">`;
        }
      }
      if (cookies_object.length > 1) {
        for (let i = 0; i < cookies_object.length; i++) {
          if (cookies_object[i].group === grouping[group]) {
            html += /*html*/ `
            <div class="cookiemunch_container">
              <div class="cookiemunch_switch_title_container">
                <h2>${cookies_object[i].name}</h2>
                <label class="cookiemunch_switch">
                  <input id="cookiemunch_${cookies_object[i].id}" type="checkbox" value="cookiemunch_${cookies_object[i].id}" aria-label="check box for ${cookies_object[i].name} cookies">
                  <span class="cookiemunch_slider cookiemunch_round${plugin_settings.check_switch_icons ? ' cookiemunch_switch_icons' : ''}" >
                    ${plugin_settings.check_switch_icons ? /*html*/`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill:#4ADE80;transform:;-ms-filter:"><path d="M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill:#F87171;transform:;-ms-filter:"><path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"></path></svg>` : ``}
                  </span>
                </label>
              </div>
              <p>${cookies_object[i].used_for}</p>
              <a rel="noreferrer" target="_blank" href="${cookies_object[i].url}">${cookies_object[i].url_text}</a>
            </div>`;
          }
        }
      } else if (cookies_object.length === 1) {
        if (cookies_object[0].group === grouping[group]) {
          html += /*html*/ `
          <div class="cookiemunch_container">
            <div class="cookiemunch_switch_title_container"><h2>${cookies_object[0].name}</h2>
              <label style="pointer-events: none; border-width: 0px;" class="cookiemunch_switch">
                <input id="cookiemunch_${cookies_object[0].id}" type="checkbox" value="cookiemunch_${cookies_object[0].id}" aria-label="check box for ${cookies_object[0].name} cookies">
                <span class="checkmark">
                  <div class="checkmark_stem"></div>
                  <div class="checkmark_kick"></div>
                </span>
                <span class="close"></span>
              </label>
            </div>
            <p>${cookies_object[0].used_for}</p>
            <a rel="noreferrer" target="_blank" href="${cookies_object[0].url}">${cookies_object[0].url_text}</a>
          </div>`;
        }
      }

      if (grouping[group] !== 'Optional') {
        if (cookies_object.length && required_cookies.length) {
          html += /*html*/ `</div>`;
        }
      }

    } // for end

    // optional cookies section
    if (grouping.indexOf("Optional") > -1) {
      if (cookies_object.length && required_cookies.length) {
        html += /*html*/ `
        <div 
          class="cookiemunch_wrapper_dropdown cookiemunch_wrapper_optional" 
          data-cookiemunchdropdown="cookiemunch_wrapper_optional"
          >
          <span>${plugin_settings.cookie_optional}</span><span class="cookiemunch_wrapper_chev"></span>
        </div>
        <div class="cookiemunch_wrapper cookiemunch_wrapper_optional" style="display: none;">
        `;
      } else {
        html += /*html*/ `
        <div class="cookiemunch_wrapper cookiemunch_wrapper_optional" data-fade-switch="true">`;
      }
      if (cookies_object.length > 1 && grouping.indexOf("Optional") > -1) {
        for (let i = 0; i < cookies_object.length; i++) {
          if (!cookies_object[i].group) {
            html += /*html*/ `
            <div class="cookiemunch_container">
              <div class="cookiemunch_switch_title_container">
                <h2>${cookies_object[i].name}</h2>
                <label class="cookiemunch_switch">
                  <input id="cookiemunch_${cookies_object[i].id}" type="checkbox" value="cookiemunch_${cookies_object[i].id}" aria-label="check box for ${cookies_object[i].name} cookies">
                  <span class="cookiemunch_slider cookiemunch_round${plugin_settings.check_switch_icons ? ' cookiemunch_switch_icons' : ''}">
                    ${plugin_settings.check_switch_icons ? /*html*/`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill:#4ADE80;transform:;-ms-filter:"><path d="M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill:#F87171;transform:;-ms-filter:"><path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"></path></svg>` : ``}
                  </span>
                </label>
              </div>
              <p>${cookies_object[i].used_for}</p>
              <a rel="noreferrer" target="_blank" href="${cookies_object[i].url}">${cookies_object[i].url_text}</a>
            </div>`;
          }
        }
      } else if (cookies_object.length === 1 && grouping.indexOf("Optional") > -1) {
        if (!cookies_object[0].group) {
          html += /*html*/ `
          <div class="cookiemunch_container">
            <div class="cookiemunch_switch_title_container"><h2>${cookies_object[0].name}</h2>
              <label style="pointer-events: none; border-width: 0px;" class="cookiemunch_switch">
                <input id="cookiemunch_${cookies_object[0].id}" type="checkbox" value="cookiemunch_${cookies_object[0].id}" aria-label="check box for ${cookies_object[0].name} cookies">
                <span class="checkmark">
                  <div class="checkmark_stem"></div>
                  <div class="checkmark_kick"></div>
                </span>
                <span class="close"></span>
              </label>
            </div>
            <p>${cookies_object[0].used_for}</p>
            <a rel="noreferrer" target="_blank" href="${cookies_object[0].url}">${cookies_object[0].url_text}</a>
          </div>`;
        }
      }
      html += /*html*/ `</div>`;
    }

    // required cookies section
    if (cookies_object.length && required_cookies.length) {
      html += /*html*/ `
      <div
        class="cookiemunch_wrapper_dropdown cookiemunch_wrapper_required"
        data-cookiemunchdropdown="cookiemunch_wrapper_required"
        >
        <span>${plugin_settings.cookie_required}</span>
        <span class="cookiemunch_wrapper_chev"></span>
      </div>
      <div class="cookiemunch_wrapper cookiemunch_wrapper_required" style="display: none;">`;
    } else {
      html += /*html*/ `
      <div class="cookiemunch_wrapper cookiemunch_wrapper_required" data-fade-switch="true">`;
    }
    if (required_cookies.length) {
      for (let j = 0; j < required_cookies.length; j++) {
        html += /*html*/ `
        <div class="cookiemunch_container">
          <div class="cookiemunch_switch_title_container">
            <h2>${required_cookies[j].name}</h2>
          </div>
          <p>${required_cookies[j].used_for}</p>
          <a rel="noreferrer" target="_blank" href="${required_cookies[j].url}">${required_cookies[j].url_text}</a>
        </div>`;
      }
    }
    html += /*html*/ `</div>`;

    // label above action buttons
    if (cookies_object.length) {
      html += /*html*/ `
      <span class="cookiemunch_actions_label">${plugin_settings.cookie_accept_label}</span>`;
    } else if (required_cookies.length) {
      html += /*html*/ `
      <span class="cookiemunch_actions_label">${plugin_settings.cookie_required_label}</span>`;
    }

    // action buttons
    html += /*html*/ `
    <div class="cookiemunch_actions">`;
    if (cookies_object.length > 1) {
      if (required_cookies.length) {
        html += /*html*/ `
        <button id="cookiemunch_decline">
          ${plugin_settings.cookie_button_required}
        </button>
        <button id="cookiemunch_accept_selected" ${has_grouping ? '' : 'style="display: none;"'}>
          ${plugin_settings.cookie_button_selected}
        </button>
        <button 
          data-cookiemunchdropdown="cookiemunch_wrapper_optional"
          id="cookiemunch_accept_select"  
          ${has_grouping ? 'style="display: none;"' : ''}>
            ${plugin_settings.cookie_button_select}
        </button>
        `;
      } else {
        html += /*html*/ `
        <button id="cookiemunch_decline">
          ${plugin_settings.cookie_button_none}
        </button>
        <button id="cookiemunch_accept_selected">
          ${plugin_settings.cookie_button_selected}
        </button>
        `;
      }
      html += /*html*/ `
      <button id="cookiemunch_accept_all">
        ${plugin_settings.cookie_button_all}
      </button>
      `;
    } else if (cookies_object.length === 1) {
      if (required_cookies.length) {
        html += /*html*/ `
        <button class="width-half" id="cookiemunch_decline">
          ${plugin_settings.cookie_button_required}
        </button>
        <button class="width-half" id="cookiemunch_accept_all">
          ${plugin_settings.cookie_button_all}
        </button>
        `;
      } else {
        html += /*html*/ `
        <button class="width-half" id="cookiemunch_decline">
          ${plugin_settings.cookie_button_no}
        </button>
        <button class="width-half" id="cookiemunch_accept_all">
          ${plugin_settings.cookie_button_yes}
        </button>
        `;
      }
    } else if (required_cookies.length) {
      html += /*html*/ `
      <button class="width-full" id="cookiemunch_accept_all">
        ${plugin_settings.cookie_button_agree}
      </button>
      `;
    }
    html += /*html*/ `</div>`;
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

  const create_cookiemunch = () => {

    let create_html_hot_cookie_options = document.createElement('div');
    let cookie_munch_el = document.createElement('div');
    let cookie_munch_el_required = document.createElement('div');

    create_html_hot_cookie_options.setAttribute("class", "cookiemunch_toggle_view");
    create_html_hot_cookie_options.innerHTML = create_html_hot_cookie_options_fn();

    cookie_munch_el.setAttribute("id", "cookie_munch_element");
    cookie_munch_el.setAttribute("style", "transition: 0.3s ease-in-out; opacity: 0;");
    if (plugin_settings.hide_icon) {
      cookie_munch_el.setAttribute("data-class", "cookiemunch_hide_icon");
    }
    cookie_munch_el.setAttribute("class", "open-fully");

    let cookie_svg = /*html*/ `
    <img width="100%" height="100%" alt="cookiemunch logo" src="${plugin_settings.cookie_image}">
    `;
    let html = /*html*/ `
    <div class="cookie_munch_title_wrap">
      <div class="cookie_munch_svg">${cookie_svg}</div>
      <h1>${plugin_settings.cookie_title}</h1>
    </div>
    <span style="display: none;" id="close_panel_btn" class="close_panel"></span>
    `;
    cookie_munch_el.innerHTML = html;

    // required blocker
    cookie_munch_el_required.setAttribute("id", "cookiemunch_cookies_required");

    if (plugin_settings.required && !checkCookie('cookiemunch_option_selected')) {
      cookie_munch_el.appendChild(create_html_hot_cookie_options);
      cookie_munch_el_required.appendChild(cookie_munch_el);
      document.body.appendChild(cookie_munch_el_required);
      document.body.classList.add("cookiemunch_scroll_block");
    } else {
      cookie_munch_el.appendChild(create_html_hot_cookie_options);
      document.body.appendChild(cookie_munch_el);
    }

    toggle_view_el = document.querySelector(".cookiemunch_toggle_view");
    document.querySelector('.cookie_munch_title_wrap').addEventListener("click", () => {
      slideDown(toggle_view_el, duration);
    });
    if (checkCookie('cookiemunch_option_selected')) {
      slideUp(toggle_view_el, 0);
    }

    let cookiemunch_dropdown_btns = document.querySelectorAll('[data-cookiemunchdropdown]');
    [].forEach.call(cookiemunch_dropdown_btns, (cookiemunch_dropdown) => {
      cookiemunch_dropdown.onclick = () => {
        let dropdown = cookiemunch_dropdown.getAttribute('data-cookiemunchdropdown');
        window.cookiemunch_dropdown(dropdown);
      }
    });

    let cookiemunch_decline_btn = document.getElementById('cookiemunch_decline');
    if (cookiemunch_decline_btn) {
      cookiemunch_decline_btn.onclick = () => {
        window.cookiemunch_decline();
      }
    }

    let cookiemunch_accept_selected_btn = document.getElementById('cookiemunch_accept_selected');
    if (cookiemunch_accept_selected_btn) {
      cookiemunch_accept_selected_btn.onclick = () => {
        window.cookiemunch_accept_selected();
      }
    }

    let close_panel_btn = document.getElementById('close_panel_btn');
    if (close_panel_btn) {
      close_panel_btn.onclick = () => {
        window.cookiemunch_accept_selected();
      }
    }

    let cookiemunch_accept_all_btn = document.getElementById('cookiemunch_accept_all');
    if (cookiemunch_accept_all_btn) {
      cookiemunch_accept_all_btn.onclick = () => {
        window.cookiemunch_accept_all();
      }
    }

    setTimeout(() => {
      cookie_munch_el.setAttribute("style", "transition: 0.3s ease-in-out; opacity:1;");
    }, duration);
  };

  // set checked if cookies
  const set_checked_if_cookies = () => {
    for (let i = 0; i < cookies_object.length; i++) {
      let check_this_cookie = 'cookiemunch_' + cookies_object[i].id;
      let el = document.getElementById(check_this_cookie);
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
  const load_scripts_if_cookies = () => {
    let i;
    let check_this_cookie;
    if (checkCookie('cookiemunch_option_selected')) {
      if (plugin_settings.hide_icon) {
        document.getElementById("cookie_munch_element").setAttribute("class", "closed-fully");
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
        let el = document.getElementById(check_this_cookie);
        if (plugin_settings.first_visit_checked) {
          el.checked = true;
        } else {
          el.checked = false;
        }
      }
    }
  };

  const load_dropdown = () => {
    if (!plugin_settings.start_dropdown_closed) {
      let first_group = get_grouping();
      if (!has_grouping) {
        cookiemunch_dropdown('cookiemunch_wrapper_optional');
      } else {
        cookiemunch_dropdown(`cookiemunch_wrapper_${first_group[0].replaceAll(/\s/g,'_')}_group`.toLowerCase());
      }
    }
  };

  window.cookiemunch_load_plugin = () => {
    let cookie_munch_element = document.getElementById("cookie_munch_element");
    if (cookie_munch_element) {
      cookie_munch_element.parentElement.removeChild(cookie_munch_element);
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

  const startup = () => {
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
    setTimeout(() => {
      cookiemunch_load_plugin();
    }, 0);
  };

  startup();
};

if (typeof exports != "undefined") {
  exports.cookiemunch = cookiemunch_function;
  window.cookiemunch = cookiemunch_function;
} else {
  window.cookiemunch = cookiemunch_function;
}