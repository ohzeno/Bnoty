// 초기화
var btn1 = document.getElementById("btn");
var screenshot_show = document.getElementById("screenshot_show");
var screenshot_full = document.getElementById("screenshot_full");

// 연결
btn1.addEventListener('click', test );
screenshot_show.addEventListener('click', ShowCapture );
screenshot_full.addEventListener('click', FullCapture );


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

function FullCapture() {
  console.log("[popup.js] 1. 전체페이지 캡처");

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0]; 
    currentTab = tab; // 탭 정보를 얻기 위해 나중에 호출할 때 사용됨
    var filename = getFilename(tab.url);
    console.log("filename : " + filename);
    CaptureAPI.captureToFiles(tab, filename, displayCaptures,
                              errorHandler, progress, splitnotifier);
  });

};

// 설정 메소드
var currentTab; // 현재 활성 탭의 chrome.tabs.query 결과
var  resultWindowId; // 결과 이미지를 넣을 창 ID
// 유틸 
function $(id) { return document.getElementById(id); }
function show(id) { $(id).style.display = 'block'; }
function hide(id) { $(id).style.display = 'none'; }

// 현재 uRL 받아서 그냥 파일명만 바꿔주는 함수
function getFilename(contentURL) {
  console.log("[popup.js] 2. getFilename (현재URL) ");
  console.log(contentURL);
  var name = contentURL.split('?')[0].split('#')[0];
  if (name) {
    name = name
            .replace(/^https?:\/\//, '')
            .replace(/[^A-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^[_\-]+/, '')
            .replace(/[_\-]+$/, '');
        name = '-' + name;
    } else {
        name = '';
    }
    return 'screencapture' + name + '-' + Date.now() + '.png';
}

// Capture Handlers
function displayCaptures(filenames) {
    if (!filenames || !filenames.length) {
        show('uh-oh');
        return;
    }
    _displayCapture(filenames);
}


function _displayCapture(filenames, index) {
  console.log("popup.js : _displayCapture ");
  // console.log("완성된URL 이미지가아님 : " + filename);
  index = index || 0;
  var last = index === filenames.length - 1;
  if (!last) {
      _displayCapture(filenames, index + 1);
  }
}


function errorHandler(reason) {
    show('uh-oh'); // TODO - extra uh-oh info?
}


// 로딩바
function progress(complete) {
    if (complete === 0) {
        // Page capture has just been initiated.
        show('loading');
    }
    else {
        $('bar').style.width = parseInt(complete * 100, 10) + '%';
    }
}

// 이미지 분해
function splitnotifier() {
    show('split-image');
}

