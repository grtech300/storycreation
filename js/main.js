/**
 * WEBSITE 1 - Main Application Script
 * Handles CTA link binding, green toggle state, and safe analytics loading.
 */

document.addEventListener("DOMContentLoaded", function () {
  const config = window.APP_CONFIG || {};
  const destinationUrl = config.MAIN_CONTENT_SITE_URL || "https://example.com/uk-student-grants";

  // 1. Bind destination URL & interaction handlers to all APPLY NOW buttons
  const applyButtons = document.querySelectorAll('.js-apply-now, [data-cta="apply"]');

  applyButtons.forEach(function (button) {
    button.setAttribute("href", destinationUrl);
    button.setAttribute("target", "_self");
    button.setAttribute("rel", "noopener");

    // Add toggle class on click/tap/focus
    button.addEventListener("click", function (event) {
      button.classList.toggle("is-toggled");
      if (typeof window.trackCtaClick === "function") {
        window.trackCtaClick("apply_now", destinationUrl);
      }
    });
  });

  // Global helper method callable directly from the Browser Console to toggle green state
  window.toggleApplyNow = function () {
    applyButtons.forEach(function (button) {
      button.classList.toggle("is-toggled");
    });
    console.log("APPLY NOW button green state toggled!");
  };

  // Initialize optional Analytics if IDs are provided
  initAnalytics(config);
});

/**
 * Safely initializes analytics tags only when valid measurement IDs are supplied in config.js
 */
function initAnalytics(config) {
  if (config.GA_MEASUREMENT_ID && config.GA_MEASUREMENT_ID.trim() !== "") {
    const gaId = config.GA_MEASUREMENT_ID.trim();
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId);
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", gaId, { send_page_view: true });

    window.trackCtaClick = window.trackCtaClick || function (action, url) {
      if (typeof window.gtag === "function") {
        window.gtag("event", action, {
          event_category: "CTA",
          event_label: url
        });
      }
    };
  }

  if (config.TIKTOK_PIXEL_ID && config.TIKTOK_PIXEL_ID.trim() !== "") {
    const ttId = config.TIKTOK_PIXEL_ID.trim();
    (function (w, d, t) {
      w[t] = w[t] || [];
      w[t].methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
      w[t].factory = function (e) {
        return function () {
          var a = Array.prototype.slice.call(arguments);
          a.unshift(e);
          w[t].push(a);
          return w[t];
        };
      };
      for (var i = 0; i < w[t].methods.length; i++) {
        w[t][e = w[t].methods[i]] = w[t].factory(e);
      }
      w[t].load = function (e, n) {
        var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
        w[t]._i = w[t]._i || {};
        w[t]._i[e] = [];
        w[t]._i[e]._u = i;
        w[t]._t = w[t]._t || {};
        w[t]._t[e] = +new Date();
        w[t]._o = w[t]._o || {};
        w[t]._o[e] = n || {};
        var c = d.createElement("script");
        c.type = "text/javascript";
        c.async = true;
        c.src = i + "?sdkid=" + e + "&lib=" + t;
        var s = d.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(c, s);
      };
      w[t].load(ttId);
      w[t].page();
    })(window, document, "ttq");
  }
}
