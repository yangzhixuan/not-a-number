// Generated by CoffeeScript 1.4.0
(function(){NAN.Grid=function(){function e(e,t,n){this.x=e,this.y=t,this.game=n,this.mouse=this.game.mouse,this.id=this.game.gridId,this.deltaX=0,this.game.gridId+=1,this.exist=!0,this.value=Math.floor(Math.random()*10),this.selected=!1,this.color=this.getColor(),this.remainedTime=-1}return e.prototype.cleaned=function(){return this.remainedTime>=0},e.prototype.clean=function(){return this.remainedTime=30},e.prototype.moveTo=function(e,t){return this.x=e,this.y=t},e.prototype.getColor=function(){var e;return e={},e.s=.5,this.selected?e.h=.3:e.h=.8,this.value==="NAN"?(e.h+=.1,e.l=.6):e.l=this.value*.01+.3,e},e.prototype.getPosition=function(){var e,t,n,r;return e={x:this.game.gridXOffset+this.x*this.game.gridHeight,y:this.game.gridYOffset+this.y*this.game.gridWidth},this.cleaned()?(t=.5+ -Math.cos(Math.PI*(30-this.remainedTime)/30)/2,n=mediate(e.x,this.game.score.position.x,t),r=mediate(e.y,this.game.score.position.y-this.game.gridWidth/2,t),{x:n,y:r}):e},e.prototype.getElement=function(){return $("#square-"+this.id)},e.prototype.isConnecting=function(e){var t;return t=Math.abs(e.x-this.x)+Math.abs(e.y-this.y)===1,t},e.prototype.init=function(){var e=this;return $("#container").append("<div class='square' id='square-"+this.id+"'></div>"),this.position=this.getPosition(),this.getElement().css("background-color",colorToString(this.color)),this.getElement().append("<div class='number'>"+this.value+"</div>"),this.getElement().hide(),this.getElement().show(500),this.getElement().mouseover(function(){return e.mouseOver(),!1}),this.getElement().mousedown(function(){return e.mouseDown(),!1}),this.getElement().mouseup(function(){return e.mouseUp(),!1}),this.update()},e.prototype.update=function(){var e;return this.cleaned()&&(this.remainedTime===0&&(this.exist=!1),this.getElement().css("opacity",Math.pow(this.remainedTime/30,3)),this.remainedTime-=1),this.color=this.getColor(),this.deltaX!==0&&(e=Math.min(this.deltaX,10),this.deltaX-=e,this.position.x+=e),this.cleaned()&&(this.position=this.getPosition()),this.position!==this.lastPosition&&(this.getElement().css("top",""+this.position.x+"px"),this.getElement().css("left",""+this.position.y+"px")),this.lastPosition={x:this.position.x,y:this.position.y},this.color!==this.lastColor&&this.getElement().css("background-color",colorToString(this.color)),this.lastColor=this.color},e.prototype.mouseDown=function(){if(this.mouse.state==="none")return this.mouse.beginPath(),this.mouse.addGrid(this)},e.prototype.mouseOver=function(){if(this.mouse.state==="select")return this.mouse.addGrid(this)},e.prototype.mouseUp=function(){if(this.mouse.state==="select")return this.mouse.addGrid(this),this.mouse.endPath()},e}()}).call(this);