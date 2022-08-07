const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//player

var player = {
	x : (canvas.width - 96) / 2,
	y : (canvas.height - 96) / 2,
	width : 96,
	height : 96
};

var img_up = new Image();
img_up.src = "assets/player/up.png";
var img_down = new Image();
img_down.src = "assets/player/down.png";
var img_left = new Image();
img_left.src = "assets/player/left.png";
var img_right = new Image();
img_right.src = "assets/player/right.png";

// bullets
var bullet_up = new Image();
bullet_up.src = "assets/player/bullet_up.png";
var bullet_down = new Image();
bullet_down.src = "assets/player/bullet_down.png";
var bullet_left = new Image();
bullet_left.src = "assets/player/bullet_left.png";
var bullet_right = new Image();
bullet_right.src = "assets/player/bullet_right.png";

var score = 0;
var bullet_timer = 1000;
var current_img = img_up;
var bullets = [];
var regen_timer = 0;
var health = 100;
var game_over = false;
var bullets_left = 15;
var background_change = 0;

// Audio

var gunsound = new Audio('assets/sounds and others/gunsound.wav');
var zombiedeath = new Audio('assets/sounds and others/zombiedeathnew.wav');
var zombiespawn = new Audio('assets/sounds and others/zombiespawn.wav');
var blank = new Audio('assets/sounds and others/blank.wav');
var reload = new Audio('assets/sounds and others/reload.wav');

var music = new Audio('assets/sounds and others/music.wav'); 
music.loop = true;

window.onload = function(){
	var fps = 60;
	document.addEventListener("keydown", keydown);
	document.addEventListener("keydown", menu_controls);
	setInterval(gameloop, 1000 / fps);
}

// backgrounds

var grass = new Image();
grass.src = "assets/backgrounds/grass.png";

var cobble = new Image();
cobble.src = "assets/backgrounds/cobble.png";

var mud = new Image();
mud.src = "assets/backgrounds/mud.png";

var sand = new Image();
sand.src = "assets/backgrounds/sand.png";

// list
var background_no = 0;
var backgrounds = [grass, cobble, mud, sand];
var current_background = backgrounds[background_no];

function gameloop(){
	if (current_state == "menu"){
		menu_draw();	
	}

	if (current_state == "action"){
		enemy_update();
		update();
		draw();	
	}
}

function update(){

	bullet_timer = bullet_timer - 60;

	for (var i = 0; i <= bullets.length; i++) {
		if (bullets[i]){
			if (bullets[i].direction == "left"){
				bullets[i].x -= 15;	
			}

			if (bullets[i].direction == "right"){
				bullets[i].x += 15;	
			}

			if (bullets[i].direction == "up"){
				bullets[i].y -= 15;	
			}

			if (bullets[i].direction == "down"){
				bullets[i].y += 15;	
			}
		}
	}	

	for (var i = 0; i <= bullets.length; i++) {
		if (bullets[i]){
			if (bullets[i].x < 0 || bullets[i].x > canvas.width || bullets[i].y > canvas.height || bullets[i].y < 0){
				bullets.splice(i, 1);
			}
		}
	}

	collision_check();
}

function draw(){
	ctx.globalAlpha = 1;

	ctx.fillStyle = "#e6aa05";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	background_draw();
	
	ctx.drawImage(current_img, player.x, player.y);

	for (var i = 0; i <= bullets.length; i++) {
		if (bullets[i]){
			ctx.drawImage(bullets[i].img, bullets[i].x, bullets[i].y);	
		}
	}
	
	enemy_draw();

	ctx.fillStyle = "black";
	ctx.font = "30px Arial";
	ctx.fillText("Score: " + score, 10, 50);

	ctx.fillText("Health: " + Math.floor(health), 640, 50);

	// ctx.fillText("speed: " + enemy_speed, 600, 100);

	ctx.fillText("15/" + bullets_left, 640, 100);	

	if (bullets_left <= 0){
		ctx.fillText("R to reload", (canvas.width - 170) / 2, ((canvas.height - 20) / 2) + 50);		
	}

	if (game_over){
		ctx.fillText("GAME OVER", (canvas.width - 170) / 2, (canvas.height - 20) / 2);

		ctx.fillText("R to restart", (canvas.width - 170) / 2, ((canvas.height - 20) / 2) + 50);		
	}

	hurt();
}

