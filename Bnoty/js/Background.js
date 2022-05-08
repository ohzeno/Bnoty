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
          Bnoty.screenShot(sendResponse);
          sendResponse({ farewell: 'screenShot funcion is called' });
      } else if ( request.method === 'sendimg' ){
          console.log("sendimg 데이터 출력 메소드 ");
          console.error(request.dataUUU);
          var img = request.dataUUU;
          var o = global.extension.getURL("capture.html");
          global.tabs.query({}, function(e) {
              var t;
              if (e && e.length)
                  for (var n = e.length - 1; 0 <= n; n--)
                      if (e[n].url === o) {
                          t = e[n];
                          break;
                      }
              
              if (t){
                  global.tabs.update( 
                      t.id,
                      { active: true },
                      Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, sendResponse, 0)
                      );
              } else {
                  global.tabs.create({
                      url: o
                  }, Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, sendResponse, 0));
              }
          
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
  
};

Bnoty.init();
