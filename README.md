# Purpose

This add-on is meant to demonstrate page jank on some Amazon pages with only
basic use of the `PageMod` API.

This problem occurs with and without e10s enabled.

# Run with e10s

1. `jpm run -b '/Applications/FirefoxNightly.app/Contents/MacOS/firefox-bin'`
2. Visit an [Amazon product page][1]
3. Attempt to scroll the page (lots of jank)
4. Hard refresh (Cmd-Shift-R)
5. Attempt to scroll the page (even more jank)

# Run without e10s

1. `jpm run -b '/Applications/FirefoxNightly.app/Contents/MacOS/firefox-bin' --prefs no-e10s.json`
2. Visit an [Amazon product page][1]
3. Attempt to scroll the page (lots of jank)
4. Hard refresh (Cmd-Shift-R)
5. Attempt to scroll the page (even more jank)

# Errors

In your terminal, you should see many errors during the jank periods, including:

* `TypeError: worker.tab is null`
* `TypeError: can't access dead object`

# Cause

This problem only appears in Firefox 36 and later.

[Bug 1058698][2] changed `PageMod` to use frame scripts and message passing in
support of e10s.  This work landed in Firefox 36.

Amazon's site uses a browser-specific preloader to pull in JS and CSS files they
believe will be needed on future pages.

In more detail:

1. The preloader waits until the main page has finished loading
2. It creates dummy elements to trigger extra JS and CSS files to load
  * For Firefox, `object` elements with a `data` attribute are used
  * For Chrome, `img` elements with a `src` attribute are used
3. The dummy elements are removed once any of the following happen:
  * `onload` handler is triggered
  * `onerror` handlers is triggered
  * 2500 - 2599 ms have passed

In Firefox, the use of `object` elements for this purpose means a tiny dummy
window is created for each preload request.  The page mod is offered each of
these windows to attach its code, but in most cases the window is already gone
before the first line of `onAttach` can execute, resulting in many errors and
page jank.

[1]: http://www.amazon.com/Saga-Vol-Brian-K-Vaughan/dp/1607069318/
[2]: https://bugzil.la/1058698