function add_bullet(){
	if (bullet_timer <= 0 && bullets_left > 0){
		bullet_timer = 1000;
		bullets_left = bullets_left - 1;

		gunsound.play();
		
		var bullet = {};
			bullet.width = 10;
			bullet.height = 10;

		if (current_img == img_left){
			bullet.direction = "left";
			bullet.img = bullet_left;
			bullet.x = player.x;
			bullet.y = player.y + 40;
		}

		if (current_img == img_right){
			bullet.direction = "right";
			bullet.img = bullet_right;
			bullet.x = player.x + 80;
			bullet.y = player.y + 40;
		}

		if (current_img == img_up){
			bullet.direction = "up";
			bullet.img = bullet_up;
			bullet.x = player.x + 40;
			bullet.y = player.y + 10;
		}

		if (current_img == img_down){
			bullet.direction = "down";
			bullet.img = bullet_down;
			bullet.x = player.x + 40;
			bullet.y = player.y + 70;
		}

		bullets.push(bullet);
	}

	if (bullets_left <= 0){
		blank.play();
	}
}

function collision_check(){
	for (var i = 0; i <= bullets.length; i++) {
		for (var j = 0; j <= enemies.length; j++) {
			if (bullets[i] && enemies[j]){
				if (CheckCollision(bullets[i], enemies[j])){
					zombiedeath.play();
					bullets.splice(i, 1);
					enemies.splice(j, 1);
					score = score + 1;
					regen_timer = regen_timer + 1;
					background_change = background_change + 1;
				}
			}
		}	
	}

	for (var j = 0; j <= enemies.length; j++) {
		if (enemies[j]){
			if (CheckCollision(player, enemies[j])){
				health = health - 1;
				if (health <= 0){
					health = 0;
				}
			}
		}
	}	

	if (health <= 0){
		game_over = true;
	}

	if (regen_timer >= 10){
		regen_timer = 0;
		health = 100;
	}

	if (background_change >= 25){
		background_change = 0;
		background_no = background_no + 1;
		current_background = backgrounds[background_no];
		enemy_speed = enemy_speed + 0.5;
	}

	if (enemy_speed >= 10){
		enemy_speed = 10;
	}

	if (background_no >= 4){
		background_no = 0;
		current_background = backgrounds[background_no];
	}
}

function keydown(event){
	if (game_over == false){
		switch(event.keyCode){
			case 37:current_img = img_left; return;
			case 38:current_img = img_up;return;
			case 39:current_img = img_right;return;
			case 40:current_img = img_down;return;
			case 90:add_bullet();return;
			case 80:pause();return;
		}	
	}

	switch(event.keyCode){
		case 73:music.play();break;
		case 79:stopAudio(music);break;
		case 82:reset();break;
	}
}

function CheckCollision(a, b){
	return a.x < b.x + b.width &&
		   b.x < a.x + a.width &&
		   a.y < b.y + b.height &&
		   b.y < a.y + a.height
}

function reset(){
	if (bullets_left < 15){
		reload.play();
		bullets_left = 15;
	} 

	if (game_over){
		game_over = false;
		health = 100;
		regen_timer = 0;
		score = 0;
		background_change = 0;
		background_no = 0;
		enemy_speed = 5;
		current_background = backgrounds[background_no];
		bullets_left = 15;
	}
}

function hurt(){
	ctx.fillStyle = "red";
	ctx.globalAlpha = 0.2;

	for (var i = 0; i <= enemies.length; i++){
		if (enemies[i]){
			if (CheckCollision(player, enemies[i])){
				ctx.fillRect(0, 0, canvas.width, canvas.height);	
			}	
		}
	}
}

function background_draw(){
	for (var x = 0; x <= canvas.width; x += 256){
		for (var y = 0; y <= canvas.height; y += 256){
			ctx.drawImage(current_background, x, y);
		}
	}
}

function pause(){
	state = 0;
	current_state = states[state];
}

function stopAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
}