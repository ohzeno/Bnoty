// in background
window.CaptureAPI = (function () {
  var MAX_PRIMARY_DIMENSION = 15000 * 2,
    MAX_SECONDARY_DIMENSION = 4000 * 2,
    MAX_AREA = MAX_PRIMARY_DIMENSION * MAX_SECONDARY_DIMENSION;

  var matches = ["http://*/*", "https://*/*", "ftp://*/*", "file://*/*"],
    noMatches = [/^https?:\/\/chrome.google.com\/.*$/];

  function isValidUrl(url) {
    var r, i;
    for (i = noMatches.length - 1; i >= 0; i--) {
      if (noMatches[i].test(url)) {
        return false;
      }
    }
    for (i = matches.length - 1; i >= 0; i--) {
      r = new RegExp("^" + matches[i].replace(/\*/g, ".*") + "$");
      if (r.test(url)) {
        return true;
      }
    }
    return false;
  }

  function initiateCapture(tab, callback) {
    chrome.tabs.sendMessage(tab.id, { msg: "scrollPage" }, function () {
      // console.log("initiate Capture function ------>");
      callback();
    });
  }

  function capture(data, screenshots, sendResponse, splitnotifier) {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataURI) {
      if (dataURI) {
        var image = new Image();
        image.onload = function () {
          data.image = { width: image.width, height: image.height };
          // console.log(data.image);

          // need modify 
          if (data.windowWidth !== image.width) {
            var scale = image.width / data.windowWidth;
            data.x *= scale;
            data.y *= scale;
            data.totalWidth *= scale;
            data.totalHeight *= scale;
          }

          // wait for capture
          if (!screenshots.length) {
            Array.prototype.push.apply(
              screenshots,
              _initScreenshots(data.totalWidth, data.totalHeight)
            );
            if (screenshots.length > 1) {
              if (splitnotifier) {
                // 분할알림
                splitnotifier();
              }
              $("screenshot-count").innerText = screenshots.length;
            }
          }

          _filterScreenshots(
            data.x,
            data.y,
            image.width,
            image.height,
            screenshots
          ).forEach(function (screenshot) {
            screenshot.ctx.drawImage(
              image,
              data.x - screenshot.left,
              data.y - screenshot.top
            );
            // console.log(image);
          });

          // response
          sendResponse(JSON.stringify(data, null, 4) || true);
        };
        image.src = dataURI;
      }
    });
  }

  function _initScreenshots(totalWidth, totalHeight) {
    var badSize =
        totalHeight > MAX_PRIMARY_DIMENSION ||
        totalWidth > MAX_PRIMARY_DIMENSION ||
        totalHeight * totalWidth > MAX_AREA,
      biggerWidth = totalWidth > totalHeight,
      maxWidth = !badSize
        ? totalWidth
        : biggerWidth
        ? MAX_PRIMARY_DIMENSION
        : MAX_SECONDARY_DIMENSION,
      maxHeight = !badSize
        ? totalHeight
        : biggerWidth
        ? MAX_SECONDARY_DIMENSION
        : MAX_PRIMARY_DIMENSION,
      numCols = Math.ceil(totalWidth / maxWidth),
      numRows = Math.ceil(totalHeight / maxHeight),
      row,
      col,
      canvas,
      left,
      top;

    var canvasIndex = 0;
    var result = [];

    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        canvas = document.createElement("canvas");
        canvas.width =
          col == numCols - 1 ? totalWidth % maxWidth || maxWidth : maxWidth;
        canvas.height =
          row == numRows - 1 ? totalHeight % maxHeight || maxHeight : maxHeight;

        left = col * maxWidth;
        top = row * maxHeight;

        result.push({
          canvas: canvas,
          ctx: canvas.getContext("2d"),
          index: canvasIndex,
          left: left,
          right: left + canvas.width,
          top: top,
          bottom: top + canvas.height,
        });

        canvasIndex++;
      }
    }

    return result;
  }

  function _filterScreenshots(
    imgLeft,
    imgTop,
    imgWidth,
    imgHeight,
    screenshots
  ) {
    var imgRight = imgLeft + imgWidth,
      imgBottom = imgTop + imgHeight;
    return screenshots.filter(function (screenshot) {
      return (
        imgLeft < screenshot.right &&
        imgRight > screenshot.left &&
        imgTop < screenshot.bottom &&
        imgBottom > screenshot.top
      );
    });
  }

  // send capture result
  function getBlobs(screenshots) {
    // console.log("getBlobs Funtion in Fullcapture.js line 171");
    return screenshots.map(function (screenshot) {
      var dataURI = screenshot.canvas.toDataURL();
      var o = chrome.extension.getURL("capture.html");
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
            Function.prototype.bind.call(updateScreenshot, Bnoty, dataURI, 0, 0)
          );
        } else {
          global.tabs.create(
            {
              url: o,
            },
            Function.prototype.bind.call(updateScreenshot, Bnoty, dataURI, 0, 0)
          );
        }
      });
    });
  }

  function saveBlob(blob, filename, index, callback, errback) {
    filename = _addFilenameSuffix(filename, index);

    function onwriteend() {
      var urlName =
        "filesystem:chrome-extension://" +
        chrome.i18n.getMessage("@@extension_id") +
        "/temporary/" +
        filename;

      callback(urlName);
    }

    var size = blob.size + 1024 / 2;

    var reqFileSystem =
      window.requestFileSystem || window.webkitRequestFileSystem;
    reqFileSystem(
      window.TEMPORARY,
      size,
      function (fs) {
        fs.root.getFile(
          filename,
          { create: true },
          function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = onwriteend;
              fileWriter.write(blob);
            }, errback); 
          },
          errback
        );
      },
      errback
    );
  }

  function _addFilenameSuffix(filename, index) {
    if (!index) {
      return filename;
    }
    var sp = filename.split(".");
    var ext = sp.pop();
    return sp.join(".") + "-" + (index + 1) + "." + ext;
  }

  function captureToBlobs(tab, callback, errback, progress, splitnotifier) {
    var loaded = false,
      screenshots = [],
      timeout = 3000,
      timedOut = false,
      noop = function () {};

    callback = callback || noop;
    errback = errback || noop;
    progress = progress || noop;

    if (!isValidUrl(tab.url)) {
      errback("invalid url"); // TODO errors
    }

    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request.msg === "capture") {
        progress(request.complete);
        capture(request, screenshots, sendResponse, splitnotifier);
        return true;
      } else {
        console.error(
          "Unknown message received  : " + request.msg
        );
        errback("internal error");
        return false;
      }
    });

    chrome.tabs.executeScript(tab.id, { file: "js/Page.js" }, function () {
      if (timedOut) {
        // console.error("Timeout");
      } else {
        loaded = true;
        progress(0);

        // reload code ( 5 seconds )
        window.setTimeout(function () {
          window.location.reload();
        }, 5000);

        function showPanel() {
          window.Bnoty.showPanel();
        }
        initiateCapture(tab, function () {
          // send capture result
          showPanel();
          callback(getBlobs(screenshots));
        });
      }
    });

    window.setTimeout(function () {
      if (!loaded) {
        timedOut = true;
        errback("execute timeout");
      }
    }, timeout); //3000
  }

  // capture result -> file
  function captureToFiles(
    tab,
    filename,
    callback,
    errback,
    progress,
    splitnotifier
  ) {
    captureToBlobs(
      tab,
      function (blobs) {
        var i = 0,
          len = blobs.length,
          filenames = [];

        (function doNext() {
          saveBlob(
            blobs[i],
            filename,
            i,
            function (filename) {
              i++;
              filenames.push(filename);
              i >= len ? callback(filenames) : doNext();
            },
            errback
          );
        })();
      },
      errback,
      progress,
      splitnotifier
    );
  }

  function updateScreenshot(t, n) {
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
              Function.prototype.bind.call(updateScreenshot, Bnoty, t, n, ++a),
              300
            );
        }
      );
    }
  }

  return {
    captureToBlobs: captureToBlobs,
    captureToFiles: captureToFiles,
  };
})();
