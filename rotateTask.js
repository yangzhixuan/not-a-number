// Generated by CoffeeScript 1.4.0
(function() {

  NAN.RotateTask = (function() {

    function RotateTask(elementA, elementB) {
      var _this = this;
      this.elementA = elementA;
      this.elementB = elementB;
      this.frames = 100;
      this.timeStep = 20;
      this.time = 0;
      this.angle = 0;
      this.getElementA().css("-webkit-transform", "rotateY(0 deg)");
      this.getElementB().css("-webkit-transform", "rotateY(-180 deg)");
      this.intervalId = setInterval(function() {
        return _this.update();
      }, this.timeStep);
    }

    RotateTask.prototype.update = function() {
      var rate;
      this.time += 1;
      if (this.time > this.frames) {
        this.getElementA().hide();
        this.getElementB().show();
        clearInterval(this.intervalId);
      }
      rate = this.time / this.frames;
      this.angle = 180 * rate;
      this.getElementA().css("opacity", 1 - rate);
      return this.getElementB().css("opacity", rate);
    };

    RotateTask.prototype.getElementA = function() {
      return $(elementA);
    };

    RotateTask.prototype.getElementB = function() {
      return $(elementB);
    };

    return RotateTask;

  })();

}).call(this);
