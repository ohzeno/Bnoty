// 초기화
var btn1 = document.getElementById("btn");
var screenshot_show = document.getElementById("screenshot_show");
var screenshot_crop = document.getElementById("screenshot_crop");
var screenshot_full = document.getElementById("screenshot_full");
var screenshot_scroll = document.getElementById("screenshot_scroll");

// 연결
btn1.addEventListener('click', test );
screenshot_show.addEventListener('click', ShowCapture );
screenshot_crop.addEventListener('click', CropCapture );
screenshot_full.addEventListener('click', FullCapture );
screenshot_scroll.addEventListener('click', ScrollCapture );


// 함수
function test() {
  chrome.runtime.sendMessage( { method : 'test'}, (response) => {
    console.log("[popup.js] chrome.runtime.sendMessage()");
    console.log(response.farewell);
  });
};

function ShowCapture() {
  chrome.runtime.sendMessage( { method : 'ShowCapture'}, (response) => {
    console.log("[popup.js] 현재화면캡처");
    console.log(response.farewell);
  });
};

function CropCapture() {
  chrome.runtime.sendMessage( { method : 'CropCapture'}, (response) => {
    console.log("[popup.js] 부분캡처");
    console.log(response.farewell);
  });
};

function FullCapture() {
  chrome.runtime.sendMessage( { method : 'FullCapture'}, (response) => {
    console.log("[popup.js] 전체페이지 캡처");
    console.log(response.farewell);
  });
};

function ScrollCapture() {
  chrome.runtime.sendMessage( { method : 'ScrollCapture'}, (response) => {
    console.log("[popup.js] 스크롤캡처");
    console.log(response.farewell);
  });
};
