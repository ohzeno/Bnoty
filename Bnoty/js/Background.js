
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
            ShowCapture();
            sendResponse({ farewell: 'contentgoodbye' });
        } else if ( request.method === 'CropCapture' ){
            
        } else if ( request.method === 'FullCapture' ){
            
        } else if ( request.method === 'ScrollCapture' ){
            
        }
});

function test() {
    console.log("투마로");
};

function ShowCapture(){
    console.log("[Background] ShowCapture")
    // 함수로 저장
    global.tabs.captureVisibleTab(function(a) {
        // 추출한 이미지를 이걸로
        console.log(a);
     });
    // var o = global.extension.getURL("screen.html");

}