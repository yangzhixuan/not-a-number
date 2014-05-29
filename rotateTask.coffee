class NAN.RotateTask
	constructor: (@elementA, @elementB)->
		@frames = 100
		@timeStep = 20
		@time = 0
		@angle = 0
#		@getElementA().css("-webkit-transform", "rotateY(0 deg)")
#		@getElementB().css("-webkit-transform", "rotateY(-180 deg)")
		@intervalId = setInterval(
			=>
				@update()
			, @timeStep
		)

	update: ()->
		@time += 1
		if @time >= @frames
			@getElementA().hide()
			@getElementB().show()
			clearInterval(@intervalId)

		rate = (1 - Math.cos(@time / @frames * Math.PI)) / 2
		@angle = 180 * rate
		@getElementA().css("opacity", Math.max(1 - rate * 2, 0))
		@getElementB().css("opacity", Math.max((rate - 0.5) * 2, 0))
		console.log(rate)
#		rate = Math.min(rate, 1 - rate)
		if rate >= 0.5
			rate += 1
#		$("#container").css("", "")
		$("#container").css("-webkit-transform", "rotateY(#{180 * rate}deg)")
		$("body").css("-webkit-perspective", "1001px")

	getElementA: ()->
		return $(@elementA)
	getElementB: ()->
		return $(@elementB)
