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

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    currentTab = tab; // used in later calls to get tab info
    var filename = getFilename(tab.url);
    CaptureAPI.captureToFiles(tab, filename, displayCaptures,
                              errorHandler, progress, splitnotifier);
  });


  // chrome.runtime.sendMessage( { method : 'FullCapture'}, (response) => {
  //   console.log("[popup.js] 전체페이지 캡처");
  //   console.log(response.farewell);
  // });

};

function ScrollCapture() {
  chrome.runtime.sendMessage( { method : 'ScrollCapture'}, (response) => {
    console.log("[popup.js] 스크롤캡처");
    console.log(response.farewell);
  });
};


// 후
var currentTab, // result of chrome.tabs.query of current active tab
    resultWindowId; // window id for putting resulting images


//
// Utility methods
//

function $(id) { return document.getElementById(id); }
function show(id) { $(id).style.display = 'block'; }
function hide(id) { $(id).style.display = 'none'; }


function getFilename(contentURL) {
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
    var last = index === filenames.length - 1;

    if (currentTab.incognito && index === 0) {
        // cannot access file system in incognito, so open in non-incognito
        // window and add any additional tabs to that window.
        //
        // we have to be careful with focused too, because that will close
        // the popup.
        chrome.windows.create({
            url: filename,
            incognito: false,
            focused: last
        }, function(win) {
            resultWindowId = win.id;
        });
    } else {
        chrome.tabs.create({
            url: filename,
            active: last,
            windowId: resultWindowId,
            openerTabId: currentTab.id,
            index: (currentTab.incognito ? 0 : currentTab.index) + 1 + index
        });
    }

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

