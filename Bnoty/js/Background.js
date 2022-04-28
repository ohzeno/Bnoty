
// 설정
var global = "undefined" != typeof chrome ? chrome : "undefined" != typeof browser ? browser : void 0; 

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log('[background] chrome.runtime.onMessage.addListener()');
        console.log("[background] request:" + request.method);
        if (request.method === 'test') {
            // 이곳에다 test 메소드 내용을 작성 
            test();
            // 응답
            sendResponse({ farewell: 'test funcion is called' });
        } else if ( request.method === 'ShowCapture' ){
            ShowCapture(sendResponse);
            sendResponse({ farewell: 'ShowCapture funcion is called' });
        } else if ( request.method === 'CropCapture' ){
            CropCapture();
            sendResponse({ farewell: 'CropCapture funcion is called' });
        } else if ( request.method === 'FullCapture' ){
            FullCapture();
            sendResponse({ farewell: 'FullCapture funcion is called' });
        } else if ( request.method === 'ScrollCapture' ){
            ScrollCapture();
            
        }
});

function test() {
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

};

function ShowCapture(i){
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

    

    setTimeout(function() {
        global.tabs.create( { url: "capture.html" } );
    }, 1000);

    // global.tabs.captureVisibleTab(function(a) {
    //     var o = global.extension.getURL("capture.html");
    //     global.tabs.create( 
    //         { url: o },
    //         ( function (x) { chrome.runtime.sendMessage( { method : 'setImage'} ); })
    //         );
    // });


    // var o = global.extension.getURL("screen.html");
    // global.tabs.create( {url:"screen.html"} );
}



function CropCapture() {
    console.log("[Background] CropCapture");

    function onCreated(tab) {
        console.log(`Created new tab: ${tab.id}`)
    }
    
    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var creating = global.tabs.create({
        url:"capture.html"
    });
    creating.then(onCreated, onError);
};
  
function FullCapture() {
    console.log("[Background] FullCapture");

    chrome.storage.sync.set({ "abc" : "123"});

    global.tabs.captureVisibleTab(function(a) {
        // 추출한 이미지를 이걸로
        console.log(a);
        chrome.storage.sync.set({ "captureimg" : a}, function() {
            console.log('Value is set to ' + a);
        });

        chrome.storage.local.set({ "captureimg": a}, function() {
            // console.log('Value is set to ' + a);
            });

    });

    global.tabs.create( { url: "capture.html" } );

};
  
function ScrollCapture() {
    console.log("[Background] ScrollCapture");
    // let url = chrome.runtime.getURL("capture.html");
    global.tabs.create({ url : "capture.html" });

};

function updateScreenshot(t, n) {
    var a = arguments[2];
    null == a && (a = 0), 10 < a || global.runtime.sendMessage({
        method: "update_url",
        url: t
    }, function(e) {
        e && e.success || window.setTimeout(Function.prototype.bind.call(updateScreenshot, t, n, ++a), 300);
    });
}
  