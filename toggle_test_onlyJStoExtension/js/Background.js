console.log("Background.js upppp");
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
    // 현재 탭에 inject.js 삽입. activeTab 권한 있어야함.
    global.tabs.executeScript(null, {
      file: "/js/inject_my.js", // 상위폴더 background.html에서 실행되는거라 /js/ 붙음.
    });
  },
};

Bnoty.init();
