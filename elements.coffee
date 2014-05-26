class NAN.Score
    constructor: ->
#        $("#score").css("-webkit-transform", "translate()")
        @value = 0
        @displayedValue = 0
        @position = {x: 20, y: $("#container").width() / 2}

    addValue: (points)->
        @value += points

    update: ->
        delta = (@value - @displayedValue) * 0.1
#        if delta == 0 and @value > @displayedValue
#            delta = 1
        @displayedValue += delta
        $("#score").html("#{Math.floor(@displayedValue + 0.3)}")

class NAN.NumberShow
    constructor: (data)->
        @time = 0
        @finished = false
        @getElement().show()
        @getElement().animate({opacity: "0.95"}, 400)
        @getElementNumber().html(data.n)
        @getElementScore().html(data.score.toString() + " points")
        if data.descriptions == null or data.descriptions == ""
            data.descriptions = "Not Interesting"
        @getElementDescriptions().html(data.descriptions)

    getElement: ->
        $("#number-show")


    getElementNumber: ->
        $("#number-show-number")

    getElementScore: ->
        $("#number-show-score")

    getElementDescriptions: ->
        $("#number-show-descriptions")

    update: ->
        @time += 1
        if @time > 50
            @getElement().animate({opacity: "0.0"}, 400)
            setTimeout(
                =>
                    @getElement().hide(200)
                , 400
            )
            @finished = true