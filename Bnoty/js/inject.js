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
      {
        type: "injection_link",
        title: "LINK INJECTION~~~~~~~ ",
      }
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

    startPainting: function (event) {
      console.log("여긴 왔는데");
      // 마우스 클릭버튼 누름
      if (event.which === 1) {
        console.log("여긴 왔는데");
        //좌클릭 일 때만 그리기
        if (this.painting) {
          // 이부분은 곡선그리는 부분떄문에 사용
          this.painting = false;
          return;
        }
        // console.log("start들어옴");
        this.painting = true;
        this.sX = event.offsetX;
        this.sY = event.offsetY;
        if (this.activate == "fill") {
          console.log("여긴 왔는데");
          this.handleFill(event.clientX, event.clientY);
        }
        if (this.activate == "lasso" && this.saveLasso == null) {
          this.lassosX = event.offsetX;
          this.lassosY = event.offsetY;
        }
        // 링크삽입
        if ( this.activate == "injection_link"){
          // alert("링크삽입");
          this.injectionLink( event.offsetX, event.offsetY);

        }
        if ( this.activate == "injection_end"){
          console.log("링크삽입 종료");
        }


      }
    },
    stopPainting: function (event) {
      // 마우스 클릭 버튼 떔
      // console.log("stop들어옴");
      if (this.activate == "curve") {
        // 커브면 끝좌표 초기화 or 갱신
        if (this.mX == null && this.mY == null) {
          this.mX = event.offsetX;
          this.mY = event.offsetY;
          return; // 여기서는 끝좌표만 갱신하고 리턴해줘야 다음작업 가능
        }
        this.mX = null;
        this.mY = null;
      } else if (this.activate == "lasso") {
        if (this.saveLasso == null) {
          this.saveLasso = this.ctx.getImageData(
            this.lassosX,
            this.lassosY,
            this.lassoeX - this.lassosX,
            this.lassoeY - this.lassosY
          );
        } else {
          this.saveLasso = null;
        }
      }
      this.painting = false;
      if (this.activate != "text" && this.activate != "lasso") {
        this.saveImage = this.ctx.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        ); // 지금까지 그린 정보를 저장
        this.addHistory();
      }
    },
    leaveStopPainting: function () {
      // 마우스 범위 밖으로 나감
      if (this.painting) {
        this.painting = false;
        if (this.activate != "text") {
          this.saveImage = this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
          ); // 지금까지 그린 정보를 저장
          this.addHistory();
        }
      }
      if (this.activate == "curve") {
        this.mX = null;
        this.mY = null;
      }
    },
    onMouseMove: function (event) {
      // 마우스 움직일때 실행
      // clientX는 화면 전체에서 마우스 좌표, offsetX는 캔버스 내 좌표
      this.eX = event.offsetX;
      this.eY = event.offsetY;

      // console.log("좌표", x, y);
      if (!this.painting) {
        // console.log("begin들어옴");
        // this.ctx.globalCompositeOperation = "destination-atop"; // 이 줄 추가로 펜선 안겹침. 즉 투명하게 그릴 수 있음. 기존엔 투명도 설정해도 계속 겹쳐서 불투명하게 그려짐. + 부작용> 두번째 그릴때 이전에 그린거 초기화됨. restore, buffer캔버스 사용해야 할 듯...
        this.ctx.beginPath();
        this.ctx.moveTo(this.eX, this.eY);
      } else {
        //그냥 else하면 filling 상태일 때 클릭하고 드래그하면 선 그려짐
        // console.log("stroke들어옴");
        if (this.activate == "eraser") {
          // 부분 지우기
          // this.ctx.strokeRect(this.eX-this.ctx.lineWidth*1.49, this.eY-this.ctx.lineWidth*1.49, this.ctx.lineWidth*2.9, this.ctx.lineWidth*2.9);
          this.ctx.save();
          this.lineWidth = 4;
          this.setCtxProp();
          this.ctx.clearRect(
            this.eX - this.ctx.lineWidth * 1.5,
            this.eY - this.ctx.lineWidth * 1.5,
            this.ctx.lineWidth * 3,
            this.ctx.lineWidth * 3
          ); // 해당 범위만큼 지운다.
          this.ctx.restore();
          this.lineWidth = this.ctx.lineWidth;
          return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.currentIndex != 0) {
          // 저장된 정보가 있으면 불러옴 이전에 그렸던 작업을 다시 불러옴
          this.ctx.putImageData(this.array[this.currentIndex], 0, 0);
        }

        if (this.activate == "pen") {
          // 펜그리는 부분
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.stroke();
        } else if (this.activate == "highlighter") {
          this.ctx.globalAlpha = 0.5; // 형광펜 그리는 동안 알파 변경
          if (this.ctx.lineWidth < 15) {
            // 너무 얇으면 최소굵기 지정
            this.ctx.lineWidth = 15;
          }
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.stroke();
          this.ctx.globalAlpha = this.globalAlpha; // 알파 초기화
          this.ctx.lineWidth = this.lineWidth; // 굵기 초기화
        } else if (this.activate == "rectangle") {
          // 네모 그리는 부분 시작 좌표에서 해당 너비 높이만큼 그린다
          this.ctx.strokeRect(
            this.sX,
            this.sY,
            this.eX - this.sX,
            this.eY - this.sY
          );
        } else if (this.activate == "triangle") {
          // 세모
          this.ctx.beginPath();
          this.ctx.moveTo((this.sX + this.eX) / 2, this.sY); // 시작점(x,y)
          this.ctx.lineTo(this.sX, this.eY);
          this.ctx.moveTo((this.sX + this.eX) / 2, this.sY);
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.moveTo(this.sX, this.eY);
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.lineCap = "round"; // 끝을 둥글게
          this.ctx.stroke();
          this.ctx.lineCap = "butt"; // 끝을 원래로
        } else if (this.activate == "circle") {
          // 동그라미
          var s = ((this.eX - this.sX) / 2) * 0.5522848,
            o = ((this.eY - this.sY) / 2) * 0.5522848,
            a = this.sX + this.eX - this.sX,
            r = this.sY + this.eY - this.sY,
            h = this.sX + (this.eX - this.sX) / 2,
            c = this.sY + (this.eY - this.sY) / 2;
          this.ctx.beginPath(); // 새로운 경로 시작함을 알림 약간 기존 저장된 시작점 그런거 초기화느낌?
          this.ctx.moveTo(this.sX, c); // 시작점(x,y)
          this.ctx.bezierCurveTo(this.sX, c - o, h - s, this.sY, h, this.sY); //곡선 그리는 부분 첫번째 제어점 (x,y), 두번째 제어점(x,y), 끝점x,y
          this.ctx.bezierCurveTo(h + s, this.sY, a, c - o, a, c);
          this.ctx.bezierCurveTo(a, c + o, h + s, r, h, r);
          this.ctx.bezierCurveTo(h - s, r, this.sX, c + o, this.sX, c);
          this.ctx.stroke(); // 이걸 해줌으로써 위에서 작성한 것들 화면에 뿌려줌?
        } else if (this.activate == "line") {
          // 직선
          this.ctx.beginPath();
          this.ctx.moveTo(this.sX, this.sY);
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.stroke();
        } else if (this.activate == "curve") {
          // 그 여기 들어온 수를 판단해서 점 찍고 하는식으로 해야할거 같은데?
          this.ctx.beginPath();
          if (this.mX == null && this.mY == null) {
            // 끝 좌표가 없으면 끝좌표를 저장하고 직선 그림
            this.ctx.moveTo(this.sX, this.sY);
            this.ctx.lineTo(this.eX, this.eY);
          } else {
            // 끝 좌표가 존재하면 마우스 이동좌표에 따른 곡선 그림
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
          var headlen = this.ctx.lineWidth * 6; // 화살표 선 길이
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
          this.ctx.lineCap = "round"; // 끝을 둥글게
          this.ctx.stroke();
          this.ctx.lineCap = "butt"; // 끝을 원래로
        } else if (this.activate == "lasso") {
          // 올가미
          if (this.saveLasso != null) {
            this.ctx.clearRect(
              this.lassosX,
              this.lassosY,
              this.lassoeX - this.lassosX,
              this.lassoeY - this.lassosY
            );
            this.ctx.putImageData(this.saveLasso, this.eX, this.eY);
            return;
          }
          this.lassoeX = event.offsetX;
          this.lassoeY = event.offsetY;
          this.ctx.save();
          this.ctx.strokeStyle = "rgba(46,112,245)";
          this.ctx.lineWidth = 1;
          // 네모 그리는 부분 시작 좌표에서 해당 너비 높이만큼 그린다
          this.ctx.setLineDash([5]); // 간격이 20인 점선 설정
          this.ctx.strokeRect(
            this.sX,
            this.sY,
            this.eX - this.sX,
            this.eY - this.sY
          );
          this.ctx.setLineDash([]); // 실선으로 변경
          this.ctx.restore();
        }
      }
    },
    onMouseClick: function (event) {
      if (this.activate == "text") {
        if (this.textactive) {
          this.handleMouseClick();
        }
        if (!this.hasInput) {
          console.log("실행됨");
          this.addInput(event.offsetX, event.offsetY);
        }
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
      var leaveStopPainting = Function.prototype.bind.call(
        this.leaveStopPainting,
        this
      );
      var onMouseClick = Function.prototype.bind.call(this.onMouseClick, this);
      this.canvas.addEventListener("mousedown", startPainting);
      this.canvas.addEventListener("touchstart", startPainting);
      this.canvas.addEventListener("mousemove", onMouseMove);
      this.canvas.addEventListener("touchmove", onMouseMove);
      this.canvas.addEventListener("mouseup", stopPainting);
      this.canvas.addEventListener("touchend", stopPainting);
      this.canvas.addEventListener("mouseleave", leaveStopPainting);
      // this.canvas.addEventListener("click", onMouseClick);
      // window_e.document.addEventListener("keydown", this.keydownBinded);
      // window_e.document.addEventListener("keypress", this.keypressBinded);
    },
    setCtxProp: function () {
      console.log("inject.js e 내부 setCtxProp");
      this.ctx.strokeStyle = this.strokeStyle; // 선 색
      this.ctx.fillStyle = this.strokeStyle; // 채우기 색
      this.ctx.globalAlpha = this.globalAlpha; // 투명도
      this.ctx.lineWidth = this.lineWidth; // 선 굵기
    },
    handlePanelAppearing: function (t) {
      console.log("inject.js e 내부 handlePanelAppearing");
      t.target.style.opacity = 1;
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
        r.setAttribute("class", "bnoty_controls_draw_option");
        r.setAttribute("title", a.title);
        this.addClass(r, a.type);
        // r.addEventListener(
        //   "click",
        //   Function.prototype.bind.call(this.onControlPanelClick, this, o)
        // ),
        if (a.type == "fill") {
          r.addEventListener("click", function () {
            // e_group.activate = "fill";
            e_group.activate = "injection_link";
            // e_group.canvas.style.cursor = "pointer";
          });
        }

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
    matchOutlineColor: function (a, b, c, d) {
      console.log("inject.js e 내부 matchOutlineColor");
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
          // this.storeCanvas();
          // this.storeHistory();
        }
      }
    },
    floodFill: function (x, y, option, i, image, a, s) {
      console.log("inject.js e 내부 floodFill");
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
            (data[(c = (h = y2) * width_4 + 4 * (r = x2))] = option[0]),
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
    render: function (t) {
      this.config = t || {};
      this.createCanvas();
      // this.setLineProperty();
      this.createControlPanel();
      this.addMouseEventListener();
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
    // 링크 삽입함수
    injectionLink: function (x, y) {
      console.log("injection link START~~~");
      console.log(x + " , " + y);
      var x = document.createElement("IMG");
      x.setAttribute("src", "https://1.bp.blogspot.com/-x5UnU81HjR8/YPbIDsXjVvI/AAAAAAAJXNM/eZgJX2vCxyc_lAW8DioFRMpu8D5uxaEWwCLcBGAsYHQ/s1600/8.png");
      x.setAttribute("width", "100");
      x.setAttribute("height", "100");
      x.setAttribute("alt", "IU");  
      x.setAttribute("z-index", 10);  
      x.setAttribute("position", "absolute" );
      x.setAttribute("top", x );
      x.setAttribute("left", y );

      // 추가 
      document.body.appendChild(x);
      e_group.activate = "injection_end";


    }
  };
  return e_group;
});
