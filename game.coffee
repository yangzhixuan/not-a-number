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


class NAN.Game
    constructor: ->
        $.backgroundBlockId = 0
        @background = new NAN.Background
        @score = new NAN.Score
        @gridId = 0
        @init()
        @gridMargin = 4
        @containerHeight = 680
        @containerWidth = 680
        @numGridRows = 6
        @numGridColumns = 6
        @numGrids = @numGridColumns * @numGridRows
        @gridWidth = (@containerWidth - 100) / @numGridRows
        @gridHeight = @gridWidth
        @gridXOffset = 90
        @gridYOffset = (@containerWidth - @numGridColumns * @gridWidth) / 2
        console.log(@gridWidth)
        setStyleRuleValue(".board", "width", "#{@containerWidth}px")
        setStyleRuleValue(".board", "height", "#{@containerHeight}px")
        setStyleRuleValue(".number", "line-height", "#{@gridHeight}px")
        setStyleRuleValue(".square", "height", "#{@gridHeight - @gridMargin * 2}px")
        setStyleRuleValue(".square", "width", "#{@gridWidth - @gridMargin * 2}px")
        
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
        if @time <= 100
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
            @timeLeft -= 0.03
        $("#progressbar").attr("value", "#{@timeLeft}")

$(document).ready( ->
    timeStep = 0
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
