
window.CaptureAPI = (function() {

    var MAX_PRIMARY_DIMENSION = 15000 * 2,
        MAX_SECONDARY_DIMENSION = 4000 * 2,
        MAX_AREA = MAX_PRIMARY_DIMENSION * MAX_SECONDARY_DIMENSION;


    //
    // URL Matching test - to verify we can talk to this URL
    //

    var matches = ['http://*/*', 'https://*/*', 'ftp://*/*', 'file://*/*'],
        noMatches = [/^https?:\/\/chrome.google.com\/.*$/];

    function isValidUrl(url) {
        // executeScript가 작동하지 않는지 알 수 있는 더 
        // 좋은 방법을 찾을 수 없으므로 알려진 URL에 대해 테스트하기만 하면 됩니다.
        // 일단....
        var r, i;
        for (i = noMatches.length - 1; i >= 0; i--) {
            if (noMatches[i].test(url)) {
                return false;
            }
        }
        for (i = matches.length - 1; i >= 0; i--) {
            r = new RegExp('^' + matches[i].replace(/\*/g, '.*') + '$');
            if (r.test(url)) {
                return true;
            }
        }
        return false;
    }


    function initiateCapture(tab, callback) {
        chrome.tabs.sendMessage(tab.id, {msg: 'scrollPage'}, function() {
            console.log("initiateCapture function ------>");
            // 창의 모든 부분에 대한 스냅샷 촬영을 마쳤습니다. 
            // 결과 전체 스크린샷 이미지를 새 브라우저 탭에 표시합니다.
            callback();
        });
    }


    function capture(data, screenshots, sendResponse, splitnotifier) {
        console.log("capture 함수 ( api.js )" );
        // 캠처하는곳
        chrome.tabs.captureVisibleTab(
            null, {format: 'png'}, function(dataURI) {
                if (dataURI) {
                    var image = new Image();
                    image.onload = function() {
                        data.image = {width: image.width, height: image.height};
                        console.log(data.image);
                        

                        // given device mode emulation or zooming, we may end up with
                        // a different sized image than expected, so let's adjust to
                        // match it!
                        // 126 / 5,000
                        // 주어진 장치 모드 에뮬레이션 또는 확대/축소로 인해 예상과 다른 크기의 이미지가 나타날 수 있으므로 그에 맞게 조정합시다!
                        if (data.windowWidth !== image.width) {
                            var scale = image.width / data.windowWidth;
                            data.x *= scale;
                            data.y *= scale;
                            data.totalWidth *= scale;
                            data.totalHeight *= scale;
                        }

                        // lazy initialization of screenshot canvases (since we need to wait
                        // for actual image size)
                        // 스크린샷 캔버스의 지연 초기화(실제 이미지 크기를 기다려야 하기 때문에)
                        if (!screenshots.length) {
                            Array.prototype.push.apply(
                                screenshots,
                                _initScreenshots(data.totalWidth, data.totalHeight)
                            );
                            if (screenshots.length > 1) {
                                if (splitnotifier) {
                                    // 분할알림
                                    splitnotifier();
                                }
                                $('screenshot-count').innerText = screenshots.length;
                            }
                        }

                        // draw it on matching screenshot canvases
                        // 일치하는 스크린샷 캔버스에 그리기
                        _filterScreenshots(
                            data.x, data.y, image.width, image.height, screenshots
                        ).forEach(function(screenshot) {
                            screenshot.ctx.drawImage(
                                image,
                                data.x - screenshot.left,
                                data.y - screenshot.top
                            );
                            console.log("  IMAGE ~~~ ");
                            console.log(image);
                        });

                        // send back log data for debugging (but keep it truthy to
                        // indicate success)
                        sendResponse(JSON.stringify(data, null, 4) || true);
                    };
                    image.src = dataURI;
                }
            });
    }


    function _initScreenshots(totalWidth, totalHeight) {
        // Create and return an array of screenshot objects based
        // on the `totalWidth` and `totalHeight` of the final image.
        // We have to account for multiple canvases if too large,
        // because Chrome won't generate an image otherwise.
        // 최종 이미지의 'totalWidth' 및 'totalHeight'를 기반으로 
        // 스크린샷 개체의 배열을 만들고 반환합니다. 
        // Chrome이 그렇지 않으면 이미지를 생성하지 않기 때문에 
        // 너무 큰 경우 여러 캔버스를 고려해야 합니다.
        // 
        var badSize = (totalHeight > MAX_PRIMARY_DIMENSION ||
                       totalWidth > MAX_PRIMARY_DIMENSION ||
                       totalHeight * totalWidth > MAX_AREA),
            biggerWidth = totalWidth > totalHeight,
            maxWidth = (!badSize ? totalWidth :
                        (biggerWidth ? MAX_PRIMARY_DIMENSION : MAX_SECONDARY_DIMENSION)),
            maxHeight = (!badSize ? totalHeight :
                         (biggerWidth ? MAX_SECONDARY_DIMENSION : MAX_PRIMARY_DIMENSION)),
            numCols = Math.ceil(totalWidth / maxWidth),
            numRows = Math.ceil(totalHeight / maxHeight),
            row, col, canvas, left, top;

        var canvasIndex = 0;
        var result = [];

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                canvas = document.createElement('canvas');
                canvas.width = (col == numCols - 1 ? totalWidth % maxWidth || maxWidth :
                                maxWidth);
                canvas.height = (row == numRows - 1 ? totalHeight % maxHeight || maxHeight :
                                 maxHeight);

                left = col * maxWidth;
                top = row * maxHeight;

                result.push({
                    canvas: canvas,
                    ctx: canvas.getContext('2d'),
                    index: canvasIndex,
                    left: left,
                    right: left + canvas.width,
                    top: top,
                    bottom: top + canvas.height
                });

                canvasIndex++;
            }
        }

        return result;
    }


    function _filterScreenshots(imgLeft, imgTop, imgWidth, imgHeight, screenshots) {
        console.log(" fun -- _filterScreenshots : api.js // 164 line")

        // Filter down the screenshots to ones that match the location
        // of the given image.
        // 주어진 이미지의 위치와 일치하는 것으로 스크린샷을 필터링합니다.

        var imgRight = imgLeft + imgWidth,
            imgBottom = imgTop + imgHeight;
        return screenshots.filter(function(screenshot) {
            return (imgLeft < screenshot.right &&
                    imgRight > screenshot.left &&
                    imgTop < screenshot.bottom &&
                    imgBottom > screenshot.top);
        });
    }


    function getBlobs(screenshots) {
        return screenshots.map(function(screenshot) {
            var dataURI = screenshot.canvas.toDataURL();

            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // create a blob for writing to a file
            var blob = new Blob([ab], {type: mimeString});
            return blob;
        });
    }


    function saveBlob(blob, filename, index, callback, errback) {
        filename = _addFilenameSuffix(filename, index);

        function onwriteend() {
            // open the file that now contains the blob - calling
            // `openPage` again if we had to split up the image
            var urlName = ('filesystem:chrome-extension://' +
                           chrome.i18n.getMessage('@@extension_id') +
                           '/temporary/' + filename);

            callback(urlName);
        }

        // come up with file-system size with a little buffer
        var size = blob.size + (1024 / 2);

        // create a blob for writing to a file
        var reqFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        reqFileSystem(window.TEMPORARY, size, function(fs){
            fs.root.getFile(filename, {create: true}, function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = onwriteend;
                    fileWriter.write(blob);
                }, errback); // TODO - standardize error callbacks?
            }, errback);
        }, errback);
    }


    function _addFilenameSuffix(filename, index) {
        if (!index) {
            return filename;
        }
        var sp = filename.split('.');
        var ext = sp.pop();
        return sp.join('.') + '-' + (index + 1) + '.' + ext;
    }


    function captureToBlobs(tab, callback, errback, progress, splitnotifier) {
        console.log("captureToBlobs");

        var loaded = false,
            screenshots = [],
            timeout = 3000,
            timedOut = false,
            noop = function() {};

        callback = callback || noop;
        errback = errback || noop;
        progress = progress || noop;

        if (!isValidUrl(tab.url)) {
            errback('invalid url'); // TODO errors
        }

        // TODO will this stack up if run multiple times? (I think it will get cleared?)
        // 여러 번 실행하면 스택이 쌓이나요? (해결될 것 같은데요?)
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (request.msg === 'capture') {
                console.log(" onMessage / capture ");
                progress(request.complete);
                capture(request, screenshots, sendResponse, splitnotifier);

                // https://developer.chrome.com/extensions/messaging#simple
                //
                // If you want to asynchronously use sendResponse, add return true;
                // to the onMessage event handler.
                // 비동기적으로 sendResponse를 사용하려면 return true를 추가하십시오.
                // onMessage 이벤트 핸들러에
                return true;
            } else {
                console.error('Unknown message received from content script: ' + request.msg);
                errback('internal error');
                return false;
            }
        });

        chrome.tabs.executeScript(tab.id, {file: 'js/Page.js'}, function() {
            if (timedOut) {
                console.error('Timed out too early while waiting for ' +
                              'chrome.tabs.executeScript. Try increasing the timeout.');
            } else {
                loaded = true;
                progress(0);

                initiateCapture(tab, function() {
                    callback(getBlobs(screenshots));
                });
            }
        });

        window.setTimeout(function() {
            if (!loaded) {
                timedOut = true;
                errback('execute timeout');
            }
        }, timeout);
    }


    function captureToFiles(tab, filename, callback, errback, progress, splitnotifier) {
        captureToBlobs(tab, function(blobs) {
            var i = 0,
                len = blobs.length,
                filenames = [];

            (function doNext() {
                saveBlob(blobs[i], filename, i, function(filename) {
                    i++;
                    filenames.push(filename);
                    i >= len ? callback(filenames) : doNext();
                }, errback);
            })();
        }, errback, progress, splitnotifier);
    }


    return {
        captureToBlobs: captureToBlobs,
        captureToFiles: captureToFiles
    };

})();
