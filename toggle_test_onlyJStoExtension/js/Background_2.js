/**
 * Copyright Liang Zhou
 * All rights reserved.
 */
console.log("background.js upppp");
var global =
    "undefined" != typeof chrome
      ? chrome
      : "undefined" != typeof browser
      ? browser
      : void 0,
  NP = {
    init: function () {
      console.log("Background.js init");
      global.browserAction.onClicked.addListener(this.inject), // this.inject 는 init 안에있는 함수를 실행
        global.runtime.onMessage.addListener(function (e, t, n) {
          // 메시지 핸들러 function(request, sender, sendResponse) sendResponse는 function인데 응답 받았고 받았을 때 함수를 실행한다.
          // e는 inject.js에서 sendMessage로 보내온 method
          // n은 method를 받았을 때 응답하는 function
          if ("take_screen_shot" === e.method) NP.screenShot(n);
          else if ("get_pixel_color" === e.method) {
            var a = e.point; // x, y 축이 저장됨
            NP.getPixelColor(a, n); // n은 function 이동
          } else
            "save_data" === e.method // inject.js 보내온 저장 데이터
              ? NP.saveData(e.config)
              : "get_data" === e.method
              ? NP.getData(n)
              : "open_options" === e.method && chrome.runtime.openOptionsPage();
          // 확장 프로그램이 옵션 페이지를 선언하지 않거나 Chrome이 다른 이유로 페이지를 생성하지 못한 경우 lastError 콜백이 설정
          return !0;
        });
    },
    getPixelColor: function (r, c) {
      // r : x, y  c : function
      console.log("Background.js getPixelColor");
      global.tabs.captureVisibleTab(null, null, function (e) {
        // 화면 캡처 (windowId?: number, options?: ImageDetails, callback?: function,)
        // 이것을 사용하려면 <all_urls> 사용 권한 또는 ActiveTab 사용 권한이 있어야한다.
        // function에는 이미지 데이터 url이 들어온다. e = dataUrl
        var o = document.createElement("canvas"), //canvas tagname의 HTML요소를 만들어 반환
          i = o.getContext("2d"), // 렌더링 컨텍스트 타입을 지정
          l = new Image();
        document.documentElement.appendChild(o), // 루트 요소를 가르킨다. appendChild()는 객체를 루트요소안에 삽입한다. 캔버스를 루트요소안에 삽입한다.
          (l.src = e), // dataUrl
          (l.onload = function () {
            // 이미지가 온로드되었을 때
            (o.width = l.naturalWidth), // 이미지의 원본 크기를 캔버스의 너비를 맞춰줌
              (o.height = l.naturalHeight), // 이미지의 원본 크기를 캔버스의 높이를 맞춰줌
              i.drawImage(l, 0, 0); // 맨 왼쪽 위부터 이미지를 로드 시킴
            var e = i.getImageData(0, 0, o.width, o.height), // 추출할 이미지의 왼쪽 위 모서리의 x축 , y축 좌표, 추출할 사각형의 너비, 높이
              t = 4 * (r.y * e.width + r.x), // 스포이드를 찍은 부분의 위치를 저장
              n = e.data; // 255 데이터 배열이 쫙 나옴
            if ("function" == typeof c) {
              // sendResponse 함수 실행
              var a = {
                // 스포이드로 찍은 부분의 rgba 값을 저장함
                r: n[t],
                g: n[t + 1],
                b: n[t + 2],
                a: n[t + 3],
              };
              document.documentElement.removeChild(o), c(a);
            }
          });
      });
    },
    saveData: function (e) {
      // tool과 스포이드 색, 투명도가 저장된다.
      try {
        console.log("Background.js saveData");
        localStorage.setItem("config", JSON.stringify(e)); // 로컬스토리지 config 설정
      } catch (e) {}
    },
    getData: function (e) {
      console.log("Background.js getData");
      var t = localStorage.getItem("config"), // 로컬스토리지에서 불러옴
        n = null;
      try {
        n = JSON.parse(t);
      } catch (e) {}
      e(n); // config에 다시 저장한다.
    },
    inject: function () {
      console.log("Background.js inject");
      global.tabs.insertCSS(
        //tabId?: number, details: InjectDetails(css의 세부 정보, 파일), callback?: function,
        null,
        {
          file: "/css/main.min.css",
        },
        function () {
          if (global.extension.lastError) {
            // 허용되지 않은 페이지에서 실행했을 경우
            global.extension.lastError.message;
            try {
              alert(
                "We are sorry, but the page you are viewing is not supported. Please try another page."
              );
            } catch (e) {}
          }
          global.tabs.executeScript(null, {
            // 스크립트 실행
            file: "/js/inject.js",
          });
        }
      );
    },
  };

console.log("background.js init before");
NP.init();
