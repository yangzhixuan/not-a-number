
class NAN.Game
    constructor: ->
        $.backgroundBlockId = 0
        @score = new NAN.Score
        @gridId = 0
        @init()
        @gridMargin = 2
        @containerHeight = 670
        @containerWidth = 600
        @numGridRows = 5
        @numGridColumns = 5
        @numGrids = @numGridColumns * @numGridRows
        @gridWidth = (@containerWidth - 100) / @numGridRows
        @gridHeight = @gridWidth
        @gridXOffset = 110
        @gridYOffset = (@containerWidth - @numGridColumns * @gridWidth) / 2
        setStyleRuleValue(".board", "width", "#{@containerWidth}px")
        setStyleRuleValue(".board", "height", "#{@containerHeight}px")
        setStyleRuleValue(".number", "line-height", "#{@gridHeight}px")
        setStyleRuleValue(".square", "height", "#{@gridHeight - @gridMargin * 2}px")
        setStyleRuleValue(".square", "width", "#{@gridWidth - @gridMargin * 2}px")
        @gameOver = false
        @grids = []
        @mouse = new NAN.Mouse
        @paused = true
        @timeLeft = 100
        @gridQueue = []
        for i in [0...@numGridRows]
            @grids[i] = []
        @initTouchScreen()
        @startTime = getTime()
        @gridsToShow = []

    initTouchScreen: ()->
        $("#container").on("touchstart",
            (e)=>
                grid = @getEventGrid(e)
                if grid
                    grid.mouseDown()
                return false
        )
        $("#container").on("touchmove",
            (e)=>
                grid = @getEventGrid(e)
                if grid
                    grid.mouseOver()
                console.log(grid)
                return false
        )
        $("#container").on("touchend",
            (e)=>
                @mouse.endPath()
                return false
        )


    getEventPosition: (e)->
        y = e.originalEvent.targetTouches[0].pageX - $("#container").offset().left
        x = e.originalEvent.targetTouches[0].pageY - $("#container").offset().top
        return {x: x, y : y}

    getEventGrid: (e)->
        pos = @getEventPosition(e)
        return @getGridAt(pos.x, pos.y)


    newGrid: (x, y, show = true)->
        grid = new NAN.Grid(x, y, this, show)
        @grids[x][y] = grid
        @gridQueue.push(grid)

    getGridAt: (x, y)->
        for grid in @gridQueue
            if grid.testInside(x, y)
                return grid
        return null


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
                        @newGrid(x, y, false)
                        @gridsToShow.push(@grids[x][y])
                        @grids[x][y].getElement().hide()
                        @grids[x][y].getElement().css("opacity", 0.0)

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
        if @gameOver
            return true
        if @time <= 60
            return true
        if $.numberShow and not $.numberShow.finished
            return true
        if not @movementEnd()
            return true
        return false

    update: ->
        @paused = @getPaused()
        if @time < @numGridRows * 5
            if @time % 5 == 0
                x = @time / 5
                for y in [0...@numGridColumns]
                    @newGrid(x, y)
        else
            @nextFrame()
        if @movementEnd()
            for grid in @gridsToShow
                grid.show()
            @gridsToShow = []
        @updateGrids()   
        @score.update()
        @time += 1
        if $.numberShow
            $.numberShow.update()
            if $.numberShow.finished
                $.numberShow = null

        if not @paused
            @timeLeft -= 0.05

        if @timeLeft < 0 and not @gameOver
            @over()

        $("#progressbar").attr("value", "#{@timeLeft}")

    over: ()->
        delay = 2000
        $("#game-over-screen").fadeIn(delay)
        @finalScore = @score.value
        @score.addValue(-@finalScore)
        @gameOver = true
        if @timeLeft >= 0
            $(".score").fadeOut(500)

        setTimeout(
            =>
                @score.addValue(@finalScore)
                $(".score").fadeIn(500)
            , delay
        )

$(document).ready( ->
    timeStep = 0
    $("#game-over-screen").hide()
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
    ###
    setTimeout(
        ->
            $("#how-to-play").slideDown(700)
        ,
        4000 * timeStep
    )
    ###
)
