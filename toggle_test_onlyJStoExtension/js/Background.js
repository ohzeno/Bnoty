console.log("Background.js upppp");
var global;

if ("undefined" != typeof chrome) {
  global = chrome;
} else {
  if ("undefined" != typeof browser) {
    global = browser;
  } else {
    void 0;
  }
}

what = {
  init: function () {
    global.browserAction.onClicked.addListener(this.inject);
  },
  inject: function () {
    global.tabs.executeScript(null, {
      file: "/js/inject.js",
    });
  },
};

what.init();
