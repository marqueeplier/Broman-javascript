var enemies = [];

var timer_up = 1000;
var timer_down = 2000;
var timer_left = 3000;
var timer_right = 4000;

// enemy assets

var enemy_img_up = new Image();
enemy_img_up.src = "assets/enemy/up.png";

var enemy_img_down = new Image();
enemy_img_down.src = "assets/enemy/down.png";

var enemy_img_left = new Image();
enemy_img_left.src = "assets/enemy/left.png";

var enemy_img_right = new Image();
enemy_img_right.src = "assets/enemy/right.png";

var enemy_speed = 5;

function enemy_update(){
	timers();
	enemy_spawn();

	for (var i = 0; i <= enemies.length; i++) {
		if (enemies[i] && game_over == false && typeof enemies[i].direction !== "undefined"){
			if (enemies[i].direction == "up"){
				enemies[i].y += enemy_speed;
				if(enemies[i] >= canvas.height ){
					enemies.splice(i, 1);
				}
			}
			if (enemies[i].direction == "down"){
				enemies[i].y -= enemy_speed;
				if(enemies[i].y <= 0){
					enemies.splice(i, 1);
				}
			}
			if (enemies[i].direction == "left"){
				enemies[i].x += enemy_speed;
				if(enemies[i] >= canvas.width){
					enemies.splice(i, 1);
				}
			}
			if (enemies[i].direction == "right"){
				enemies[i].x -= enemy_speed;
				if(enemies[i].x <= 0){
					enemies.splice(i, 1);
				}
			}
		}
	}
	for (var i = 0; i <= enemies.length; i++) {
		if (enemies[i] && game_over == true){
			enemies.splice(i, 1);
		}
	}
}

function timers(){
	timer_up = timer_up - 10;
	timer_down = timer_down - 10;
	timer_left = timer_left - 10;
	timer_right = timer_right - 10;
}

function enemy_spawn(){
	if (timer_up <= 0){
		timer_up = 1000;
		zombiespawn.play();
		
		enemy_up = {};
		enemy_up.width = 96;
		enemy_up.height = 96;
		enemy_up.x = (canvas.width - enemy_up.width) / 2;
		enemy_up.y = -enemy_up.width; 
		enemy_up.direction = "up";
		enemy_up.img = enemy_img_up;

		enemies.push(enemy_up);
	}

	if (timer_down <= 0){
		timer_down = 2000;
		zombiespawn.play();
		
		enemy_down = {};
		enemy_down.width = 96;
		enemy_down.height = 96;
		enemy_down.x = (canvas.width - enemy_down.width) / 2;
		enemy_down.y = canvas.height; 
		enemy_down.direction = "down";
		enemy_down.img = enemy_img_down;

		enemies.push(enemy_down);
	}

	if (timer_left <= 0){
		timer_left = 3000;
		zombiespawn.play();
		
		enemy_left = {};
		enemy_left.width = 96;
		enemy_left.height = 96;
		enemy_left.x = -enemy_left.width;
		enemy_left.y = (canvas.height - enemy_left.height) / 2; 
		enemy_left.direction = "left";
		enemy_left.img = enemy_img_left;

		enemies.push(enemy_left);
	}

	if (timer_right <= 0){
		timer_right = 4000;
		zombiespawn.play();
		
		enemy_right = {};
		enemy_right.width = 96;
		enemy_right.height = 96;
		enemy_right.x = canvas.width;
		enemy_right.y = (canvas.height - enemy_right.height) / 2; 
		enemy_right.direction = "right";
		enemy_right.img = enemy_img_right;

		enemies.push(enemy_right);
	}
}

function enemy_draw(){
	for (var i = 0; i <= enemies.length; i++) {
		if (enemies[i]){
			ctx.drawImage(enemies[i].img, enemies[i].x, enemies[i].y);
		}
	}
}