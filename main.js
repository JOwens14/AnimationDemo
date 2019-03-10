function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

function Background(game) {
	this.fbg = true;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/Ocean.gif"), 0, 0, 800, 600, 1, 1, true, true); //1500, 900
    Entity.call(this, game, 0, 0);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;
Background.xpos = 0;

Background.prototype.update = function () {
  this.animation = new Animation(ASSET_MANAGER.getAsset("./img/Ocean.gif"), 0, 0, 800, 600, 1, 1, true, true);
	Entity.prototype.update.call(this);
}

Background.prototype.draw = function (ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, Background.xpos, this.y);
  Entity.prototype.draw.call(this);
  Background.xpos--;
  if (Background.xpos < -799) {
    Background.xpos = 800;
  }
}

function BackgroundFlipped(game) {
	this.fbg = true;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/OceanFlip.gif"), 0, 0, 800, 600, 1, 1, true, true); //1500, 900
    Entity.call(this, game, 0, 0);
}

BackgroundFlipped.prototype = new Entity();
BackgroundFlipped.prototype.constructor = BackgroundFlipped;
BackgroundFlipped.xpos = 800;

BackgroundFlipped.prototype.update = function () {
  this.animation = new Animation(ASSET_MANAGER.getAsset("./img/OceanFlip.gif"), 0, 0, 800, 600, 1, 1, true, true);
	Entity.prototype.update.call(this);
}

BackgroundFlipped.prototype.draw = function (ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, BackgroundFlipped.xpos, this.y);
  Entity.prototype.draw.call(this);
  BackgroundFlipped.xpos--;
  if (BackgroundFlipped.xpos < -799) {
    BackgroundFlipped.xpos = 800;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function Character(game) {
	this.cat = 0;
	this.size = 200;
	this.updateAnimation();
    Entity.call(this, game, 340, 345);
}

Character.prototype = new Entity();
Character.prototype.constructor = Character;
Character.x= 100;
Character.y = 350;
Character.counter = 0;

Character.prototype.updateAnimation = function() {
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/tank.png"), 0, this.cat, this.size, this.size, 0.2, 3, true, true);
}

Character.prototype.update = function () {
	if(this.game.space) {
		if(this.cat == (this.size * 8) - this.size ? this.cat = 0 : this.cat += this.size);
		this.updateAnimation();
	}
	Entity.prototype.update.call(this);
}

Character.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, Character.x, Character.y);
    Entity.prototype.draw.call(this);
    if (Character.counter < 4) {
      if(Character.counter % 2 === 1) {
        Character.y--;
      }
    } else {
      if(Character.counter % 2 === 1) {
        Character.y++;
      }
    }
    Character.counter++;
    if (Character.counter === 8) {
      Character.counter =0;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function Soldier(game) {
	this.size = 128;
	this.updateAnimation();
    Entity.call(this, game, 340, 345);
}

Soldier.prototype = new Entity();
Soldier.prototype.constructor = Soldier;
Soldier.origin = 820;
Soldier.x= Soldier.origin;
Soldier.y = 395;
Soldier.counter = 0;
Soldier.kill = false;

Soldier.prototype.updateAnimation = function() {
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/soldier.png"), 0, 128, this.size, this.size, 0.2, 8, true, true);
}

Soldier.prototype.update = function () {
	if(this.game.space) {
		if(this.cat == (this.size * 8) - this.size ? this.cat = 0 : this.cat += this.size);
		this.updateAnimation();
	}
	Entity.prototype.update.call(this);
}

Soldier.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, Soldier.x, Soldier.y, .79);
    Entity.prototype.draw.call(this);
    Soldier.x -= 2;
    if (Soldier.kill) {
      Soldier.x = Soldier.origin;
      Soldier.kill = false;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
var Explosion = false;

function Shell(game) {
	this.sizeX = 25;
  this.sizeY = 13;
	this.updateAnimation();
    Entity.call(this, game, 340, 345);
}

Shell.prototype = new Entity();
Shell.prototype.constructor = Shell;
Shell.origin = 270;
Shell.x= Shell.origin;
Shell.y = 432;
Shell.counter = 0;

Shell.prototype.updateAnimation = function() {
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/shell.png"), 0, 0, this.sizeX, this.sizeY, 1, 1, true, true);
}

Shell.prototype.update = function () {
	if(this.game.space) {
		if(this.cat == (this.size * 8) - this.size ? this.cat = 0 : this.cat += this.size);
		this.updateAnimation();
	}
	Entity.prototype.update.call(this);
}

Shell.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, Shell.x, Shell.y);
    Entity.prototype.draw.call(this);
    Shell.x += 2;
    if (Shell.x < Soldier.x + 15 && Shell.x > Soldier.x + 10) {
      Soldier.kill = true;
      Explosion = true;
      Shell.x = Shell.origin;
      Boom.x = 535; //positions the explosion
      //Explosion = false;
    }

}


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function Boom(game) {
	this.sizeX = 128;
  this.sizeY = 128;
	this.updateAnimation();
    Entity.call(this, game, 340, 345);
}

