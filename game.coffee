@hsvString = (h, s, v) ->
    color = hsvToRgb(h, s, v);
    return colorToString([Math.floor(color[0]), Math.floor(color[1]), Math.floor(color[2])])


@randomColor = ->
    color = hsvToRgb(Math.random() * 0.1 + 0.4, 0.8, 0.9);
    return [Math.floor(color[0]), Math.floor(color[1]), Math.floor(color[2])]

@colorToString = (color) ->
    return "rgb(#{color[0]}, #{color[1]}, #{color[2]})"


@randomColorString = ->
    color = randomColor()
    return colorToString(color)

@clamp = (a) ->
    return Math.max(Math.min(a, 1.0), 0.0)

@mediate = (left, right, rate)->
    return left + (right - left) * rate

@colorToString = (color)->
    return "hsla(#{(color.h - Math.floor(color.h)) * 360}, #{clamp(color.s) * 100}%, #{clamp(color.l) * 100}%, 1.0)"

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
        @getElement().append("<div class='number'>#{@value}</p>")
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
            movement = Math.min(@deltaX, 5)
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

class NAN.Mouse
    
    constructor: ->
        @path = []
        @state = "none"

    checkPath: ()->
        result = true
       # console.log(@path.length)
        if @path.length < 2
            result = false
        for i in [0...(@path.length - 1)]
            if @path[i].grid.isConnecting(@path[i + 1].grid) == false
                result = false
        return result

    evaluatePath: ()->
        result = ""
        for node in @path
            val = node.grid.value
            result += val.toString()
        console.log(result)
        return result

    beginPath: ()->
        @path = []
        @state = "select"

    endPath: ()->
        if @state == "none"
            return
        if @checkPath()
            numberString = @evaluatePath()
            result = $.analyzer.analyze(numberString)
            $.numberShow = new NAN.NumberShow(
                {
                    n: numberString,
                    descriptions: result.descriptions.filter(
                        (desc)->
                            return desc != null and desc != ""
                        ).join("<br>")
                }
            )
            $.game.score.addValue(result.score)
            for i in [0...@path.length]
                node = @path[i]
       #         node.grid.hideAfter(100 * i)
                node.grid.clean()
        for node in @path
            node.grid.selected = false
        @state = "none"
        @path = []

    addGrid: (grid)->
        if @path.length >= 9
            return
        inside = false
        for node in @path
            if node.x == grid.x and node.y ==  grid.y
                inside = true
        if not inside
            if @path.length == 0 or @path[@path.length - 1].grid.isConnecting(grid)
                grid.selected = true
                node = {x: grid.x, y: grid.y, grid: grid}
                @path.push(node)

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
        if data.descriptions == null or data.descriptions == ""
            data.descriptions = "Not Interesting"
        @getElementDescriptions().html(data.descriptions)

    getElement: ->
        $("#number-show")

    getElementNumber: ->
        $("#number-show-number")

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


class NAN.Game
    constructor: ->
        $.backgroundBlockId = 0
        @background = new NAN.Background
        @score = new NAN.Score
        @gridId = 0
        @init()
        @gridWidth = 60
        @gridHeight = 60
        @numGridColumns = 10
        @numGridRows = 8
        @numGrids = @numGridColumns * @numGridRows
        @gridXOffset = 90
#        console.log($("#container").width())
 #       @gridYOffset = ($("#container").width() - @numGridColumns * @gridWidth) / 2
        @gridYOffset = (680 - @numGridColumns * @gridWidth) / 2
        @grids = []
        @mouse = new NAN.Mouse
        @paused = true
        @timeLeft = 100
        @gridQueue = []
        for i in [0...@numGridRows]
            @grids[i] = []

    newGrid: (x, y)->
        grid = new NAN.Grid(x, y, this)
        @grids[x][y] = grid
        grid.init()
        @gridQueue.push(grid)

    init: ->
        @time = 0

    movementEnd: ->
        result = true
        for row in @grids
            for grid in row
                if grid != null and grid.deltaX != 0
                    result = false
        return result

    nextFrame: ->
        for x in [0...@numGridRows].reverse()
            for y in [0...@numGridColumns]
                if @grids[x][y] == null or not @grids[x][y].exist
                    if x > 0 and @grids[x - 1][y] != null
                        @grids[x - 1][y].deltaX += @gridHeight
                        @grids[x][y] = @grids[x - 1][y]
                        @grids[x - 1][y].moveTo(x, y)
                        @grids[x - 1][y] = null
                    else if x == 0
                        @newGrid(x, y)
#                    @grids[x][y].init()

    updateGrids: () ->
        newQueue = []
        for grid in @gridQueue
            if grid == null or grid.exist == false
                0
            else
                grid.update()
                newQueue.push(grid)
        @gridQueue = newQueue

    getPaused: ->
        if @time <= 40
            return true
        if $.numberShow and not $.numberShow.finished
            return true
        if not @movementEnd()
            return true
        return false

    update: ->
        @paused = @getPaused()
        if @time < @numGridRows
            x = @time
            for y in [0...@numGridColumns]
                @newGrid(x, y)
                ###
                grid.getElement().mouseover( ->
                    $(this).hide(400, ->
                        $(this).show(300)
                    )
                )
                ###
        else
            @nextFrame()
        @updateGrids()    
        @score.update()
        @background.update()
        @time += 1
        if $.numberShow
            $.numberShow.update()
            if $.numberShow.finished
                $.numberShow = null

        if not @paused
            @timeLeft -= 0.1
        $("#progressbar").attr("value", "#{@timeLeft}")

$(document).ready( ->
    timeStep = 1
    $("#number-show").hide()
    $("#number-show").css("opacity", "0.0")
    $.analyzer = new window.NAN.Analyzer
    $("#title").animate({top:"-=400px"}, 0)
    $("#title").animate({top:"+=400px"}, 1900 * timeStep)
    $("#how-to-play").slideUp(0)
    $("#container").animate({top:"+=700px"}, 0)
    $("#container").animate({top:"-=700px"}, 1900 * timeStep)
    $.game = new NAN.Game
    setTimeout(
        ->
            setInterval(
                -> 
                    $.game.update()
                , 
                20
            )
        ,
        2000 * timeStep
    )

    setTimeout(
        ->
            $("#title-1").animate({fontSize: "90px"}, 500 * timeStep)
            $("#title-2").slideUp(500 * timeStep)
            $("#title-3").animate({fontSize: "49px"}, 500 * timeStep)
        ,
        3000 * timeStep
    )
    $("body").mouseup(
        ->
            $.game.mouse.endPath()
    )
    setTimeout(
        ->
            $("#how-to-play").slideDown(700)
        ,
        4000 * timeStep
    )
)
