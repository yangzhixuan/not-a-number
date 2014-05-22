// Generated by CoffeeScript 1.4.0
(function() {
  var Game, Grid, Mouse,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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

  this.colorToString = function(color) {
    return "hsla(" + (color.h * 360) + ", " + (color.s * 100) + "%, " + (color.l * 100) + "%, 1.0)";
  };

  Grid = (function() {

    function Grid(x, y, game) {
      this.x = x;
      this.y = y;
      this.game = game;
      this.mouse = this.game.mouse;
      this.value = Math.pow(2, Math.floor(Math.random() * 10 - 2));
      if (this.value < 1) {
        this.value = "NAN";
      }
      this.selected = false;
      this.color = this.getColor();
    }

    Grid.prototype.getColor = function() {
      var color;
      color = {};
      color.s = 0.5;
      if (this.selected) {
        color.h = 0.3;
      } else {
        color.h = 0.8;
      }
      if (this.value === "NAN") {
        color.h += 0.1;
        color.l = 0.6;
      } else {
        color.l = Math.log(this.value) * 0.05 + 0.3;
      }
      return color;
    };

    Grid.prototype.getElement = function() {
      return $("#square-" + (this.x * $.game.numGridColumns + this.y));
    };

    Grid.prototype.isCconnecting = function(grid) {
      var doubling, nan, neighbouring;
      neighbouring = Math.abs(grid.x - this.x) + Math.abs(grid.y - this.y) === 1;
      doubling = grid.value === this.value * 2;
      nan = this.value === "NAN" || grid.value === "NAN";
      return neighbouring && (doubling || nan);
    };

    Grid.prototype.init = function() {
      var _this = this;
      $("#container").append("<div class='square' id='square-" + (this.x * this.game.numGridColumns + this.y) + "'></div>");
      this.getElement().css("-webkit-transform", "translate(" + (20 + this.y * this.game.gridHeight) + "px, " + (20 + this.x * this.game.gridWidth) + "px)");
      this.getElement().css("background-color", colorToString(this.color));
      this.getElement().append("<div class='number'>" + this.value + "</p>");
      this.getElement().hide();
      this.getElement().show(500);
      this.getElement().mouseover(function() {
        _this.mouseOver();
        return false;
      });
      this.getElement().mousedown(function() {
        _this.mouseDown();
        return false;
      });
      return this.getElement().mouseup(function() {
        _this.mouseUp();
        return false;
      });
    };

    Grid.prototype.update = function() {
      this.color = this.getColor();
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

    Grid.prototype.mouseOver = function() {
      if (this.mouse.state === "select") {
        return this.mouse.addGrid(this);
      }
    };

    Grid.prototype.mouseUp = function() {
      if (this.mouse.state === "select") {
        this.mouse.addGrid(this);
        return this.mouse.endPath();
      }
    };

    Grid.prototype.hideAfter = function(time) {
      var _this = this;
      return setTimeout(function() {
        return _this.getElement().hide(300);
      }, time);
    };

    return Grid;

  })();

  Mouse = (function() {

    function Mouse() {
      this.path = [];
      this.state = "none";
    }

    Mouse.prototype.checkPath = function() {
      var i, result, _i, _ref;
      result = true;
      if (this.path.length < 3) {
        result = false;
      }
      for (i = _i = 0, _ref = this.path.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.path[i].grid.isCconnecting(this.path[i + 1].grid) === false) {
          result = false;
        }
      }
      return result;
    };

    Mouse.prototype.beginPath = function() {
      this.path = [];
      return this.state = "select";
    };

    Mouse.prototype.endPath = function() {
      var i, node, _i, _j, _len, _ref, _ref1;
      if (this.checkPath()) {
        for (i = _i = 0, _ref = this.path.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          node = this.path[i];
          node.grid.hideAfter(100 * i);
          console.log(i);
        }
      }
      _ref1 = this.path;
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        node = _ref1[_j];
        node.grid.selected = false;
      }
      this.state = "none";
      return this.path = [];
    };

    Mouse.prototype.addGrid = function(grid) {
      var node;
      node = {
        x: grid.x,
        y: grid.y,
        grid: grid
      };
      if (!(__indexOf.call(this.path, node) >= 0)) {
        if (this.path.length === 0 || this.path[this.path.length - 1].grid.isCconnecting(grid)) {
          grid.selected = true;
          return this.path.push(node);
        }
      }
    };

    return Mouse;

  })();

  Game = (function() {

    function Game() {
      var i, _i, _ref;
      this.init();
      this.gridWidth = 64;
      this.gridHeight = 64;
      this.numGridColumns = 10;
      this.numGridRows = 10;
      this.numGrids = this.numGridColumns * this.numGridRows;
      this.grids = [];
      this.mouse = new Mouse;
      this.paused = true;
      this.timeLeft = 100;
      for (i = _i = 0, _ref = this.numGridRows; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.grids[i] = [];
      }
    }

    Game.prototype.init = function() {
      return this.time = 0;
    };

    Game.prototype.getGrid = function(x, y) {
      return $("#square-" + (x * this.numGridColumns + y));
    };

    Game.prototype.update = function() {
      var dx, dy, grid, k, neiX, neiY, x, y, _i, _j, _k, _l, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _results, _results1;
      if (this.time < this.numGridRows) {
        x = this.time;
        for (y = _i = 0, _ref = this.numGridColumns; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
          grid = new Grid(x, y, this);
          this.grids[x][y] = grid;
          grid.init();
          /*
                          grid.getElement().mouseover( ->
                              $(this).hide(400, ->
                                  $(this).show(300)
                              )
                          )
          */

        }
      } else {
        if (this.time > 20) {
          this.paused = false;
        }
        dx = [0, 1, 0, -1];
        dy = [1, 0, -1, 0];
        for (x = _j = 0, _ref1 = this.numGridRows; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          for (y = _k = 0, _ref2 = this.numGridColumns; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
            this.grids[x][y].update();
            for (k = _l = 0; _l < 4; k = ++_l) {
              neiX = x + dx[k];
              neiY = y + dy[k];
              if (__indexOf.call((function() {
                _results = [];
                for (var _m = 0, _ref3 = this.numGridColumns; 0 <= _ref3 ? _m < _ref3 : _m > _ref3; 0 <= _ref3 ? _m++ : _m--){ _results.push(_m); }
                return _results;
              }).apply(this), neiX) >= 0 && __indexOf.call((function() {
                _results1 = [];
                for (var _n = 0, _ref4 = this.numGridColumns; 0 <= _ref4 ? _n < _ref4 : _n > _ref4; 0 <= _ref4 ? _n++ : _n--){ _results1.push(_n); }
                return _results1;
              }).apply(this), neiY) >= 0) {
                if (this.grids[x][y].isCconnecting(this.grids[neiX][neiY])) {
                  1;

                }
              }
            }
          }
        }
      }
      this.time += 1;
      if (!this.paused) {
        this.timeLeft -= 0.1;
      }
      return $("#progressbar").attr("value", "" + this.timeLeft);
    };

    return Game;

  })();

  $(document).ready(function() {
    var timeStep;
    timeStep = 1;
    $("#title").animate({
      left: "+=1000px"
    }, 0);
    $("#title").animate({
      left: "-=1000px"
    }, 1900 * timeStep);
    $("#container").animate({
      top: "+=500px"
    }, 0);
    $("#container").animate({
      top: "-=500px"
    }, 1900 * timeStep);
    $.game = new Game;
    return setTimeout(function() {
      return setInterval(function() {
        return $.game.update();
      }, 20);
    }, 2000 * timeStep);
  });

}).call(this);
