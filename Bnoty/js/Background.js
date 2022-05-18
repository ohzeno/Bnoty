var global;

// global is browser
if ("undefined" != typeof chrome) {
  global = chrome;
} else {
  if ("undefined" != typeof browser) {
    global = browser;
  } else {
    void 0;
  }
}

Bnoty = {
  init: function () {
    // Bnoty.inject execute when broswer cliked
    global.browserAction.onClicked.addListener(this.inject);
    global.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request.method === "ShowCapture") {
        Bnoty.screenShot(sendResponse);
        sendResponse({ farewell: "screenShot funcion is called" });
      } else if (request.method === "sendimg") {
        var img = request.dataUUU;
        var o = chrome.extension.getURL("capture.html");
        chrome.tabs.query({}, function (e) {
          var t;
          if (e && e.length)
            for (var n = e.length - 1; 0 <= n; n--)
              if (e[n].url === o) {
                t = e[n];
                break;
              }

          if (t) {
            chrome.tabs.update(
              t.id,
              { active: true },
              Function.prototype.bind.call(
                Bnoty.updateScreenshot,
                Bnoty,
                img,
                sendResponse,
                0
              )
            );
          } else {
            chrome.tabs.create(
              {
                url: o,
              },
              Function.prototype.bind.call(
                Bnoty.updateScreenshot,
                Bnoty,
                img,
                sendResponse,
                0
              )
            );
          }
        });
      } else if (request.method === "FullcaptureStart") {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            var tab = tabs[0];
            currentTab = tab; // For current tab information
            var filename = getFilename(tab.url);
            CaptureAPI.captureToFiles(
              tab,
              filename,
              displayCaptures,
              errorHandler,
              progress,
              splitnotifier
            );
          }
        );
      }
    });
  },
  inject: function () {
    global.tabs.insertCSS(
      null,
      {
        file: "/css/main.min.css",
      },
      function () {
        if (global.extension.lastError) {
          global.extension.lastError.message;
          try {
            alert("Please try another page. we can't capture this page..");
          } catch (e) {}
        }
        // inject.js injection to current page /
        global.tabs.executeScript(null, {
          file: "/js/inject.js",
        });
      }
    );
  },
  // capture function
  screenShot: function (i) {
    global.tabs.captureVisibleTab(function (img) {
      var o = global.extension.getURL("capture.html");
      global.tabs.query({}, function (e) {
        var t;
        if (e && e.length)
          for (var n = e.length - 1; 0 <= n; n--)
            if (e[n].url === o) {
              t = e[n];
              break;
            }

        if (t) {
          global.tabs.update(
            t.id,
            { active: true },
            Function.prototype.bind.call(
              Bnoty.updateScreenshot,
              Bnoty,
              img,
              i,
              0
            )
          );
        } else {
          global.tabs.create(
            {
              url: o,
            },
            Function.prototype.bind.call(
              Bnoty.updateScreenshot,
              Bnoty,
              img,
              i,
              0
            )
          );
        }
      });
    });
  },
  // update page function
  updateScreenshot: function (t, n) {
    var a = arguments[2];
    if (a == null) {
      a = 0;
    }

    if (10 >= a) {
      global.runtime.sendMessage(
        {
          method: "update_url",
          url: t,
        },
        function (e) {
          (e && e.success) ||
            window.setTimeout(
              Function.prototype.bind.call(
                Bnoty.updateScreenshot,
                Bnoty,
                t,
                n,
                ++a
              ),
              300
            );
        }
      );
    }
  },
  screenshot_full: function (i, img) {
    var o = chrome.extension.getURL("capture.html");
    chrome.tabs.query({}, function (e) {
      var t;
      if (e && e.length)
        for (var n = e.length - 1; 0 <= n; n--)
          if (e[n].url === o) {
            t = e[n];
            break;
          }

      if (t) {
        chrome.tabs.update(
          t.id,
          { active: true },
          Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, i, 0)
        );
      } else {
        chrome.tabs.create(
          {
            url: o,
          },
          Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, i, 0)
        );
      }
    });
  },
  showPanel: function () {
    global.tabs.executeScript({
      code: `window.bnoty.showControlPanel();`,
    });
  },
};

Bnoty.init();

// methods, variable
var currentTab; // current tab (chrome.tabs.query)
var resultWindowId; // tab id
// util
function $(id) {
  return document.getElementById(id);
}
function show(id) {
  $(id).style.display = "block";
}
function hide(id) {
  $(id).style.display = "none";
}

// change file name function
function getFilename(contentURL) {
  var name = contentURL.split("?")[0].split("#")[0];
  if (name) {
    name = name
      .replace(/^https?:\/\//, "")
      .replace(/[^A-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[_\-]+/, "")
      .replace(/[_\-]+$/, "");
    name = "-" + name;
  } else {
    name = "";
  }
  return "screencapture" + name + "-" + Date.now() + ".png";
}

// Capture Handlers
function displayCaptures(filenames) {
  if (!filenames || !filenames.length) {
    alert("Full Capture Error!");
    return;
  }

  _displayCapture(filenames);
}

function _displayCapture(filenames, index) {
  index = index || 0;
  var last = index === filenames.length - 1;
  if (!last) {
    _displayCapture(filenames, index + 1);
  }
}

function errorHandler(reason) {
  show("uh-oh");
}

// Loading bar
function progress(complete) {
  if (complete === 0) {
    show("loading");
  } else {
    $("bar").style.width = parseInt(complete * 100, 10) + "%";
  }
}

function splitnotifier() {
  show("split-image");
}
