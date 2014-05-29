// Generated by CoffeeScript 1.4.0
(function() {

  this.mobileMode = function() {
    if (navigator.appVersion.indexOf("iPad") !== -1) {
      return true;
    }
    if (navigator.appVersion.indexOf("iOS") !== -1) {
      return true;
    }
    if (navigator.appVersion.indexOf("Android") !== -1) {
      return true;
    }
    return false;
  };

  NAN.AudioTask = (function() {

    function AudioTask(n, timeout, audioPlayer) {
      var _this = this;
      this.n = n;
      this.audioPlayer = audioPlayer;
      setTimeout(function() {
        return _this.play();
      }, timeout);
      return;
    }

    AudioTask.prototype.play = function() {
      return this.audioPlayer.play(this.n, 0.3);
    };

    return AudioTask;

  })();

  NAN.AudioPlayer = (function() {

    function AudioPlayer(suffix) {
      var i, _i,
        _this = this;
      this.disabled = $.mobileMode;
      if (this.disabled) {
        return;
      }
      this.sounds = [[]];
      this.copies = 8;
      this.pointer = [];
      for (i = _i = 0; _i < 10; i = ++_i) {
        this.pointer[i] = 0;
        this.sounds[i] = [];
        this.sounds[i][0] = new Audio("sound/sound" + i + suffix + ".mp3");
        this.sounds[i][0].load();
        document.body.appendChild(this.sounds[i][0]);
      }
      setTimeout(function() {
        var j, _j, _results;
        _results = [];
        for (i = _j = 0; _j < 10; i = ++_j) {
          _results.push((function() {
            var _k, _ref, _results1;
            _results1 = [];
            for (j = _k = 1, _ref = this.copies; 1 <= _ref ? _k < _ref : _k > _ref; j = 1 <= _ref ? ++_k : --_k) {
              _results1.push(this.sounds[i].push(this.sounds[i][0].cloneNode(true)));
            }
            return _results1;
          }).call(_this));
        }
        return _results;
      }, 0);
    }

    AudioPlayer.prototype.play = function(n, volumn) {
      var sound;
      if (volumn == null) {
        volumn = 1.0;
      }
      if (this.disabled) {
        return;
      }
      sound = this.sounds[n][this.pointer[n]];
      this.pointer[n] = (this.pointer[n] + 1) % this.copies;
      sound.volumn = volumn;
      return sound.play();
    };

    AudioPlayer.prototype.playString = function(n) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = n.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(new NAN.AudioTask(parseInt(n[i]), 400 + i * 200, this));
      }
      return _results;
    };

    return AudioPlayer;

  })();

}).call(this);
