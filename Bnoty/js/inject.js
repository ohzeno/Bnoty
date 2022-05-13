var getCSSAnimationManager = function () {
    for (
        var t,
            e,
            i,
            n = !1,
            s = ["webkit", "Moz", "O", ""],
            o = s.length,
            a = document.documentElement.style;
        o--;

    )
        if (s[o]) {
            if (void 0 !== a[s[o] + "AnimationName"]) {
                switch (((t = s[o]), o)) {
                    case 0:
                        (e = t.toLowerCase() + "AnimationStart"),
                            (i = t.toLowerCase() + "AnimationEnd"),
                            (n = !0);
                        break;

                    case 1:
                        (e = "animationstart"), (i = "animationend"), (n = !0);
                        break;

                    case 2:
                        (e = t.toLowerCase() + "animationstart"),
                            (i = t.toLowerCase() + "animationend"),
                            (n = !0);
                }
                break;
            }
        } else if (void 0 !== a.animationName) {
            (t = s[o]), (e = "animationstart"), (i = "animationend"), (n = !0);
            break;
        }
    return {
        supported: n,
        prefix: t,
        start: e,
        end: i,
    };
};

!(function (window_t, func_e) {
    if ("undefined" != typeof unsafeWindow && null !== unsafeWindow) {
        if (unsafeWindow.CTRL_HIDDEN) {
            window_t.bnoty.showControlPanel();
        } else {
            if (!unsafeWindow.bnoty_INIT) {
                window_t.bnoty = func_e(window_t);
                window_t.bnoty.init(); //e.init()
            }
        }
    } else {
        if (!(void 0 !== window_t.bnoty && null !== window_t.bnoty)) {
            window_t.bnoty = func_e(window_t);
        }
        if (window_t.bnoty.controlPanelHidden) {
            window_t.bnoty.showControlPanel();
        } else {
            if (!window_t.bnoty.initialized) {
                window_t.bnoty.init();
            }
        }
    }
})("undefined" != typeof window ? window : this, function (window_e) {
    var global;
    if ("undefined" != typeof chrome) {
        global = chrome;
    } else {
        if ("undefined" != typeof browser) {
            global = browser;
        } else {
            void 0;
        }
    }
    e_group = {
        canvas: null,
        ctx: null,
        initialized: !1,
        controlPanelHidden: !1,
        INITIAL_COLOR: "red",
        painting: false,
        config: {},
        drawOptions: [
            {
                type: "pen",
                title: "Pencil - Draw a custom line",
            },
            {
                type: "lasso",
                title: "Area lasso - Lasso an area",
            },
            {
                type: "text",
                font: "Arial",
                minSize: 15,
                maxSize: 50,
                title: "Text - Insert text",
            },
            {
                type: "figure",
                title: "Figure - Draw a figure",
            },
            {
                type: "image",
                title: "Image - Insert Image",
            },
            {
                type: "cursor",
                title: "Cursor - Interact with the web page",
            },
            {
                type: "eraser",
                title: "Eraser - Erase part of your drawings",
                width: 30,
                height: 30,
            },
            {
                type: "fill",
                title: "Paint Bucket - Fill an area",
            },
        ],
        selectedAlphaOption: null,
        resizeTimeoutID: null,
        paragraph: null,
        panel: null,
        strokeStyle: "rgb(0, 0, 0)", // color
        lineWidth: 3, // line width
        globalAlpha: 1, // transparency
        activate: "pen", // activate tool (defualt : pen)
        saveImage: null, // save my note
        saveLasso: [null, null], // lasso 
        histories: null, // note history
        MAX_ITEMS: null, // max save capacity
        currentIndex: null, // index position
        array: [], // data save array
        red: 0,
        green: 0,
        blue: 0,
        sX: null,
        sY: null,
        eX: null,
        eY: null,
        mX: null,
        mY: null,
        lassosX: null,
        lassosY: null,
        lassoeX: null,
        lassoeY: null,
        lassosubX: null,
        lassosubY: null,
        hasInput: false, // text input
        size: "20px", // text size
        font: "sans-serif", // text font
        boldtext: "", // bold
        italictext: "", 
        textactive: false, // check text input
        img: null,
        linkX: null, // for link
        linkY: null,
        linknumber: 0, // link num
        linkarr: [],
        removeToast: null,
        toastElement: null,
        autoSave: null,
        top_box: null,
        pageX: null,
        pageY: null,
        userVol: null,
        preVol: null,
        calVol: null,

        startPainting: function (event) {
            event.preventDefault();
            // click mouse
            if (event.which === 1) {
                // left mouse click
                if (this.painting) {
                    this.painting = false;
                    return;
                }
                this.painting = true;
                this.sX = event.offsetX;
                this.sY = event.offsetY;
                if (this.activate == "fill") {
                    this.handleFill(event.clientX, event.clientY);
                }
                if (this.activate == "lasso" && this.saveLasso[0] == null) {
                    // lasso check
                    this.lassosX = event.offsetX;
                    this.lassosY = event.offsetY;
                    this.lassosubX = event.offsetX;
                    this.lassosubY = event.offsetY;
                } else if (
                    this.activate == "lasso" &&
                    this.saveLasso[0] != null &&
                    (this.sX < this.lassosX ||
                        this.sX > this.lassoeX ||
                        this.sY < this.lassosY ||
                        this.sY > this.lassoeY)
                ) {
                    // cancel lasso and save canvas
                    if (
                        this.lassosX == this.lassosubX &&
                        this.lassosY == this.lassosubY
                    ) {
                        this.ctx.putImageData(
                            this.array[this.currentIndex],
                            0,
                            0
                        );
                        this.currentIndex--;
                        (this.saveLasso[0] = null),
                            (this.saveLasso[1] = null),
                            (this.lassosX = null),
                            (this.lassosY = null),
                            (this.lassoeX = null),
                            (this.lassoeY = null),
                            (this.lassosubX = null),
                            (this.lassosubY = null);
                    } else {
                        this.ctx.putImageData(
                            this.saveLasso[0],
                            this.lassosX,
                            this.lassosY
                        );
                        (this.saveLasso[0] = null),
                            (this.saveLasso[1] = null),
                            (this.lassosX = null),
                            (this.lassosY = null),
                            (this.lassoeX = null),
                            (this.lassoeY = null),
                            (this.lassosubX = null),
                            (this.lassosubY = null);
                    }
                }
                // link injection
                if (this.activate == "insert_link") {
                    this.LinkInputField(event.offsetX, event.offsetY);
                }
            }
        },
        stopPainting: function (event) {
            if (event.which === 1) {
                if (this.activate == "curve") {
                    if (this.mX == null && this.mY == null) {
                        this.mX = event.offsetX;
                        this.mY = event.offsetY;
                        return; // update end position and return for next work
                    }
                    this.mX = null;
                    this.mY = null;
                } else if (this.activate == "lasso") {
                    if (this.lassosX > this.lassoeX) {
                        var tmp = this.lassosX;
                        this.lassosX = this.lassoeX;
                        this.lassoeX = tmp;
                        this.lassosubX = this.lassosX;
                    }
                    if (this.lassosY > this.lassoeY) {
                        var tmp = this.lassosY;
                        this.lassosY = this.lassoeY;
                        this.lassoeY = tmp;
                        this.lassosubY = this.lassosY;
                    }
                    if (
                        this.saveLasso[1] == null &&
                        this.saveLasso[0] != null
                    ) {
                        this.saveLasso[1] = this.ctx.getImageData(
                            this.lassosX,
                            this.lassosY,
                            this.lassoeX - this.lassosX,
                            this.lassoeY - this.lassosY
                        );
                    } else if (this.saveLasso[1] != null) {
                        this.canvas.style.cursor = "crosshair";
                        this.lassosX = this.eX - (this.sX - this.lassosX);
                        this.lassosY = this.eY - (this.sY - this.lassosY);
                        (this.lassoeX = this.lassosX + this.saveLasso[1].width),
                            (this.lassoeY =
                                this.lassosY + this.saveLasso[1].height);
                        this.ctx.putImageData(
                            this.saveLasso[1],
                            this.lassosX,
                            this.lassosY
                        );
                    }
                }
                if (this.activate != "lasso") {
                    (this.saveLasso[0] = null),
                        (this.saveLasso[1] = null),
                        (this.lassosX = null),
                        (this.lassosY = null),
                        (this.lassoeX = null),
                        (this.lassoeY = null),
                        (this.lassosubX = null),
                        (this.lassosubY = null);
                }
                if (this.activate == "insert_image") {
                    if (e_group.img == null) return;
                }
                this.painting = false;
                if (
                    this.activate != "text" &&
                    this.activate != "insert_link" &&
                    this.activate != "nothing" &&
                    this.saveLasso[0] == null
                ) {
                    if (
                        this.activate != "lasso" &&
                        this.activate != "fill" &&
                        this.sX == this.eX &&
                        this.sY == this.eY
                    )
                        return;
                    this.saveImage = this.ctx.getImageData(
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height
                    ); 
                    // save note
                    this.addHistory();
                }
            }
        },
        leaveStopPainting: function () {
            // when cursor leaved
            if (this.painting) {
                if (this.activate == "lasso") {
                    if (this.lassosX > this.lassoeX) {
                        var tmp = this.lassosX;
                        this.lassosX = this.lassoeX;
                        this.lassoeX = tmp;
                        this.lassosubX = this.lassosX;
                    }
                    if (this.lassosY > this.lassoeY) {
                        var tmp = this.lassosY;
                        this.lassosY = this.lassoeY;
                        this.lassoeY = tmp;
                        this.lassosubY = this.lassosY;
                    }
                    if (
                        this.saveLasso[1] != null ||
                        this.saveLasso[0] != null
                    ) {
                        this.canvas.style.cursor = "crosshair";
                        this.ctx.putImageData(
                            this.array[this.currentIndex],
                            0,
                            0
                        );
                        this.currentIndex--;
                        (this.saveLasso[0] = null),
                            (this.saveLasso[1] = null),
                            (this.lassosX = null),
                            (this.lassosY = null),
                            (this.lassoeX = null),
                            (this.lassoeY = null),
                            (this.lassosubX = null),
                            (this.lassosubY = null);
                    }
                }
                this.painting = false;
                if (
                    this.activate != "text" &&
                    this.activate != "nothing" &&
                    this.saveLasso[0] == null
                ) {
                    this.saveImage = this.ctx.getImageData(
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height
                    ); 
                    this.addHistory();
                }
            }
            if (this.activate == "curve") {
                this.mX = null;
                this.mY = null;
            }
        },
        onMouseMove: function (event) {
            // mouse move function
            this.eX = event.offsetX;
            this.eY = event.offsetY;
            if (this.activate == "lasso") {
                if (
                    this.lassosX <= this.eX &&
                    this.lassoeX >= this.eX &&
                    this.lassosY <= this.eY &&
                    this.lassoeY >= this.eY
                ) {
                    this.canvas.style.cursor = "move";
                } else {
                    this.canvas.style.cursor = "crosshair";
                }
            }
            if (this.activate == "lasso" && this.lassosX == null) {
                return;
            }
            if (!this.painting) {
                 this.ctx.beginPath();
                this.ctx.moveTo(this.eX, this.eY);
            } else {
                if (this.activate == "eraser") {
                    this.ctx.clearRect(
                        this.eX - this.ctx.lineWidth * 1.5,
                        this.eY - this.ctx.lineWidth * 1.5,
                        this.ctx.lineWidth * 3,
                        this.ctx.lineWidth * 3
                    ); // erase selected 
                    return;
                }
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                if (this.array.length != 0) {
                    // before save canvas
                    this.ctx.putImageData(this.array[this.currentIndex], 0, 0);
                }

                if (this.activate == "pen") {
                    this.ctx.lineTo(this.eX, this.eY);
                    this.ctx.stroke();
                } else if (this.activate == "highlighter") {
                    this.ctx.globalAlpha = 0.5; 
                    if (this.ctx.lineWidth < 15) {
                        this.ctx.lineWidth = 15;
                    }
                    this.ctx.lineTo(this.eX, this.eY);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = this.globalAlpha; 
                    this.ctx.lineWidth = this.lineWidth; 
                } else if (this.activate == "rectangle") {
                    this.ctx.strokeRect(
                        this.sX,
                        this.sY,
                        this.eX - this.sX,
                        this.eY - this.sY
                    );
                } else if (this.activate == "triangle") {
                    this.ctx.beginPath();
                    this.ctx.moveTo((this.sX + this.eX) / 2, this.sY); 
                    this.ctx.lineTo(this.sX, this.eY);
                    this.ctx.moveTo((this.sX + this.eX) / 2, this.sY);
                    this.ctx.lineTo(this.eX, this.eY);
                    this.ctx.moveTo(this.sX, this.eY);
                    this.ctx.lineTo(this.eX, this.eY);
                    this.ctx.lineCap = "round"; 
                    this.ctx.stroke();
                    this.ctx.lineCap = "butt";  
                } else if (this.activate == "circle") {
                    var s = ((this.eX - this.sX) / 2) * 0.5522848,
                        o = ((this.eY - this.sY) / 2) * 0.5522848,
                        a = this.sX + this.eX - this.sX,
                        r = this.sY + this.eY - this.sY,
                        h = this.sX + (this.eX - this.sX) / 2,
                        c = this.sY + (this.eY - this.sY) / 2;
                    this.ctx.beginPath(); // initialization
                    this.ctx.moveTo(this.sX, c); 
                    this.ctx.bezierCurveTo(
                        this.sX,
                        c - o,
                        h - s,
                        this.sY,
                        h,
                        this.sY
                    ); 
                    this.ctx.bezierCurveTo(h + s, this.sY, a, c - o, a, c);
                    this.ctx.bezierCurveTo(a, c + o, h + s, r, h, r);
                    this.ctx.bezierCurveTo(
                        h - s,
                        r,
                        this.sX,
                        c + o,
                        this.sX,
                        c
                    );
                    this.ctx.stroke(); // show screen
                } else if (this.activate == "line") {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.sX, this.sY);
                    this.ctx.lineTo(this.eX, this.eY);
                    this.ctx.stroke();
                } else if (this.activate == "curve") {
                    this.ctx.beginPath();
                    if (this.mX == null && this.mY == null) {
                        this.ctx.moveTo(this.sX, this.sY);
                        this.ctx.lineTo(this.eX, this.eY);
                    } else {
                        this.ctx.moveTo(this.sX, this.sY);
                        this.ctx.quadraticCurveTo(
                            event.offsetX,
                            event.offsetY,
                            this.mX,
                            this.mY
                        );
                    }
                    this.ctx.stroke();
                } else if (this.activate == "arrow") {
                    var headlen = this.ctx.lineWidth * 6;
                    var dx = this.eX - this.sX;
                    var dy = this.eY - this.sY;
                    var angle = Math.atan2(dy, dx);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.sX, this.sY);
                    this.ctx.lineTo(this.eX, this.eY);
                    this.ctx.moveTo(this.eX, this.eY);
                    this.ctx.lineTo(
                        this.eX - headlen * Math.cos(angle - Math.PI / 6),
                        this.eY - headlen * Math.sin(angle - Math.PI / 6)
                    );
                    this.ctx.moveTo(this.eX, this.eY);
                    this.ctx.lineTo(
                        this.eX - headlen * Math.cos(angle + Math.PI / 6),
                        this.eY - headlen * Math.sin(angle + Math.PI / 6)
                    );
                    this.ctx.lineCap = "round"; 
                    this.ctx.stroke();
                    this.ctx.lineCap = "butt"; 
                } else if (this.activate == "lasso") {
                    // 올가미
                    if (this.saveLasso[1] != null) {
                        this.canvas.style.cursor = "move";
                        this.ctx.clearRect(
                            this.lassosubX,
                            this.lassosubY,
                            this.saveLasso[1].width,
                            this.saveLasso[1].height
                        );
                        this.ctx.putImageData(
                            this.saveLasso[1],
                            this.eX - (this.sX - this.lassosX),
                            this.eY - (this.sY - this.lassosY)
                        );
                        return;
                    }
                    this.lassoeX = event.offsetX;
                    this.lassoeY = event.offsetY;
                    if (this.eX != this.lassosX && this.eY != this.lassosY) {
                        this.saveLasso[0] = this.ctx.getImageData(
                            this.lassosX,
                            this.lassosY,
                            this.eX - this.lassosX,
                            this.eY - this.lassosY
                        );
                    }
                    this.ctx.save();
                    this.ctx.strokeStyle = "rgb(255,85,160)"; 
                    this.ctx.globalAlpha = 1;
                    this.ctx.lineWidth = 2;
                    this.ctx.setLineDash([5]);
                    this.ctx.strokeRect(
                        this.sX,
                        this.sY,
                        this.eX - this.sX,
                        this.eY - this.sY - 0.5
                    );
                    this.ctx.setLineDash([]);
                    this.ctx.restore();
                } else if (this.activate == "insert_image") {
                    if (e_group.img != null) {
                        e_group.ctx.drawImage(
                            e_group.img,
                            this.sX,
                            this.sY,
                            this.eX - this.sX,
                            this.eY - this.sY
                        );
                    }
                }
            }
        },
        onMouseClick: function (event) {
            event.preventDefault();
            if (this.activate == "text") {
                if (this.textactive) {
                    this.handleMouseClick();
                }
                if (!this.hasInput) {
                    this.addInput(event.clientX, event.clientY);
                    e_group.pageX = event.offsetX;
                    e_group.pageY = event.offsetY;
                }
            }
        },
        addInput: function (x, y) {
            var input = document.createElement("textarea");

            input.id = "textbox";
            input.type = "text";
            input.style.position = "fixed";
            input.style.left = x + "px";
            input.style.top = y + "px";
            input.style.width = "500px";
            input.style.opacity = "0.5";
            input.style.filter.opacity = "0.5";
            input.style.fontSize = e_group.size;
            input.style.zIndex = "2147483647";

            input.onkeydown = this.handleENTER;

            document.body.appendChild(input);

            input.focus();

            this.hasInput = true;
            this.textactive = true;
        },
        handleENTER: function (event) {
            var blank_pattern = /^\s+|\s+$/g;
            var keyCode = event.keyCode;
            if (keyCode === 27) {
                var textList = this.value.split("\n");
                for (var i = 0; i < textList.length; i++) {
                    e_group.drawText(
                        textList[i],
                        parseInt(e_group.pageX, 10),
                        parseInt(e_group.pageY, 10) +
                            e_group.size.replace("px", "") * i +
                            5
                    );
                }
                document.body.removeChild(this);
                if (this.value.replace(blank_pattern, "") != "") {
                    e_group.saveImage = e_group.ctx.getImageData(
                        0,
                        0,
                        e_group.canvas.width,
                        e_group.canvas.height
                    );
                    e_group.addHistory();
                }
                e_group.hasInput = false;
                e_group.textactive = false;
            }
        },
        handleMouseClick: function () {
            var inputs = document.getElementById("textbox");
            var blank_pattern = /^\s+|\s+$/g;
            if (inputs != null) {
                if (inputs.value.replace(blank_pattern, "") != "") {
                    var textList = inputs.value.split("\n");
                    for (var i = 0; i < textList.length; i++) {
                        e_group.drawText(
                            textList[i],
                            parseInt(e_group.pageX, 10),
                            parseInt(e_group.pageY, 10) +
                                e_group.size.replace("px", "") * i +
                                5
                        );
                    }
                    e_group.saveImage = e_group.ctx.getImageData(
                        0,
                        0,
                        e_group.canvas.width,
                        e_group.canvas.height
                    );
                    e_group.addHistory();
                }
                document.body.removeChild(inputs);
                e_group.hasInput = false;
                e_group.textactive = false;
            }
        },
        drawText: function (txt, x, y) {
            this.ctx.textBaseline = "top";
            this.ctx.textAlign = "left";
            this.ctx.font =
                e_group.boldtext +
                " " +
                e_group.italictext +
                " " +
                e_group.size +
                " " +
                e_group.font;
            this.ctx.fillText(txt, x, y);
        },
        clearLasso: function () {
            if (e_group.currentIndex != 0) {
                if (
                    e_group.lassosX == e_group.lassosubX &&
                    e_group.lassosY == e_group.lassosubY
                ) {
                    e_group.ctx.putImageData(
                        e_group.array[e_group.currentIndex],
                        0,
                        0
                    );
                    (e_group.saveLasso[0] = null),
                        (e_group.saveLasso[1] = null),
                        (e_group.lassosX = null),
                        (e_group.lassosY = null),
                        (e_group.lassoeX = null),
                        (e_group.lassoeY = null),
                        (e_group.lassosubX = null),
                        (e_group.lassosubY = null);
                } else {
                    e_group.ctx.putImageData(
                        e_group.saveLasso[0],
                        e_group.lassosX,
                        e_group.lassosY
                    );
                    e_group.saveImage = e_group.ctx.getImageData(
                        0,
                        0,
                        e_group.canvas.width,
                        e_group.canvas.height
                    ); 
                    e_group.addHistory();
                    (e_group.saveLasso[0] = null),
                        (e_group.saveLasso[1] = null),
                        (e_group.lassosX = null),
                        (e_group.lassosY = null),
                        (e_group.lassoeX = null),
                        (e_group.lassoeY = null),
                        (e_group.lassosubX = null),
                        (e_group.lassosubY = null);
                }
            }
        },
        loadCanvas: function (changes, namespace) {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                var subnewValue, suboldValue;
                if (oldValue) {
                    suboldValue = oldValue.substring(0, 30);
                }
                if (newValue) {
                    subnewValue = newValue.substring(0, 30);
                }
                // console.log(
                //     `Storage key "${key}" in namespace "${namespace}" changed.`,
                //     `Old value was "${suboldValue}", new value is "${subnewValue}".`
                // );
                if (key === "key" + this.pageUrl && newValue !== undefined) {
                    // console.log("init onChanged chrome Storage FB");
                    e_group.getConfig();
                }
            }
        },
        sendRead: async function () {
            this.pageUrl = document.location.href;

            await chrome.runtime.sendMessage(
                { method: "startRead", url: this.pageUrl },
                async (response) => {
                    // console.log("sendMessage : ", response);
                }
            );

            chrome.storage.onChanged.addListener(this.loadCanvasBinded);
        },
        toast: function (string) {
            const toast = document.getElementById("toast");

            toast.classList.contains("reveal")
                ? (clearTimeout(removeToast),
                  (removeToast = setTimeout(function () {
                      document
                          .getElementById("toast")
                          .classList.remove("reveal");
                  }, 1000)))
                : (removeToast = setTimeout(function () {
                      document
                          .getElementById("toast")
                          .classList.remove("reveal");
                  }, 1000));
            toast.classList.add("reveal"), (toast.innerText = string);
        },
        getVolume: function (str) {
            const getByteLengthOfString = function (s, b, i, c) {
                for (
                    b = i = 0;
                    (c = s.charCodeAt(i++));
                    b += c >> 11 ? 3 : c >> 7 ? 2 : 1
                );
                return b;
            };

            let vol = getByteLengthOfString(str);

            return Math.ceil(vol / 1000); 
        },
        addLink: function (linkarray) {
            linkarray.forEach((element) => {
                var goto = element.link;
                var atag = window_e.document.createElement("a");
                atag.setAttribute("id", "linkobject");
                atag.setAttribute("target", "”_blank”");
                atag.setAttribute("href", goto);
                atag.setAttribute("linknumber", e_group.linknumber);
                atag.addEventListener("contextmenu", function () {
                    const deletenum = this.getAttribute("linknumber");
                    const deleteindex = e_group.linkarr.findIndex(function (e) {
                        return e.num === deletenum;
                    });
                    e_group.linkarr.splice(deleteindex, 1);
                    this.remove();
                });
                atag.style.position = "absolute";
                atag.style.width = 24 + "px";
                atag.style.height = 24 + "px";
                atag.style.left = element.x + "px";
                atag.style.top = element.y + "px";
                atag.style.zIndex = 2147483647;

                var imgtag = window_e.document.createElement("img");
                imgtag.setAttribute(
                    "src",
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAqRJREFUSEvFlU1sjFEUhp+DFklnusGKSBARNupnTVhq0x/aRtjMN9KdBaqNn0pJK7SNBYmFmG9sKuiQKbpVa0LYkDI2YlUrnSZCtUduvzvtnfHNTLto3N2999zznvO+55wrLPGSJfZPSQCluRKqGkHqgV3AehvQN+AtkIZsWhj6XSzQogCKdxjoAzaVzlK+gHQId5+E2f0DoDQvh8h14Mzi6NMB2NgpdM+470IAvIEC5+OgN0FHYPpz8LhyK3AI9CSwznHYL/gdRQEsLSnHYAiIC342LBvFiwA+cGT+XhqFRDq3n8sgEDTy0eF8CPxWAVVi9SCngD3BQ30Ny24IiWeKKRTvkQOSgeyOnPAOQKwV5IFFHge2mMgV7xrQWUSPq4J/QTkWhZUZYG1gJy1CwmQ/X6aKdx84aiO8KCR7beRz6YaDaJ2QfK54XcAVazMo+McLAcYAI55ZOwX/veK9BPaVqaZRwT+gxGtATW+YNSb42woAYlmQquB+VUS4Pam4Z0VhsoIftYJPWAYmhaQpAJeiPGfRgP8FAUwIfrXV4YcNY/asBEUzNcK9d0psFGR/GYpeCP7BBVDkiixdQqJHideBPi0NILVCYkSJXQK5XErkFuBhSJn2AueLVFCPkOxS2qrhjynTNVaDZiE527AFjRb9ALrZOkuB32IbrRbkNOje4E5egZhGGwkaLZYCabLvMrBiu3BnKg/AbJQTTTDz2Ik2Bb/iwqCtjvw8gsinfMe58dIgJIdzliHDLtYP0u64+g7cCobd6k/B+U/TLyYrM+wsLbPx9gmJvK4PAeheBl/NeDhbpnoKrqUPNpwrO65zr5R4A2i/mUllgDKg7S4trn2ZL7OtAqYNkPkyd4PaL1PMl/kGNA0VwzlBwwL5v5/+4jQIt/4LnsTlGQ5Eqh8AAAAASUVORK5CYII="
                );

                var linkiobject = {}; // link objection
                linkiobject.num = e_group.linknumber++;
                linkiobject.x = element.x;
                linkiobject.y = element.y;
                linkiobject.link = goto;

                e_group.linkarr.push(linkiobject);

                imgtag.setAttribute("alt", "IU");
                imgtag.setAttribute("width", "24");
                imgtag.setAttribute("height", "24");

                atag.appendChild(imgtag);
                document.body.appendChild(atag);
            });
        },
        getTime: function () {
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            let date = today.getDate();
            let hours = today.getHours();
            let minutes = today.getMinutes();
            let seconds = today.getSeconds();
            var format =
                year +
                ("00" + month.toString()).slice(-2) +
                ("00" + date.toString()).slice(-2) +
                ("00" + hours.toString()).slice(-2) +
                ("00" + minutes.toString()).slice(-2) +
                ("00" + seconds.toString()).slice(-2);
            return "" + format;
        },
        getConfig: async function () {
            var pageUrl = document.location.href;
            await chrome.storage.local.get(
                ["link" + pageUrl],
                function (result) {
                    e_group.addLink(result["link" + pageUrl]);
                }
            );

            await chrome.storage.local.get(
                ["userVol" + pageUrl],
                function (result) {
                    e_group.userVol = parseInt(result["userVol" + pageUrl]);
                    if (e_group.userVol != 0) {
                        e_group.calVol = Math.ceil(e_group.userVol / 100000);
                        window_e.document.getElementById(
                            "volume_percent"
                        ).innerHTML = e_group.calVol + "%";
                    } else {
                        window_e.document.getElementById(
                            "volume_percent"
                        ).innerHTML = "LOCAL STORAGE";
                    }
                }
            );

            await chrome.storage.local.get(
                ["preVol" + pageUrl],
                function (result) {
                    e_group.preVol = result["preVol" + pageUrl];
                }
            );

            await chrome.storage.local.get(
                ["key" + pageUrl],
                async function (result) {
                    var t = result["key" + pageUrl];
                    if (t) {
                        var subt = t.substring(0, 30);
                    }
                    if (t) {
                        var e = new Image();
                        (e.onload = Function.prototype.bind.call(
                            e_group.initCanvas,
                            e_group,
                            e
                        )),
                            (e.src = t);
                        await e_group.saveConfig();
                    } else {
                        await e_group.initCanvas();
                    }
                }
            );
        },
        saveConfig: async function () {
            e_group.saveImage = await e_group.ctx.getImageData(
                0,
                0,
                e_group.canvas.width,
                e_group.canvas.height
            ); 
            await chrome.storage.local.clear();
        },
        get_time: async function () {
            let today = new Date();
            let minutes = today.getMinutes();
            let seconds = today.getSeconds();
            let milseconds = today.getMilliseconds();
            // console.log(minutes + " : " + seconds + " : " + milseconds);
        },
        autoRead: async function () {
            await e_group.sendRead();
        },
        createCanvas: function () {
            this.canvas = window_e.document.createElement("Canvas");
            this.ctx = this.canvas.getContext("2d");
            this.canvas.setAttribute("id", "bnoty");
            this.canvas.style.cursor = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAFxGAABcRgEUlENBAAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAC9UlEQVRo3tXXXUhTYRjA8f+7nSkaYeYsi6BBN3UTTCqwLDQQCokguir6EpKuvKibLrqq226CiiAQKhmBRLBIVkJa0KLUwrqyD1NkONDRRU5dbnu7OIsz88xtx23n3Xtz4NnzHM5vz3k/jgAmgFNSyiBlOARwFOgDksAT4LyUcr5sAFJKhBAJwJGKJZr27nwc7Lt5EXf7QrkARoDGf0GXSyMWeooQYhDowN3+U3WAQ9Oc8WRSipPHDvDo7hUqKrT0vNfAOdztk0oCALo6j5/t6X31YGbMh9PhMMuNAsOpjowrB2D2uTPy63e8rnb9avmSyAvB/NdWvIFBtQA6YgBoMcnTJ3l8LsGsX2MpAjAIXMAbmFAJ0AIMmP3xTN3Rr8vHBNBqJ2I5YGUXlpBJDYHQAabDVoQZYHkXQvchuZjtPrYhVgKMLjSDdDB125HjvWxBmAMAxrpGmf+22+S9VwqRGfDpSIYJrRYiM0BHZFpWlUFkA3hSXfCoilgdUAaI7ADFEbkBFEbkDlAUkR9AQUT+AMUQ1gAKIawDDMQ7oMEuxNoACiDWDjAQQWBLqRGFARiIt8DWUiIKBzAQQ4DbQnUIaM4XUViAgRgBNlqongH25YMoPMBADAN1Fqqngf25IooDMBB9wC4L1VPAoVwQxQMYkB7gdLE6UXyAjpi2uE+E8Aa22Q/QERGLE/s70JapE6UD6IgYUFHIfaK0AB0xa3F1MkWUHqAjFoFKC5UfgT14A9JegI74A7jSInFAy1KVAJrwBobsB+iIOWBdLqlSIq/5a4TvQ/XkwpJ4BlwN93dH7QXoiChQnS3tcu8GfEPV6d26Hu7vvqECwAO8Bzalh2NxQaWmP1tnTy3+z1X/VyaBw/YDsnxPtN2q50vIpcBGlh1RB7yU0ChSoRP33ATHK2w+C+WH2B6Li3GXUzou+Wrxj1bZeBq1OBraOjw76uO+HzNak73H6bVDHgJnsq2uygJSiDCwOcPPUaBGaUAK8QY4aPbw4f7uxF9DoLslgW0q+gAAAABJRU5ErkJggg=="), auto`;
            window_e.document.body.appendChild(this.canvas);
            window_e.addEventListener("resize", this.resizeBinded);
            window_e.addEventListener("scroll", this.resizeBinded);
            this.setCtxProp();
            this.Histories();
            this.initCanvas();
            chrome.storage.local.clear();
            e_group.autoRead();
            this.toastElement = window_e.document.createElement("div");
            this.toastElement.setAttribute("id", "toast");
            window_e.document.body.appendChild(e_group.toastElement);
            function auto_save() {
                e_group.autoSave = setInterval(() => {
                    this.pageUrl = document.location.href;
                    var time = e_group.getTime();
                    chrome.runtime.sendMessage(
                        {
                            method: "save",
                            config: e_group.canvas.toDataURL(),
                            url: this.pageUrl,
                            link: e_group.linkarr,
                            time: time,
                        },
                        (response) => {
                            // response
                        }
                    );
                    e_group.toast("자동 저장");
                    if (e_group.userVol != 0) {
                        curVol = parseInt(
                            e_group.getVolume(e_group.canvas.toDataURL())
                        );
                        e_group.calVol = Math.ceil(
                            e_group.userVol - e_group.preVol + curVol / 100000
                        );
                        window_e.document.getElementById(
                            "volume_percent"
                        ).innerHTML = e_group.calVol + "%";
                    } else {
                        window_e.document.getElementById(
                            "volume_percent"
                        ).innerHTML = "로컬 저장소";
                    }
                }, 180000);
            }
            auto_save();
        },
        initCanvas: async function (t) {
            if (t) {
                await this.handleResize(!0);
                await this.ctx.drawImage(t, 0, 0);
                e_group.saveImage = await e_group.ctx.getImageData(
                    0,
                    0,
                    e_group.canvas.width,
                    e_group.canvas.height
                ); 
                await e_group.addHistory();
            } else {
                await this.handleResize();
            }
        },
        addMouseEventListener: function () {
            var startPainting = Function.prototype.bind.call(
                this.startPainting,
                this
            );
            var onMouseMove = Function.prototype.bind.call(
                this.onMouseMove,
                this
            );
            var stopPainting = Function.prototype.bind.call(
                this.stopPainting,
                this
            );
            var leaveStopPainting = Function.prototype.bind.call(
                this.leaveStopPainting,
                this
            );
            var onMouseClick = Function.prototype.bind.call(
                this.onMouseClick,
                this
            );
            this.canvas.addEventListener("mousedown", startPainting);
            this.canvas.addEventListener("touchstart", startPainting);
            this.canvas.addEventListener("mousemove", onMouseMove);
            this.canvas.addEventListener("touchmove", onMouseMove);
            this.canvas.addEventListener("mouseup", stopPainting);
            this.canvas.addEventListener("touchend", stopPainting);
            this.canvas.addEventListener("mouseleave", leaveStopPainting);
            this.canvas.addEventListener("click", onMouseClick);
        },
        // history
        Histories: function () {
            function historySave() {
                e_group.MAX_ITEMS = 50;
                e_group.currentIndex = 0;
                e_group.array = [];
            }

            this.histories = new historySave(); 
            historySave.prototype.add = function (t) {
                if (
                    (e_group.currentIndex < e_group.array.length - 1
                        ? ((e_group.array[++e_group.currentIndex] = t),
                          (e_group.array = e_group.array.slice(
                              0,
                              e_group.currentIndex + 1
                          )))
                        : (e_group.array.push(t),
                          (e_group.currentIndex = e_group.array.length - 1)),
                    e_group.array.length > e_group.MAX_ITEMS)
                ) {
                    var e_h = e_group.array.length - e_group.MAX_ITEMS;
                    (e_group.array = e_group.array.splice(-e_group.MAX_ITEMS)),
                        (e_group.currentIndex = e_group.currentIndex - e_h);
                }
            };
            historySave.prototype.previous = function () {
                return 0 === e_group.currentIndex
                    ? null
                    : e_group.array[--e_group.currentIndex];
            };
            historySave.prototype.next = function () {
                return e_group.currentIndex === e_group.array.length - 1
                    ? null
                    : e_group.array[++e_group.currentIndex];
            };
            historySave.prototype.hasPrevious = function () {
                return 0 < e_group.currentIndex;
            };
            historySave.prototype.hasNext = function () {
                return e_group.currentIndex < e_group.array.length - 1;
            };
        },
        addHistory: function () {
            this.histories.add(this.saveImage);
            var pageUrl = document.location.href;
            var time = e_group.getTime();
            chrome.runtime.sendMessage(
                {
                    method: "localSave",
                    config: e_group.canvas.toDataURL(),
                    url: pageUrl,
                    link: e_group.linkarr,
                    time: time,
                },
                (response) => {
                    // response
                }
            );
            this.checkHistoryButtonStatus();
        },
        setCtxProp: function () {
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.fillStyle = this.strokeStyle; 
            this.ctx.globalAlpha = this.globalAlpha;
            this.ctx.lineWidth = this.lineWidth;
            if (this.linePicker) {
                this.linePicker.value = this.lineWidth;
                this.linePickerPreview.innerHTML =
                    Math.round((this.linePicker.value / 20) * 100) + "%";
            }
        },
        handlePanelAppearing: function (t) {
            t.target.style.opacity = 1;
        },
        hideControlPanel: function () {
            this.addClass(this.panel.parentNode, "hide");
            this.controlPanelHidden = !0;
            "undefined" != typeof unsafeWindow &&
                null !== unsafeWindow &&
                (unsafeWindow.CTRL_HIDDEN = !0);
        },
        showControlPanel: function () {
            this.removeClass(this.panel.parentNode, "hide");
            this.controlPanelHidden = !1;
            "undefined" != typeof unsafeWindow &&
                null !== unsafeWindow &&
                (unsafeWindow.CTRL_HIDDEN = !1);
        },
        handleResize: function (t) {
            var e = !1,
                i = window_e.pageYOffset || document.documentElement.scrollTop,
                n =
                    (window_e.innerHeight ||
                        document.documentElement.clientHeight,
                    this.ctx.lineWidth),
                s = Math.max(
                    document.documentElement.clientWidth,
                    document.body.scrollWidth,
                    document.documentElement.scrollWidth,
                    document.body.offsetWidth,
                    document.documentElement.offsetWidth
                ),
                o = Math.max(
                    document.documentElement.clientHeight,
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.offsetHeight
                ),
                a = Math.min(o - this.canvas.offsetTop, 5e3);
            if (5e3 < i - this.canvas.offsetTop) {
                a = Math.min(o - i, 5e3);
                this.canvas.style.top = i + "px";
                e = !0;
            } else {
                if (i < this.canvas.offsetTop) {
                    a = 5e3;
                    this.canvas.style.top =
                        Math.max(0, 5e3 * Math.floor(i / 5e3)) + "px";
                    e = !0;
                }
            }
            if (e) {
                this.ctx.clearRect(
                    0,
                    0,
                    this.this.canvas.width,
                    this.canvas.height
                );
                if (this.paragraph) {
                    this.paragraph.clearIntervals();
                    this.paragraph = null;
                }
            } else {
            }
            this.canvas.width = s; 
            this.canvas.style.width = s + "px";
            this.canvas.height = a; 
            this.setCtxProp();
            this.canvas.style.height = a + "px";
            this.ctx.lineWidth = n;
            if (this.array.length != 0) {
                this.ctx.putImageData(this.array[this.currentIndex], 0, 0);
            } else {
                this.histories.add(
                    this.ctx.getImageData(
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height
                    )
                );
            }
        },
        createControlPanel: function () {
            this.panel = window_e.document.createElement("div");
            this.backBtn = window_e.document.createElement("div");
            this.nextBtn = window_e.document.createElement("div");
            var tools = window_e.document.createElement("div"),
                color = window_e.document.createElement("div"),
                controls = window_e.document.createElement("div"),
                transparency = window_e.document.createElement("div"),
                size_control = window_e.document.createElement("div"),
                volumeReader = window_e.document.createElement("div"),
                volumePercent = window_e.document.createElement("div");
            this.panel.setAttribute("id", "bnoty_controls");
            volumePercent.setAttribute("id", "volume_percent");
            tools.setAttribute("class", "bnoty_controls_draw");
            color.setAttribute("class", "bnoty_controls_color");
            controls.setAttribute("class", "bnoty_controls_control");
            transparency.setAttribute(
                "class",
                "bnoty_controls_range alpha_control"
            );
            size_control.setAttribute(
                "class",
                "bnoty_controls_range size_control"
            );
            volumeReader.setAttribute(
                "class",
                "bnoty_controls_range volume_control"
            );

            var box = window_e.document.createElement("div");
            box.setAttribute("class", "top_box");
            this.top_box = box;
            window_e.document.body.appendChild(box);
            var penBox = window_e.document.createElement("div"); // pen
            penBox.setAttribute("class", "pen_box");
            penBox.setAttribute("id", "penBox");
            var textBox = window_e.document.createElement("div"); // text
            textBox.setAttribute("class", "text_box");
            textBox.setAttribute("id", "textBox");
            var figureBox = window_e.document.createElement("div"); // figure
            figureBox.setAttribute("class", "pen_box");
            figureBox.setAttribute("id", "figureBox");
            var eraserBox = window_e.document.createElement("div"); // eraser
            eraserBox.setAttribute("class", "pen_box");
            eraserBox.setAttribute("id", "eraserBox");
            var imageBox = window_e.document.createElement("div"); // image
            imageBox.setAttribute("class", "pen_box");
            imageBox.setAttribute("id", "imageBox");
            var captureBox = window_e.document.createElement("div"); // capture
            captureBox.setAttribute("class", "pen_box");
            captureBox.setAttribute("id", "captureBox");
            box.appendChild(this.panel);
            this.panel.appendChild(tools);
            this.panel.appendChild(color);
            this.panel.appendChild(transparency);
            this.panel.appendChild(size_control);
            this.panel.appendChild(volumeReader);
            this.panel.appendChild(volumePercent);
            this.panel.appendChild(controls);

            for (var o = 0; o < this.drawOptions.length; o++) {
                var a = this.drawOptions[o],
                    r = window_e.document.createElement("div");
                r.setAttribute("class", "bnoty_controls_draw_option");
                r.setAttribute("title", a.title);
                this.addClass(r, a.type);

                if (!window_e.document.getElementById("penBox")) {
                    box.appendChild(penBox);
                    var tmp_pen = window_e.document.createElement("div");
                    var highlighterPen = window_e.document.createElement("div");
                    tmp_pen.setAttribute("class", "linePen");
                    tmp_pen.setAttribute("id", "pen1");
                    tmp_pen.setAttribute("title", "normal_pen");
                    highlighterPen.setAttribute("class", "highlighterPen");
                    highlighterPen.setAttribute("id", "pen2");
                    highlighterPen.setAttribute("title", "highlighter");
                    tmp_pen.addEventListener("click", function () {
                        e_group.activate = "pen";
                        e_group.canvas.style.cursor = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAFxGAABcRgEUlENBAAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAC9UlEQVRo3tXXXUhTYRjA8f+7nSkaYeYsi6BBN3UTTCqwLDQQCokguir6EpKuvKibLrqq226CiiAQKhmBRLBIVkJa0KLUwrqyD1NkONDRRU5dbnu7OIsz88xtx23n3Xtz4NnzHM5vz3k/jgAmgFNSyiBlOARwFOgDksAT4LyUcr5sAFJKhBAJwJGKJZr27nwc7Lt5EXf7QrkARoDGf0GXSyMWeooQYhDowN3+U3WAQ9Oc8WRSipPHDvDo7hUqKrT0vNfAOdztk0oCALo6j5/t6X31YGbMh9PhMMuNAsOpjowrB2D2uTPy63e8rnb9avmSyAvB/NdWvIFBtQA6YgBoMcnTJ3l8LsGsX2MpAjAIXMAbmFAJ0AIMmP3xTN3Rr8vHBNBqJ2I5YGUXlpBJDYHQAabDVoQZYHkXQvchuZjtPrYhVgKMLjSDdDB125HjvWxBmAMAxrpGmf+22+S9VwqRGfDpSIYJrRYiM0BHZFpWlUFkA3hSXfCoilgdUAaI7ADFEbkBFEbkDlAUkR9AQUT+AMUQ1gAKIawDDMQ7oMEuxNoACiDWDjAQQWBLqRGFARiIt8DWUiIKBzAQQ4DbQnUIaM4XUViAgRgBNlqongH25YMoPMBADAN1Fqqngf25IooDMBB9wC4L1VPAoVwQxQMYkB7gdLE6UXyAjpi2uE+E8Aa22Q/QERGLE/s70JapE6UD6IgYUFHIfaK0AB0xa3F1MkWUHqAjFoFKC5UfgT14A9JegI74A7jSInFAy1KVAJrwBobsB+iIOWBdLqlSIq/5a4TvQ/XkwpJ4BlwN93dH7QXoiChQnS3tcu8GfEPV6d26Hu7vvqECwAO8Bzalh2NxQaWmP1tnTy3+z1X/VyaBw/YDsnxPtN2q50vIpcBGlh1RB7yU0ChSoRP33ATHK2w+C+WH2B6Li3GXUzou+Wrxj1bZeBq1OBraOjw76uO+HzNak73H6bVDHgJnsq2uygJSiDCwOcPPUaBGaUAK8QY4aPbw4f7uxF9DoLslgW0q+gAAAABJRU5ErkJggg=="), auto`;
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    highlighterPen.addEventListener("click", function () {
                        e_group.activate = "highlighter";
                        e_group.canvas.style.cursor = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAFxGAABcRgEUlENBAAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAADVklEQVRo3tXZT2wUVRzA8e+b6bIWS6Clspt4aSPQlIuOpLZYbLYxDVCjGDBQ/pQqWAuJ6UUPeBAOkKBRD1ojSaFrjEeNYiLxNXtojQaIkpBAagBDuk0lbDfVtnTbbrvdPg5T3Q0p0Kk7f/bdZt6838xn3m9+7yUjlFIAMN2rgMv4Q1XkURNKKZjuLQP65899iT90MN8APUAo63wH/lB7fgCSPZXAHwv0DQNrAA1/KO1lwDbgBeC9Bfrj4R+vN73f+XsxIG93d016NYWeBd4C2rI7f+uL8+pRiRAiDfQB3wIf3e7uSnoNEAB04AzQCDA4lKCm9XulFEIIEAIA9VTpbPznd4YqMOSYdwBmGV0OlAI/DQ4lNjz35ncoBbomWKYrFFCgweG6BO823I0D672AyABMhDY4lCh6vu1cdG5OFQMIzLf/mE9x7KUx9lZNoGsAXAM2YsiUdwDz7ckth34Fav89Lnl8jvb6cVo3J+6/VAI7MeSk1wAdwNtCgE9TfLBjlN0bH/iM54EmDJnwEuAV4Aefrjjx8hjNNROPinMBeBFDJj0BAAjtb7m0Ppiq7tz3z2JjxYA6DPmnJwCb9rSUnDsy/ElgRfp1C/FmgbUYcsB1AABXthYCXwM7LcbdhSG/cR9gIlYCZ4HXLMZeiyFvuQ8wEauA00CThdhR4Bm7F7vFAUxE8fxWw2o6VWLI6+4DMjPxKXDAwj2SQABD3nUfkPkmPgf2Wxg1AazDkHfcB5iIZUCXRYQCinK97VgaIJNOnwHNFkbdAGox5N/uAzIz8QVwyGJ1qseQUfcBJsIHdAP1biD+P8BErACuAmVOI3IDMBFB4KLTiNwBTEQZ0OMkIrcAFxC5BziMsAfgIMI+gEMIewEOIOwH2IxwBmAjwjmATQhnATYgnAfkGOEOIIcI9wBLRAyO6FSdCpTHIuGo+wCLiPi4NtXY8UThX6N6FKiPRcJR9wGLRCRTIvb0yUBwbEr7L51ikXC5NwCPQCRTIrbuWHB1Ki183qhCD0d8BdRlp031h4HCqRnhgYVscQh/Ks0EoPt0qDgeJCtt8gAADP/SqCuYqft4jTYyqXlgM7eEVrn9jeUjk2IA889p/gEAgg0HH1ad0rFIuMDTgCxE/wJdFbFI+OY9d67SZnmubAAAAAAASUVORK5CYII="), auto`;
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    penBox.appendChild(tmp_pen);
                    penBox.appendChild(highlighterPen);
                    window_e.document.getElementById("penBox").style.display =
                        "none";
                }

                if (!window_e.document.getElementById("textBox")) {
                    box.appendChild(textBox);
                    var text = window_e.document.createElement("div"),
                        boldText = window_e.document.createElement("div"),
                        italicText = window_e.document.createElement("div"),
                        fontText = window_e.document.createElement("div"),
                        fontSize = window_e.document.createElement("div");
                    text.setAttribute("class", "text");
                    text.setAttribute("id", "text");
                    text.setAttribute("title", "Input Text");
                    text.addEventListener("click", function () {
                        e_group.activate = "text";
                        e_group.canvas.style.cursor = "default";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    boldText.setAttribute("class", "boldText");
                    boldText.setAttribute("id", "boldText");
                    boldText.setAttribute("title", "Bold Text");
                    boldText.addEventListener("click", function () {
                        if (e_group.boldtext == "bold") {
                            e_group.boldtext = "";
                        } else {
                            e_group.boldtext = "bold";
                        }
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    italicText.setAttribute("class", "italicText");
                    italicText.setAttribute("id", "italicText");
                    italicText.setAttribute("title", "Italic Text");
                    italicText.addEventListener("click", function () {
                        if (e_group.italictext == "italic") {
                            e_group.italictext = "";
                        } else {
                            e_group.italictext = "italic";
                        }
                        e_group.removeClass(e_group.canvas, "cursor");
                    });

                    fontSize.setAttribute("class", "fontSize");
                    fontSize.setAttribute("id", "fontSize");
                    fontSize.setAttribute("title", "FontSize");

                    var input = window.document.createElement("input");
                    input.setAttribute("id", "jsFontSize");
                    input.setAttribute("type", "number");
                    input.setAttribute("value", "20");
                    input.style.width = "80px";
                    fontSize.appendChild(input);
                    input.addEventListener("input", function () {
                        e_group.size =
                            document.getElementById("jsFontSize").value + "px";
                    });

                    fontText.setAttribute("class", "fontText");
                    fontText.setAttribute("id", "fontText");
                    fontText.setAttribute("title", "Font");

                    var select = window.document.createElement("select");
                    select.setAttribute("id", "jsFont");
                    var opt = window.document.createElement("option");
                    opt.setAttribute("value", "sans-serif");
                    var optText = window.document.createTextNode("gothic");
                    opt.appendChild(optText);
                    select.appendChild(opt);
                    var opt = window.document.createElement("option");
                    opt.setAttribute("value", "monospace");
                    var optText = window.document.createTextNode("normal");
                    opt.appendChild(optText);
                    select.appendChild(opt);
                    var opt = window.document.createElement("option");
                    opt.setAttribute("value", "serif");
                    var optText = window.document.createTextNode("normal2");
                    opt.appendChild(optText);
                    select.appendChild(opt);
                    var opt = window.document.createElement("option");
                    opt.setAttribute("value", "cursive");
                    var optText = window.document.createTextNode("cursive");
                    opt.appendChild(optText);
                    select.appendChild(opt);
                    var opt = window.document.createElement("option");
                    opt.setAttribute("value", "fantasy");
                    var optText = window.document.createTextNode("gothic2");
                    opt.appendChild(optText);
                    select.appendChild(opt);
                    window.document.body.appendChild(select);
                    select.style.width = "80px";

                    select.addEventListener("input", function () {
                        e_group.font = document.getElementById("jsFont").value;
                    });
                    // select.style = `position: absolute; top: 60px; left: 600px; z-index: 2147483647;`;

                    fontText.appendChild(select);

                    textBox.appendChild(text);
                    textBox.appendChild(boldText);
                    textBox.appendChild(italicText);
                    textBox.appendChild(fontSize);
                    textBox.appendChild(fontText);
                    window_e.document.getElementById("textBox").style.display =
                        "none";
                }

                if (!window_e.document.getElementById("figureBox")) {
                    box.appendChild(figureBox);
                    var square = window_e.document.createElement("div");
                    var triangle = window_e.document.createElement("div");
                    var circle = window_e.document.createElement("div");
                    var line = window_e.document.createElement("div");
                    var curve = window_e.document.createElement("div");
                    var arrow = window_e.document.createElement("div");

                    square.setAttribute("class", "square");
                    square.setAttribute("id", "square");
                    square.setAttribute("title", "Square");
                    square.addEventListener("click", function () {
                        e_group.activate = "rectangle";
                        e_group.canvas.style.cursor = "crosshair";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    triangle.setAttribute("class", "triangle");
                    triangle.setAttribute("id", "triangle");
                    triangle.setAttribute("title", "Triangle");
                    triangle.addEventListener("click", function () {
                        e_group.activate = "triangle";
                        e_group.canvas.style.cursor = "crosshair";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    circle.setAttribute("class", "circle");
                    circle.setAttribute("id", "circle");
                    circle.setAttribute("title", "Circle");
                    circle.addEventListener("click", function () {
                        e_group.activate = "circle";
                        e_group.canvas.style.cursor = "crosshair";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    line.setAttribute("class", "line");
                    line.setAttribute("id", "line");
                    line.setAttribute("title", "Line");
                    line.addEventListener("click", function () {
                        e_group.activate = "line";
                        e_group.canvas.style.cursor = "crosshair";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    curve.setAttribute("class", "curve");
                    curve.setAttribute("id", "curve");
                    curve.setAttribute("title", "Curve");
                    curve.addEventListener("click", function () {
                        e_group.activate = "curve";
                        e_group.canvas.style.cursor = "crosshair";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    arrow.setAttribute("class", "arrow");
                    arrow.setAttribute("id", "arrow");
                    arrow.setAttribute("title", "Arrow");
                    arrow.addEventListener("click", function () {
                        e_group.activate = "arrow";
                        e_group.canvas.style.cursor = "crosshair";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    figureBox.appendChild(square);
                    figureBox.appendChild(triangle);
                    figureBox.appendChild(circle);
                    figureBox.appendChild(line);
                    figureBox.appendChild(curve);
                    figureBox.appendChild(arrow);
                    window_e.document.getElementById(
                        "figureBox"
                    ).style.display = "none";
                }

                if (!window_e.document.getElementById("eraserBox")) {
                    box.appendChild(eraserBox);
                    var eraser = window_e.document.createElement("div");
                    var all_eraser = window_e.document.createElement("div");
                    eraser.setAttribute("class", "nomal_eraser");
                    eraser.setAttribute("id", "nomal_eraser");
                    eraser.setAttribute("title", "nomal_eraser");
                    all_eraser.setAttribute("class", "all_eraser");
                    all_eraser.setAttribute("id", "all_eraser");
                    all_eraser.setAttribute("title", "all_eraser");
                    eraser.addEventListener("click", function () {
                        e_group.activate = "eraser";
                        e_group.canvas.style.cursor = "crosshair";
                        e_group.ctx.lineWidth = 5;
                        e_group.linePicker.value = 5;
                        e_group.linePickerPreview.innerHTML =
                            Math.round((e_group.linePicker.value / 20) * 100) +
                            "%";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    all_eraser.addEventListener("click", function () {
                        e_group.ctx.clearRect(
                            0,
                            0,
                            e_group.canvas.width,
                            e_group.canvas.height
                        ); //clear canvas
                        e_group.saveImage = e_group.ctx.getImageData(
                            0,
                            0,
                            e_group.canvas.width,
                            e_group.canvas.height
                        );
                        e_group.addHistory();
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    eraserBox.appendChild(eraser);
                    eraserBox.appendChild(all_eraser);
                    window_e.document.getElementById(
                        "eraserBox"
                    ).style.display = "none";
                }

                if (!window_e.document.getElementById("imageBox")) {
                    box.appendChild(imageBox);
                    var insert_image = window_e.document.createElement("div");
                    var fileChange = window.document.createElement("input");
                    var insert_link = window_e.document.createElement("div");
                    insert_image.setAttribute("class", "insert_image");
                    insert_image.setAttribute("id", "insert_image");
                    insert_image.setAttribute("title", "insert image");
                    fileChange.setAttribute("type", "file");
                    fileChange.setAttribute("id", "fileloader");
                    fileChange.style.visibility = "hidden";
                    insert_image.setAttribute("type", "file");
                    insert_link.setAttribute("class", "insert_link");
                    insert_link.setAttribute("id", "insert_link");
                    insert_link.setAttribute("title", "insert_link");
                    insert_image.addEventListener("click", function () {
                        e_group.activate = "insert_image";
                        e_group.removeClass(e_group.canvas, "cursor");
                        fileChange.click();
                    });
                    fileChange.addEventListener("change", function (event) {
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            e_group.img = new Image();
                            e_group.img.src = e.target.result;
                        };
                        reader.readAsDataURL(event.target.files[0]);
                    });
                    insert_link.addEventListener("click", function () {
                        e_group.activate = "insert_link";
                        e_group.canvas.style.cursor = `url("data:image/png;base64,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"), auto`;
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                    imageBox.appendChild(insert_image);
                    imageBox.appendChild(insert_link);
                    window_e.document.getElementById("imageBox").style.display =
                        "none";
                }

                // capture box
                if (!window_e.document.getElementById("captureBox")) {
                    // capture
                    box.appendChild(captureBox);
                    var screen_capture_btn =
                        window_e.document.createElement("div");
                    var full_capture_btn =
                        window_e.document.createElement("div");
                    screen_capture_btn.addEventListener(
                        "click",
                        this.ScreencaptureStart
                    );
                    full_capture_btn.addEventListener(
                        "click",
                        this.FullcaptureStart
                    );

                    screen_capture_btn.setAttribute(
                        "class",
                        "screen_capture_btn"
                    );
                    screen_capture_btn.setAttribute("id", "screen_capture_btn");
                    screen_capture_btn.setAttribute(
                        "title",
                        "Capture current screen"
                    );

                    full_capture_btn.setAttribute("class", "full_capture_btn");
                    full_capture_btn.setAttribute("id", "full_capture_btn");
                    full_capture_btn.setAttribute(
                        "title",
                        "Capture entire web page"
                    );

                    captureBox.appendChild(screen_capture_btn);
                    captureBox.appendChild(full_capture_btn);
                    window_e.document.getElementById(
                        "captureBox"
                    ).style.display = "none";
                }

                if (a.type == "fill") {
                    r.addEventListener("click", function () {
                        e_group.clearLasso();
                        e_group.handleMouseClick();
                        e_group.activate = "fill";
                        e_group.canvas.style.cursor = `url("data:image/png;base64,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"), auto`;
                        window_e.document.getElementById(
                            "penBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "textBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "figureBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "captureBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "eraserBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "imageBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "saveBox"
                        ).style.display = "none";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                } else if (a.type == "pen") {
                    r.addEventListener("click", function () {
                        e_group.clearLasso();
                        e_group.handleMouseClick();
                        if (
                            window_e.document.getElementById("penBox").style
                                .display === "none"
                        ) {
                            window_e.document.getElementById(
                                "penBox"
                            ).style.display = "block";
                            window_e.document.getElementById(
                                "textBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "figureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "eraserBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "imageBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "saveBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "captureBox"
                            ).style.display = "none";
                        } else {
                            window_e.document.getElementById(
                                "penBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "textBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "figureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "captureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "eraserBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "imageBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "saveBox"
                            ).style.display = "none";
                        }
                        e_group.activate = "pen";
                        e_group.canvas.style.cursor = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAFxGAABcRgEUlENBAAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAC9UlEQVRo3tXXXUhTYRjA8f+7nSkaYeYsi6BBN3UTTCqwLDQQCokguir6EpKuvKibLrqq226CiiAQKhmBRLBIVkJa0KLUwrqyD1NkONDRRU5dbnu7OIsz88xtx23n3Xtz4NnzHM5vz3k/jgAmgFNSyiBlOARwFOgDksAT4LyUcr5sAFJKhBAJwJGKJZr27nwc7Lt5EXf7QrkARoDGf0GXSyMWeooQYhDowN3+U3WAQ9Oc8WRSipPHDvDo7hUqKrT0vNfAOdztk0oCALo6j5/t6X31YGbMh9PhMMuNAsOpjowrB2D2uTPy63e8rnb9avmSyAvB/NdWvIFBtQA6YgBoMcnTJ3l8LsGsX2MpAjAIXMAbmFAJ0AIMmP3xTN3Rr8vHBNBqJ2I5YGUXlpBJDYHQAabDVoQZYHkXQvchuZjtPrYhVgKMLjSDdDB125HjvWxBmAMAxrpGmf+22+S9VwqRGfDpSIYJrRYiM0BHZFpWlUFkA3hSXfCoilgdUAaI7ADFEbkBFEbkDlAUkR9AQUT+AMUQ1gAKIawDDMQ7oMEuxNoACiDWDjAQQWBLqRGFARiIt8DWUiIKBzAQQ4DbQnUIaM4XUViAgRgBNlqongH25YMoPMBADAN1Fqqngf25IooDMBB9wC4L1VPAoVwQxQMYkB7gdLE6UXyAjpi2uE+E8Aa22Q/QERGLE/s70JapE6UD6IgYUFHIfaK0AB0xa3F1MkWUHqAjFoFKC5UfgT14A9JegI74A7jSInFAy1KVAJrwBobsB+iIOWBdLqlSIq/5a4TvQ/XkwpJ4BlwN93dH7QXoiChQnS3tcu8GfEPV6d26Hu7vvqECwAO8Bzalh2NxQaWmP1tnTy3+z1X/VyaBw/YDsnxPtN2q50vIpcBGlh1RB7yU0ChSoRP33ATHK2w+C+WH2B6Li3GXUzou+Wrxj1bZeBq1OBraOjw76uO+HzNak73H6bVDHgJnsq2uygJSiDCwOcPPUaBGaUAK8QY4aPbw4f7uxF9DoLslgW0q+gAAAABJRU5ErkJggg=="), auto`;
                        e_group.setCtxProp();
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                } else if (a.type == "text") {
                    r.addEventListener("click", function () {
                        e_group.activate = "text";
                        e_group.clearLasso();
                        if (
                            window_e.document.getElementById("textBox").style
                                .display === "none"
                        ) {
                            window_e.document.getElementById(
                                "penBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "textBox"
                            ).style.display = "block";
                            window_e.document.getElementById(
                                "figureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "eraserBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "imageBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "saveBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "captureBox"
                            ).style.display = "none";
                        } else {
                            window_e.document.getElementById(
                                "penBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "textBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "figureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "captureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "eraserBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "imageBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "saveBox"
                            ).style.display = "none";
                        }
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                } else if (a.type == "figure") {
                    r.addEventListener("click", function () {
                        e_group.clearLasso();
                        e_group.handleMouseClick();
                        if (
                            window_e.document.getElementById("figureBox").style
                                .display === "none"
                        ) {
                            window_e.document.getElementById(
                                "penBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "textBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "figureBox"
                            ).style.display = "block";
                            window_e.document.getElementById(
                                "eraserBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "imageBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "saveBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "captureBox"
                            ).style.display = "none";
                        } else {
                            window_e.document.getElementById(
                                "penBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "textBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "figureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "captureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "eraserBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "imageBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "saveBox"
                            ).style.display = "none";
                        }
                        e_group.activate = "rectangle";
                        e_group.canvas.style.cursor = "crosshair";
                        e_group.setCtxProp();
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                } else if (a.type == "eraser") {
                    r.addEventListener("click", function () {
                        e_group.clearLasso();
                        e_group.handleMouseClick();
                        if (
                            window_e.document.getElementById("eraserBox").style
                                .display === "none"
                        ) {
                            window_e.document.getElementById(
                                "penBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "textBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "figureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "eraserBox"
                            ).style.display = "block";
                            window_e.document.getElementById(
                                "imageBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "saveBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "captureBox"
                            ).style.display = "none";
                        } else {
                            window_e.document.getElementById(
                                "penBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "textBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "figureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "captureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "eraserBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "imageBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "saveBox"
                            ).style.display = "none";
                        }
                        e_group.activate = "eraser";
                        e_group.canvas.style.cursor = "crosshair";
                        e_group.ctx.lineWidth = 5;
                        e_group.linePicker.value = 5;
                        e_group.linePickerPreview.innerHTML =
                            Math.round((e_group.linePicker.value / 20) * 100) +
                            "%";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                } else if (a.type == "lasso") {
                    r.addEventListener("click", function () {
                        e_group.handleMouseClick();
                        e_group.activate = "lasso";
                        e_group.canvas.style.cursor = "pointer";
                        window_e.document.getElementById(
                            "penBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "textBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "figureBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "captureBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "eraserBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "imageBox"
                        ).style.display = "none";
                        window_e.document.getElementById(
                            "saveBox"
                        ).style.display = "none";
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                } else if (a.type == "image") {
                    r.addEventListener("click", function () {
                        e_group.clearLasso();
                        e_group.handleMouseClick();
                        if (
                            window_e.document.getElementById("imageBox").style
                                .display === "none"
                        ) {
                            window_e.document.getElementById(
                                "penBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "textBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "figureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "eraserBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "imageBox"
                            ).style.display = "block";
                            window_e.document.getElementById(
                                "saveBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "captureBox"
                            ).style.display = "none";
                        } else {
                            window_e.document.getElementById(
                                "penBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "textBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "figureBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "eraserBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "imageBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "saveBox"
                            ).style.display = "none";
                            window_e.document.getElementById(
                                "captureBox"
                            ).style.display = "none";
                        }
                        e_group.removeClass(e_group.canvas, "cursor");
                    });
                } else if (a.type == "cursor") {
                    r.addEventListener("click", function () {
                        e_group.clearLasso();
                        e_group.handleMouseClick();
                        e_group.activate = "cursor";
                        e_group.addClass(e_group.canvas, "cursor");
                    });
                }

                tools.appendChild(r);
                if (
                    !(
                        ((null !== this.config.tool &&
                            void 0 !== this.config.tool) ||
                            0 !== o) &&
                        o !== this.config.tool
                    )
                ) {
                    // this.triggerClick(r);
                }
            }

            var pen = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option pen"
                ),
                lasso = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option lasso"
                ),
                text1 = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option text"
                ),
                figure = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option figure"
                ),
                image = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option image"
                ),
                cursor = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option cursor"
                ),
                eraser1 = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option eraser"
                ),
                fill = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option fill"
                );

            pen.item(0).addEventListener("click", function () {
                e_group.nonSelected();
                pen.item(0).style.backgroundColor = "#dabb2f";
                var nomal_pen1 =
                        window_e.document.getElementsByClassName("linePen"),
                    highlighter_pen1 =
                        window_e.document.getElementsByClassName(
                            "highlighterPen"
                        );
                nomal_pen1.item(0).addEventListener("click", function () {
                    highlighter_pen1.item(0).style.backgroundColor = "#fff2b7";
                    nomal_pen1.item(0).style.backgroundColor = "#dabb2f";
                });
                highlighter_pen1.item(0).addEventListener("click", function () {
                    nomal_pen1.item(0).style.backgroundColor = "#fff2b7";
                    highlighter_pen1.item(0).style.backgroundColor = "#dabb2f";
                });
            });
            lasso.item(0).addEventListener("click", function () {
                e_group.nonSelected();
                lasso.item(0).style.backgroundColor = "#dabb2f";
            });
            var nomal_text_flag = false;
            var boldText_flag = false;
            var italicText_flag = false;
            text1.item(0).addEventListener("click", function () {
                e_group.nonSelected();
                text1.item(0).style.backgroundColor = "#dabb2f";
                var nomal_text = window_e.document.getElementById("text"),
                    boldText =
                        window_e.document.getElementsByClassName("boldText"),
                    italicText =
                        window_e.document.getElementsByClassName("italicText");
                nomal_text.addEventListener("click", function () {
                    if (nomal_text_flag) {
                        nomal_text.style.backgroundColor = "#fff2b7";
                        nomal_text_flag = false;
                    } else {
                        nomal_text.style.backgroundColor = "#dabb2f";
                        nomal_text_flag = true;
                    }
                });
                boldText.item(0).addEventListener("click", function () {
                    if (boldText_flag) {
                        boldText.item(0).style.backgroundColor = "#fff2b7";
                        boldText_flag = false;
                    } else {
                        boldText.item(0).style.backgroundColor = "#dabb2f";
                        boldText_flag = true;
                    }
                });
                italicText.item(0).addEventListener("click", function () {
                    if (italicText_flag) {
                        italicText.item(0).style.backgroundColor = "#fff2b7";
                        italicText_flag = false;
                    } else {
                        italicText.item(0).style.backgroundColor = "#dabb2f";
                        italicText_flag = true;
                    }
                });
            });
            figure.item(0).addEventListener("click", function () {
                e_group.nonSelected();
                figure.item(0).style.backgroundColor = "#dabb2f";
                var square = window_e.document.getElementById("square"),
                    triangle = window_e.document.getElementById("triangle"),
                    circle = window_e.document.getElementById("circle"),
                    line = window_e.document.getElementById("line"),
                    curve = window_e.document.getElementById("curve"),
                    arrow = window_e.document.getElementById("arrow");

                square.addEventListener("click", function () {
                    square.style.backgroundColor = "#dabb2f";
                    triangle.style.backgroundColor = "#fff2b7";
                    circle.style.backgroundColor = "#fff2b7";
                    line.style.backgroundColor = "#fff2b7";
                    curve.style.backgroundColor = "#fff2b7";
                    arrow.style.backgroundColor = "#fff2b7";
                });
                triangle.addEventListener("click", function () {
                    square.style.backgroundColor = "#fff2b7";
                    triangle.style.backgroundColor = "#dabb2f";
                    circle.style.backgroundColor = "#fff2b7";
                    line.style.backgroundColor = "#fff2b7";
                    curve.style.backgroundColor = "#fff2b7";
                    arrow.style.backgroundColor = "#fff2b7";
                });
                circle.addEventListener("click", function () {
                    square.style.backgroundColor = "#fff2b7";
                    triangle.style.backgroundColor = "#fff2b7";
                    circle.style.backgroundColor = "#dabb2f";
                    line.style.backgroundColor = "#fff2b7";
                    curve.style.backgroundColor = "#fff2b7";
                    arrow.style.backgroundColor = "#fff2b7";
                });
                line.addEventListener("click", function () {
                    square.style.backgroundColor = "#fff2b7";
                    triangle.style.backgroundColor = "#fff2b7";
                    circle.style.backgroundColor = "#fff2b7";
                    line.style.backgroundColor = "#dabb2f";
                    curve.style.backgroundColor = "#fff2b7";
                    arrow.style.backgroundColor = "#fff2b7";
                });
                curve.addEventListener("click", function () {
                    square.style.backgroundColor = "#fff2b7";
                    triangle.style.backgroundColor = "#fff2b7";
                    circle.style.backgroundColor = "#fff2b7";
                    line.style.backgroundColor = "#fff2b7";
                    curve.style.backgroundColor = "#dabb2f";
                    arrow.style.backgroundColor = "#fff2b7";
                });
                arrow.addEventListener("click", function () {
                    square.style.backgroundColor = "#fff2b7";
                    triangle.style.backgroundColor = "#fff2b7";
                    circle.style.backgroundColor = "#fff2b7";
                    line.style.backgroundColor = "#fff2b7";
                    curve.style.backgroundColor = "#fff2b7";
                    arrow.style.backgroundColor = "#dabb2f";
                });
            });
            image.item(0).addEventListener("click", function () {
                e_group.nonSelected();
                image.item(0).style.backgroundColor = "#dabb2f";
                var image1 = window_e.document.getElementById("insert_image"),
                    link1 = window_e.document.getElementById("insert_link");
                image1.addEventListener("click", function () {
                    image1.style.backgroundColor = "#dabb2f";
                    link1.style.backgroundColor = "#fff2b7";
                });
                link1.addEventListener("click", function () {
                    image1.style.backgroundColor = "#fff2b7";
                    link1.style.backgroundColor = "#dabb2f";
                });
            });
            cursor.item(0).addEventListener("click", function () {
                e_group.nonSelected();
                cursor.item(0).style.backgroundColor = "#dabb2f";
            });
            eraser1.item(0).addEventListener("click", function () {
                e_group.nonSelected();
                eraser1.item(0).style.backgroundColor = "#dabb2f";
                var nomal_eraser =
                        window_e.document.getElementById("nomal_eraser"),
                    all_eraser = window_e.document.getElementById("all_eraser");
                nomal_eraser.addEventListener("click", function () {
                    nomal_eraser.style.backgroundColor = "#dabb2f";
                    all_eraser.style.backgroundColor = "#fff2b7";
                });
                all_eraser.addEventListener("click", function () {
                    nomal_eraser.style.backgroundColor = "#fff2b7";
                    all_eraser.style.backgroundColor = "#dabb2f";
                });
            });
            fill.item(0).addEventListener("click", function () {
                e_group.nonSelected();
                fill.item(0).style.backgroundColor = "#dabb2f";
            });

            this.colorPicker = window_e.document.createElement("input");
            this.colorPicker.setAttribute("type", "color");
            this.colorPicker.value = this.config.color || "#000000";
            this.colorPicker.setAttribute("title", "Select a color");
            this.colorPicker.addEventListener("change", function (event) {
                var color = event.currentTarget.value;
                e_group.red = parseInt(color[1] + color[2], 16);
                e_group.green = parseInt(color[3] + color[4], 16);
                e_group.blue = parseInt(color[5] + color[6], 16);
                e_group.strokeStyle =
                    "rgb(" +
                    e_group.red +
                    "," +
                    e_group.green +
                    "," +
                    e_group.blue +
                    ")";
                e_group.setCtxProp();
            });
            color.appendChild(this.colorPicker);
            this.alphaPicker = window_e.document.createElement("input");
            this.alphaPicker.setAttribute("type", "range");
            this.alphaPicker.setAttribute("min", "0.01");
            this.alphaPicker.setAttribute("max", "1");
            this.alphaPicker.setAttribute("step", "0.01");
            this.alphaPicker.value =
                null !== this.config.alpha && void 0 !== this.config.alpha
                    ? this.config.alpha
                    : 1;
            this.alphaPicker.setAttribute("title", "Select transparency");
            this.alphaPicker.addEventListener("change", function (event) {
                e_group.globalAlpha = event.currentTarget.value;
                e_group.setCtxProp();
            });
            this.alphaPicker.addEventListener("input", function (event) {
                if (e_group.alphaPickerPreview) {
                    e_group.alphaPickerPreview.innerHTML =
                        Math.round(100 * event.currentTarget.value) + "%";
                }
            });
            this.alphaPickerPreview = window_e.document.createElement("p");
            transparency.appendChild(this.alphaPicker);
            transparency.appendChild(this.alphaPickerPreview);
            this.linePicker = window_e.document.createElement("input");
            this.linePicker.setAttribute("type", "range");
            this.linePicker.setAttribute("min", "1");
            this.linePicker.setAttribute("max", "20");
            this.linePicker.setAttribute("step", "1");
            this.linePicker.value = this.config.thickness || 1;
            this.linePicker.setAttribute("title", "Select line width");
            this.linePicker.addEventListener("change", function (event) {
                e_group.lineWidth = event.currentTarget.value;
                e_group.setCtxProp();
            });
            this.linePicker.addEventListener("input", function (event) {
                if (e_group.linePickerPreview) {
                    e_group.linePickerPreview.innerHTML =
                        Math.round((event.currentTarget.value / 20) * 100) +
                        "%";
                }
            });
            this.linePickerPreview = window_e.document.createElement("p");
            size_control.appendChild(this.linePicker);
            size_control.appendChild(this.linePickerPreview);
            this.selectedAlphaOption = this.alphaPicker.value;
            this.ctx.lineWidth = this.linePicker.value;
            this.alphaPickerPreview.innerHTML =
                Math.round(100 * this.selectedAlphaOption) + "%";
            this.linePickerPreview.innerHTML =
                Math.round((this.ctx.lineWidth / 20) * 100) + "%";
            var captureBtn = window_e.document.createElement("div"),
                exitBtn = window_e.document.createElement("div"),
                control_save = window_e.document.createElement("div"),
                control_hide = window_e.document.createElement("div"),
                p = window_e.document.createElement("div");
            captureBtn.setAttribute(
                "class",
                "bnoty_controls_control_option prtBtn"
            );
            captureBtn.setAttribute(
                "title",
                "Take a screenshot of the current web page with your drawings"
            );
            exitBtn.setAttribute(
                "class",
                "bnoty_controls_control_option exitBtn"
            );
            exitBtn.setAttribute("title", "Quit");
            this.backBtn.setAttribute(
                "class",
                "bnoty_controls_control_option backBtn"
            );
            this.backBtn.setAttribute("title", "Step backward");
            this.nextBtn.setAttribute(
                "class",
                "bnoty_controls_control_option nextBtn"
            );
            this.nextBtn.setAttribute("title", "Step forward");
            this.backBtn.addEventListener("click", function () {
                if (e_group.histories.hasPrevious()) {
                    e_group.ctx.putImageData(
                        e_group.histories.previous(),
                        0,
                        0
                    );
                    e_group.checkHistoryButtonStatus(); // 이전 다음 버튼 활성화 비활성화 체크
                }
            });
            this.nextBtn.addEventListener("click", function () {
                if (e_group.histories.hasNext()) {
                    e_group.ctx.putImageData(e_group.histories.next(), 0, 0);
                    e_group.checkHistoryButtonStatus(); // 이전 다음 버튼 활성화 비활성화 체크
                }
            });

            var saveBox = window_e.document.createElement("div"); // save
            saveBox.setAttribute("class", "pen_box");
            saveBox.setAttribute("id", "saveBox");
            if (!window_e.document.getElementById("saveBox")) {
                box.appendChild(saveBox);
                var save = window_e.document.createElement("div"),
                    capacity_check = window_e.document.createElement("div");

                save.setAttribute("class", "save");
                save.setAttribute("id", "save");
                save.setAttribute("title", "Manual save");
                capacity_check.setAttribute("class", "capacity_check");
                capacity_check.setAttribute("id", "capacity_check");
                capacity_check.setAttribute(
                    "title",
                    "Check My Computer Capacity"
                );

                saveBox.appendChild(save);
                saveBox.appendChild(capacity_check);
                window_e.document.getElementById("saveBox").style.display =
                    "none";
            }

            save.addEventListener("click", function () {
                var pageUrl = document.location.href;
                var time = e_group.getTime();
                chrome.runtime.sendMessage(
                    {
                        method: "save",
                        config: e_group.canvas.toDataURL(),
                        url: pageUrl,
                        link: e_group.linkarr,
                        time: time,
                    },
                    (response) => {
                        // response
                    }
                );
                e_group.toast("Save Complete!");
                if (e_group.userVol != 0) {
                    curVol = parseInt(
                        e_group.getVolume(e_group.canvas.toDataURL())
                    );
                    e_group.calVol = Math.ceil(
                        e_group.userVol - e_group.preVol + curVol / 100000
                    );
                    window_e.document.getElementById(
                        "volume_percent"
                    ).innerHTML = e_group.calVol + "%";
                } else {
                    window_e.document.getElementById(
                        "volume_percent"
                    ).innerHTML = "LOCAL STORAGE";
                }
            });

            control_save.setAttribute(
                "class",
                "bnoty_controls_control_option save"
            );
            control_save.setAttribute("title", "Save your drawings");
            control_save.addEventListener("click", function () {
                if (
                    window_e.document.getElementById("saveBox").style
                        .display === "none"
                ) {
                    window_e.document.getElementById("penBox").style.display =
                        "none";
                    window_e.document.getElementById("textBox").style.display =
                        "none";
                    window_e.document.getElementById(
                        "figureBox"
                    ).style.display = "none";
                    window_e.document.getElementById(
                        "eraserBox"
                    ).style.display = "none";
                    window_e.document.getElementById("imageBox").style.display =
                        "none";
                    window_e.document.getElementById("saveBox").style.display =
                        "block";
                    window_e.document.getElementById(
                        "captureBox"
                    ).style.display = "none";
                } else {
                    window_e.document.getElementById("penBox").style.display =
                        "none";
                    window_e.document.getElementById("textBox").style.display =
                        "none";
                    window_e.document.getElementById(
                        "figureBox"
                    ).style.display = "none";
                    window_e.document.getElementById(
                        "captureBox"
                    ).style.display = "none";
                    window_e.document.getElementById(
                        "eraserBox"
                    ).style.display = "none";
                    window_e.document.getElementById("imageBox").style.display =
                        "none";
                    window_e.document.getElementById("saveBox").style.display =
                        "none";
                }
                e_group.addHistory();
            });
            control_hide.setAttribute(
                "class",
                "bnoty_controls_control_option hideCtrlBtn"
            );
            control_hide.setAttribute(
                "title",
                "Hide control panel (Click the extension icon to re-open)"
            );
            p.setAttribute("class", "settingsBtn");
            p.setAttribute("title", "Settings");
            captureBtn.addEventListener(
                "click",
                Function.prototype.bind.call(this.onPrintButtonClick, this)
            );
            exitBtn.addEventListener(
                "click",
                Function.prototype.bind.call(this.exit, this)
            );
            control_hide.addEventListener(
                "click",
                Function.prototype.bind.call(this.hideControlPanel, this)
            );
            controls.appendChild(this.backBtn);
            controls.appendChild(this.nextBtn);
            controls.appendChild(control_save);
            controls.appendChild(captureBtn);
            controls.appendChild(control_hide);
            controls.appendChild(exitBtn);
            controls.appendChild(p);
            this.checkHistoryButtonStatus(); 
            this.CSSAnimationManager.supported
                ? this.panel.addEventListener(
                      this.CSSAnimationManager.end,
                      Function.prototype.bind.call(
                          this.handlePanelAppearing,
                          this
                      ),
                      !1
                  )
                : (this.panel.style.opacity = 1);
            e_group.setCtxProp();
        },
        nonSelected: function () {
            var pen = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option pen"
                ),
                lasso = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option lasso"
                ),
                text = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option text"
                ),
                figure = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option figure"
                ),
                image = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option image"
                ),
                cursor = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option cursor"
                ),
                eraser = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option eraser"
                ),
                fill = window_e.document.getElementsByClassName(
                    "bnoty_controls_draw_option fill"
                );

            pen.item(0).style.backgroundColor = "#fffbe5";
            lasso.item(0).style.backgroundColor = "#fffbe5";
            text.item(0).style.backgroundColor = "#fffbe5";
            figure.item(0).style.backgroundColor = "#fffbe5";
            image.item(0).style.backgroundColor = "#fffbe5";
            cursor.item(0).style.backgroundColor = "#fffbe5";
            eraser.item(0).style.backgroundColor = "#fffbe5";
            fill.item(0).style.backgroundColor = "#fffbe5";
        },
        checkHistoryButtonStatus: function () {
            if (this.nextBtn && this.backBtn) {
                if (this.histories.hasNext())
                    this.removeClass(this.nextBtn, "disabled");
                else this.addClass(this.nextBtn, "disabled");
                if (this.histories.hasPrevious())
                    this.removeClass(this.backBtn, "disabled");
                else this.addClass(this.backBtn, "disabled");
            }
        },
        addClass: function (t, e) {
            0 <= t.className.indexOf(e) ||
                (t.className = t.className + " " + e);
        },
        removeClass: function (t, e) {
            t.className = t.className.replace(
                new RegExp("\\b" + e + "\\b", "g"),
                ""
            );
        },
        matchOutlineColor: function (a, b, c, d) {
            return 255 !== a && 255 !== b && 255 !== c && 0 !== d;
        },
        handleFill: function (x, y) {
            var currentImage = this.ctx.getImageData(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
            i = 4 * (y * this.canvas.width + x);
            r = currentImage.data[i];
            g = currentImage.data[i + 1];
            b = currentImage.data[i + 2];
            a = currentImage.data[i + 3];
            red_option = this.red;
            green_option = this.green;
            blue_option = this.blue;
            alpha_option = Math.round(255 * this.globalAlpha);
            if (
                !(
                    r === red_option &&
                    g === green_option &&
                    b === blue_option &&
                    a === alpha_option
                )
            ) {
                if (!this.matchOutlineColor(r, g, b, a)) {
                    this.floodFill(
                        x,
                        y,
                        [
                            this.red,
                            this.green,
                            this.blue,
                            Math.round(255 * this.globalAlpha),
                        ],
                        !1,
                        currentImage,
                        0,
                        !0
                    );
                    this.ctx.putImageData(currentImage, 0, 0);
                }
            }
        },
        floodFill: function (x, y, option, i, image, a, s) {
            var r,
                h,
                c,
                data = image.data,
                array_1 = [],
                u = !!0,
                p = !1,
                width = image.width,
                height = image.height,
                array_wh = new Uint8ClampedArray(width * height),
                width_4 = 4 * width,
                x2 = x,
                y2 = y,
                w = y2 * width_4 + 4 * x2,
                C = data[w],
                b = data[w + 1],
                L = data[w + 2],
                P = data[w + 3],
                T = !1,
                D = function (t, e) {
                    if (t < 0 || e < 0 || height <= e || width <= t) return !1;
                    var i = e * width_4 + 4 * t,
                        n = Math.max(
                            Math.abs(C - data[i]),
                            Math.abs(b - data[i + 1]),
                            Math.abs(L - data[i + 2]),
                            Math.abs(P - data[i + 3])
                        );
                    if (n < a) {
                        n = 0;
                    }
                    var s = Math.abs(0 - array_wh[e * width + t]);
                    return (
                        T ||
                            (0 !== n &&
                                255 !== s &&
                                ((data[i] = option[0]),
                                (data[i + 1] = option[1]),
                                (data[i + 2] = option[2]),
                                (data[i + 3] = (option[3] + data[i + 3]) / 2),
                                (array_wh[e * width + t] = 255))),
                        n + s === 0
                    );
                };
            for (array_1.push([x2, y2]); array_1.length; ) {
                var k = array_1.pop();
                for (x2 = k[0], y2 = k[1], T = !0; D(x2, y2 - 1); ) y2 -= 1;
                for (
                    T = !1,
                        i &&
                            (!D(x2 - 1, y2) &&
                                D(x2 - 1, y2 - 1) &&
                                array_1.push([x2 - 1, y2 - 1]),
                            !D(x2 + 1, y2) &&
                                D(x2 + 1, y2 - 1) &&
                                array_1.push([x2 + 1, y2 - 1])),
                        p = u = !1;
                    D(x2, y2);

                )
                    void 0,
                        (data[(c = (h = y2) * width_4 + 4 * (r = x2))] =
                            option[0]),
                        (data[c + 1] = option[1]),
                        (data[c + 2] = option[2]),
                        (data[c + 3] = option[3]),
                        (array_wh[h * width + r] = 255),
                        D(x2 - 1, y2)
                            ? u || (array_1.push([x2 - 1, y2]), (u = !0))
                            : u && (u = !1),
                        D(x2 + 1, y2)
                            ? p || (array_1.push([x2 + 1, y2]), (p = !0))
                            : p && (p = !1),
                        (y2 += 1);
                if (i) {
                    D(x2 - 1, y2) && !u && array_1.push([x2 - 1, y2]);
                    D(x2 + 1, y2) && !p && array_1.push([x2 + 1, y2]);
                }
            }
        },
        initDragging: function () {
            this.top_box.addEventListener(
                "mousedown",
                this.handleDraggingStart
            ),
                this.top_box.addEventListener(
                    "touchstart",
                    this.handleDraggingStart
                ),
                window_e.document.addEventListener(
                    "mouseup",
                    this.handleDragDone
                ),
                window_e.document.addEventListener(
                    "touchend",
                    this.handleDragDone
                );
        },
        handleDraggingStart: function (t) {
            e_group.pos_x =
                this.getBoundingClientRect().left -
                (void 0 === t.clientX ? t.touches[0].clientX : t.clientX);
            e_group.pos_y =
                this.getBoundingClientRect().top -
                (void 0 === t.clientY ? t.touches[0].clientY : t.clientY);
            this.addEventListener("mousemove", e_group.handleDragging);
            this.addEventListener("touchmove", e_group.handleDragging);
        },
        handleDragging: function (t) {
            if ("INPUT" !== t.target.nodeName.toUpperCase()) {
                t.preventDefault();
                this.style.top =
                    (void 0 === t.clientY ? t.touches[0].clientY : t.clientY) +
                    e_group.pos_y +
                    "px";
                this.style.left =
                    (void 0 === t.clientX ? t.touches[0].clientX : t.clientX) +
                    e_group.pos_x +
                    "px";
            }
        },
        handleDragDone: function (t) {
            e_group.top_box.removeEventListener(
                "mousemove",
                e_group.handleDragging
            );
            e_group.top_box.removeEventListener(
                "touchmove",
                e_group.handleDragging
            );
        },
        exit: function () {
            e_group.deleteLink();
            e_group.clearLasso();
            e_group.handleMouseClick();
            this.canvas.parentNode.removeChild(this.canvas);
            this.panel.parentNode.parentNode.removeChild(this.panel.parentNode);
            this.toastElement.parentNode.removeChild(this.toastElement);
            window_e.removeEventListener("resize", this.resizeBinded);
            window_e.removeEventListener("scroll", this.resizeBinded);
            chrome.storage.onChanged.removeListener(this.loadCanvasBinded);
            this.canvas = null;
            this.ctx = null;
            this.initialized = !1;
            this.controlPanelHidden = !1;
            this.painting = false;
            this.selectedAlphaOption = null;
            this.resizeTimeoutID = null;
            this.paragraph = null;
            this.panel = null;
            this.strokeStyle = "rgb(0, 0, 0)";
            this.lineWidth = 3;
            this.globalAlpha = 1;
            this.paragraph = null;
            this.activate = "pen";
            this.saveImage = null;
            this.saveLasso = [null, null];
            this.histories = null;
            this.MAX_ITEMS = null;
            this.currentIndex = null;
            this.array = [];
            this.red = 0;
            this.green = 0;
            this.blue = 0;
            this.sX = null;
            this.sY = null;
            this.eX = null;
            this.eY = null;
            this.mX = null;
            this.mY = null;
            this.lassosX = null;
            this.lassosY = null;
            this.lassoeX = null;
            this.lassoeY = null;
            this.lassosubX = null;
            this.lassosubY = null;
            this.hasInput = false;
            this.size = "20px";
            this.font = "sans-serif";
            this.boldtext = "";
            this.italictext = "";
            this.textactive = false;
            this.removeToast = null;
            this.toastElement = null;
            clearInterval(this.autoSave);
            this.autoSave = null;
            this.top_box = null;
            this.linkarr = [];
            this.linknumber = 0;
            "undefined" != typeof unsafeWindow &&
                null !== unsafeWindow &&
                ((unsafeWindow.bnoty_INIT = !1),
                (unsafeWindow.CTRL_HIDDEN = !1));
        },
        render: function (t) {
            this.config = t || {};
            this.createCanvas();
            // this.setLineProperty();
            this.createControlPanel();
            this.addMouseEventListener();
            this.initDragging();
            // this.addMouseEventListener(),
            // this.addKeyEventListeners();
        },
        initConfig: function () {
            global.runtime.sendMessage(
                {
                    method: "get_data",
                }
                //this.renderBinded
            );
            e_group.render();
        },
        init: function () {
            (this.CSSAnimationManager = getCSSAnimationManager()),
                (this.renderBinded = Function.prototype.bind.call(
                    this.render,
                    this
                )),
                (this.resizeBinded = Function.prototype.bind.call(function () {
                    this.resizeTimeoutID &&
                        (this.resizeTimeoutID = window_e.clearTimeout(
                            this.resizeTimeoutID
                        )),
                        (this.resizeTimeoutID = window_e.setTimeout(
                            Function.prototype.bind.call(
                                this.handleResize,
                                this
                            ),
                            200
                        ));
                }, this)),
                (this.loadCanvasBinded = Function.prototype.bind.call(
                    this.loadCanvas,
                    this
                )),
                this.initConfig(),
                (this.initialized = !0),
                "undefined" != typeof unsafeWindow &&
                    null !== unsafeWindow &&
                    (unsafeWindow.bnoty_INIT = !0);
        },
        LinkInputField: function (x, y) {
            var atag = window_e.document.createElement("div");
            atag.setAttribute("id", "linkdiv");
            atag.style.position = "absolute";
            atag.style.width = 280 + "px";
            atag.style.left = x + "px";
            atag.style.top = y + "px";
            atag.style.zIndex = 2147483647;
            e_group.linkX = x;
            e_group.linkY = y;
            var input1 = window_e.document.createElement("input");
            input1.setAttribute("id", "linkinput");
            input1.setAttribute("type", "text");
            input1.setAttribute("placeholder", "링크입력");

            var input2 = window_e.document.createElement("input");
            input2.setAttribute("type", "button");
            input2.setAttribute("value", "확인");
            input2.addEventListener("click", this.linkclickfuntion);

            atag.appendChild(input1);
            atag.appendChild(input2);
            document.body.appendChild(atag);

            e_group.activate = "nothing";
        },
        linkclickfuntion: function (e) {
            var goto = document.getElementById("linkinput").value;

            var atag = window_e.document.createElement("a");
            atag.setAttribute("id", "linkobject");
            atag.setAttribute("target", "”_blank”");
            atag.setAttribute("href", goto);
            atag.setAttribute("linknumber", e_group.linknumber);

            atag.addEventListener("contextmenu", function (e) {
                e.preventDefault();
            });
            atag.addEventListener("contextmenu", function () {
                const deletenum = this.getAttribute("linknumber");
                const deleteindex = e_group.linkarr.findIndex(function (e) {
                    return e.num === deletenum;
                });
                e_group.linkarr.splice(deleteindex, 1);
                this.remove();
            });
            atag.style.position = "absolute";
            atag.style.width = 24 + "px";
            atag.style.height = 24 + "px";
            atag.style.left = e_group.linkX + "px";
            atag.style.top = e_group.linkY + "px";
            atag.style.zIndex = 2147483647;

            var imgtag = window_e.document.createElement("img");
            imgtag.setAttribute(
                "src",
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAqRJREFUSEvFlU1sjFEUhp+DFklnusGKSBARNupnTVhq0x/aRtjMN9KdBaqNn0pJK7SNBYmFmG9sKuiQKbpVa0LYkDI2YlUrnSZCtUduvzvtnfHNTLto3N2999zznvO+55wrLPGSJfZPSQCluRKqGkHqgV3AehvQN+AtkIZsWhj6XSzQogCKdxjoAzaVzlK+gHQId5+E2f0DoDQvh8h14Mzi6NMB2NgpdM+470IAvIEC5+OgN0FHYPpz8LhyK3AI9CSwznHYL/gdRQEsLSnHYAiIC342LBvFiwA+cGT+XhqFRDq3n8sgEDTy0eF8CPxWAVVi9SCngD3BQ30Ny24IiWeKKRTvkQOSgeyOnPAOQKwV5IFFHge2mMgV7xrQWUSPq4J/QTkWhZUZYG1gJy1CwmQ/X6aKdx84aiO8KCR7beRz6YaDaJ2QfK54XcAVazMo+McLAcYAI55ZOwX/veK9BPaVqaZRwT+gxGtATW+YNSb42woAYlmQquB+VUS4Pam4Z0VhsoIftYJPWAYmhaQpAJeiPGfRgP8FAUwIfrXV4YcNY/asBEUzNcK9d0psFGR/GYpeCP7BBVDkiixdQqJHideBPi0NILVCYkSJXQK5XErkFuBhSJn2AueLVFCPkOxS2qrhjynTNVaDZiE527AFjRb9ALrZOkuB32IbrRbkNOje4E5egZhGGwkaLZYCabLvMrBiu3BnKg/AbJQTTTDz2Ik2Bb/iwqCtjvw8gsinfMe58dIgJIdzliHDLtYP0u64+g7cCobd6k/B+U/TLyYrM+wsLbPx9gmJvK4PAeheBl/NeDhbpnoKrqUPNpwrO65zr5R4A2i/mUllgDKg7S4trn2ZL7OtAqYNkPkyd4PaL1PMl/kGNA0VwzlBwwL5v5/+4jQIt/4LnsTlGQ5Eqh8AAAAASUVORK5CYII="
            );

            var linkiobject = {}; // 저장용 객체
            linkiobject.num = e_group.linknumber++;
            linkiobject.x = e_group.linkX;
            linkiobject.y = e_group.linkY;
            linkiobject.link = goto;

            e_group.linkarr.push(linkiobject);

            imgtag.setAttribute("alt", "IU");
            imgtag.setAttribute("width", "24");
            imgtag.setAttribute("height", "24");

            atag.appendChild(imgtag);
            document.body.appendChild(atag);

            let target = document.getElementById("linkdiv");
            target.remove();

        },
        onPrintButtonClick: function () {
            // alert("프린터클릭");
            if (
                window_e.document.getElementById("captureBox").style.display ===
                "none"
            ) {
                window_e.document.getElementById("captureBox").style.display =
                    "block";
                window_e.document.getElementById("penBox").style.display =
                    "none";
                window_e.document.getElementById("textBox").style.display =
                    "none";
                window_e.document.getElementById("figureBox").style.display =
                    "none";
                window_e.document.getElementById("eraserBox").style.display =
                    "none";
                window_e.document.getElementById("imageBox").style.display =
                    "none";
                window_e.document.getElementById("saveBox").style.display =
                    "none";
            } else {
                window_e.document.getElementById("penBox").style.display =
                    "none";
                window_e.document.getElementById("textBox").style.display =
                    "none";
                window_e.document.getElementById("figureBox").style.display =
                    "none";
                window_e.document.getElementById("captureBox").style.display =
                    "none";
                window_e.document.getElementById("eraserBox").style.display =
                    "none";
                window_e.document.getElementById("imageBox").style.display =
                    "none";
                window_e.document.getElementById("saveBox").style.display =
                    "none";
            }
        },
        // capture
        ScreencaptureStart: function () {
            e_group.hideControlPanel();
            document.body.style.overflow = "hidden";
            window_e.setTimeout(function () {
                chrome.runtime.sendMessage(
                    { method: "ShowCapture" },
                    (response) => {
                        console.log(response.farewell);
                    }
                );
            }, 100);
            window_e.setTimeout(function () {
                e_group.showControlPanel();
                document.body.style.overflow = "";
            }, 500);
        },
        FullcaptureStart: function () {
            e_group.hideControlPanel();
            window_e.setTimeout(function () {
                chrome.runtime.sendMessage(
                    { method: "FullcaptureStart" },
                    (response) => {
                        console.log(response.farewell);
                    }
                );
            }, 100);
        },
        updateScreenshot: function (t, n) {
            var a = arguments[2];
            if (a == null) {
                a = 0;
            }
            if (10 >= a) {
                global.runtime.sendMessage(
                    {
                        method: "update_url",
                        url: t,
                    },
                    function (e) {
                        (e && e.success) ||
                            window.setTimeout(
                                Function.prototype.bind.call(
                                    Bnoty.updateScreenshot,
                                    Bnoty,
                                    t,
                                    n,
                                    ++a
                                ),
                                300
                            );
                    }
                );
            }
        },
        // delete link
        deleteLink: function () {
            while (true) {
                if (document.getElementById("linkobject")) {
                    document.getElementById("linkobject").remove();
                } else {
                    break;
                }
            }
        },
    };
    return e_group;
});
