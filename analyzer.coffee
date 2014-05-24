window.NAN.maximumNumber = 100000000

class NAN.NumberSet
	constructor: ()->
		@numbers = []
		@description = "Interesting Number"

	analyze: (n)->
		n = parseInt(n)
		if n in @numbers
			return {score: Math.max(1, n) / Math.max(1, @numbers.indexOf(n)), description: @description}
		return {score: 0, description: null}


class NAN.PrimeNumberSet extends NAN.NumberSet
	isPrime: (n)->
		n = parseInt(n)
		if n == 2
			return true
		if n < 2
			return false
		a = 2
		while a * a <= n
			if n % a == 0
				return false
			a += 1
		return true

	constructor: ()->
		super()
		@description = "Prime Number"
		for i in [0...NAN.maximumNumber / 1000]
			if @isPrime(i)
				@numbers.push(i)

	analyze: (n)->
		result = super(n)
		result.score *= 3
		return result


class NAN.PureOddNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Pure Odd Number"

	analyze: (n)->
		for char in n
			if parseInt(char) % 2 == 0
				return null 
		result = {score: n.length, description: @description}
		return result

class NAN.PureEvenNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Pure Even Number"

	analyze: (n)->
		for char in n
			if parseInt(char) % 2 == 1
				return null 
		result = {score: n.length, description: @description}
		return result


class NAN.PureNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Pure Number"

	analyze: (n)->
		for char in n
			if char != n[0]
				return null
		result = {score: n.length, description: @description}
		return result


class NAN.APNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "AP Number"

	analyze: (n)->
		return null if n.length < 3 
		delta = -1
		for i in [0...n.length - 1]
			newDelta = (n[i + 1] - n[i] + 10) % 10
			if newDelta == 0
				return null
			if delta == -1
				delta = newDelta
			else 
				if delta != newDelta
					return null
		result = {score: n.length, description: @description}
		return result


class NAN.WaveNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Wave Number"

	analyze: (n)->
		return null if n.length < 3 
		lastDelta = 0
		for i in [0...n.length - 1]
			newDelta = (n[i + 1] - n[i])
			return null if Math.abs(newDelta) != 1
			if lastDelta != 0 and newDelta + lastDelta != 0
				return null
			lastDelta = newDelta
		result = {score: n.length, description: @description}
		return result


class NAN.PowerOf2NumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Power Of 2"
		a = 1
		while a < NAN.maximumNumber
			@numbers.push(a)
			a *= 2

class NAN.CloseToSomePowerOf2NumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Close To Some Power Of 2"
		a = 16
		while a < NAN.maximumNumber
			@numbers.push(a + 1)
			@numbers.push(a - 1)
			a *= 2

class NAN.SquareNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Square Number"
		for a in [0...Math.floor(Math.sqrt(NAN.maximumNumber))]
			@numbers.push(a * a)

class NAN.CubicNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Cubic Number"
		for a in [0...NAN.maximumNumber]
			@numbers.push(a * a * a) 
			break if a * a * a >= NAN.maximumNumber 


class NAN.FactorialNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Factorial Number"
		a = 1
		for i in [1..1000]
			a = a * i
			break if a >= NAN.maximumNumber 
			@numbers.push(a)

class NAN.HundredNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Ends in 0s"
		a = 1
		for i in [1..1000]
			a = a * 10
			for b in [1..9]
				break if a * b >= NAN.maximumNumber 
				@numbers.push(a * b)

class NAN.AutomorphicNumberNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Automorphic Number"
		###
		a = 0
		b = 1
		for i in [1..1000]
			c = a + b
			a = b
			b = c
			break if a >= NAN.maximumNumber 
			@numbers.push(a)
		###



class NAN.FibonacciNumberSet extends NAN.NumberSet
	constructor: ()->
		super()
		@description = "Fibonacci Number"
		a = 0
		b = 1
		for i in [1..1000]
			c = a + b
			a = b
			b = c
			break if a >= NAN.maximumNumber 
			@numbers.push(a)

class NAN.PalindromicNumberSet extends NAN.NumberSet
	constructor: ()->
		@description = "Palindromic Number"

	analyze: (n)->
		if n.split("").reverse().join("") == n
			return {score: n.length, description: @description}
		return null

class NAN.Analyzer
	constructor: ()->
		@numberSets = []
		for key of NAN
			if key.toString().indexOf("NumberSet") > 0
				@numberSets.push(new NAN[key.toString()])

	analyze: (n)->
		score = 0
		descriptions = []
		propertiesCount = 0
		for numberSet in @numberSets
			result = numberSet.analyze(n)
			continue if result == null
			score += result.score
			propertiesCount += 1
			descriptions.push(result.description)
		return {score: Math.floor(score * propertiesCount), descriptions: descriptions}
