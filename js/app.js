const scoreSound = document.getElementById('success-sound');
const winGameSound = document.getElementById('win-sound');
let selected = false;
let selectorPosition = 2;
let points = 0;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    if (this.x > 510) {
        this.x = -50;
        this.speed = 100 + Math.floor(Math.random() * 100 * points);
    }

    if (player.x < this.x + 80 &&
        player.x + 80 > this.x &&
        player.y < this.y + 60 &&
        60 + player.y > this.y) {
        player.x = 202;
        player.y = 405;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Gems for player
var Gem = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/Gem Orange.png';
    this.width = 75;
    this.height = 140;
};

// Update the Gem's position, required method for game
// Parameter: dt, a time delta between ticks
Gem.prototype.update = function(dt) {
    this.x += this.speed * dt;

    if (this.x > 510) {
        this.x = -50;
        this.speed = 100 + Math.floor(Math.random() * 150);
    }
    // what happens if the player touches the gem
    if (player.x < this.x + 60 &&
        player.x + 60 > this.x &&
        player.y < this.y + 80 &&
        80 + player.y > this.y) {
        //player touches gem     
        score();
    }
};

// Draw the Gem on the screen, required method for game
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};


// GemPoints object for points
var GemPoints = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Gem Blue.png';
    this.width = 65;
    this.height = 125;
};

GemPoints.prototype.update = function(dt) {};

// Draw GemPoints
GemPoints.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};


// Now write your own Player class
var Player = function(x, y, playerType) {
    this.x = x;
    this.y = y;
    this.player = playerType;
};

Player.prototype.update = function(dt) {};

// Draw the Player Object on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.player), this.x, this.y); //this.player
};

// Player handleInput() method
Player.prototype.handleInput = function(keyup) {
    if (selected === true) {
        if (keyup == 'left' && this.x > 0) {
            if (this.player === 'images/blue_wizard_right.png') {
                this.player = 'images/blue_wizard_left.png';
            }
            this.x -= 102;
        }
        if (keyup == 'right' && this.x < 405) {
            if(this.player === 'images/blue_wizard_left.png'){
                this.player = 'images/blue_wizard_right.png';
            }
            this.x += 102;
        }
        if (keyup == 'up' && this.y > 0) {
            this.y -= 83;
        }
        if (keyup == 'down' && this.y < 405) {
            this.y += 83;
        }
    }
}


// The Player Selector class
var Selector = function(x, y) {
    this.x = x;
    this.y = y;
    this.selector = 'images/Selector.png';
};

Selector.prototype.update = function(dt) {};

// Draw Player selector
Selector.prototype.render = function() {
    ctx.drawImage(Resources.get(this.selector), this.x, this.y); //this.selector
};

// Selector handleInput() method.
Selector.prototype.handleInput = function(keyup) {
    // Materialize toasts for user directions  materializecss.com/toasts.html
    //while moving back and forth toast msg 'Press the UP Arrow to select your character!'
    if (selected === false) {
        M.toast({ html: 'Press the UP Arrow to select your character!' });

        if (keyup == 'left' && this.x > 0) {
            this.x -= 102;
            selectorPosition -= 1;
        }
        if (keyup == 'right' && this.x < 405) {
            this.x += 102;
            selectorPosition += 1;
        }
        if (keyup == 'up' && this.y > 0) {
            this.y -= 40;
            scoreSound.play();
            setTimeout(function() {
                selected = true;
                selectPlayer();
                selector.x = 202; //selector
                selector.y = 445; //selector
                selector = null;
            }, 600);
        }
    }
};



// Now instantiate all your objects.

// init gem obj
gem = new Gem(0, 0, 200);


// init new enemy obj
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
var enemyLocation = [63, 147, 230];
enemyLocation.forEach(function(locationY) {
    enemy = new Enemy(0, locationY, 200);
    allEnemies.push(enemy);
});


// instantiate new player objects
// display all player options
let allPlayers = [];
var playerLocation = [02, 102, 202, 302, 402];
var playerTypes = ['images/char-cat-girl.png', 'images/blue_wizard_left.png', 'images/char-horn-girl.png',
    'images/char-pink-girl.png', 'images/char-princess-girl.png'
];
//loop through locations and playerTypes and push player to allPlayers array
for (i = 0; i < playerLocation.length; i++) {
    for (j = 0; j < playerTypes.length; j++) {
        player = new Player(playerLocation[i], 405, playerTypes[i]);
        allPlayers.push(player);
    }
}


//instantiate new gemPoints
// add gems, pushing to allGems arr, with every point by calling score() 
let allGemPoints = [];
let xLocation = -90;
// each gem added to a new location
function createGemPoints() {
    xLocation += 102;
    gemPoints = new GemPoints(xLocation, 450);
    allGemPoints.push(gemPoints);
}


//instantiate new selector
// This class requires an update() render() and handler
selector = new Selector(202, 445);


//instantiate the main selected player 
function selectPlayer() {
    if (selected === true) {
        allPlayers = [];
        player = new Player(playerLocation[selectorPosition], 405, playerTypes[selectorPosition]);
        allPlayers.push(player);
    }
}




//helper functions

// add points   
function score() {
    if (points <= 3) {
        scoreSound.play();
        player.x = 202; //player
        player.y = 405; //player
        points += 1;
        console.log(points);
        createGemPoints();
    } else if (points === 4) {
        winGame();
    }
}


// what happens when the player wins
function winGame() {
    player.x = 202; //player
    player.y = 405; //player
    points += 1;
    console.log(points);
    createGemPoints();
    winGameSound.play();
    console.log('you won');
    congratsModal();
}


// open hidden materialize modal 
// modal functionality uses https://materializecss.com/modals.html
function congratsModal() {
    var elem = document.querySelector('.modal');
    M.AutoInit();
    var instance = M.Modal.getInstance(elem);
    instance.open();
}


// facebook sharer button to share the game url
// this button will be inside the materialize modal that displays after win
var facebookShare = document.querySelector('[data-js="facebook-share"]');
facebookShare.onclick = function(e) {
    e.preventDefault();
    var facebookWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=' + document.URL, 'facebook-popup', 'height=350,width=600');
    if (facebookWindow.focus) { facebookWindow.focus(); }
    reset();
    return false;
}

function reset() {
    location.reload();
}

// This listens for key presses and sends the keys to your
// Player.handleInput() and Selector.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (selected === false) {
        selector.handleInput(allowedKeys[e.keyCode]);
    } else {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});


// Materialize toasts
// https://materializecss.com/toasts.html
// if user is clicking or tapping on screen the toast is a small popup
// pop up msg 'Select Player With Arrow Buttons!'
document.addEventListener('click', function(event) {
    if (selected === false) {
        M.toast({ html: 'Select Player With Arrow Buttons!' });
    }
});