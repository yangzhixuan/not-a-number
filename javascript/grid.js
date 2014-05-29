// Generated by CoffeeScript 1.4.0
(function() {

  this.hsvString = function(h, s, v) {
    var color;
    color = hsvToRgb(h, s, v);
    return colorToString([Math.floor(color[0]), Math.floor(color[1]), Math.floor(color[2])]);
  };

  this.randomColor = function() {
    var color;
    color = hsvToRgb(Math.random() * 0.1 + 0.4, 0.8, 0.9);
    return [Math.floor(color[0]), Math.floor(color[1]), Math.floor(color[2])];
  };

  this.colorToString = function(color) {
    return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
  };

  this.randomColorString = function() {
    var color;
    color = randomColor();
    return colorToString(color);
  };

  this.clamp = function(a) {
    return Math.max(Math.min(a, 1.0), 0.0);
  };

  this.mediate = function(left, right, rate) {
    return left + (right - left) * rate;
  };

  this.colorToString = function(color) {
    return "hsl(" + ((color.h - Math.floor(color.h)) * 360) + ", " + (clamp(color.s) * 100) + "%, " + (clamp(color.l) * 100) + "%)";
  };

  this.getTime = function() {
    var date;
    date = new Date();
    return date.getTime();
  };

  NAN.Grid = (function() {

    function Grid(x, y, game, show) {
      var _this = this;
      this.x = x;
      this.y = y;
      this.game = game;
      this.mouse = this.game.mouse;
      this.id = this.game.gridId;
      this.deltaX = 0;
      this.game.gridId += 1;
      this.exist = true;
      this.value = Math.floor(Math.random() * 10);
      this.selected = false;
      this.width = $.game.gridWidth;
      this.height = $.game.gridHeight;
      this.color = this.getColor();
      this.remainedTime = -1;
      $("#container").append("<div class='square' id='square-" + this.id + "'></div>");
      this.position = this.getPosition();
      this.getElement().css("background-color", colorToString(this.color));
      this.getElement().append("<div class='number'>" + this.value + "</div>");
      this.getElement().css("opacity", 0);
      if (show) {
        this.show();
      }
      this.getElement().mouseover(function() {
        _this.mouseOver();
        return false;
      });
      this.getElement().mousedown(function() {
        _this.mouseDown();
        return false;
      });
      this.getElement().mouseup(function() {
        _this.mouseUp();
        return false;
      });
      this.update();
    }

    Grid.prototype.cleaned = function() {
      return this.remainedTime >= 0;
    };

    Grid.prototype.clean = function() {
      return this.remainedTime = 30;
    };

    Grid.prototype.moveTo = function(x, y) {
      this.x = x;
      return this.y = y;
    };

    Grid.prototype.testInside = function(x, y) {
      return this.position.x <= x && x <= this.position.x + this.height && this.position.y <= y && y <= this.position.y + this.width;
    };

    Grid.prototype.getColor = function() {
      var color;
      color = {};
      color.h = 0.35 + this.value * 0.000;
      if (this.selected) {
        color.s = 0.6;
        color.l = 0.9;
      } else {
        color.s = 0.54;
        color.l = 0.7;
      }
      return color;
    };

    Grid.prototype.getPosition = function() {
      var originPosition, rate, x, y;
      originPosition = {
        x: this.game.gridXOffset + this.x * this.game.gridHeight,
        y: this.game.gridYOffset + this.y * this.game.gridWidth
      };
      if (this.cleaned()) {
        rate = 0.5 + -Math.cos(Math.PI * (30 - this.remainedTime) / 30) / 2;
        x = mediate(originPosition.x, this.game.score.position.x, rate);
        y = mediate(originPosition.y, this.game.score.position.y - this.game.gridWidth / 2, rate);
        return {
          x: x,
          y: y
        };
      }
      return originPosition;
    };

    Grid.prototype.getElement = function() {
      return $("#square-" + this.id);
    };

    Grid.prototype.isConnecting = function(grid) {
      var neighbouring;
      neighbouring = Math.abs(grid.x - this.x) + Math.abs(grid.y - this.y) === 1;
      return neighbouring;
    };

    Grid.prototype.show = function() {
      this.getElement().show(0);
      return this.getElement().animate({
        opacity: 1.0
      }, 400);
    };

    Grid.prototype.update = function() {
      var movement;
      if (this.cleaned()) {
        if (this.remainedTime === 0) {
          this.exist = false;
        }
        this.getElement().css("opacity", Math.pow(this.remainedTime / 30, 3));
        this.remainedTime -= 1;
      }
      this.color = this.getColor();
      if (this.deltaX !== 0) {
        movement = Math.min(this.deltaX, 10);
        this.deltaX -= movement;
        this.position.x += movement;
      }
      if (this.cleaned()) {
        this.position = this.getPosition();
      }
      if (this.position !== this.lastPosition) {
        this.getElement().css("top", "" + this.position.x + "px");
        this.getElement().css("left", "" + this.position.y + "px");
      }
      this.lastPosition = {
        x: this.position.x,
        y: this.position.y
      };
      if (this.color !== this.lastColor) {
        this.getElement().css("background-color", colorToString(this.color));
      }
      return this.lastColor = this.color;
    };

    Grid.prototype.mouseDown = function() {
      if (this.mouse.state === "none") {
        this.mouse.beginPath();
        return this.mouse.addGrid(this);
      }
    };

    Grid.prototype.makeSound = function() {
      return $.audioPlayerA.play(this.value, 0.3);
    };

    Grid.prototype.mouseOver = function() {
      if (this.mouse.state === "select") {
        return this.mouse.addGrid(this);
      }
    };

    Grid.prototype.mouseUp = function() {
      if (this.mouse.state === "select") {
        return this.mouse.endPath();
      }
    };

    return Grid;

  })();

}).call(this);
