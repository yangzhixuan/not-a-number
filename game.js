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
    return "hsla(" + ((color.h - Math.floor(color.h)) * 360) + ", " + (clamp(color.s) * 100) + "%, " + (clamp(color.l) * 100) + "%, 1.0)";
  };

  NAN.Grid = (function() {

    function Grid(x, y, game) {
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
      this.color = this.getColor();
      this.remainedTime = -1;
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
        color.l = this.value * 0.01 + 0.3;
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

    Grid.prototype.init = function() {
      var _this = this;
      $("#container").append("<div class='square' id='square-" + this.id + "'></div>");
      this.position = this.getPosition();
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
      this.getElement().mouseup(function() {
        _this.mouseUp();
        return false;
      });
      return this.update();
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

    return Grid;

  })();

  NAN.Mouse = (function() {

    function Mouse() {
      this.path = [];
      this.state = "none";
    }

    Mouse.prototype.checkPath = function() {
      var i, result, _i, _ref;
      result = true;
      if (this.path.length < 2) {
        result = false;
      }
      for (i = _i = 0, _ref = this.path.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.path[i].grid.isConnecting(this.path[i + 1].grid) === false) {
          result = false;
        }
      }
      return result;
    };

    Mouse.prototype.evaluatePath = function() {
      var node, result, val, _i, _len, _ref;
      result = "";
      _ref = this.path;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        val = node.grid.value;
        result += val.toString();
      }
      return result;
    };

    Mouse.prototype.beginPath = function() {
      this.path = [];
      return this.state = "select";
    };

    Mouse.prototype.endPath = function() {
      var i, node, numberString, result, _i, _j, _len, _ref, _ref1;
      if (this.state === "none") {
        return;
      }
      if (this.checkPath()) {
        numberString = this.evaluatePath();
        result = $.analyzer.analyze(numberString);
        $.numberShow = new NAN.NumberShow({
          n: numberString,
          descriptions: result.descriptions.filter(function(desc) {
            return desc !== null && desc !== "";
          }).join("<br>"),
          score: result.score
        });
        $.game.score.addValue(result.score);
        for (i = _i = 0, _ref = this.path.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          node = this.path[i];
          node.grid.clean();
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
      var inside, node, _i, _len, _ref;
      if (this.path.length >= 9) {
        return;
      }
      if (this.path.length === 0 && grid.value === 0) {
        return;
      }
      inside = false;
      _ref = this.path;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (node.x === grid.x && node.y === grid.y) {
          inside = true;
        }
      }
      if (!inside) {
        if (this.path.length === 0 || this.path[this.path.length - 1].grid.isConnecting(grid)) {
          grid.selected = true;
          node = {
            x: grid.x,
            y: grid.y,
            grid: grid
          };
          return this.path.push(node);
        }
      }
    };

    return Mouse;

  })();

  NAN.Score = (function() {

    function Score() {
      this.value = 0;
      this.displayedValue = 0;
      this.position = {
        x: 20,
        y: $("#container").width() / 2
      };
    }

    Score.prototype.addValue = function(points) {
      return this.value += points;
    };

    Score.prototype.update = function() {
      var delta;
      delta = (this.value - this.displayedValue) * 0.1;
      this.displayedValue += delta;
      return $("#score").html("" + (Math.floor(this.displayedValue + 0.3)));
    };

    return Score;

  })();

  NAN.NumberShow = (function() {

    function NumberShow(data) {
      this.time = 0;
      this.finished = false;
      this.getElement().show();
      this.getElement().animate({
        opacity: "0.95"
      }, 400);
      this.getElementNumber().html(data.n);
      this.getElementScore().html(data.score.toString() + " points");
      if (data.descriptions === null || data.descriptions === "") {
        data.descriptions = "Not Interesting";
      }
      this.getElementDescriptions().html(data.descriptions);
    }

    NumberShow.prototype.getElement = function() {
      return $("#number-show");
    };

    NumberShow.prototype.getElementNumber = function() {
      return $("#number-show-number");
    };

    NumberShow.prototype.getElementScore = function() {
      return $("#number-show-score");
    };

    NumberShow.prototype.getElementDescriptions = function() {
      return $("#number-show-descriptions");
    };

    NumberShow.prototype.update = function() {
      var _this = this;
      this.time += 1;
      if (this.time > 50) {
        this.getElement().animate({
          opacity: "0.0"
        }, 400);
        setTimeout(function() {
          return _this.getElement().hide(200);
        }, 400);
        return this.finished = true;
      }
    };

    return NumberShow;

  })();

  NAN.Game = (function() {

    function Game() {
      var i, _i, _ref;
      $.backgroundBlockId = 0;
      this.background = new NAN.Background;
      this.score = new NAN.Score;
      this.gridId = 0;
      this.init();
      this.gridWidth = 60;
      this.gridHeight = 60;
      this.numGridColumns = 10;
      this.numGridRows = 8;
      this.numGrids = this.numGridColumns * this.numGridRows;
      this.gridXOffset = 90;
      this.gridYOffset = (680 - this.numGridColumns * this.gridWidth) / 2;
      this.grids = [];
      this.mouse = new NAN.Mouse;
      this.paused = true;
      this.timeLeft = 100;
      this.gridQueue = [];
      for (i = _i = 0, _ref = this.numGridRows; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.grids[i] = [];
      }
    }

    Game.prototype.newGrid = function(x, y) {
      var grid;
      grid = new NAN.Grid(x, y, this);
      this.grids[x][y] = grid;
      grid.init();
      return this.gridQueue.push(grid);
    };

    Game.prototype.init = function() {
      return this.time = 0;
    };

    Game.prototype.movementEnd = function() {
      var grid, result, row, _i, _j, _len, _len1, _ref;
      result = true;
      _ref = this.grids;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
          grid = row[_j];
          if (grid !== null && grid.deltaX !== 0) {
            result = false;
          }
        }
      }
      return result;
    };

    Game.prototype.nextFrame = function() {
      var x, y, _i, _j, _len, _ref, _ref1, _results, _results1;
      _ref1 = (function() {
        _results1 = [];
        for (var _j = 0, _ref = this.numGridRows; 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
        return _results1;
      }).apply(this).reverse();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        x = _ref1[_i];
        _results.push((function() {
          var _k, _ref2, _results2;
          _results2 = [];
          for (y = _k = 0, _ref2 = this.numGridColumns; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
            if (this.grids[x][y] === null || !this.grids[x][y].exist) {
              if (x > 0 && this.grids[x - 1][y] !== null) {
                this.grids[x - 1][y].deltaX += this.gridHeight;
                this.grids[x][y] = this.grids[x - 1][y];
                this.grids[x - 1][y].moveTo(x, y);
                _results2.push(this.grids[x - 1][y] = null);
              } else if (x === 0) {
                _results2.push(this.newGrid(x, y));
              } else {
                _results2.push(void 0);
              }
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    Game.prototype.updateGrids = function() {
      var grid, newQueue, _i, _len, _ref;
      newQueue = [];
      _ref = this.gridQueue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        grid = _ref[_i];
        if (grid === null || grid.exist === false) {
          0;

        } else {
          grid.update();
          newQueue.push(grid);
        }
      }
      return this.gridQueue = newQueue;
    };

    Game.prototype.getPaused = function() {
      if (this.time <= 100) {
        return true;
      }
      if ($.numberShow && !$.numberShow.finished) {
        return true;
      }
      if (!this.movementEnd()) {
        return true;
      }
      return false;
    };

    Game.prototype.update = function() {
      var x, y, _i, _ref;
      this.paused = this.getPaused();
      if (this.time < this.numGridRows) {
        x = this.time;
        for (y = _i = 0, _ref = this.numGridColumns; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
          this.newGrid(x, y);
          /*
                          grid.getElement().mouseover( ->
                              $(this).hide(400, ->
                                  $(this).show(300)
                              )
                          )
          */

        }
      } else {
        this.nextFrame();
      }
      this.updateGrids();
      this.score.update();
      this.background.update();
      this.time += 1;
      if ($.numberShow) {
        $.numberShow.update();
        if ($.numberShow.finished) {
          $.numberShow = null;
        }
      }
      if (!this.paused) {
        this.timeLeft -= 0.03;
      }
      return $("#progressbar").attr("value", "" + this.timeLeft);
    };

    return Game;

  })();

  $(document).ready(function() {
    var timeStep;
    timeStep = 1;
    $("#number-show").hide();
    $("#number-show").css("opacity", "0.0");
    $.analyzer = new window.NAN.Analyzer;
    $("#title").animate({
      top: "-=400px"
    }, 0);
    $("#title").animate({
      top: "+=400px"
    }, 1900 * timeStep);
    $("#how-to-play").slideUp(0);
    $("#container").animate({
      top: "+=700px"
    }, 0);
    $("#container").animate({
      top: "-=700px"
    }, 1900 * timeStep);
    $.game = new NAN.Game;
    setTimeout(function() {
      return setInterval(function() {
        return $.game.update();
      }, 20);
    }, 2000 * timeStep);
    setTimeout(function() {
      $("#title-1").animate({
        fontSize: "90px"
      }, 500 * timeStep);
      $("#title-2").slideUp(500 * timeStep);
      return $("#title-3").animate({
        fontSize: "49px"
      }, 500 * timeStep);
    }, 3000 * timeStep);
    $("body").mouseup(function() {
      return $.game.mouse.endPath();
    });
    return setTimeout(function() {
      return $("#how-to-play").slideDown(700);
    }, 4000 * timeStep);
  });

}).call(this);
