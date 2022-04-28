// 설정
var global = "undefined" != typeof chrome ? chrome : "undefined" != typeof browser ? browser : void 0; 

Bnoty = {
    init: function () {
        // global.browserAction.onClicked.addListener(this.inject);
        global.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if ( request.method === "test"){
                Bnoty.test2();
                sendResponse({ farewell: 'test funcion is called' });
            } else if ( request.method === 'ShowCapture' ){
                Bnoty.screenShot();
                sendResponse({ farewell: 'ShowCapture funcion is called' });
            }
        });

    },
    // inject: function () {
    //     global.tabs.executeScript(null, {
    //         file: "/js/inject.js",
    //     });
    // },
    
    // 테스트용 
    test2 : function() {
        console.log("크롬 스토리지 저장 하기 ");
        //
        let color = '#3aa757';
        var jam = 'spacecowboy';
        chrome.storage.sync.set({ color });
        chrome.storage.local.set({jam}, function () {
            // 저장 완료
            console.log(jam);
            console.log("저장완료 됐습니다.");
        });

        let testdata = '네네눼눼';
        chrome.storage.sync.set({ testdata });

        // 읽기
        chrome.storage.sync.get("color", ({ color }) => {
            console.log(color);
        });
        chrome.storage.local.get("jam", ({ jam }) => {
            console.log(jam);
        });
        chrome.storage.sync.get("testdata", ({ testdata }) => {
            console.log(testdata);
        });

        // 스토리지 비우고 한번 더
        console.log("스토리지 삭제");
        chrome.storage.local.clear();
        chrome.storage.sync.clear();
        chrome.storage.local.get("jam", ({ jam }) => {
            console.log(jam);
        });
        chrome.storage.sync.get("testdata", ({ testdata }) => {
            console.log(testdata);
        });
    },

    // 현재 화면 캡처
    ShowCapture : function(){
        console.log("[Background] ShowCapture");

        // 함수로 저장
        global.tabs.captureVisibleTab(function(a) {
            // 추출한 이미지 a
            let captureimgurl = a + "";
            console.log(typeof(a)); 
            console.log(captureimgurl); 
            console.log(typeof(captureimgurl)); 
               
            chrome.storage.sync.set({ captureimgurl });
            // global.tabs.create( { url: "capture.html" } );
            let color = a + '';
            var jam = 'spacecowboy';
            chrome.storage.sync.set({ color });
            chrome.storage.local.set({jam}, function () {
                // 저장 완료
                console.log(jam);
                console.log("저장완료 됐습니다.");
            });
    
        });
    
        //  
        setTimeout(function() {
            global.tabs.create( { url: "capture.html" } );
        }, 1000);
    },

    screenShot: function(i) {
        global.tabs.captureVisibleTab(function(a) {
            var o = global.extension.getURL("capture.html");
            global.tabs.query({}, function(e) {
                var t;
                if (e && e.length)
                    for (var n = e.length - 1; 0 <= n; n--)
                        if (e[n].url === o) {
                            t = e[n];
                            break;
                        }
                t ? global.tabs.update(t.id, {
                    active: !0
                }, Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, a, i, 0)) : global.tabs.create({
                    url: o
                }, Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, a, i, 0));
            });
        });
    },
    updateScreenshot: function(t, n) {
        var a = arguments[2];
        null == a && (a = 0), 10 < a || global.runtime.sendMessage({
            method: "update_url",
            url: t
        }, function(e) {
            e && e.success || window.setTimeout(Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, t, n, ++a), 300);
        });
    }

    //


};
  

Bnoty.init();