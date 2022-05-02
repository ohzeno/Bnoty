// 설정
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
        // global.browserAction.onClicked.addListener(this.inject);
        global.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if ( request.method === "test"){
                Bnoty.test2();
                sendResponse({ farewell: 'test funcion is called' });
            } else if ( request.method === 'ShowCapture' ){
                Bnoty.screenShot(sendResponse);
                // sendResponse({ farewell: 'ShowCapture funcion is called' });
            } else if ( request.method === 'CropCapture' ){
                Bnoty.CropCapture();
                sendResponse({ farewell: 'CropCapture funcion is called' });
            } else if ( request.method === 'FullCapture' ){
                Bnoty.FullCapture();
                sendResponse({ farewell: 'FullCapture funcion is called' });
            } else if ( request.method === 'ScrollCapture' ){
                Bnoty.ScrollCapture();
                sendResponse({ farewell: 'ScrollCapture funcion is called' });
            }
        });

        // global.runtime.onMessage.addListener(function (e, t, n) {
        //     if ("ShowCapture" === e.method) Bnoty.screenShot(n);
        // });

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

    // 현재 화면 캡처 테스트
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
    // 전체화면
    FullCapture : function(i){
        console.log("[Background] FullCapture");
        // TODO
        // 전체화면 이미지를 구해서 url (string)으로 만든 다음 img 에다가 넣어주면된다.
        // var img;

        // 구현

        // 1. 페이지 최대화
        // 여기가 실행되는 곳은 html이 없어서 안됨..
        // 일단 보류



        // 2. 전체 페이지 사이즈구하기
        // 받아와야한다.
        
        // 2-1. 이미지 (canvas)를 전체사이즈로 생성
        
        // 3. 전체 사이즈를 스크린 사이즈로 나누어서 배열에 넣기
        // 이때 해더(위에 나오는거) 사이즈를 구하기
        // (가능)
        
        // 
        
        // 4. 배열돌리면서 이미지 삽입
        // 스크롤 바꾸고
        // 캡처해서
        // 전체 이미지에 붙여버리기.

        // 그리고 canvas 이미지 url을 추출해서 보내주기
        // (가능) todataURL을 사용

        // 개발 순서
        // 가. 일단 이게 되는지 확인하기
        // 나. 순선대로 코딩
        // 다. 테스트
        
        chrome.tabs.captureVisibleTab(
            null, {format: 'png'}, function(dataURI) {
                console.log(dataURI);
            });
        // capturing.then(onCaptured, onError);

        // function onCaptured(imageUri) {
        //     console.log(imageUri);
        // }
          
        // function onError(error) {
        //     console.log(`Error: ${error}`);
        // }
          
        
        

        // global.tabs.query({}, function(e) {
        //     var t;
        //     if (e && e.length)
        //         for (var n = e.length - 1; 0 <= n; n--)
        //             if (e[n].url === o) {
        //                 t = e[n];
        //                 break;
        //             }
        //     if (t){
        //         global.tabs.update( 
        //             t.id,
        //             { active: true },
        //             Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, i, 0)
        //             );
        //     } else {
        //         global.tabs.create({
        //             url: o
        //         }, Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, i, 0));
        //     }
        
        // });

    }, 
    // 스크롤 캡처
    ScrollCapture : function(i){
        console.log("[Background] ScrollCapture");
        // 전체화면 이미지를 구해서 url (string)으로 만든 다음 img 에다가 넣어주면된다.
        var img;

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
                    Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, i, 0)
                    );
            } else {
                global.tabs.create({
                    url: o
                }, Function.prototype.bind.call(Bnoty.updateScreenshot, Bnoty, img, i, 0));
            }
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