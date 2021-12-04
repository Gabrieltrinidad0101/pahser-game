const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload,
        create,
        update
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }

}

new Phaser.Game(config)


function preload(){
    this.load.image("sky","assets/sky.png")
    this.load.image("ground","assets/platform.png")
    this.load.image("star","assets/star.png")
    this.load.image("bomb","assets/bomb.png")
    this.load.spritesheet("dude","assets/dude.png",{frameWidth: 32, frameHeight: 48})
}

function create(){
    //vars
    this.score = 0


    this.add.image(400,300,"sky");

    platforms = this.physics.add.staticGroup()

    platforms.create(400,568,"ground").setScale(2).refreshBody()

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    //player

    this.player = this.physics.add.sprite(100,450,"dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true)


    //bombs
    this.bombs = this.physics.add.group();
    
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude",{start: 0,end: 3}),
        frameRate: 10,
        repeat: -1
    })
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
    //cursors
    this.cursors = this.input.keyboard.createCursorKeys();
    
    //stars
    this.stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    })
    
    this.stars.children.iterate(child=>{
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8))
    })


    //text
    this.scoreText = this.add.text(16,16,"score 0",{fontSize: "32px",fill: "#000"})
    
    //collisions
    this.physics.add.collider(this.player,platforms);
    this.physics.add.collider(this.stars,platforms);
    this.physics.add.overlap(this.player,this.stars,collectStar, null, this);
    this.physics.add.collider(this.player,this.bombs,hitBomb,null,this)
    this.physics.add.collider(platforms,this.bombs)
}

function hitBomb(player,bomb){
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    location.reload();
}

function collectStar(_,star){
    star.disableBody(true,true)
    this.score += 10
    this.scoreText.setText("Score "+this.score)
    if(this.stars.countActive(true) === 0){
        this.stars.children.iterate(child=>{
            child.enableBody(true,child.x,0,true,true)
        });
        const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
        const bomb = this.bombs.create(x,16,"bomb");
        bomb.setBounce(1);  
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}


function update(){
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-160);
        this.player.anims.play("left",true);
    }else if(this.cursors.right.isDown){
        this.player.setVelocityX(160)
        this.player.anims.play("right",true)
    }else{
        this.player.setVelocityX(0)
        this.player.anims.play("turn")
    }
    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(-330)
    }
}


