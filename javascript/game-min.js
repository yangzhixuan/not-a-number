// Generated by CoffeeScript 1.4.0
(function(){this.hsvString=function(e,t,n){var r;return r=hsvToRgb(e,t,n),colorToString([Math.floor(r[0]),Math.floor(r[1]),Math.floor(r[2])])},this.randomColor=function(){var e;return e=hsvToRgb(Math.random()*.1+.4,.8,.9),[Math.floor(e[0]),Math.floor(e[1]),Math.floor(e[2])]},this.colorToString=function(e){return"rgb("+e[0]+", "+e[1]+", "+e[2]+")"},this.randomColorString=function(){var e;return e=randomColor(),colorToString(e)},this.clamp=function(e){return Math.max(Math.min(e,1),0)},this.mediate=function(e,t,n){return e+(t-e)*n},this.colorToString=function(e){return"hsla("+(e.h-Math.floor(e.h))*360+", "+clamp(e.s)*100+"%, "+clamp(e.l)*100+"%, 1.0)"},NAN.Game=function(){function e(){var e,t,n;$.backgroundBlockId=0,this.background=new NAN.Background,this.score=new NAN.Score,this.gridId=0,this.init(),this.gridMargin=4,this.containerHeight=680,this.containerWidth=680,this.numGridRows=6,this.numGridColumns=6,this.numGrids=this.numGridColumns*this.numGridRows,this.gridWidth=(this.containerWidth-100)/this.numGridRows,this.gridHeight=this.gridWidth,this.gridXOffset=90,this.gridYOffset=(this.containerWidth-this.numGridColumns*this.gridWidth)/2,console.log(this.gridWidth),setStyleRuleValue(".board","width",""+this.containerWidth+"px"),setStyleRuleValue(".board","height",""+this.containerHeight+"px"),setStyleRuleValue(".number","line-height",""+this.gridHeight+"px"),setStyleRuleValue(".square","height",""+(this.gridHeight-this.gridMargin*2)+"px"),setStyleRuleValue(".square","width",""+(this.gridWidth-this.gridMargin*2)+"px"),this.grids=[],this.mouse=new NAN.Mouse,this.paused=!0,this.timeLeft=100,this.gridQueue=[];for(e=t=0,n=this.numGridRows;0<=n?t<n:t>n;e=0<=n?++t:--t)this.grids[e]=[]}return e.prototype.newGrid=function(e,t){var n;return n=new NAN.Grid(e,t,this),this.grids[e][t]=n,n.init(),this.gridQueue.push(n)},e.prototype.init=function(){return this.time=0},e.prototype.movementEnd=function(){var e,t,n,r,i,s,o,u;t=!0,u=this.grids;for(r=0,s=u.length;r<s;r++){n=u[r];for(i=0,o=n.length;i<o;i++)e=n[i],e!==null&&e.deltaX!==0&&(t=!1)}return t},e.prototype.nextFrame=function(){var e,t,n,r,i,s,o,u,a;o=function(){a=[];for(var e=0,t=this.numGridRows;0<=t?e<t:e>t;0<=t?e++:e--)a.push(e);return a}.apply(this).reverse(),u=[];for(n=0,i=o.length;n<i;n++)e=o[n],u.push(function(){var n,r,i;i=[];for(t=n=0,r=this.numGridColumns;0<=r?n<r:n>r;t=0<=r?++n:--n)this.grids[e][t]===null||!this.grids[e][t].exist?e>0&&this.grids[e-1][t]!==null?(this.grids[e-1][t].deltaX+=this.gridHeight,this.grids[e][t]=this.grids[e-1][t],this.grids[e-1][t].moveTo(e,t),i.push(this.grids[e-1][t]=null)):e===0?i.push(this.newGrid(e,t)):i.push(void 0):i.push(void 0);return i}.call(this));return u},e.prototype.updateGrids=function(){var e,t,n,r,i;t=[],i=this.gridQueue;for(n=0,r=i.length;n<r;n++)e=i[n],e===null||e.exist===!1?0:(e.update(),t.push(e));return this.gridQueue=t},e.prototype.getPaused=function(){return this.time<=100?!0:$.numberShow&&!$.numberShow.finished?!0:this.movementEnd()?!1:!0},e.prototype.update=function(){var e,t,n,r;this.paused=this.getPaused();if(this.time<this.numGridRows){e=this.time;for(t=n=0,r=this.numGridColumns;0<=r?n<r:n>r;t=0<=r?++n:--n)this.newGrid(e,t)}else this.nextFrame();return this.updateGrids(),this.score.update(),this.background.update(),this.time+=1,$.numberShow&&($.numberShow.update(),$.numberShow.finished&&($.numberShow=null)),this.paused||(this.timeLeft-=.03),$("#progressbar").attr("value",""+this.timeLeft)},e}(),$(document).ready(function(){var e;return e=0,$("#number-show").hide(),$("#number-show").css("opacity","0.0"),$.analyzer=new window.NAN.Analyzer,$("#title").animate({top:"-=400px"},0),$("#title").animate({top:"+=400px"},1900*e),$("#how-to-play").slideUp(0),$("#container").animate({top:"+=700px"},0),$("#container").animate({top:"-=700px"},1900*e),$.game=new NAN.Game,setTimeout(function(){return setInterval(function(){return $.game.update()},20)},2e3*e),setTimeout(function(){return $("#title-1").animate({fontSize:"90px"},500*e),$("#title-2").slideUp(500*e),$("#title-3").animate({fontSize:"49px"},500*e)},3e3*e),$("body").mouseup(function(){return $.game.mouse.endPath()}),setTimeout(function(){return $("#how-to-play").slideDown(700)},4e3*e)})}).call(this);