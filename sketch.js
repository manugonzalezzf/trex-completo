var t_rex,t_rexRunning,t_rexCollided;
var ground,ground_img, inv_ground;
var cloud,cloud_img,cloud_gp;
var cactus, cactus_img01,cactus_img02,cactus_img03,cactus_img04,cactus_img05,cactus_img06,cactus_gp;
var PLAY = 1,END = 0;
var gameState = PLAY;
var score = 0;
var record = 0;
var restart,restart_img;
var gameOver,gameOver_img;
var jump_sound, die_sound, score_sound;

//carrega as mídias
function preload(){
  t_rexRunning = loadAnimation("trex3.png","trex4.png");
  t_rexCollided = loadAnimation("trex_collided.png");

  ground_img = loadImage("ground2.png");

  cloud_img = loadImage("cloud.png");

  cactus_img01 = loadImage("obstacle1.png");
  cactus_img02 = loadImage("obstacle2.png");
  cactus_img03 = loadImage("obstacle3.png");
  cactus_img04 = loadImage("obstacle4.png");
  cactus_img05 = loadImage("obstacle5.png");
  cactus_img06 = loadImage("obstacle6.png");

  restart_img = loadImage("restart.png");
  gameOver_img = loadImage("gameOver.png");

  jump_sound = loadSound("jump.mp3");
  die_sound = loadSound("die.mp3");
  score_sound = loadSound("checkPoint.mp3");

}

function setup(){
  //tela 600 x 200
  createCanvas(windowWidth,windowHeight);
  
  //create a trex sprite
  t_rex = createSprite(50,height-50,20,40);
  t_rex.addAnimation("run",t_rexRunning);
  t_rex.addAnimation("collide",t_rexCollided);
  t_rex.scale = 0.5;

  ground = createSprite(width/2,height-40,width,20);
  ground.addImage(ground_img);
  inv_ground = createSprite(width/2,height-20,width,10);
  inv_ground.visible = false;  

  cactus_gp = new Group();
  cloud_gp = new Group();

  t_rex.debug = false;
  t_rex.setCollider("circle",0,0,30);
  //t_rex.setCollider("rectangle",0,0,100,100,180);

  gameOver = createSprite(width/2,height-120,30,10);
  gameOver.addImage(gameOver_img);
  gameOver.scale = 0.5
  restart = createSprite(width/2,height-80,20,20);
  restart.addImage(restart_img);
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;

}

function draw(){
  background("white");

  text("Score: "+score,width-100,height-180);

  if (t_rex.isTouching(cactus_gp)) {
    gameState = END;
    t_rex.changeAnimation("collide",t_rexCollided);
    die_sound.play();
  }

  if (gameState === PLAY) {
    

    if (touches.length > 0 || keyDown("space") && t_rex.y > height-50) {
      t_rex.velocityY = -10; 
      jump_sound.play();
      touches = [];
    }
    //velocidade do solo
    ground.velocityX = -2;

    //reinicindo o solo
    if(ground.x < 200){
      ground.x = ground.width/2;
    }

    score = Math.round(frameCount/4);

    spawClouds();
    spawCactus();
    
  }
  if (gameState === END) {
    stopGame();
    if(mousePressedOver(restart)){
      resetGame();
    }
  }

 
  gravity();

  //colisão do trex
  t_rex.collide(inv_ground);

  drawSprites();
}

function gravity(){
  t_rex.velocityY = t_rex.velocityY+0.5;
}

function spawClouds(){
  if (frameCount%60 === 0) {
    cloud = createSprite(width,100,20,10);
    cloud.velocityX = -2;
    cloud.addImage(cloud_img);
    cloud.y = random(height-100,height-100);
    cloud.scale = random(0.2,1);
    cloud.lifetime = width/cloud.velocityX;
    cloud_gp.add(cloud);
    cloud.depht = t_rex.depht -1;
  }
  
}

function spawCactus(){
  if (frameCount%120  === 0) {
    cactus = createSprite(width,height-50,20,10);
    cactus.velocityX = -2;
    cactus.lifetime = width/cactus.velocityX;
    var sorteio = Math.round(random(1,6));
    switch (sorteio) {
      case 1: cactus.addImage(cactus_img01);
      cactus.scale = 0.4;
        break;
      case 2: cactus.addImage(cactus_img02);
      cactus.scale = 0.4;
        break;
      case 3: cactus.addImage(cactus_img03);
      cactus.scale = 0.4;
        break;
      case 4: cactus.addImage(cactus_img04);
      cactus.scale = 0.4;
        break;
      case 5: cactus.addImage(cactus_img05);
      cactus.scale = 0.4;
        break;
      case 6: cactus.addImage(cactus_img06);
      cactus.scale = 0.3;
        break;
    }
    cactus_gp.add(cactus);
  }
  
}

function stopGame(){
  ground.velocityX = 0;
  cactus_gp.setVelocityXEach(0);
  cloud_gp.setVelocityXEach(0);
  cactus_gp.setLifetimeEach(-1);
  cloud_gp.setLifetimeEach(-1);
  gameOver.visible = true;
  restart.visible = true;
}

function resetGame(){
  gameState = PLAY;
  cactus_gp.destroyEach();
  cloud_gp.destroyEach();
  t_rex.changeAnimation("run",t_rexRunning);
  gameOver.visible = false;
  restart.visible = false;
  frameCount = 0;
}