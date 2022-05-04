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
  // t는 window, e는 function(window_e)
  if ("undefined" != typeof unsafeWindow && null !== unsafeWindow) {
    if (unsafeWindow.CTRL_HIDDEN) {
      // t.bnoty.showControlPanel();
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
      // t.bnoty.showControlPanel();
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
    INITIAL_COLOR: "red",
    painting: false,
    // controlPanelHidden: !1,
    config: {},
    drawOptions: [
      {
        type: "pen",
        title: "Pencil - draw a custom line",
      },
      {
        type: "eyedropper",
        title:
          "Color picker - pick a color from the web page or your drawings and use it for drawing",
      },
      {
        type: "text",
        font: "Arial",
        minSize: 15,
        maxSize: 50,
        title: "Text - insert text",
      },
      {
        type: "line",
        title: "Line - draw a straight line",
      },
      {
        type: "quadratic_curve",
        title: "Quadratic curve - draw a quadratic curve",
        iteration: 0,
        initLoc: null,
        lastLoc: null,
      },
      {
        type: "bezier_curve",
        title: "Bezier curve - draw a bezier curve",
        iteration: 0,
        initLoc: null,
        firstPoint: null,
        lastPoint: null,
      },
      {
        type: "polygon",
        title: "Polygon - draw a polygon",
        initLoc: null,
        lastLoc: null,
      },
      {
        type: "circle",
        title: "Ellipse - draw an ellipse or a circle",
      },
      {
        type: "rectangle",
        title: "Rectangle - draw a rectangle or a square",
      },
      {
        type: "cursor",
        title: "Cursor - interact with the web page",
      },
      {
        type: "eraser",
        title: "Eraser - erase part of your drawings",
        width: 30,
        height: 30,
      },
      {
        type: "fill",
        title: "Paint Bucket - fill an area",
      },
    ],
    selectedAlphaOption: null,
    resizeTimeoutID: null,
    paragraph: null,
    panel: null,
    strokeStyle: "rgb(0, 0, 0)", // 선 색상
    lineWidth: 3, // 선 두께
    globalAlpha: 1, //투명도
    activate: "pen", // 지금 활성화된 도구 기본은 펜!
    saveImage: null, // 지금 까지 그린 이미지를 저장
    saveLasso: null, // 올가미로 선택한 영역을 이미지로 저장
    histories: null, // 여기에 이제 그 작업한거 저장함
    MAX_ITEMS: null, // 최대 저장 아이템
    currentIndex: null, // 지금 인덱스 위치
    array: [], // 데이터 저장 공간
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
    hasInput: false, // 텍스트 입력 여부
    size: "20px", // 텍스트 사이즈
    font: "sans-serif", // 텍스트 폰트
    boldtext: "", // 볼드
    italictext: "", // 기울이기
    textactive: false, // 텍스트 입력중인지 체크

    createCanvas: function () {
      console.log("inject.js e 내부 createCanvas");
      this.canvas = window_e.document.createElement("Canvas");
      this.ctx = this.canvas.getContext("2d");
      this.canvas.setAttribute("id", "bnoty");
      window_e.document.body.appendChild(this.canvas);
      window_e.addEventListener("resize", this.resizeBinded);
      window_e.addEventListener("scroll", this.resizeBinded);
      this.setCtxProp();
      this.initCanvas();
    },
    initCanvas: function (t) {
      t
        ? (this.handleResize(!0), this.ctx.drawImage(t, 0, 0))
        : this.handleResize();
    },
    setCtxProp: function () {
      console.log("inject.js e 내부 setCtxProp");
      this.ctx.strokeStyle = this.strokeStyle; // 선 색
      this.ctx.fillStyle = this.strokeStyle; // 채우기 색
      this.ctx.globalAlpha = this.globalAlpha; // 투명도
      this.ctx.lineWidth = this.lineWidth; // 선 굵기
    },
    handleResize: function (t) {
      var e = !1,
        i = window_e.pageYOffset || document.documentElement.scrollTop,
        n =
          (window_e.innerHeight || document.documentElement.clientHeight,
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
          this.canvas.style.top = Math.max(0, 5e3 * Math.floor(i / 5e3)) + "px";
          e = !0;
        }
      }
      if (e) {
        this.ctx.clearRect(0, 0, this.this.canvas.width, this.canvas.height);
        if (this.paragraph) {
          // this.paragraph는 무슨 역할인지 아직 모름.
          this.paragraph.clearIntervals();
          this.paragraph = null;
        }
        // storeCanvas(!0);
      } else {
        // storeCanvas(t);
      }
      this.canvas.width = s;
      this.canvas.height = a;
      e;
      // this.updatePaintStyle();
      this.ctx.lineWidth = n;
    },
    createControlPanel: function () {
      (this.panel = window_e.document.createElement("div")),
        (this.backBtn = window_e.document.createElement("div")),
        (this.nextBtn = window_e.document.createElement("div"));
      var tools = window_e.document.createElement("div"),
        color = window_e.document.createElement("div"),
        controls = window_e.document.createElement("div"),
        transparency = window_e.document.createElement("div"),
        size_control = window_e.document.createElement("div");
      this.panel.setAttribute("id", "bnoty_controls"),
        tools.setAttribute("class", "bnoty_controls_draw"),
        color.setAttribute("class", "bnoty_controls_color"),
        controls.setAttribute("class", "bnoty_controls_control"),
        transparency.setAttribute(
          "class",
          "bnoty_controls_range alpha_control"
        ),
        size_control.setAttribute("class", "bnoty_controls_range size_control"),
        window_e.document.body.appendChild(this.panel),
        this.panel.appendChild(tools),
        this.panel.appendChild(color),
        this.panel.appendChild(transparency),
        this.panel.appendChild(size_control),
        this.panel.appendChild(controls);
      for (var o = 0; o < this.drawOptions.length; o++) {
        var a = this.drawOptions[o],
          r = window_e.document.createElement("div");
        r.setAttribute("class", "bnoty_controls_draw_option"),
          r.setAttribute("title", a.title),
          this.addClass(r, a.type),
          // r.addEventListener(
          //   "click",
          //   Function.prototype.bind.call(this.onControlPanelClick, this, o)
          // ),
          tools.appendChild(r);
        if (
          !(
            ((null !== this.config.tool && void 0 !== this.config.tool) ||
              0 !== o) &&
            o !== this.config.tool
          )
        ) {
          // this.triggerClick(r);
        }
      }
      (this.colorPicker = window_e.document.createElement("input")),
        this.colorPicker.setAttribute("type", "color"),
        (this.colorPicker.value = this.config.color || "#000000"),
        this.colorPicker.setAttribute("title", "Select a color"),
        // this.colorPicker.addEventListener(
        //   "change",
        //   Function.prototype.bind.call(this.onColorPanelClick, this),
        //   !1
        // ),
        color.appendChild(this.colorPicker),
        (this.alphaPicker = window_e.document.createElement("input")),
        this.alphaPicker.setAttribute("type", "range"),
        this.alphaPicker.setAttribute("min", "0"),
        this.alphaPicker.setAttribute("max", "1"),
        this.alphaPicker.setAttribute("step", "0.01"),
        (this.alphaPicker.value =
          null !== this.config.alpha && void 0 !== this.config.alpha
            ? this.config.alpha
            : 1),
        this.alphaPicker.setAttribute("title", "Select transparency"),
        // this.alphaPicker.addEventListener(
        //   "change",
        //   Function.prototype.bind.call(this.onAlphaChange, this),
        //   !1
        // ),
        // this.alphaPicker.addEventListener(
        //   "input",
        //   Function.prototype.bind.call(this.onAlphaUpdate, this),
        //   !1
        // ),
        (this.alphaPickerPreview = window_e.document.createElement("p")),
        transparency.appendChild(this.alphaPicker),
        transparency.appendChild(this.alphaPickerPreview);
      var h = window_e.document.createElement("input");
      h.setAttribute("type", "range"),
        h.setAttribute("min", "1"),
        h.setAttribute("max", "20"),
        h.setAttribute("step", "1"),
        (h.value = this.config.thickness || 1),
        h.setAttribute("title", "Select line width"),
        // h.addEventListener(
        //   "change",
        //   Function.prototype.bind.call(this.onLineChange, this),
        //   !1
        // ),
        // h.addEventListener(
        //   "input",
        //   Function.prototype.bind.call(this.onLineUpdate, this),
        //   !1
        // ),
        (this.linePickerPreview = window_e.document.createElement("p")),
        size_control.appendChild(h),
        size_control.appendChild(this.linePickerPreview),
        // (this.selectedColorOption = this.hexToRgb(this.colorPicker.value)),
        (this.selectedAlphaOption = this.alphaPicker.value),
        (this.ctx.lineWidth = h.value),
        (this.alphaPickerPreview.innerHTML =
          Math.round(100 * this.selectedAlphaOption) + "%"),
        (this.linePickerPreview.innerHTML =
          Math.round((this.ctx.lineWidth / 20) * 100) + "%");
      // this.updatePaintStyle();
      var c = window_e.document.createElement("div"),
        l = window_e.document.createElement("div"),
        d = window_e.document.createElement("div"),
        u = window_e.document.createElement("div"),
        p = window_e.document.createElement("div");
      c.setAttribute("class", "bnoty_controls_control_option prtBtn"),
        c.setAttribute(
          "title",
          "Take a screenshot of the current web page with your drawings"
        ),
        l.setAttribute("class", "bnoty_controls_control_option exitBtn"),
        l.setAttribute("title", "Quit"),
        this.backBtn.setAttribute(
          "class",
          "bnoty_controls_control_option backBtn"
        ),
        this.backBtn.setAttribute("title", "Step backward"),
        this.nextBtn.setAttribute(
          "class",
          "bnoty_controls_control_option nextBtn"
        ),
        this.nextBtn.setAttribute("title", "Step forward"),
        d.setAttribute("class", "bnoty_controls_control_option eraseAllBtn"),
        d.setAttribute("title", "Erase all"),
        u.setAttribute("class", "bnoty_controls_control_option hideCtrlBtn"),
        u.setAttribute(
          "title",
          "Close control panel (Click the extension icon to re-open)"
        ),
        p.setAttribute("class", "settingsBtn"),
        p.setAttribute("title", "Settings"),
        // c.addEventListener(
        //   "click",
        //   Function.prototype.bind.call(this.onPrintButtonClick, this)
        // ),
        // l.addEventListener(
        //   "click",
        //   Function.prototype.bind.call(this.exit, this)
        // ),
        // this.backBtn.addEventListener(
        //   "click",
        //   Function.prototype.bind.call(this.handleBackButtonClick, this)
        // ),
        // this.nextBtn.addEventListener(
        //   "click",
        //   Function.prototype.bind.call(this.handleForwardButtonClick, this)
        // ),
        // d.addEventListener(
        //   "click",
        //   Function.prototype.bind.call(this.eraseAll, this)
        // ),
        // u.addEventListener(
        //   "click",
        //   Function.prototype.bind.call(this.hideControlPanel, this)
        // ),
        // p.addEventListener("click", function () {
        //   global.runtime.sendMessage({
        //     method: "open_options",
        //   });
        // }),
        controls.appendChild(this.backBtn),
        controls.appendChild(this.nextBtn),
        controls.appendChild(d),
        controls.appendChild(c),
        controls.appendChild(u),
        controls.appendChild(l),
        controls.appendChild(p),
        // this.checkHistoryButtonStatus(),
        this.CSSAnimationManager.supported
          ? this.panel.addEventListener(
              this.CSSAnimationManager.end,
              Function.prototype.bind.call(this.handlePanelAppearing, this),
              !1
            )
          : (this.panel.style.opacity = 1);
    },
    addClass: function (t, e) {
      0 <= t.className.indexOf(e) || (t.className = t.className + " " + e);
    },
    removeClass: function (t, e) {
      t.className = t.className.replace(new RegExp("\\b" + e + "\\b", "g"), "");
    },
    render: function (t) {
      (this.config = t || {}),
        this.createCanvas(),
        // this.setLineProperty(),
        this.createControlPanel();
      // this.initDragging(),
      // this.addMouseEventListener(),
      // this.addKeyEventListeners();
    },
    initConfig: function () {
      global.runtime.sendMessage(
        {
          method: "get_data",
        },
        this.renderBinded
      );
    },
    init: function () {
      // 여기 this는 401번 줄 e임.
      // (this.history = new t()),
      (this.CSSAnimationManager = getCSSAnimationManager()),
        // (this.setColorBinded = Function.prototype.bind.call(
        //   this.setColor,
        //   this
        // )),
        (this.renderBinded = Function.prototype.bind.call(this.render, this)),
        // (this.handlePostMessageResponseBinded = Function.prototype.bind.call(
        //   this.handlePostMessageResponse,
        //   this
        // )), // 이건 this에 handlePostMessageResponseBinded 속성을 새로 선언하면서 그 속성에 this.handlePostMessageResponse를 할당하는데, handlePostMessageResponse 내부의 this에 call의 두번째 인자가 할당됨. 즉 앞으로 this.handlePostMessageResponseBinded(xxx)를 사용하면 handlePostMessageResponse(xxx)랑 같음. call 두번째 인자도 this 됐으니까. this.handlePostMessageResponseBinded가 어디서 호출된건 안보이는데, e를 리턴해주니까 그쪽에서 쓰겠지 뭐...
        // (this.keydownBinded = Function.prototype.bind.call(
        //   this.handleKeyDown,
        //   this
        // )),
        // (this.keypressBinded = Function.prototype.bind.call(
        //   this.handleKeyPress,
        //   this
        // )),
        // (this.handleHotKeysDownBinded = Function.prototype.bind.call(
        //   this.handleHotKeysDown,
        //   this
        // )),
        // (this.persistLocalStorageBinded = Function.prototype.bind.call(
        //   this.persistLocalStorage,
        //   this
        // )),
        (this.resizeBinded = Function.prototype.bind.call(function () {
          this.resizeTimeoutID &&
            (this.resizeTimeoutID = window_e.clearTimeout(
              this.resizeTimeoutID
            )),
            (this.resizeTimeoutID = window_e.setTimeout(
              Function.prototype.bind.call(this.handleResize, this),
              200
            ));
        }, this)),
        this.initConfig(),
        (this.initialized = !0),
        "undefined" != typeof unsafeWindow &&
          null !== unsafeWindow &&
          (unsafeWindow.bnoty_INIT = !0);
    },
  };
  return e_group;
});
