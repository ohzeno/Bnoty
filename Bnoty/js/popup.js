var btn1 = document.getElementById("test");
var btn2 = document.getElementById("test2");

btn1.addEventListener('click', startAutoSave );
btn2.addEventListener('click', startAutoRead );

function startAutoSave() {
    chrome.runtime.sendMessage( { method : '10SecSave'}, (response) => {
        // console.log("[popup.js] chrome.runtime.sendMessage()");
        console.log(response.farewell);
    });

};

function startAutoRead() {
    chrome.runtime.sendMessage( { method : 'startRead'}, (response) => {
        // console.log("[popup.js] chrome.runtime.sendMessage()");
        console.log(response.farewell);
    });

};

