// GameBoard code below
function distance(a, b) {
    var difX = a.x - b.x;
    var difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY);
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 *
 * http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */
function getRandomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Circle(game) {
    this.radius = getRandomIntBetween(0, 20);
    this.colors = ["Red", "Green", "Blue", "White"];
    this.color = getRandomIntBetween(0, 3);
    
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
    
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
}


Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.collideRight = function () {
    return this.x + this.radius > 800;
};

Circle.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};

Circle.prototype.collideBottom = function () {
    return this.y + this.radius > 800;
};

Circle.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x;
    }
    
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent)) {

            if (this.radius > ent.radius && this.color !== ent.color) {
                
                this.radius += ent.radius;
                ent.removeFromWorld = true;
            
            } else if (this.radius > ent.radius && this.color === ent.color) {

                var temp = this.velocity;
                this.velocity = ent.velocity;
                ent.velocity = temp;
            }   
        };
    };

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        
        if (this != ent) {
            var dist = distance(this, ent);
            var difX = (ent.x - this.x) / dist;
            var difY = (ent.y - this.y) / dist;
            this.velocity.x += difX / (dist * dist) * acceleration;
            this.velocity.y += difY / (dist * dist) * acceleration;

            var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            
            if (speed > maxSpeed) {
                var ratio = maxSpeed / speed;
                this.velocity.x *= ratio;
                this.velocity.y *= ratio;
            };
        };
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;

}

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

function LoadCircle(color, radius, velocity, x, y) {
    this.color = color;
    this.radius = radius;
    this.velocity = velocity;
    this.x = x;
    this.y = y;
}

function CreateCircleFromLoadedCircle(game, color, radius, velocity, x, y) {
    this.radius = radius;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.color = color;

    Entity.call(this, game, x, y);

    this.velocity = velocity;

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
}

CreateCircleFromLoadedCircle.prototype = new Entity();
CreateCircleFromLoadedCircle.constructor = CreateCircleFromLoadedCircle;

CreateCircleFromLoadedCircle.prototype.collideRight = function () {
    return this.x + this.radius > 800;
};

CreateCircleFromLoadedCircle.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};

CreateCircleFromLoadedCircle.prototype.collideBottom = function () {
    return this.y + this.radius > 800;
};

CreateCircleFromLoadedCircle.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

CreateCircleFromLoadedCircle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

CreateCircleFromLoadedCircle.prototype.update = function () {
    Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x;
    }
    
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent)) {

            if (this.radius > ent.radius && this.color !== ent.color) {
                
                this.radius += ent.radius;
                ent.removeFromWorld = true;
            
            } else if (this.radius > ent.radius && this.color === ent.color) {

                var temp = this.velocity;
                this.velocity = ent.velocity;
                ent.velocity = temp;
            }   
        };
    };

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        
        if (this != ent) {
            var dist = distance(this, ent);
            var difX = (ent.x - this.x) / dist;
            var difY = (ent.y - this.y) / dist;
            this.velocity.x += difX / (dist * dist) * acceleration;
            this.velocity.y += difY / (dist * dist) * acceleration;

            var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            
            if (speed > maxSpeed) {
                var ratio = maxSpeed / speed;
                this.velocity.x *= ratio;
                this.velocity.y *= ratio;
            };
        };
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;

}

CreateCircleFromLoadedCircle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

var friction = 1;
var acceleration = 1000;
var maxSpeed = 1000;

// the "main" code begins here
var socket = io.connect("http://76.28.150.193:8888");

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    for (var i = 0; i < 20; i++) {
        var circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    };

    var saveButton = document.getElementById("save").addEventListener("click", function(event) {
        var circleData = {circles: []};
        
        for (var i = 0; i < gameEngine.entities.length; i++) {
            var circle = gameEngine.entities[i];
            var loadCircle = new LoadCircle(circle.color, circle.radius, circle.velocity, circle.x, circle.y);
            circleData.circles.push(loadCircle);
        }
        
        //save to server
        socket.emit("save", {studentname: "Jason Thai", statename: "Spawn Circles", data: circleData});
    });

    var loadButton = document.getElementById("load").addEventListener("click", function(event) {
        //tells server to send a load event back to us
        socket.emit("load", { studentname: "Jason Thai", statename: "Spawn Circles"});
    });

    //listens for server load event and data being passed
    socket.on("load", function (data) {
        gameEngine.removeAllEntities();

        console.log(data);
        var circles = data.data.circles;
        
        for (var i = 0; i < circles.length; i++) {
            var loadedCircle = circles[i];
            var color = loadedCircle.color;
            var radius = loadedCircle.radius;
            var velocity = loadedCircle.velocity;
            var x = loadedCircle.x;
            var y = loadedCircle.y;

            var circle = new CreateCircleFromLoadedCircle(gameEngine, color, radius, velocity, x, y);
            gameEngine.addEntity(circle);
        }
    });

    socket.on("connect", function () {
        console.log("Socket connected.")
    });
    
    gameEngine.init(ctx);
    gameEngine.start();
});

