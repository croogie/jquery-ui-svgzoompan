/*! jquery-ui-svgzoompan - v0.0.1 - 2014-05-29
* https://github.com/croogie/jquery-ui-svgzoompan
* Copyright (c) 2014 Michał Świtoń; Licensed MIT */
(function ($, undefined) {
    $.widget('croogie.svgzoompan', {
        masterViewBox: [],
        zoomLevels: [],
        viewBoxDims: [],
        curZoomIndex: 0,
        mouseTouchEvent: false,
        startX: null,
        startY: null,

        options: {
            zoomLevels: "200, 300, 400, 500, 600, 700, 800, 900, 1000",
            initialZoom: "100",
            initialMinX: false, // Important! If initial minX is 0 must be in quotes or else it is registered as false
            initialMinY: false
        },

        _setZoomLevels: function () {
            this.zoomLevels = this.options.zoomLevels.split(', ');
            this.zoomLevels.push(this.options.initialZoom);
            this.zoomLevels.sort(function (a, b) {
                return a - b;
            });

            this.viewBoxDims = [];

            for (var i = 0 ; i < this.zoomLevels.length ; i++) {
                var viewBoxWidth = this.masterViewBox[2] / (this.zoomLevels[i] / 100),
                    viewBoxHeight = this.masterViewBox[3] / (this.zoomLevels[i] / 100);

                this.viewBoxDims[i] = {
                    width: viewBoxWidth,
                    height: viewBoxHeight
                };

                // If we're at the initial zoom
                if (this.zoomLevels[i] === this.options.initialZoom) {
                    this.curZoomIndex = i;

                    // get center point
                    var minx = (this.masterViewBox[2] - viewBoxWidth) / 2,
                        miny = (this.masterViewBox[3] - viewBoxHeight) / 2;

                    this.element.attr('viewBox', minx + " " + miny + " " + viewBoxWidth + " " + viewBoxHeight);
                }
            }
        },

        _registerEvents: function () {
            this._on(this.element, {
                'mousewheel'    : '_handleWheelEvent',
                'mousedown'     : '_handleMouseDownEvent',
                'touchstart'    : '_handleMouseDownEvent',
                'mouseup'       : '_handleMouseUpEvent',
                'touchend'      : '_handleMouseUpEvent',
                'mousemove'     : '_handleDragEvent',
                'touchmove'     : '_handleDragEvent'
            });
        },

        _handleWheelEvent: function (e) {
            if (e.originalEvent.wheelDelta /120 > 0) {
                this.zoom('in');
            } else {
                this.zoom('out');
            }
        },

        _handleMouseDownEvent: function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.mouseTouchEvent = true;

            if (!e.touches) {
                this.startX = e.clientX;
                this.startY = e.clientY;
            } else {
                this.startX = e.touches[0].clientX;
                this.startY = e.touches[0].clientY;
            }
        },

        _handleMouseUpEvent: function () {
            this.mouseTouchEvent = false;
        },

        _handleDragEvent: function (e) {
            if (this.mouseTouchEvent) {
                e.preventDefault();
                e.stopPropagation();

                var dX, dY;
                var curViewBox = this._getViewBox();

                if (!e.touches) {
                    dX = this.startX - e.clientX;
                    dY = this.startY - e.clientY;
                } else {
                    dX = this.startX - e.touches[0].clientX;
                    dY = this.startY - e.touches[0].clientY;
                }

                // check if user want to scroll outside the viewport
                // drag mouse to right
                if (dX < 0 && curViewBox[0] < 0) {
                    dX = 0;
                }
                // move svg to the right (drag mouse to the left)
                else if (dX > 0 && (parseInt(curViewBox[2]) + parseInt(curViewBox[0]) > this.masterViewBox[2])) {
                    dX = 0;
                }
                // drag mouse to bottom
                else if (dY < 0 && curViewBox[1] < 0) {
                    dY = 0;
                }
                // drag mouse to top
                else if (dY > 0 && (parseInt(curViewBox[3]) + parseInt(curViewBox[1]) > this.masterViewBox[3])) {
                    dY = 0;
                }

                var ratioX = (this.element.width() / this.masterViewBox[2]) / (this.zoomLevels[this.curZoomIndex] / 100 / 1.3);
                var ratioY = (this.element.height() / this.masterViewBox[3]) / (this.zoomLevels[this.curZoomIndex] / 100 / 1.3);

                var newMinX = parseFloat(curViewBox[0]) + (dX * ratioX);
                if (newMinX < 0) {
                    newMinX = 0;
                }
                var newMinY = parseFloat(curViewBox[1]) + (dY * ratioY);
                if (newMinY < 0) {
                    newMinY = 0;
                }

                this.element.get(0).setAttribute(
                    'viewBox',
                    newMinX + " " + newMinY + " " + curViewBox[2] + " " + curViewBox[3]
                );

                if (!e.touches) {
                    this.startX = e.clientX;
                    this.startY = e.clientY;
                } else {
                    this.startX = e.touches[0].clientX;
                    this.startY = e.touches[0].clientY;
                }
            }
        },

        _getViewBox: function () {
            return this.element.get(0).getAttribute('viewBox').split(" ");
        },

        _create: function () {
            this.masterViewBox = this._getViewBox();

            this._setZoomLevels();
            this._registerEvents();
        },

        zoom: function (direction) {
            direction = direction.toLowerCase();

            if (direction === 'in' && this.curZoomIndex === (this.zoomLevels.length - 1)) {
                return false;
            } else if (direction === 'out' && this.curZoomIndex === 0) {
                return false;
            } else { // OK to zoom!
                if (direction === 'in') {
                    this.curZoomIndex++;
                } else {
                    this.curZoomIndex--;
                }

                var curViewBox = this._getViewBox();
                var nextViewBoxDims = this.viewBoxDims[this.curZoomIndex];

                var minx = parseFloat(curViewBox[0]) + parseFloat((parseFloat(curViewBox[2]) - parseFloat(nextViewBoxDims.width)) / 2);
                if (minx < 0) { // Too far left!
                    minx = 0;
                } else if ((minx + parseFloat(nextViewBoxDims.width)) > parseFloat(this.masterViewBox[2])) { // Too far right!
                    minx = parseFloat(this.masterViewBox[2]) - parseFloat(nextViewBoxDims.width);
                }

                var miny = parseFloat(curViewBox[1]) + parseFloat((parseFloat(curViewBox[3]) - parseFloat(nextViewBoxDims.height)) / 2);
                if (miny < 0) { // Too far up!
                    miny = 0;
                } else if ((miny + parseFloat(nextViewBoxDims.height)) > parseFloat(this.masterViewBox[3])) { // Too far down!
                    miny = parseFloat(this.masterViewBox[3]) - parseFloat(nextViewBoxDims.height);
                }

                this.element.get(0).setAttribute(
                    "viewBox",
                    minx + " " + miny + " " + nextViewBoxDims.width + " " + nextViewBoxDims.height
                );
            }

            return this;
        }
    });
}(jQuery));
