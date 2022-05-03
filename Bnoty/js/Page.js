
// var CAPTURE_DELAY = 150;

function onMessage(data, sender, callback) {
    if (data.msg === 'scrollPage') {
        getPositions(callback);
        return true;
    } else if (data.msg == 'logMessage') {
        console.log('[POPUP LOG]', data.data);
    } else {
        console.error('Unknown message received from background: ' + data.msg);
    }
}

if (!window.hasScreenCapturePage) {
    window.hasScreenCapturePage = true;
    chrome.runtime.onMessage.addListener(onMessage);
}

function max(nums) {
    return Math.max.apply(Math, nums.filter(function(x) { return x; }));
}

function getPositions(callback) {
    console.log("[page.js] getPositions ");
    
    // MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND

    var body = document.body,
        originalBodyOverflowYStyle = body ? body.style.overflowY : '',
        originalX = window.scrollX,
        originalY = window.scrollY,
        originalOverflowStyle = document.documentElement.style.overflow;

    // try to make pages with bad scrolling work, e.g., ones with
    // `body { overflow-y: scroll; }` can break `window.scrollTo`
    // 스크롤이 잘 안 되는 페이지를 만드십시오.
    // 예를 들어  `body { overflow-y: 스크롤; }`는 `window.scrollTo`를 깨뜨릴 수 있습니다.
    if (body) {
        body.style.overflowY = 'visible';
    }

    var widths = [
            document.documentElement.clientWidth,
            body ? body.scrollWidth : 0,
            document.documentElement.scrollWidth,
            body ? body.offsetWidth : 0,
            document.documentElement.offsetWidth
        ],
        heights = [
            document.documentElement.clientHeight,
            body ? body.scrollHeight : 0,
            document.documentElement.scrollHeight,
            body ? body.offsetHeight : 0,
            document.documentElement.offsetHeight,

            (Array.prototype.slice.call(document.getElementsByTagName('*'), 0)
             .reduce(function(val, elt) {
                 var h = elt.offsetHeight; return h > val ? h : val;
             }, 0))

        ],

        // 전체 창
        fullWidth = max(widths),
        fullHeight = max(heights),
        // 현재 창
        windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        arrangements = [],
        // pad the vertical scrolling to try to deal with
        // sticky headers, 250 is an arbitrary size
        // 고정 헤더를 처리하기 위해 세로 스크롤을 채우십시오. 250은 임의의 크기입니다.
        scrollPad = 200, // 이게 지금 200은 상수인데 헤더 길이를ㅈ ㅝ야할듯
        yDelta = windowHeight - (windowHeight > scrollPad ? scrollPad : 0),
        xDelta = windowWidth,
        yPos = fullHeight - windowHeight,
        xPos,
        numArrangements;

    // During zooming, there can be weird off-by-1 types of things...
    // 확대/축소하는 동안 이상한 off-by-1 유형이 있을 수 있습니다.
    if (fullWidth <= xDelta + 1) {
        fullWidth = xDelta;
    }

    // Disable all scrollbars. We'll restore the scrollbar state when we're done
    // taking the screenshots.
    // 모든 스크롤바를 비활성화합니다. 스크린샷 촬영이 끝나면 스크롤바 상태를 복원합니다.
    document.documentElement.style.overflow = 'hidden';

    while (yPos > -yDelta) {
        xPos = 0;
        while (xPos < fullWidth) {
            arrangements.push([xPos, yPos]);
            xPos += xDelta;
        }
        yPos -= yDelta;
    }

    /** */
    console.log("--------full capture start--------");
    console.log('fullHeight', fullHeight, 'fullWidth', fullWidth);
    console.log('windowHeight', windowHeight, 'windowWidth', windowWidth );
    console.log('xDelta', xDelta, 'yDelta', yDelta);
    var arText = [];
    arrangements.forEach(function(x) { arText.push('['+x.join(',')+']'); });
    console.log('arrangements', arText.join(', '));
    /**/

    numArrangements = arrangements.length;

    function cleanUp() {
        document.documentElement.style.overflow = originalOverflowStyle;
        if (body) {
            body.style.overflowY = originalBodyOverflowYStyle;
        }
        window.scrollTo(originalX, originalY);
    }

    (function processArrangements() {
        console.log("fun :::  processArrangements ")
        if (!arrangements.length) {
            cleanUp();
            if (callback) {
                callback();
            }
            return;
        }

        var next = arrangements.shift(),
            x = next[0], y = next[1];

        window.scrollTo(x, y);

        var data = {
            msg: 'capture',
            x: window.scrollX,
            y: window.scrollY,
            complete: (numArrangements-arrangements.length)/numArrangements,
            windowWidth: windowWidth,
            totalWidth: fullWidth,
            totalHeight: fullHeight,
            devicePixelRatio: window.devicePixelRatio
        };

        console.log('>> DATA', JSON.stringify(data, null, 4));

        // WAIT();

        // 상황이 안정될 때까지 기다려야 함
        window.setTimeout(function() {
            // 아래 콜백이 반환되지 않는 경우 정리
            var cleanUpTimeout = window.setTimeout(cleanUp, 1250);

            chrome.runtime.sendMessage(data, function(captured) {
                console.log("capterd show----")
                console.log(captured);
                window.clearTimeout(cleanUpTimeout);

                if (captured) {
                    // 다음 배열을 캡처하기 위해 이동.
                    processArrangements();
                } else {
                    // popup.js에 오류가 있으면 응답 값이 정의되지 않을 수 있으므로 정리
                    cleanUp();
                }
            });

        }, 500 );

    })();
}


// function WAIT() {
//     new Promise(function(resolve, reject){
//         setTimeout(function() {
//             resolve(1);
//         }, 1000);
//     })
//     .then(function(result) {
//         console.log( " 대기 " + result); // 1
//         chrome.runtime.sendMessage(data, function(captured) {
//             console.log("capterd show----")
//             console.log(captured);
//             window.clearTimeout(cleanUpTimeout);

//             if (captured) {
//                 // 다음 배열을 캡처하기 위해 이동.
//                 processArrangements();
//             } else {
//                 // popup.js에 오류가 있으면 응답 값이 정의되지 않을 수 있으므로 정리
//                 cleanUp();
//             }
//         });


//         return result + 10;
//     })
// }