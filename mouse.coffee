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
      #  console.log(result)
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
            $.numberShow = new NAN.NumberShow
                n: numberString,
                descriptions: result.descriptions.filter(
                    (desc)->
                        return desc != null and desc != ""
                    ).join("<br>"),
                score: result.score
            
            $.game.score.addValue(result.score)
            if result.score != 0
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
        if @path.length == 0 and grid.value == 0
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