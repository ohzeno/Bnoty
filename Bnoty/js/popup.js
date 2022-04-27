// 초기화
var btn1 = document.getElementById("test");
// 연결
btn1.addEventListener('click', startAutoSave );

function startAutoSave() {
    let url;
    console.log(window.location.toString());
    console.log("pop");
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        url = tabs[0].url;
        console.log(url);
    })
    chrome.runtime.sendMessage( { method : '10SecSave', url : url}, (response) => {
        console.log("[popup.js] chrome.runtime.sendMessage()");
        console.log(response.farewell);
    });

};
