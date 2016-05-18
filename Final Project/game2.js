//cse-www.pltw.org/~rsanjpzy
var players = new Array;
var playerX;
var playerY;
var client;
var cDead = 0;
var ajaxGet;
function debug(stuff){
  document.getElementById("debug").value += stuff+"\n"
  document.getElementById("debug").scrollTop = document.getElementById("debug").scrollHeight
}

  var keyState = {}; 
  window.addEventListener('keydown',function(e){keyState[e.keyCode || e.which] = true;},true);    
  window.addEventListener('keyup',function(e){keyState[e.keyCode || e.which] = false;},true);

  function World(canvas){
    var self = this;
    this.init = function(){
      this.objects = [];
      this.canvas = document.getElementById(canvas);
      this.context = this.canvas.getContext("2d");
    }
    this.start = function(){
      self.drawObjects = setInterval(this.drawObjects,10);
      self.moveObj = setInterval(this.moveObjects,10);
    }
    this.clear = function(){
      self.context.fillStyle = "#34495e"
      self.context.fillRect(0,0,self.canvas.width,self.canvas.height);
    }
    this.drawObjects = function(){
      self.clear()
      self.objects.forEach(function(obj,index){
        if (typeof(obj.velX) !== 'undefined'){
          obj.move(obj);
        }
        self.objects[index].draw();
      });
      players.forEach(function(obj,index){
        players[index].draw();
      })
    }
    this.moveObjects = function(){
      self.objects.forEach(function(obj){
        // if (typeof(obj.velX) !== 'undefined'){
        //   obj.move(obj);
        // }
      });
    }
    this.appendObject = function(newObject){
      this.objects.push(newObject);
      return this.objects[this.objects.length-1]
    }
    this.init();
  }

  function Object(x,y,width,height,color,type,name){
    self = this
    this.init = function() {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      this.height = height;
      this.width = width;
      this.color = color;
      this.type = typeof type == "undefined" ? "nuetral":type;
      this.name = typeof name == "undefined" ? "NULL":name
    }
    this.draw = function(ctx){
      ctx = world.context;
      ctx.fillStyle=this.color
      ctx.strokeStyle="#FFFFFF"
      ctx.lineWidth  = 2;
      ctx.fillRect(this.x,this.y,this.width,this.height);
      ctx.strokeRect(this.x,this.y,this.width,this.height);
    }
    this.isTouching = function(self,o){
      if ((((o.x < self.x && self.x < (o.x + o.width)) || (o.x < (self.x + self.width) && (self.x + self.width) < (o.x + o.width)))) && (((o.y < self.y && self.y < (o.y + o.height)) || (o.y < (self.y + self.height) && (self.y + self.height) < (o.y + o.height))))) {
        return  true
      }
    }
    this.init();
  }

  function Obstacle(x,y,width,height,color){
      this.init = function() {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      this.height = height;
      this.width = width;
      this.color = color;
    }

    this.init();
  }
  Obstacle.prototype = new Object();

  function Movable(x,y,width,height,color,speed){
    var self = this;
    this.init = function() {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      this.speed = speed;
      this.velX = 0.0;
      this.velY = 0.0;
      this.height = height;
      this.width = width;
      this.color = color;
    }
    this.move = function(s) {
      if (cDead == 1){
        cDead = 0;
        s.x = 270;
        s.y = 0;
        debug ("You ded");
      }
      world.objects.concat(players).forEach(function(obj){
      s.x = s.x + s.velX
      s.y =  s.y + s.velY 
        if (!(obj instanceof Player)) {
          var xChangeNeg = 0
          var xChangePos = 0
          var xChange = 0
          var yChangeNeg = 0
          var yChangePos = 0
          var yChange = 0
          var xOrig = s.x
          var yOrig = s.y
          if(s.isTouching(s,obj)){

            if (obj.type === "enemy") {
              if (s.x+s.height>obj.x && s.x < obj.x){
                s.velY *= -1
                ajaxGet = obj.name;
              }
              else
              {
                debug("You died");
                s.x = 270;
                s.y = 0;
                s.canJump = false;
              }
            }
            else {
              while (s.isTouching(s,obj)){
                s.x +=
                xChangePos ++
              }
              s.x = xOrig
              while (s.isTouching(s,obj)){
                s.x --
                xChangeNeg --
              }
              s.x = xOrig
              xChange = Math.abs(xChangeNeg) > xChangePos ? xChangePos : xChangeNeg;

              while (s.isTouching(s,obj)){
                s.y ++
                yChangePos ++
              }
              s.y = yOrig
              while (s.isTouching(s,obj)){
                s.y --
                yChangeNeg --
              }
              s.y = yOrig
              yChange = Math.abs(yChangeNeg) > yChangePos ? yChangePos : yChangeNeg;
              if (Math.abs(yChange) > Math.abs(xChange)){
                s.x += xChange
              }
              else {
                s.y += yChange
                s.velY = 0;
                s.canJump=true;
              }
            }
          }
          client = s;
          playerX = s.x;
          playerY = s.y;
        }
      });
    }
    this.init();
  }
  Movable.prototype = new Object();

  function Player(x,y,width,height,color,speed){
    var self = this
    this.init = function() {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      this.speed = speed;
      this.height = height;
      this.width = width;
      this.color = color;
      this.dead = 0;
      this.canJump = false;
    }
    this.testKeys = function(){
      if (keyState[87]){
        if (self.canJump == true){
          self.velY = -3;//-self.speed;
          self.canJump = false;
        } 
      }
      if (keyState[83]){
        self.velY = self.speed;
      }
      if (keyState[65]){
        self.velX = -self.speed;
      }
      if (keyState[68]){
        self.velX = self.speed;
      }

      if (self.velX != 0){
        self.velX = ((self.velX - .1*(Math.abs(self.velX)/self.velX)).toFixed(1))/1
      }

      if (self.velY != 0){
        //self.velY = ((self.velY - .1*(Math.abs(self.velY)/self.velY)).toFixed(1))/1
      }
      self.velY += 0.1;

    }
    this.init(); 
  }
  Player.prototype = new Movable();


function sendPlayerData(x,y,name,game,player){
  var send = "?x="+x+"&y="+y+"&name="+name;
  $.ajax({url:"https://cse-www.pltw.org/~rsanjpzy/final_game.php"+send+(ajaxGet = "" ? "":"?killed="+ajaxGet),dataType:"jsonp",success:function(data, status){
    players = [];
    cDead = 0;
    console.log(data.dead);
    for (var playerNum = 0; playerNum < data.players.length; playerNum ++){
      if (data.players[playerNum].sessionid != data.session){
        players[playerNum] = new Object(data.players[playerNum].xpos,data.players[playerNum].ypos,30,30,"#D490A3","enemy",data.players[playerNum].sessionid);
      }
    }
    return data;
  }});
}