Boom.prototype = new Entity();
Boom.prototype.constructor = Shell;
Boom.x= -100;
Boom.y = 410;
Boom.counter = 0;

Boom.prototype.updateAnimation = function() {
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/explosion.png"), 0, 0, this.sizeX, this.sizeY, 0.02, 12, true, false);
}

Boom.prototype.update = function () {
	if(this.game.space) {
		if(this.cat == (this.size * 8) - this.size ? this.cat = 0 : this.cat += this.size);
		this.updateAnimation();
	}
	Entity.prototype.update.call(this);
}

Boom.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, Boom.x, Boom.y, .8);
    Entity.prototype.draw.call(this);
    if (Explosion) {
      if (Boom.counter > 12) {
        Boom.counter = 0;
        Explosion = false;
      }
      Boom.counter++;
    } else {
      Boom.x = -100;
    }

}

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function Heli(game) {
	this.sizeX = 520;
  this.sizeY = 120;
	this.updateAnimation();
    Entity.call(this, game, 340, 345);
}

Heli.prototype = new Entity();
Heli.prototype.constructor = Shell;
Heli.x= 830;
Heli.y = 100;
Heli.counter = 0;

Heli.prototype.updateAnimation = function() {
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/heli.png"), 0, 0, this.sizeX, this.sizeY, 0.06, 3, true, true);
}

Heli.prototype.update = function () {
	if(this.game.space) {
		if(this.cat == (this.size * 8) - this.size ? this.cat = 0 : this.cat += this.size);
		this.updateAnimation();
	}
	Entity.prototype.update.call(this);
}

Heli.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, Heli.x, Heli.y, .25);
    Entity.prototype.draw.call(this);
    Heli.x -= 2;
    if (Heli.x < -250) {
      Heli.x = 850;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function Info(game) {
	this.show = true;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/info.png"), 0, 0, 320, 70, 1, 1, true, true);
    Entity.call(this, game, 0, 300);
}

Info.prototype = new Entity();
Info.prototype.constructor = Info;
Info.x = 240;
Info.y = 530;

Info.prototype.update = function () {
	if (this.game.enter) {
		this.show = false;
	}
}

Info.prototype.draw = function (ctx) {
	if(this.show) {
		this.animation.drawFrame(this.game.clockTick, ctx, Info.x, Info.y);
		Entity.prototype.draw.call(this);
	}
}

///////////////////////////////////////////////////////////////////////////////////////////
// the "main" code begins here
///////////////////////////////////////////////////////////////////////////////////////////

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/tank.png");
ASSET_MANAGER.queueDownload("./img/soldier.png");
ASSET_MANAGER.queueDownload("./img/shell.png");
ASSET_MANAGER.queueDownload("./img/explosion.png");
ASSET_MANAGER.queueDownload("./img/Ocean.gif");
ASSET_MANAGER.queueDownload("./img/OceanFlip.gif");
ASSET_MANAGER.queueDownload("./img/info.png");
ASSET_MANAGER.queueDownload("./img/heli.png");

ASSET_MANAGER.downloadAll(function () {
  var canvas = document.getElementById('gameWorld');
  var ctx = canvas.getContext('2d');

  var gameEngine = new GameEngine();

  var bg = new Background(gameEngine);

  var bg2 = new BackgroundFlipped(gameEngine);

  var character = new Character(gameEngine);

  var soldier = new Soldier(gameEngine);

  var shell = new Shell(gameEngine);

  var boom = new Boom(gameEngine);

  var heli = new Heli(gameEngine);

  var info = new Info(gameEngine);

  gameEngine.addEntity(bg);
  gameEngine.addEntity(bg2);
  gameEngine.addEntity(character);
  gameEngine.addEntity(shell);
  gameEngine.addEntity(soldier);
  gameEngine.addEntity(boom);
  gameEngine.addEntity(heli);



  gameEngine.addEntity(info);

  gameEngine.init(ctx);
  gameEngine.start();
});
