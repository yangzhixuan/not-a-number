// Generated by CoffeeScript 1.4.0
(function() {

  NAN.Audio = (function() {

    function Audio() {
      var i, _i;
      this.sounds = [];
      for (i = _i = 0; _i < 10; i = ++_i) {
        this.sounds.push(new Audio("sound/sound" + i + ".mp3"));
        this.sounds[i].play();
      }
    }

    return Audio;

  })();

}).call(this);
