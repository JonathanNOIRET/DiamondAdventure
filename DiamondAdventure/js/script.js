var config = {
    type : Phaser.AUTO,
    width : 800,
    height : 600,
    scene : {
        preload : preload,
        create : create,
        update : update
    },
    physics : {
        default : "arcade",
        arcade : {
            debug: false,
            gravity : {y : 500}
        }
    }
}

const game = new Phaser.Game(config);

var cursor;
var player;

function preload(){
    this.load.image("player","assets/adventurer/character_maleAdventurer_idle.png");
    this.load.image("background","assets/backgrounds/backgroundColorForest.png");
    this.load.image("ground","assets/environment/ground_grass.png");
    this.load.image("ground2","assets/environment/ground_grass_small.png");
    this.load.image("playerSide","assets/adventurer/character_maleAdventurer_side.png");
    this.load.image("walk","assets/adventurer/character_maleAdventurer_walk0.png");
    this.load.image("walk1","assets/adventurer/character_maleAdventurer_walk1.png");
    this.load.image("walk2","assets/adventurer/character_maleAdventurer_walk2.png");
    this.load.image("walk3","assets/adventurer/character_maleAdventurer_walk3.png");
    this.load.image("walk4","assets/adventurer/character_maleAdventurer_walk4.png");
    this.load.image("walk5","assets/adventurer/character_maleAdventurer_walk5.png");
    this.load.image("walk6","assets/adventurer/character_maleAdventurer_walk6.png");
    this.load.image("walk7","assets/adventurer/character_maleAdventurer_walk7.png");
    this.load.image("playerJump","assets/adventurer/character_maleAdventurer_jump.png");
    this.load.image("ground3","assets/environment/ground_grass_small_broken.png");
    this.load.image("ground4","assets/environment/ground_grass.png");
    this.load.image("ground5","assets/environment/ground_grass_small.png");
    this.load.image("ground6","assets/environment/ground_grass_small.png");
    this.load.image("ground7","assets/environment/ground_grass.png");
    this.load.image("ground8","assets/environment/ground_stone_small.png");
    this.load.image("ground9","assets/environment/ground_cake.png");
    this.load.image("diamond","assets/environment/diamond.png");
    this.load.image("bomb","assets/environment/bomb.png");
}

function create(){
    this.anims.create({
        key : "playerRun",
        frames : [
            {key : "walk"},
            {key : "walk1"},
            {key : "walk2"},
            {key : "walk3"},
            {key : "walk4"},
            {key : "walk5"},
            {key : "walk6"},
            {key : "walk7"}
        ],
        frameRate : 8,
        repeat : -1
    })

    cursor = this.input.keyboard.createCursorKeys();

    var backgroundImage = this.add.sprite(0,0,"background");
    backgroundImage.setPosition(config.width/2,config.height/2);
    backgroundImage.setScale(0.8);

    player = this.physics.add.sprite(115,475,"player");
    player.setScale(0.3);
    player.body.collideWorldBounds = true;
    player.body.setSize(125,250);

    var platforms = this.physics.add.staticGroup();
    var ground1 = this.add.sprite(175,575,"ground");
    ground1.setScale(1);
    var ground2 = this.add.sprite(675,575,"ground2");
    ground2.setScale(1);
    var ground3 = this.add.sprite(475,375,"ground3");
    ground3.setScale(0.5);
    var ground4 = this.add.sprite(725,325,"ground4");
    ground4.setScale(0.5);
    var ground5 = this.add.sprite(125,200,"ground5");
    ground5.setScale(0.5);
    var ground6 = this.add.sprite(295,425,"ground6");
    ground6.setScale(0.5);
    var ground7 = this.add.sprite(0,465,"ground7");
    ground7.setScale(0.5);
    var ground8 = this.add.sprite(470,600,"ground8");
    ground8.setScale(0.8);
    platforms.add(ground1);
    platforms.add(ground2);
    platforms.add(ground3);
    platforms.add(ground4);
    platforms.add(ground5);
    platforms.add(ground6);
    platforms.add(ground7);
    platforms.add(ground8);

    movingPlatform = this.physics.add.image(100,285, 'ground9');
    movingPlatform.setScale(0.5);
    movingPlatform.setImmovable(true);
    movingPlatform.body.allowGravity = false;
    movingPlatform.setVelocityX(50);


    this.physics.add.collider(platforms,player);
    this.physics.add.collider(movingPlatform,player);
    
    diamonds = this.physics.add.group({
        key: 'diamond',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
        
    });
    
    diamonds.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
    
    });

   

    this.physics.add.collider(diamonds, platforms);

    
    this.physics.add.overlap(player, diamonds, grabDiamond, null, this);

    function grabDiamond (player, diamond){
        diamond.disableBody(true, true);
        
        score += 100;
        scoreText.setText('Points : ' + score);

        if (diamonds.countActive(true) === 0)
    {
        diamonds.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);
            

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
    }

    var score = 0;
    var scoreText;

    scoreText = this.add.text(16, 16, 'Point : 0', { fontSize: '20px', fill: '#000' });

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, movingPlatform);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    function hitBomb (player, bomb){
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;
        
        alert('Game over ! Ton score score est de : '+ score);

        location.reload();
    }

}

function update(time, delta){
    if(cursor.left.isDown){
        player.setVelocityX(-200);
        player.anims.play("playerRun",true);
        player.setFlip(true,false);
    }
    if(cursor.right.isDown){
        player.setVelocityX(200);
        player.anims.play("playerRun",true);
        player.setFlip(false,false);
    }
    if(cursor.left.isUp && cursor.right.isUp) {
        player.setVelocityX(0);
        player.setTexture("playerSide");
    }
    if(cursor.up.isDown && player.body.touching.down){
        player.setVelocityY(-300);
        player.setTexture("playerJump");
    }
    if(cursor.up.isDown){
        player.setTexture("playerJump");
    }
    if (movingPlatform.x >= 400){
        movingPlatform.setVelocityX(-50);
    }
    else if (movingPlatform.x <= 100){
        movingPlatform.setVelocityX(50);
    }
}