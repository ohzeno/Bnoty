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
  console.log("[popup.js] 1. 전체페이지 캡처");

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0]; 
    currentTab = tab; // 탭 정보를 얻기 위해 나중에 호출할 때 사용됨
    var filename = getFilename(tab.url);
    // function captureToFiles(tab, filename, callback,
    //                        errback, progress, splitnotifier) {
    console.log("filename : " + filename);
    CaptureAPI.captureToFiles(tab, filename, displayCaptures,
                              errorHandler, progress, splitnotifier);
  });


  // chrome.runtime.sendMessage( { method : 'FullCapture'}, (response) => {  
  //   console.log(response.farewell);
  // });

};

function ScrollCapture() {
  chrome.runtime.sendMessage( { method : 'ScrollCapture'}, (response) => {
    console.log("[popup.js] 스크롤캡처");
    console.log(response.farewell);
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


//
// Capture Handlers
//


function displayCaptures(filenames) {
    if (!filenames || !filenames.length) {
        show('uh-oh');
        return;
    }

    _displayCapture(filenames);
}


function _displayCapture(filenames, index) {
    // 
    index = index || 0;

    var filename = filenames[index];
    
    // console.log("완성된URL 이미지가아님근데 : " + filename);
    // chrome.runtime.sendMessage( { method : 'test5', dataUUU : filename }, (response) => {
    //   console.log("[popup.js] 스파시바 ");
    //   console.log(response.farewell);
    // });

    var last = index === filenames.length - 1;

    // 여기서 url은 파일네임이고 
    // if (currentTab.incognito && index === 0) {
    //     // 시크릿 모드에서는 파일 시스템에 액세스할 수 없으므로 
    //     // 시크릿 모드가 아닌 창에서 열고 해당 창에 추가 탭을 추가하세요.
    //     // 팝업이 닫히기 때문에 포커스도 주의해야 합니다.
    //     //
    //     chrome.windows.create({
    //         url: filename,
    //         incognito: false,
    //         focused: last
    //     }, function(win) {
    //         resultWindowId = win.id;
    //     });
    // } else {
    //     chrome.tabs.create({
    //         url: filename,
    //         active: last,
    //         windowId: resultWindowId,
    //         openerTabId: currentTab.id,
    //         index: (currentTab.incognito ? 0 : currentTab.index) + 1 + index
    //     });
    // }

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

