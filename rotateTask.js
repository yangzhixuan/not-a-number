// Generated by CoffeeScript 1.4.0
(function() {

  NAN.RotateTask = (function() {

    function RotateTask(elementB, direction) {
      var _this = this;
      this.elementB = elementB;
      this.direction = direction != null ? direction : 1;
      this.frames = 100;
      this.timeStep = 20;
      this.time = 0;
      this.angle = 0;
      this.getElementA().css("opacity", 1);
      this.getElementB().css("opacity", 0);
      this.getElementA().show(0);
      this.getElementB().show(0);
      this.intervalId = setInterval(function() {
        return _this.update();
      }, this.timeStep);
      $("body").css("-webkit-perspective", "1001px");
    }

    RotateTask.prototype.update = function() {
      var rate;
      this.time += 1;
      if (this.time >= this.frames) {
        this.getElementA().hide();
        this.getElementB().show();
        $.currentScreen = this.elementB;
        clearInterval(this.intervalId);
      }
      rate = (1 - Math.cos(this.time / this.frames * Math.PI)) / 2;
      this.angle = 180 * rate;
      this.getElementA().css("opacity", Math.max(1 - rate * 2, 0));
      this.getElementB().css("opacity", Math.max((rate - 0.5) * 2, 0));
      console.log(rate);
      if (rate >= 0.5) {
        rate += 1;
      }
      return $("#container").css("-webkit-transform", "rotateY(" + (180 * rate) + "deg)");
    };

    RotateTask.prototype.getElementA = function() {
      return $($.currentScreen);
    };

    RotateTask.prototype.getElementB = function() {
      return $(this.elementB);
    };

    return RotateTask;

  })();

}).call(this);
