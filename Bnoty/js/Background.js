

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log('[background] chrome.runtime.onMessage.addListener()');
        console.log("[background] request:" + request.method);
        if (request.method === 'test') {
            // 이곳에다 test 메소드 내용을 작성 
            
            // 응답
            sendResponse({ farewell: 'contentgoodbye' });
        } else if ( request.method === 'ShowCapture' ){
            
        } else if ( request.method === 'CropCapture' ){
            
        } else if ( request.method === 'FullCapture' ){
            
        } else if ( request.method === 'ScrollCapture' ){
            
        }

  });