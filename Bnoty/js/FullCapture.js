// in background
window.CaptureAPI = (function () {
  var MAX_PRIMARY_DIMENSION = 15000 * 2,
    MAX_SECONDARY_DIMENSION = 4000 * 2,
    MAX_AREA = MAX_PRIMARY_DIMENSION * MAX_SECONDARY_DIMENSION;

  var matches = ["http://*/*", "https://*/*", "ftp://*/*", "file://*/*"],
    noMatches = [/^https?:\/\/chrome.google.com\/.*$/];

  function isValidUrl(url) {
    // 가능한 URL만 찍을 것
    // 일단....
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
      console.log("initiateCapture function ------>");
      // 창의 모든 부분에 대한 스냅샷 촬영을 마쳤습니다.
      // 결과 전체 스크린샷 이미지를 새 브라우저 탭에 표시합니다.
      callback();
    });
  }

  function capture(data, screenshots, sendResponse, splitnotifier) {
    console.log(
      "capture FUNTION // USE --> captureVisibleTab ( Fullcapture.js )"
    );
    // 캠처하는곳

    //
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataURI) {
      if (dataURI) {
        var image = new Image();
        image.onload = function () {
          data.image = { width: image.width, height: image.height };
          console.log("capture 함수 ( api.js  ) : data.image");
          console.log(data.image);

          //
          //  브라우저 크기가 다르기 때문에 조정해야함
          if (data.windowWidth !== image.width) {
            var scale = image.width / data.windowWidth;
            data.x *= scale;
            data.y *= scale;
            data.totalWidth *= scale;
            data.totalHeight *= scale;
          }

          //
          // 스크린샷 캔버스의 지연 초기화(실제 이미지 크기를 기다려야 하기 때문에)
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

          //
          // 일치하는 스크린샷 캔버스에 그리기
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
            console.log("  IMAGE ~~~ ");
            console.log(image);
          });

          // 응답
          sendResponse(JSON.stringify(data, null, 4) || true);
        };
        image.src = dataURI;
      }
    });
  }

  function _initScreenshots(totalWidth, totalHeight) {
    // 최종 이미지의 'totalWidth' 및 'totalHeight'를 기반으로
    // 스크린샷 개체의 배열을 만들고 반환
    //
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
    console.log(" fun -- _filterScreenshots : api.js // 164 line");

    //
    // 주어진 이미지의 위치와 일치하는 것으로 스크린샷을 필터링합니다.

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

  // 최종 이미지 보내주기
  function getBlobs(screenshots) {
    console.log("getBlobs Funtion in Fullcapture.js line 171");
    console.log(screenshots);
    return screenshots.map(function (screenshot) {
      var dataURI = screenshot.canvas.toDataURL();
      console.log("getBlobs : ");
      console.error(dataURI);
      // global.tabs.create({url: "https://www.naver.com"});
      // chrome.runtime.sendMessage( { method : 'sendimg', dataUUU : dataURI } );
      // 이거 됨
      // chrome.runtime.sendMessage( { method : 'sendimg' }, (response) => {
      //     console.log("[popup.js] 현재화면캡처");
      //     console.log(response.farewell);
      // });

      //여기서 처리하기
      // console.log("holy");
      var o = chrome.extension.getURL("capture.html");
      // global.tabs.create({
      //     url: o
      // }, Function.prototype.bind.call(updateScreenshot, Bnoty, dataURI, 0, 0));

      global.tabs.query({}, function (e) {
        var t;
        if (e && e.length)
          for (var n = e.length - 1; 0 <= n; n--)
            if (e[n].url === o) {
              t = e[n];
              break;
            }

        // 이미지 테스트
        // var aa = "https://i2.tcafe2a.com/220427/cf582f5c59a78ed65decb42dcbee2883_1651006214_2591.jpg";

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
    console.log(" saveBlob function ");
    filename = _addFilenameSuffix(filename, index);

    function onwriteend() {
      // blob이 포함된 파일을 엽니다.
      // 이미지를 분할해야 하는 경우 'openPage'를 다시 호출
      var urlName =
        "filesystem:chrome-extension://" +
        chrome.i18n.getMessage("@@extension_id") +
        "/temporary/" +
        filename;

      callback(urlName);
    }

    // 약간의 버퍼로 파일 시스템 크기 계산
    var size = blob.size + 1024 / 2;

    // 파일에 쓰기 위한 blob 생성
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
            }, errback); // 오류콜백 표준화 필요
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
    console.log("[fullcaptrue.js] 4. captureToBlobs func ");

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
        console.log(" onMessage / capture ");
        progress(request.complete);
        capture(request, screenshots, sendResponse, splitnotifier);

        // 비동기적으로 sendResponse를 사용하려면 return true를 추가
        // onMessage 이벤트 핸들러에
        return true;
      } else {
        console.error(
          "Unknown message received from content script: " + request.msg
        );
        errback("internal error");
        return false;
      }
    });

    chrome.tabs.executeScript(tab.id, { file: "js/Page.js" }, function () {
      if (timedOut) {
        console.error("시간초과 오류");
      } else {
        loaded = true;
        progress(0);

        // 재 로드용 (5초 후 리로드)
        window.setTimeout(function () {
          window.location.reload();
        }, 50000);

        function showPanel() {
          window.Bnoty.showPanel();
        }
        initiateCapture(tab, function () {
          // 최종 이미지 전송
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

  // 캡처를 파일로 바꿔주는 함수
  function captureToFiles(
    tab,
    filename,
    callback,
    errback,
    progress,
    splitnotifier
  ) {
    console.log("[fullcaptrue.js] 3. captureTofiles fun ");
    // function captureToBlobs(tab, callback, errback, progress, splitnotifier) {
    captureToBlobs(
      tab,
      function (blobs) {
        var i = 0,
          len = blobs.length,
          filenames = [];

        console.log("captureToBlobs");
        console.log(blobs);

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

  // 창 전환
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
