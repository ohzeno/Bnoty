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
  e = {
    canvas: null,
    ctx: null,
    initialized: !1,
    INITIAL_COLOR: "black",
    CANVAS_SIZE: 700,
    painting: false,
    resizeTimeoutID: null,
    paragraph: null,
    strokeStyle: "blue",
    lineWidth: 20,
    startPainting: function (event) {
      if (event.which === 1) {
        //좌클릭 일 때만 그리기
        // console.log("start들어옴");
        this.painting = true;
      }
    },
    stopPainting: function () {
      // console.log("stop들어옴");
      this.painting = false;
    },
    onMouseMove: function (event) {
      // clientX는 화면 전체에서 마우스 좌표, offsetX는 캔버스 내 좌표
      const x = event.offsetX;
      const y = event.offsetY;
      // console.log("좌표", x, y);
      if (!this.painting) {
        // console.log("begin들어옴");
        this.ctx.globalCompositeOperation = "destination-atop"; // 이 줄 추가로 펜선 안겹침. 즉 투명하게 그릴 수 있음. 기존엔 투명도 설정해도 계속 겹쳐서 불투명하게 그려짐. + 부작용> 두번째 그릴때 이전에 그린거 초기화됨. restore, buffer캔버스 사용해야 할 듯...
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      } else {
        //그냥 else하면 filling 상태일 때 클릭하고 드래그하면 선 그려짐
        // console.log("stroke들어옴");
        // console.log(this.ctx.strokeStyle);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
      }
    },
    createCanvas: function () {
      console.log("inject.js e 내부 createCanvas");
      this.canvas = window_e.document.createElement("Canvas");
      this.ctx = this.canvas.getContext("2d");
      this.canvas.setAttribute("id", "bnoty");
      window_e.document.body.appendChild(this.canvas);
      window_e.addEventListener("resize", this.resizeBinded);
      window_e.addEventListener("scroll", this.resizeBinded);
      // ctx.fillStyle = "skyblue";
      // ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      this.setCtxProp();
      this.initCanvas();
    },
    initCanvas: function (t) {
      console.log("inject.js e 내부 initCanvas");
      if (t) {
        this.handleResize(!0);
        // this.ctx.drawImage(t, 0, 0);
        // this.storeCanvas(!0);
      } else {
        this.handleResize();
      }
      // this.storeHistory();
    },
    addMouseEventListener: function () {
      console.log("inject.js e 내부 addMouseEventListener");
      var startPainting = Function.prototype.bind.call(
        this.startPainting,
        this
      );
      var onMouseMove = Function.prototype.bind.call(this.onMouseMove, this);
      var stopPainting = Function.prototype.bind.call(this.stopPainting, this);
      this.canvas.addEventListener("mousedown", startPainting);
      this.canvas.addEventListener("touchstart", startPainting);
      this.canvas.addEventListener("mousemove", onMouseMove);
      this.canvas.addEventListener("touchmove", onMouseMove);
      this.canvas.addEventListener("mouseup", stopPainting);
      this.canvas.addEventListener("touchend", stopPainting);
      this.canvas.addEventListener("mouseleave", stopPainting);
      // window_e.document.addEventListener("keydown", this.keydownBinded);
      // window_e.document.addEventListener("keypress", this.keypressBinded);
    },
    setCtxProp: function () {
      console.log("inject.js e 내부 setCtxProp");
      this.ctx.strokeStyle = this.strokeStyle; // 선 색
      this.ctx.lineWidth = this.lineWidth; // 선 굵기
      this.ctx.globalAlpha = 0.5;
    },
    handleResize: function (t) {
      // 사이즈조절. 삼항, 콤마> if문으로 어느정도 변경
      // store, restore는 아직 없어서 주석해둠.
      // paragraph는 아직 해석못함.
      // console.log("resize");
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.paragraph) {
          // this.paragraph는 무슨 역할인지 아직 모름.
          this.paragraph.clearIntervals();
          this.paragraph = null;
        }
        // storeCanvas(!0);
      } else {
        // storeCanvas(t);
      }
      this.canvas.width = s; // 여기서 ctx 속성 처음 초기화됨.
      this.canvas.style.width = s + "px";
      this.canvas.height = a; // 여기서 ctx 속성 두번째 초기화됨. 없애면 마우스랑 그려지는 위치 어긋남. 그러니 ctx 속성 설정해주는 함수 따로 만듦.
      this.setCtxProp();
      this.canvas.style.height = a + "px";
      // if (!e) {
      //   restoreCanvas();
      // }
      // updatePaintStyle();
      this.ctx.lineWidth = n;
    },
    render: function (t) {
      console.log("inject.js e 내부 render");
      this.config = t || {};
      this.createCanvas();
      this.addMouseEventListener();
    },
    initConfig: function () {
      console.log("inject.js e 내부 initConfig");
      global.runtime.sendMessage(
        {
          method: "get_data",
        },
        this.renderBinded // init에서 바인딩된 render 여기서 실행
      );
    },
    init: function () {
      console.log("inject.js e 내부 init");
      // 여기 this는 401번 줄 e임.
      // this.history = new t();
      // this.CSSAnimationManager = getCSSAnimationManager();
      // this.setColorBinded = Function.prototype.bind.call(this.setColor, this);
      this.renderBinded = Function.prototype.bind.call(this.render, this);
      // this.handlePostMessageResponseBinded = Function.prototype.bind.call(
      //   this.handlePostMessageResponse,
      //   this
      // ); // 이건 this에 handlePostMessageResponseBinded 속성을 새로 선언하면서 그 속성에 this.handlePostMessageResponse를 할당하는데, handlePostMessageResponse 내부의 this에 call의 두번째 인자가 할당됨. 즉 앞으로 this.handlePostMessageResponseBinded(xxx)를 사용하면 handlePostMessageResponse(xxx)랑 같음. call 두번째 인자도 this 됐으니까. this.handlePostMessageResponseBinded가 어디서 호출된건 안보이는데, e를 리턴해주니까 그쪽에서 쓰겠지 뭐...
      // this.keydownBinded = Function.prototype.bind.call(
      //   this.handleKeyDown,
      //   this
      // );
      // this.keypressBinded = Function.prototype.bind.call(
      //   this.handleKeyPress,
      //   this
      // );
      // this.handleHotKeysDownBinded = Function.prototype.bind.call(
      //   this.handleHotKeysDown,
      //   this
      // );
      // this.persistLocalStorageBinded = Function.prototype.bind.call(
      //   this.persistLocalStorage,
      //   this
      // );
      this.resizeBinded = Function.prototype.bind.call(function () {
        this.resizeTimeoutID &&
          (this.resizeTimeoutID = window_e.clearTimeout(this.resizeTimeoutID));
        this.resizeTimeoutID = window_e.setTimeout(
          Function.prototype.bind.call(this.handleResize, this),
          200
        );
      }, this);
      this.initConfig(); // get data 샌드메시지 하는 부분임
      this.initialized = !0;
      "undefined" != typeof unsafeWindow &&
        null !== unsafeWindow &&
        (unsafeWindow.bnoty_INIT = !0);
    },
  };
  return e;
});

// 윈도우 사이즈 변할때마다 작동
// window.onresize = function (event) {
//   handleResize();
// };

// createCanvas();
// handleResize(); // 초기 캔버스 사이즈조절
