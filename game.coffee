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

@colorToString = (color)->
    return "hsla(#{color.h * 360}, #{color.s * 100}%, #{color.l * 100}%, 1.0)"

class Grid 
    constructor: (@x, @y, @game)->
        @mouse = @game.mouse

        @value = Math.pow(2, Math.floor(Math.random() * 10 - 2))
        if @value < 1
            @value = "NAN"
        @selected = false

        @color = @getColor()
        
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
            color.l = Math.log(@value) * 0.05 + 0.3

        return color 

    getElement: () ->
        return $("#square-#{@x * $.game.numGridColumns + @y}")

    isCconnecting: (grid) ->
        neighbouring = (Math.abs(grid.x - @x) + Math.abs(grid.y - @y) == 1)
        doubling = (grid.value == @value * 2)
        nan = (@value == "NAN" or grid.value == "NAN")
        return neighbouring and (doubling or nan)

    init: ()->
        $("#container").append("<div class='square' id='square-#{@x * @game.numGridColumns + @y}'></div>")
        @getElement().css("-webkit-transform", "translate(#{20 + @y * @game.gridHeight}px, #{20 + @x * @game.gridWidth}px)")
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

    update: ->
        @color = @getColor()
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

    hideAfter: (time)->
        setTimeout(
            =>
                @getElement().hide(300)
            , time)

class Mouse
    
    constructor: ->
        @path = []
        @state = "none"

    checkPath: ()->
        result = true
       # console.log(@path.length)
        if @path.length < 3
            result = false
        for i in [0...(@path.length - 1)]
            if @path[i].grid.isCconnecting(@path[i + 1].grid) == false
                result = false
        return result

    beginPath: ()->
        @path = []
        @state = "select"


    endPath: ()->
        if @checkPath()
            for i in [0...@path.length]
                node = @path[i]
                node.grid.hideAfter(100 * i)
                console.log(i)
        for node in @path
            node.grid.selected = false
        @state = "none"
        @path = []

    addGrid: (grid)->
        node = {x: grid.x, y: grid.y, grid: grid}
        if not (node in @path)
            if @path.length == 0 or @path[@path.length - 1].grid.isCconnecting(grid)
                grid.selected = true
                @path.push(node)

class Game
    constructor: ->
        @init()
        @gridWidth = 64
        @gridHeight = 64
        @numGridColumns = 10
        @numGridRows = 10
        @numGrids = @numGridColumns * @numGridRows
        @grids = []
        @mouse = new Mouse
        @paused = true
        @timeLeft = 100
        for i in [0...@numGridRows]
            @grids[i] = []

    init: ->
        @time = 0

    getGrid: (x, y) ->
        return $("#square-#{x * @numGridColumns + y}")

    update: ->
        if @time < @numGridRows
            x = @time
            for y in [0...@numGridColumns]
#                console.log(x, y)
#                $("#container").css("-webkit-transform", "rotateZ(#{@a}deg)")
                grid = new Grid(x, y, this)
                @grids[x][y] = grid
                grid.init()
                ###
                grid.getElement().mouseover( ->
                    $(this).hide(400, ->
                        $(this).show(300)
                    )
                )
                ###
        else
            if @time > 20
                @paused = false 
            dx = [0, 1, 0, -1]
            dy = [1, 0, -1, 0]
            for x in [0...@numGridRows]
                for y in [0...@numGridColumns]
                    @grids[x][y].update()
                    for k in [0...4]
                        neiX = x + dx[k]
                        neiY = y + dy[k]
                        if neiX in [0...@numGridColumns] and neiY in [0...@numGridColumns]
                            if @grids[x][y].isCconnecting(@grids[neiX][neiY])
                                1
#                                @grids[x][y].getElement().css("background-color", "white")
            
        @time += 1
        if not @paused
            @timeLeft -= 0.1
        $("#progressbar").attr("value", "#{@timeLeft}")
#        $("#title").css("-webkit-transform", "rotateZ(#{Math.sin(@time / 20) * 5}deg)")
#    $("#hehehe").css("-webkit-transform", "rotateX(#{@a}deg)")


$(document).ready( ->
    timeStep = 0
    $("#title").animate({left:"+=1000px"}, 0)
    $("#title").animate({left:"-=1000px"}, 1900 * timeStep)
#    $("#title").animate({left:"-=1000px"}, 900)
#    $("#title").hide("scale", {percent: 50, direction: 'horizontal'}, 200);
#    $("#title").animate({height:"0px"}, "slow")
    $("#container").animate({top:"+=500px"}, 0)
    $("#container").animate({top:"-=500px"}, 1900 * timeStep)
    $.game = new Game
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
)
