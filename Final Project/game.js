"use strict";
var keyState = {}; 
window.addEventListener('keydown',function(e){keyState[e.keyCode || e.which] = true;},true);    
window.addEventListener('keyup',function(e){keyState[e.keyCode || e.which] = false;},true);

class world {
  constructor(ctx)
  {
    this.ctx = document.getElementById(ctx).getContext('2d')
    this.element = document.getElementById(ctx)
    this.objects = []
  }
  addObject(newObject){
    this.objects.push(newObject)
    return this.objects.length-1
  }
  drawObjects(){
    this.clear()
    for (var objIndex = 0; objIndex < this.objects.length; objIndex ++) {
      this.objects[objIndex].draw(this.ctx,this.objects[objIndex])
      console.log(this.objects[objIndex].color)
      console.log(objIndex)
    }
  }
  clear() {
    this.element.getContext('2d').clearRect(0, 0, this.element.width, this.element.height)
  }
  start(){
    
  }
}

class object {
  constructor(x,y,width,height,color,outline) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = typeof color !== 'undefined' ? color : "#FFFFFF";
  }
  draw(ctx,obj) {
  	ctx.fillStyle=obj.color
    ctx.strokeStyle="#000000"
    ctx.lineWidth = 2;
  	ctx.rect(obj.x, obj.y, obj.width, obj.height)
    ctx.fill()
    ctx.stroke()
  }
}

class player extends object {
  constructor(x,y,width,height,name,color,outline) {
    super(x,y,width,height,color,outline)
    this.image
    this.name
    this.score
    this.velX
    this.velY
  }
}


class client extends player {
  constructor(x,y,width,height,name,color,outline) {
    super(x,y,width,height,name,color,outline)
  }
}

var game
var obj
var cln
var timer
function main()
{
	game = new world("game")
  game.start()
  game.addObject(new client (0,0,30,30,'Player','#5CD3FA','#000000'))
  game.addObject(new object (250,50,60,30,'#444444','#000000'))
  game.drawObjects(game)
  console.log("-------")
  game.objects[0].x = 30
  game.drawObjects(game)
}