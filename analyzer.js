// Generated by CoffeeScript 1.4.0
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.NAN.maximumNumber = 100000000;

  NAN.NumberSet = (function() {

    function NumberSet() {
      this.numbers = [];
      this.description = "Interesting Number";
    }

    NumberSet.prototype.analyze = function(n) {
      n = parseInt(n);
      if (__indexOf.call(this.numbers, n) >= 0) {
        return {
          score: Math.max(1, n) / Math.max(1, this.numbers.indexOf(n)),
          description: this.description
        };
      }
      return {
        score: 0,
        description: null
      };
    };

    return NumberSet;

  })();

  NAN.PrimeNumberSet = (function(_super) {

    __extends(PrimeNumberSet, _super);

    PrimeNumberSet.prototype.isPrime = function(n) {
      var a;
      n = parseInt(n);
      if (n === 2) {
        return true;
      }
      if (n < 2) {
        return false;
      }
      a = 2;
      while (a * a <= n) {
        if (n % a === 0) {
          return false;
        }
        a += 1;
      }
      return true;
    };

    function PrimeNumberSet() {
      this.description = "质数";
    }

    PrimeNumberSet.prototype.analyze = function(n) {
      var result;
      n = parseInt(n);
      if (this.isPrime(n)) {
        result = {};
        result.score = Math.floor(10 + Math.pow(Math.log(n), 2));
        result.description = this.description;
        return result;
      }
      return null;
    };

    return PrimeNumberSet;

  })(NAN.NumberSet);

  NAN.PureOddNumberSet = (function(_super) {

    __extends(PureOddNumberSet, _super);

    function PureOddNumberSet() {
      PureOddNumberSet.__super__.constructor.call(this);
      this.description = "纯奇数";
    }

    PureOddNumberSet.prototype.analyze = function(n) {
      var char, result, _i, _len;
      for (_i = 0, _len = n.length; _i < _len; _i++) {
        char = n[_i];
        if (parseInt(char) % 2 === 0) {
          return null;
        }
      }
      result = {
        score: Math.max(0, n.length - 4),
        description: this.description
      };
      return result;
    };

    return PureOddNumberSet;

  })(NAN.NumberSet);

  NAN.PureEvenNumberSet = (function(_super) {

    __extends(PureEvenNumberSet, _super);

    function PureEvenNumberSet() {
      PureEvenNumberSet.__super__.constructor.call(this);
      this.description = "纯偶数";
    }

    PureEvenNumberSet.prototype.analyze = function(n) {
      var char, result, _i, _len;
      for (_i = 0, _len = n.length; _i < _len; _i++) {
        char = n[_i];
        if (parseInt(char) % 2 === 1) {
          return null;
        }
      }
      result = {
        score: Math.max(0, n.length - 4),
        description: this.description
      };
      return result;
    };

    return PureEvenNumberSet;

  })(NAN.NumberSet);

  NAN.PureNumberSet = (function(_super) {

    __extends(PureNumberSet, _super);

    function PureNumberSet() {
      PureNumberSet.__super__.constructor.call(this);
      this.description = "纯数";
    }

    PureNumberSet.prototype.analyze = function(n) {
      var char, result, _i, _len;
      for (_i = 0, _len = n.length; _i < _len; _i++) {
        char = n[_i];
        if (char !== n[0]) {
          return null;
        }
      }
      result = {
        score: 10 * Math.pow(Math.max(0, n.length - 2), 2),
        description: this.description
      };
      return result;
    };

    return PureNumberSet;

  })(NAN.NumberSet);

  NAN.APNumberSet = (function(_super) {

    __extends(APNumberSet, _super);

    function APNumberSet() {
      APNumberSet.__super__.constructor.call(this);
      this.description = "等差数列数";
    }

    APNumberSet.prototype.analyze = function(n) {
      var delta, i, newDelta, result, _i, _ref;
      if (n.length < 3) {
        return null;
      }
      delta = -1;
      for (i = _i = 0, _ref = n.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        newDelta = (n[i + 1] - n[i] + 10) % 10;
        if (newDelta === 0) {
          return null;
        }
        if (delta === -1) {
          delta = newDelta;
        } else {
          if (delta !== newDelta) {
            return null;
          }
        }
      }
      result = {
        score: n.length,
        description: this.description
      };
      return result;
    };

    return APNumberSet;

  })(NAN.NumberSet);

  NAN.WaveNumberSet = (function(_super) {

    __extends(WaveNumberSet, _super);

    function WaveNumberSet() {
      WaveNumberSet.__super__.constructor.call(this);
      this.description = "波浪数";
    }

    WaveNumberSet.prototype.analyze = function(n) {
      var i, lastDelta, newDelta, result, _i, _ref;
      if (n.length < 3) {
        return null;
      }
      lastDelta = 0;
      for (i = _i = 0, _ref = n.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        newDelta = n[i + 1] - n[i];
        if (Math.abs(newDelta) !== 1) {
          return null;
        }
        if (lastDelta !== 0 && newDelta + lastDelta !== 0) {
          return null;
        }
        lastDelta = newDelta;
      }
      result = {
        score: n.length,
        description: this.description
      };
      return result;
    };

    return WaveNumberSet;

  })(NAN.NumberSet);

  NAN.PowerOf2NumberSet = (function(_super) {

    __extends(PowerOf2NumberSet, _super);

    function PowerOf2NumberSet() {
      var a;
      PowerOf2NumberSet.__super__.constructor.call(this);
      this.description = "2的幂";
      a = 1;
      while (a < NAN.maximumNumber) {
        this.numbers.push(a);
        a *= 2;
      }
    }

    return PowerOf2NumberSet;

  })(NAN.NumberSet);

  NAN.CloseToSomePowerOf2NumberSet = (function(_super) {

    __extends(CloseToSomePowerOf2NumberSet, _super);

    function CloseToSomePowerOf2NumberSet() {
      var a;
      CloseToSomePowerOf2NumberSet.__super__.constructor.call(this);
      this.description = "接近2的幂";
      a = 16;
      while (a < NAN.maximumNumber) {
        this.numbers.push(a + 1);
        this.numbers.push(a - 1);
        a *= 2;
      }
    }

    return CloseToSomePowerOf2NumberSet;

  })(NAN.NumberSet);

  NAN.SquareNumberSet = (function(_super) {

    __extends(SquareNumberSet, _super);

    function SquareNumberSet() {
      var a, _i, _ref;
      SquareNumberSet.__super__.constructor.call(this);
      this.description = "平方数";
      for (a = _i = 0, _ref = Math.floor(Math.sqrt(NAN.maximumNumber)); 0 <= _ref ? _i < _ref : _i > _ref; a = 0 <= _ref ? ++_i : --_i) {
        this.numbers.push(a * a);
      }
    }

    return SquareNumberSet;

  })(NAN.NumberSet);

  NAN.CubicNumberSet = (function(_super) {

    __extends(CubicNumberSet, _super);

    function CubicNumberSet() {
      var a, _i, _ref;
      CubicNumberSet.__super__.constructor.call(this);
      this.description = "立方数";
      for (a = _i = 0, _ref = NAN.maximumNumber; 0 <= _ref ? _i < _ref : _i > _ref; a = 0 <= _ref ? ++_i : --_i) {
        this.numbers.push(a * a * a);
        if (a * a * a >= NAN.maximumNumber) {
          break;
        }
      }
    }

    return CubicNumberSet;

  })(NAN.NumberSet);

  NAN.FactorialNumberSet = (function(_super) {

    __extends(FactorialNumberSet, _super);

    function FactorialNumberSet() {
      var a, i, _i;
      FactorialNumberSet.__super__.constructor.call(this);
      this.description = "阶乘数";
      a = 1;
      for (i = _i = 1; _i <= 1000; i = ++_i) {
        a = a * i;
        if (a >= NAN.maximumNumber) {
          break;
        }
        this.numbers.push(a);
      }
    }

    return FactorialNumberSet;

  })(NAN.NumberSet);

  NAN.HundredNumberSet = (function(_super) {

    __extends(HundredNumberSet, _super);

    function HundredNumberSet() {
      var a, b, i, _i, _j;
      HundredNumberSet.__super__.constructor.call(this);
      this.description = "以0结尾";
      a = 1;
      for (i = _i = 1; _i <= 1000; i = ++_i) {
        a = a * 10;
        for (b = _j = 1; _j <= 9; b = ++_j) {
          if (a * b >= NAN.maximumNumber) {
            break;
          }
          this.numbers.push(a * b);
        }
      }
    }

    HundredNumberSet.prototype.analyze = function(n) {
      var result;
      result = HundredNumberSet.__super__.analyze.call(this, n);
      if (result) {
        result.score = Math.sqrt(result.score);
      }
      return result;
    };

    return HundredNumberSet;

  })(NAN.NumberSet);

  NAN.AutomorphicNumberNumberSet = (function(_super) {

    __extends(AutomorphicNumberNumberSet, _super);

    function AutomorphicNumberNumberSet() {
      AutomorphicNumberNumberSet.__super__.constructor.call(this);
      this.description = "Automorphic Number";
      /*
      		a = 0
      		b = 1
      		for i in [1..1000]
      			c = a + b
      			a = b
      			b = c
      			break if a >= NAN.maximumNumber 
      			@numbers.push(a)
      */

    }

    return AutomorphicNumberNumberSet;

  })(NAN.NumberSet);

  NAN.FibonacciNumberSet = (function(_super) {

    __extends(FibonacciNumberSet, _super);

    function FibonacciNumberSet() {
      var a, b, c, i, _i;
      FibonacciNumberSet.__super__.constructor.call(this);
      this.description = "Fibonacci数";
      a = 0;
      b = 1;
      for (i = _i = 1; _i <= 1000; i = ++_i) {
        c = a + b;
        a = b;
        b = c;
        if (a >= NAN.maximumNumber) {
          break;
        }
        this.numbers.push(a);
      }
    }

    return FibonacciNumberSet;

  })(NAN.NumberSet);

  NAN.PalindromicNumberSet = (function(_super) {

    __extends(PalindromicNumberSet, _super);

    function PalindromicNumberSet() {
      this.description = "回文数";
    }

    PalindromicNumberSet.prototype.analyze = function(n) {
      if (n.split("").reverse().join("") === n) {
        return {
          score: 10 * Math.pow(Math.max(n.length - 2, 0), 2),
          description: this.description
        };
      }
      return null;
    };

    return PalindromicNumberSet;

  })(NAN.NumberSet);

  NAN.prefixNumberSet = (function(_super) {

    __extends(prefixNumberSet, _super);

    function prefixNumberSet() {
      this.numbers = [];
      this.newNumber({
        number: "31415926535",
        description: "圆周率",
        score: 60
      });
      this.newNumber({
        number: "2718281828",
        description: "自然常数e",
        score: 60
      });
      this.newNumber({
        number: "1414213562",
        description: "根号2",
        score: 40
      });
    }

    prefixNumberSet.prototype.newNumber = function(num) {
      return this.numbers.push({
        number: num.number,
        description: num.description,
        score: num.score
      });
    };

    prefixNumberSet.prototype.getResult = function(n) {
      var numberInfo, _i, _len, _ref;
      _ref = this.numbers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        numberInfo = _ref[_i];
        if (numberInfo.number.indexOf(n) === 0) {
          return {
            score: numberInfo.score * n.length,
            description: numberInfo.description + ("的前" + n.length + "位")
          };
        }
      }
      return null;
    };

    prefixNumberSet.prototype.analyze = function(n) {
      if (n.length < 3) {
        return null;
      }
      return this.getResult(n);
    };

    return prefixNumberSet;

  })(NAN.NumberSet);

  NAN.meaningfulNumberSet = (function(_super) {

    __extends(meaningfulNumberSet, _super);

    function meaningfulNumberSet() {
      this.numbers = [];
      this.newNumber({
        number: 42,
        description: "the answer to life, the universe,<br>and everything",
        score: 100
      });
      this.newNumber({
        number: 59,
        description: "挂科啦",
        score: 50
      });
      this.newNumber({
        number: 63,
        description: "南南的生日",
        score: 200
      });
      this.newNumber({
        number: 603,
        description: "南南的生日",
        score: 200
      });
      this.newNumber({
        number: 60,
        description: "谢老师不挂之恩",
        score: 70
      });
      this.newNumber({
        number: 360,
        description: "安全卫士",
        score: 70
      });
      this.newNumber({
        number: 211,
        description: "开发者的狗窝",
        score: 70
      });
      this.newNumber({
        number: 985,
        description: "看起来是一所好大学",
        score: 70
      });
      this.newNumber({
        number: 250,
        description: "脑子出了点问题",
        score: 70
      });
      this.newNumber({
        number: 100,
        description: "学霸你够了",
        score: 70
      });
      this.newNumber({
        number: 99,
        description: "学霸你够了",
        score: 70
      });
      this.newNumber({
        number: 233,
        description: "很好笑的样子",
        score: 70
      });
      this.newNumber({
        number: 119,
        description: "着火啦",
        score: 70
      });
      this.newNumber({
        number: 1024,
        description: "给你1024凑个整",
        score: 70
      });
    }

    meaningfulNumberSet.prototype.newNumber = function(num) {
      return this.numbers.push({
        number: num.number,
        description: num.description,
        score: num.score
      });
    };

    meaningfulNumberSet.prototype.getResult = function(n) {
      var numberInfo, _i, _len, _ref;
      _ref = this.numbers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        numberInfo = _ref[_i];
        if (numberInfo.number === n) {
          return {
            score: numberInfo.score,
            description: numberInfo.description
          };
        }
      }
      return null;
    };

    meaningfulNumberSet.prototype.analyze = function(n) {
      n = parseInt(n);
      return this.getResult(n);
    };

    return meaningfulNumberSet;

  })(NAN.NumberSet);

  NAN.Analyzer = (function() {

    function Analyzer() {
      var key;
      this.numberSets = [];
      for (key in NAN) {
        if (key.toString().indexOf("NumberSet") > 0) {
          this.numberSets.push(new NAN[key.toString()]);
        }
      }
    }

    Analyzer.prototype.analyze = function(n) {
      var descriptions, numberSet, propertiesCount, result, score, _i, _len, _ref;
      score = 0;
      descriptions = [];
      propertiesCount = 0;
      _ref = this.numberSets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        numberSet = _ref[_i];
        result = numberSet.analyze(n);
        if (result === null) {
          continue;
        }
        score += result.score;
        propertiesCount += 1;
        descriptions.push(result.description);
      }
      return {
        score: Math.floor(score * propertiesCount),
        descriptions: descriptions
      };
    };

    return Analyzer;

  })();

}).call(this);
