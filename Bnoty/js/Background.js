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
  },
  inject: function () {
    global.tabs.insertCSS(
      null,
      {
        file: "/css/main.min.css"
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
};

Bnoty.init();
