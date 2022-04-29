var g;
if ("undefined" != typeof chrome) {
  g = chrome;
} else {
  if ("undefined" != typeof browser) {
    g = browser;
  } else {
    void 0;
  }
}
e = {
  drawOptions: [
    {
      type: "pen",
      title: "Pencil - draw a custom line",
    },
  ],
  selectedDrawOption: null,
  mousedown: !1,
  lastMouseDownLoc: null,
  handleMouseDown: function (t) {
    t.preventDefault();
    this.mousedown = !0;
    var e = this.drawOptions[this.selectedDrawOption];
    this.lastMouseDownLoc = this.windowToCanvas(
      void 0 === t.clientX ? t.touches[0].clientX : t.clientX,
      void 0 === t.clientY ? t.touches[0].clientY : t.clientY
    );
    if ("pen" === e.type) {
      this.context.beginPath();
      this.context.moveTo(
        this.lastMouseDownLoc.x,
        this.lastMouseDownLoc.y + 16
      );
    }
  },
};
