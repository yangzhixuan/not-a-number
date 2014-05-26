class NAN.Grid 
    constructor: (@x, @y, @game)->
        @mouse = @game.mouse
        @id = @game.gridId
        @deltaX = 0
        @game.gridId += 1
        @exist = true
        @value = Math.floor(Math.random() * 10)
        @selected = false

        @color = @getColor() 
        @remainedTime = -1

    cleaned: ()->
        return @remainedTime >= 0

    clean: ()-> 
        @remainedTime = 30

    moveTo: (x, y)-> 
        @x = x
        @y = y

        
    getColor: ()->
        color = {}
        color.s = 0.5
        if @selected
            color.h = 0.3
        else
            color.h = 0.8

        if @value == "NAN"
            color.h += 0.1
            color.l = 0.6
        else
            color.l = @value * 0.01 + 0.3

        return color 

    getPosition: ()->
        originPosition = {x: @game.gridXOffset + @x * @game.gridHeight, y: @game.gridYOffset + @y * @game.gridWidth}
#        console.log(@game.gridYOffset)
        if @cleaned()
            rate = 0.5 + -Math.cos(Math.PI * (30 - @remainedTime) / 30) / 2
            x = mediate(originPosition.x, @game.score.position.x, rate)
            y = mediate(originPosition.y, @game.score.position.y - @game.gridWidth / 2, rate)
            return {x: x, y: y}

        return originPosition

    getElement: () ->
        return $("#square-#{@id}")

    isConnecting: (grid) ->
        neighbouring = (Math.abs(grid.x - @x) + Math.abs(grid.y - @y) == 1)
        return neighbouring

    init: ()->
        $("#container").append("<div class='square' id='square-#{@id}'></div>")
        @position = @getPosition()
        @getElement().css("background-color", colorToString(@color))
        @getElement().append("<div class='number'>#{@value}</div>")
        @getElement().hide()
        @getElement().show(500)
        @getElement().mouseover(
            =>
                @mouseOver()
                return false;
        )
        @getElement().mousedown(
            =>
                @mouseDown()
                return false;
        )
        @getElement().mouseup(
            =>
                @mouseUp()
                return false;
        )
        @update()

    update: ->
        if @cleaned()
            if @remainedTime == 0
                @exist = false
            @getElement().css("opacity", Math.pow(@remainedTime / 30, 3))

            @remainedTime -= 1

        @color = @getColor()
        if @deltaX != 0
            movement = Math.min(@deltaX, 10)
            @deltaX -= movement
            @position.x += movement
        if @cleaned()
            @position = @getPosition()
        if @position != @lastPosition
            @getElement().css("top", "#{@position.x}px")
            @getElement().css("left", "#{@position.y}px")
        @lastPosition = {x:@position.x, y:@position.y}

        if @color != @lastColor
            @getElement().css("background-color", colorToString(@color))
        @lastColor = @color

    mouseDown: ()->
        if @mouse.state == "none"
            @mouse.beginPath()
            @mouse.addGrid(this)

    mouseOver: ()->
        if @mouse.state == "select"
            @mouse.addGrid(this)

    mouseUp: ()->
        if @mouse.state == "select"
            @mouse.addGrid(this)
            @mouse.endPath()
