@mobileMode = ()->
	if navigator.appVersion.indexOf("iPad") != -1
		return true
	if navigator.appVersion.indexOf("iOS") != -1
		return true
	if navigator.appVersion.indexOf("Android") != -1
		return true
	return false

class NAN.AudioTask
	constructor:(@n, timeout, @audioPlayer)->
		setTimeout(
			=>
				@play()
			,timeout
		)
		return

	play: ()->
		@audioPlayer.play(@n, 0.3)



class NAN.AudioPlayer

	constructor:(suffix)->
		@disabled = $.mobileMode
		return if @disabled
		@sounds = [[]]
		@copies = 8
		@pointer = []
		for i in [0...10]
			@pointer[i] = 0
			@sounds[i] = []
			@sounds[i][0] = new Audio("sound/sound#{i}#{suffix}.mp3")
			@sounds[i][0].load()
			document.body.appendChild(@sounds[i][0])

		setTimeout(
			=>
				for i in [0...10]
					for j in [1...@copies]
						@sounds[i].push(@sounds[i][0].cloneNode(true))
			, 0
		)

	play: (n, volumn = 1.0) ->
		return if @disabled
		sound = @sounds[n][@pointer[n]] #.cloneNode(true)
		@pointer[n] = (@pointer[n] + 1) % @copies
		sound.volumn = volumn
		sound.play()

	playString: (n)->
		for i in [0...n.length]
			new NAN.AudioTask(parseInt(n[i]), 400 + i * 200, @)