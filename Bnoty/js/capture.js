// /**
//  * Copyright Liang Zhou
//  * All rights reserved.
//  */
!(function () {
    var e =
        "undefined" != typeof chrome
            ? chrome
            : "undefined" != typeof browser
            ? browser
            : void 0,
        image1 = new Image(),
        image2 = new Image(),
        target = document.getElementById("target"),
        canvas = document.createElement("canvas"),
        download = document.getElementById("download"),
        print = document.getElementById("print"),
        crop = document.getElementById("crop"),
        controls = document.getElementById("controls"),
        cropControls = document.getElementById("cropControls"),
        confirmControls = document.getElementById("confirmControls"),
        crop_back = document.getElementById("crop-back"),
        crop_forward = document.getElementById("crop-forward"),
        crop_stop = document.getElementById("crop-stop"),
        confirm_crop = document.getElementById("confirm-crop"),
        cancel_crop = document.getElementById("cancel-crop"),
        instruction = document.getElementById("instruction"),
        boxclose = document.getElementById("boxclose"),
        copyToClipboard = document.getElementById("copyToClipboard"),
        context_2d = target.getContext("2d"),
        y = [],
        I = 0,
        L = null,
        x = null,
        b = !1;
    function B(e, t) {
        0 <= e.className.indexOf(t) || (e.className = e.className + " " + t);
    }
    function k(e, t) {
        e.className = e.className.replace(new RegExp("\\b" + t + "\\b", "g"), "");
    }
    function M() {
        (I = 0),
        (x = L = null),
        (b = !(y = [])),
        (image2 = new Image()),
        k(target, "crop"),
        B(cropControls, "hide"),
        B(confirmControls, "hide"),
        k(controls, "hide"),
        target.removeEventListener("mousedown", D),
        target.removeEventListener("touchstart", D),
        target.removeEventListener("mousemove", H),
        target.removeEventListener("touchmove", H),
        target.removeEventListener("mouseup", T),
        target.removeEventListener("touchend", T);
        var e = image1.naturalWidth,
        t = image1.naturalHeight;
        (target.width = e), (target.height = t), context_2d.drawImage(image1, 0, 0);
    }
    function R() {
        context_2d.clearRect(0, 0, target.width, target.height),
        context_2d.drawImage(canvas, 0, 0);
    }
    function X() {
        (canvas.width = target.width),
        (canvas.height = target.height),
        canvas.getContext("2d").drawImage(target, 0, 0);
    }
    function Y(e, t) {
        var n = target.getBoundingClientRect();
        return {
        x: Math.round(e) - n.left * (target.width / n.width),
        y: Math.round(t) - n.top * (target.height / n.height),
        };
    }
    function C() {
        B(target, "crop"),
        k(cropControls, "hide"),
        B(controls, "hide"),
        (I = 0),
        (y = []).push(target.toDataURL()),
        (image2.src = image1.src),
        X(),
        N(),
        target.addEventListener("mousedown", D),
        target.addEventListener("touchstart", D),
        target.addEventListener("mousemove", H),
        target.addEventListener("touchmove", H),
        target.addEventListener("mouseup", T),
        target.addEventListener("touchend", T),
        j();
    }
    function D(e) {
        e.preventDefault(),
        B(confirmControls, "hide"),
        R(),
        (L = Y(
            void 0 === e.clientX ? e.touches[0].clientX : e.clientX,
            void 0 === e.clientY ? e.touches[0].clientY : e.clientY
        )),
        (b = !0),
        N();
    }
    function N() {
        context_2d.save(),
        (context_2d.globalAlpha = 0.5),
        (context_2d.fillStyle = "black"),
        context_2d.fillRect(0, 0, target.width, target.height),
        context_2d.restore();
    }
    function H(e) {
        e.preventDefault();
        var t = Y(
        void 0 === e.clientX ? e.touches[0].clientX : e.clientX,
        void 0 === e.clientY ? e.touches[0].clientY : e.clientY
        );
        if (b) {
        var n = Math.min(L.x, t.x),
            i = Math.max(L.x, t.x),
            c = Math.min(L.y, t.y),
            d = Math.max(L.y, t.y);
        R(),
            N(),
            context_2d.save(),
            context_2d.beginPath(),
            context_2d.rect(n, c, i - n, d - c),
            context_2d.clip(),
            context_2d.drawImage(image2, 0, 0),
            context_2d.restore();
        }
    }
    function T(e) {
        e.preventDefault();
        var t = void 0 === e.clientX ? e.changedTouches[0].clientX : e.clientX,
        n = void 0 === e.clientY ? e.changedTouches[0].clientY : e.clientY;
        (x = Y(t, n)),
        (b = !1),
        (confirmControls.style.top = n + "px"),
        (confirmControls.style.left = t + "px"),
        k(confirmControls, "hide");
    }
    function U() {
        var e = Math.min(L.x, x.x),
        t = Math.max(L.x, x.x),
        n = Math.min(L.y, x.y),
        i = Math.max(L.y, x.y);
        B(confirmControls, "hide");
        var c = new Image();
        (c.src = target.toDataURL()),
        (c.onload = function () {
            context_2d.clearRect(0, 0, target.width, target.height),
            (target.width = t - e),
            (target.height = i - n),
            context_2d.drawImage(c, e, n, t - e, i - n, 0, 0, t - e, i - n),
            X(),
            y.push(target.toDataURL()),
            (I = y.length - 1),
            (image2.src = y[I]),
            j();
        });
    }
    function W() {
        B(confirmControls, "hide"), R();
    }
    function j() {
        y.length && 0 !== I ? k(crop_back, "disabled") : B(crop_back, "disabled"),
        y.length && I !== y.length - 1
            ? k(crop_forward, "disabled")
            : B(crop_forward, "disabled");
    }
    function A() {
        if (y.length && 0 !== I) {
        var e = y[--I],
            t = new Image();
        (t.src = e),
            (image2.src = e),
            (t.onload = function () {
            context_2d.clearRect(0, 0, target.width, target.height),
                (target.width = t.naturalWidth),
                (target.height = t.naturalHeight),
                context_2d.drawImage(t, 0, 0),
                X();
            }),
            j();
        }
    }
    function O() {
        if (y.length && I !== y.length - 1) {
        var e = y[++I],
            t = new Image();
        (t.src = e),
            (image2.src = e),
            (t.onload = function () {
            context_2d.clearRect(0, 0, target.width, target.height),
                (target.width = t.naturalWidth),
                (target.height = t.naturalHeight),
                context_2d.drawImage(t, 0, 0),
                X();
            }),
            j();
        }
    }
    function P() {
        image1.src === y[I] ? M() : (image1.src = y[I]);
    }
    image1.addEventListener("load", M, !1),
        e.runtime.onMessage.addListener(function (e, t, n) {
        "update_url" === e.method &&
            ((image1.src = e.url),
            n({
            success: !0,
            }));
        }),
        download.addEventListener("click", function () {
        var e = document.createElement("a");
        (e.download = "screenshot.jpg"),
            (e.href = image1.src),
            document.body.appendChild(e),
            e.click(),
            document.body.removeChild(e);
        }),
        print.addEventListener("click", function () {
        window.print();
        }),
        copyToClipboard.addEventListener("click", function () {
            var imgdata = document.getElementById("target").toDataURL();
            console.log(imgdata);
            navigator.clipboard.writeText(imgdata);
            alert("이미지 URL을 복사했습니다! 이미지파일은 화면에서 복사하세요!");
        }),
        boxclose.addEventListener("click", function () {
        k(instruction, "visible");
        }),
        crop.addEventListener("click", C),
        confirm_crop.addEventListener("click", U),
        cancel_crop.addEventListener("click", W),
        crop_back.addEventListener("click", A),
        crop_forward.addEventListener("click", O),
        crop_stop.addEventListener("click", P);
})();
