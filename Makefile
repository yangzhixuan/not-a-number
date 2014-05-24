game-min.js: game.coffee
	coffee -c game.coffee
	uglifyjs game.js > game-min.js

background-min.js: background.coffee
	coffee -c background.coffee
	uglifyjs background.js > background-min.js

analyzer-min.js: analyzer.coffee
	coffee -c analyzer.coffee
	uglifyjs analyzer.js > analyzer-min.js

nan:  game-min.js background-min.js analyzer-min.js
	echo built