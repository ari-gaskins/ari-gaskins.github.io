import kaboom from "kaboom"

// Flappy Bean

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 512;
const SPEED = 480;

kaboom()

setGravity(1600)
setBackground(67, 166, 198)

loadSprite("bean", "sprites/bean.png")


scene("game", () => {
	// add bean player
	const bean = add([
		sprite("bean"),
		pos(80, 40),
		area(),
		body(),
	]);
	
	// add top and bottom
	add([
		rect(width(), FLOOR_HEIGHT),
		pos(0, 0),
		outline(4),
		area(),
		body({ isStatic: true }),
		color(124, 252, 0),
		"ceiling",
	]);

	add([
		rect(width(), FLOOR_HEIGHT),
		pos(0, height() - FLOOR_HEIGHT),
		outline(4),
		area(),
		body({ isStatic: true }),
		color(124, 252, 0),
		"floor",
	]);
	
	// infinite beams to challenge bean
	function spawnBeams() {
		// top beams
		add([
			rect(48, rand(128, 496)),
			area(),
			outline(4),
			pos(width(), FLOOR_HEIGHT),
			anchor("topleft"),
			color(255, 180, 255),
			move(LEFT, SPEED),
			"beam-top"
		])

		// bottom beams
		add([
			rect(48, rand(128, 256)),
			area(),
			outline(4),
			pos(width(), height() - FLOOR_HEIGHT),
			anchor("botleft"),
			color(255, 180, 255),
			move(LEFT, SPEED),
			"beam-bottom",
		]);

		// spawn a tree at random intervals 
		// recursively at infinitum 
		wait(rand(0.5, 1.5), () => {
			spawnBeams();
		});
	}

	spawnBeams();
	
	// make bean jumpable w/ space
	onKeyPress( 
		"space", 
		() => {
			bean.jump(JUMP_FORCE)
		}
	);

	scene("lose", (score) => {
		add([
			text("Game Over"),
			pos(center()),
			anchor("center"),
		]);

		// display score
		add([
			text(score),
			pos(width() / 2, height() / 2 + 80),
			scale(2),
			anchor("center"),
		]);

		// restart game
		add([
			text("Press Space or LMB to restart"),
			pos(width() / 2, height() / 2 + 150),
			scale(1),
			anchor("center"),
		])

		onKeyPress("space", () => go("game"));
		onClick(() => go("game"));
	});

	// setup lives
	let lives = 3;
	const livesLabel = add([
		text(lives),
		pos(24, 64),
	]);

	// keep score
	let score = 0;
	const scoreLabel = add([
		text(score),
		pos(24, 128),
	]);

	onUpdate(() => {
		score++;
		scoreLabel.text = score;
		livesLabel.text = `Lives: ${lives}`;
	});  
	
	// beam vs. bean
	bean.onCollide("beam-bottom", () => {
		if (lives == 0) {
			burp();
			go("lose", score);
		}
		
		addKaboom(bean.pos);
		shake();
		lives--;
	});

	bean.onCollide("beam-top", () => {
		if (lives == 0) {
			burp();
			go("lose", score);
		}

		addKaboom(bean.pos);
		shake();
		lives--;
	});
		
	bean.onCollide("floor", () => {
		if (lives == 0) {
			play("wooosh");
			go("lose", score);
		}

		addKaboom(bean.pos);
		shake();
		lives--;
	});
});

go("game")

