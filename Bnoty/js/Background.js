var global;

// global에 브라우저 할당
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
    // 크롬 익스텐션 아이콘 클릭되면 Bnoty.inject 실행
    global.browserAction.onClicked.addListener(this.inject);
    global.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if ( request.method === 'ShowCapture' ){
          console.log("now page capture");
          Bnoty.screenShot(sendResponse);
          sendResponse({ farewell: 'screenShot funcion is called' });
      } else if ( request.method === 'sendimg' ){
          console.log("~~~~~~sendimg print~~~ ");
          // Bnoty.screenshot_full( sendResponse, request.dataUUU);
          // console.error(request.dataUUU);
          var img = request.dataUUU;
          var o = chrome.extension.getURL("capture.html");
          chrome.tabs.query({}, function(e) {
              var t;
              if (e && e.length)
                  for (var n = e.length - 1; 0 <= n; n--)
                      if (e[n].url === o) {
                          t = e[n];
                          break;
                      }
              
              if (t){
                chrome.tabs.update( 
                      t.id,
                      { active: true },
                      Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, sendResponse, 0)
                      );
              } else {
                chrome.tabs.create({
                      url: o
                  }, Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, sendResponse, 0));
              }
          
          });
          
      } else if ( request.method === 'FullcaptureStart' ){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var tab = tabs[0]; 
          currentTab = tab; // 탭 정보를 얻기 위해 나중에 호출할 때 사용됨
          var filename = getFilename(tab.url);
          console.log("filename : " + filename);
          CaptureAPI.captureToFiles(tab, filename, displayCaptures,
                                    errorHandler, progress, splitnotifier);
        });
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
            alert(
              "We are sorry, but the page you are viewing is not supported. Please try another page."
            );
          } catch (e) {}
        }
        // 현재 탭에 inject.js 삽입. activeTab 권한 있어야함.
        global.tabs.executeScript(null, {
          file: "/js/inject.js", // 상위폴더 background.html에서 실행되는거라 /js/ 붙음.
        });
      }
    );
  },
  // 현재 화면 캡처 함수 2
  screenShot: function(i) {
    console.log("[Background] ShowCapture");
    global.tabs.captureVisibleTab(function(img) {
        var o = global.extension.getURL("capture.html");
        global.tabs.query({}, function(e) {
            var t;
            if (e && e.length)
                for (var n = e.length - 1; 0 <= n; n--)
                    if (e[n].url === o) {
                        t = e[n];
                        break;
                    }
            
            // 이미지 테스트
            // var aa = "https://i2.tcafe2a.com/220427/cf582f5c59a78ed65decb42dcbee2883_1651006214_2591.jpg";
            
            if (t){
                global.tabs.update( 
                    t.id,
                    { active: true },
                    Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, i, 0)
                    );
            } else {
                global.tabs.create({
                    url: o
                }, Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, i, 0));
            }
        
        });
    });
  },
  // 창 전환
  updateScreenshot: function(t, n) {
    var a = arguments[2];
    if ( a == null ){
        (a = 0);
    }
    
    if ( 10 >= a ){
        global.runtime.sendMessage({
            method: "update_url",
            url: t
        }, function(e) {
            e && e.success || window.setTimeout(Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, t, n, ++a), 300);
        });
    }
  },
  screenshot_full:function(i, img){
    var o = chrome.extension.getURL("capture.html");
    chrome.tabs.query({}, function(e) {
        var t;
        if (e && e.length)
            for (var n = e.length - 1; 0 <= n; n--)
                if (e[n].url === o) {
                    t = e[n];
                    break;
                }
        
        if (t){
          chrome.tabs.update( 
                t.id,
                { active: true },
                Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, i, 0)
                );
        } else {
          chrome.tabs.create({
                url: o
            }, Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, i, 0));
        }
    
    });
  }
  
};

Bnoty.init();


// 설정 메소드
var currentTab; // 현재 활성 탭의 chrome.tabs.query 결과
var  resultWindowId; // 결과 이미지를 넣을 창 ID
// 유틸 
function $(id) { return document.getElementById(id); }
function show(id) { $(id).style.display = 'block'; }
function hide(id) { $(id).style.display = 'none'; }

// 현재 uRL 받아서 그냥 파일명만 바꿔주는 함수
function getFilename(contentURL) {
  console.log("[popup.js] 2. getFilename (현재URL) ");
  console.log(contentURL);
  var name = contentURL.split('?')[0].split('#')[0];
  if (name) {
    name = name
            .replace(/^https?:\/\//, '')
            .replace(/[^A-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^[_\-]+/, '')
            .replace(/[_\-]+$/, '');
        name = '-' + name;
    } else {
        name = '';
    }
    return 'screencapture' + name + '-' + Date.now() + '.png';
}


//
// Capture Handlers
function displayCaptures(filenames) {
    if (!filenames || !filenames.length) {
      alert("Full Capture Error!");  
      // show('uh-oh');
        return;
    }

    _displayCapture(filenames);
}


function _displayCapture(filenames, index) {
  console.log("popup.js : _displayCapture ");
  // console.log("완성된URL 이미지가아님 : " + filename);
  index = index || 0;
  var last = index === filenames.length - 1;
  if (!last) {
      _displayCapture(filenames, index + 1);
  }
}


function errorHandler(reason) {
    show('uh-oh'); // TODO - extra uh-oh info?
}


// 로딩바
function progress(complete) {
    if (complete === 0) {
        // Page capture has just been initiated.
        show('loading');
    }
    else {
        $('bar').style.width = parseInt(complete * 100, 10) + '%';
    }
}

// 이미지 분해
function splitnotifier() {
    show('split-image');
}

