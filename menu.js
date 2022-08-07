var states = ["menu", "action"]
var state = 0;
var current_state = states[state]

function menu_controls(event){
	switch(event.keyCode){
		case 13:start();break;
	}
}

function start(){
	state = 1;
	current_state = states[state];
	music.play();
}

function menu_draw(){
	background_draw();

	ctx.fillStyle = "black";
	ctx.font = "30px Arial";
	ctx.fillText("Press Enter to start", (canvas.width - 250) / 2, (canvas.height - 20) / 2);
}