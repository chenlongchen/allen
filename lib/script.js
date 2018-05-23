/*
 * @ game: 奔跑吧 兄弟！
 * @ time:  2018/05/22
 * @ author: allen
*/

(function() {
    $(document).bind("touchmove", function(e) {
        e.preventDefault();
    });
    var Imgs = [
    	"images/2.png",
    	"images/3.png",
    	"images/1.png",
        "images/player.png",
        "images/play.png",
        "images/replay.png",
    	"img/bg.png",
    	"img/bg1.png",
    	"img/fish8.png",
    	"img/fish9.png",
    	"img/fish10.png",
    	"img/fish11.png",
    	"img/fish12.png",
    	"img/fish13.png",
    	"img/fish14.png",
    	"img/fish15.png",
    	"img/fish16.png",
    	"img/fish21.png",
    	"img/fish22.png",
    	"img/fish23.png",
    	"img/fish24.png",
    	"img/fish25.png",
    	"img/fish26.png",
    	"img/fish31.png",
    	"img/fish32.png",
    	"img/fish33.png",
    	"img/fish34.png",
    	"img/fish35.png",
    	"img/fish36.png",
    ];
    var Loader = new PIXI.loaders.Loader();
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var Sence = new PIXI.CanvasRenderer(screenWidth, screenHeight);
        Sence.backgroundColor = 0xFFFFFF;
    var Stage = new PIXI.Container();
    var StageContainer = new PIXI.Container();
    var boxContainer = new PIXI.Container();
    var bgContainer = new PIXI.Container();

    Loader.add(Imgs).onProgress.add(function(e){
    	$("#progress").html((Math.round(e.progress)+"%"));
    });
    Loader.load(function () {
        $("#loading").fadeOut(300);
        init();
    })

    $("#allen").append(Sence.view);
        Stage.interactive = !0;
        Stage.buttonMode = !0;

    var player = null;
    var speed = 20;
    var gameOver = !0;
    var moveSpeed = 5;
    var scoreTxt = 0;
    var StartPlay = null;
    var bgMask = null;

    var game = {
        move:!1,
        isTouch:!0,
        angleFlag:!0,
        angle:0,
        rotation:0,
        target:null,
        isFirst:true,
    }
    $("#allen").on("touchstart",function () {
        if (game.isTouch) {
            game.angle = 0;
            game.isTouch = !1;
            game.move = !0;
            game.angleFlag = !1;
        }
    })

    function AgainGame() {
        boxContainer.removeChildren(0,boxContainer.children.length);
        StageContainer.position.y = 0;

        for (var i = 0; i < 6; i++) {
            if (i==0) {
            var Sprite1 = createLemon();
                Sprite1.x = 375;
                Sprite1.y = (screenHeight-900)
                boxContainer.addChild(Sprite1);
            }else{
                var Sprite2 = createLemon();
                boxContainer.addChild(Sprite2);
            }
        }
        player.position.set(375,screenHeight-128);
        player.rotation = 0;
        scoreTxt.num = 0;
        scoreTxt.text = "得分："+scoreTxt.num;
        bgMask.visible = !1;
        StartPlay.visible = !1;
        StartPlay.IsEnable = !1;

        game.move = !1;
        game.isTouch = !0;
        game.angleFlag = !1;
        game.angle = 0;
        game.rotation = 0;
        game.target = null;
        game.isFirst = !0;

        gameOver = !1;
    }

    function init() {
            background();
            bgMask = new PIXI.Graphics();
            bgMask.beginFill(0x000000, 0.5);
            bgMask.drawRect(0,0, 750, screenHeight);

            StartPlay = createSprite("images/play.png",{x:375,y:screenHeight/2+200});
            StartPlay.type = !0;
            StartPlay.IsEnable = !0;
            StartPlay.scale.set(0.5);
            StartPlay.anchor.set(0.5, 0.5);
            StartPlay.interactive = !0;
            StartPlay.buttonMode = !0;
            StartPlay.on("touchstart",function () {
                if (this.type && this.IsEnable) {
                        gameOver = !1;
                        StartPlay.visible = !1;
                        bgMask.visible = !1;
                        StartPlay.type = !1;
                        StartPlay.IsEnable = !1;
                        StartPlay.texture = PIXI.Texture.fromImage('images/replay.png');
                } else if(!StartPlay.type && StartPlay.IsEnable){
                        AgainGame();
                }
            })

            player = createSprite("images/player.png",{x:375,y:screenHeight-128});
            player.scale.set(0.5);
            player.anchor.set(0.5, 0.5);

            scoreTxt = createText("得分：0",{fontFamily : 'Arial', fontSize: 40, fill : 0xfd020a, align : 'center'});
            scoreTxt.position.set(500, 50);
            scoreTxt.num = 0;

        for (var i = 0; i < 6; i++) {
            if (i==0) {
            var Sprite1 = createLemon();
                Sprite1.x = 375;
                Sprite1.y = (screenHeight-900)
                boxContainer.addChild(Sprite1);
            }else{
                var Sprite2 = createLemon();
                boxContainer.addChild(Sprite2);
            }
        }

        StageContainer.addChild(boxContainer,player);
        Stage.addChild(bgContainer,StageContainer,scoreTxt,bgMask,StartPlay);
        Sence.render(Stage);
        animate();
    }
     function hitLemon(obj,target) {
        var distance = Math.sqrt(Math.pow(obj.x - target.x,2) + Math.pow(obj.y - target.y,2));
        return distance < (obj.width/2) + (target.width/2);
     }
     function createLemon() {
        var lastObj = boxContainer.children[boxContainer.children.length-1];
        var angelSpeed = Math.random()>0.5?5:-5;
        var dir = Math.random()>0.5?true:false;
        var Sprite = createSprite("images/2.png");
            Sprite.x = randnum(100, 650);
            if (boxContainer.children.length>=1) {
                Sprite.y = (lastObj.y-500)
            }
            Sprite.anchor.set(0.5,0.5);
            Sprite.angelSpeed = angelSpeed;
            Sprite.dir = dir;
            Sprite.Ishit = !0;
            return Sprite;
     }

     function Over() {
         var position = player.getGlobalPosition();
         if((position.x+player.width/2)<=0 || (position.x-player.width/2)>=750 || position.y-player.height/2>=screenHeight ||position.y+player.height/2<=0) return true;
         return false;
     }

    function animate() {
        if (!gameOver) {
            for (var i = 0,data = boxContainer.children; i < data.length; i++) {
                if (data[i].dir) {};
                data[i].rotation += Math.PI/180*data[i].angelSpeed;
            }

            StageContainer.position.y+=moveSpeed;

            for (var i = 0,obj=boxContainer.children; i < obj.length; i++) {
                if (obj[i].getGlobalPosition().y-obj[i].height/2>=screenHeight) {
                    boxContainer.removeChild(obj[i]);
                    var SpriteObj = createLemon();
                    boxContainer.addChild(SpriteObj)
                }
            }
            if (game.move) {
                for (var i = 0,obj=boxContainer.children; i < obj.length; i++) {
                    if (hitLemon(player, obj[i])) {
                        game.angle = getAngle(player.x,player.y,obj[i].x,obj[i].y)* Math.PI / 180;
                        if (obj[i].Ishit) {
                            obj[i].tint = 0x0afd65;
                            scoreTxt.num++;
                            scoreTxt.text = "得分："+scoreTxt.num;
                            obj[i].Ishit = !1;
                            game.target = obj[i];
                            game.move = !1;
                            game.angleFlag = !0;
                            if (game.isFirst) game.isFirst = !1;
                        }
                    }
                }

                if (!game.isFirst) {
                    var Angle = getAngle(player.x,player.y,game.target.x,game.target.y);
                    player.x-=Math.sin(Angle*Math.PI/180)*speed;
                    player.y+=Math.cos(Angle*Math.PI/180)*speed;
                }else{
                    player.y-=speed
                }
            }

            if (!game.isFirst) {
                if (Over()&&game.move) {
                    StartPlay.visible = !0;
                    bgMask.visible = !0;
                    StartPlay.IsEnable = !0;
                    gameOver = !0;
                }
                if (!game.move) {
                    if(player.getGlobalPosition().y-player.height/2>=screenHeight){
                        StartPlay.visible = !0;
                        bgMask.visible = !0;
                        StartPlay.IsEnable = !0;
                        gameOver = !0;
                    }
                }
            }

            if (game.angleFlag) {
                player.rotation = getAtan2(player,game.target)+Math.PI/2;
                game.angle += Math.PI/180*game.target.angelSpeed;

                player.x = (game.target.x + Math.sin(-game.angle)*160);
                player.y = (game.target.y + Math.cos(-game.angle)*160);

                game.isTouch = !0;
            }
        }

        TWEEN.update();
        requestAnimationFrame(animate);
        Sence.render(Stage);
    }

    function background() {
        var fish1 = createAnimatedSprite("img/fish", 36, {x:100,y:100,loop:!0,animationSpeed:0.1}, 31);
            fish1.scale.set(0.5,0.5);
            fish1.rotation = (Math.PI / 4);
            fish1.play();

        var fish2 = createAnimatedSprite("img/fish", 16, {x:100,y:100,loop:!0,animationSpeed:0.1}, 11);
            fish2.scale.set(0.5,0.5);
            fish2.rotation = (- Math.PI / 4);
            fish2.play();

        var fish3 = createAnimatedSprite("img/fish", 26, {x:100,y:100,loop:!0,animationSpeed:0.1}, 21);
            fish3.scale.set(0.5,0.5);
            fish3.rotation = (Math.PI / 7);
            fish3.play();

        var fish4 = createAnimatedSprite("img/fish", 10, {x:100,y:100,loop:!0,animationSpeed:0.1}, 8);
            fish4.scale.set(0.5,0.5);
            fish4.rotation = (- Math.PI / 5);
            fish4.play();

        var fish5 = createAnimatedSprite("img/fish", 16, {x:100,y:100,loop:!0,animationSpeed:0.1}, 11);
            fish5.scale.set(0.5,0.5);
            fish5.rotation = (Math.PI / 4);
            fish5.play();

        var grass1 = createSprite("img/bg1.png",{x:0,y:0});

        var fishTween = new TimelineLite();
        var fish1T = TweenMax.fromTo(fish1,8,{x:0,y:530},{x:500,y:-64,onComplete:function(){}}).repeat(-1);
        var fish2T = TweenMax.fromTo(fish2,13,{x:800,y:800},{x:100,y:-64,onComplete:function(){}}).repeat(-1);
        var fish3T = TweenMax.fromTo(fish3,12,{x:50,y:screenHeight-64},{x:700,y:-120,onComplete:function(){}}).repeat(-1);
        var fish4T = TweenMax.fromTo(fish4,9,{x:800,y:screenHeight-200},{x:-124,y:160,onComplete:function(){}}).repeat(-1);
        var fish5T = TweenMax.fromTo(fish5,10,{x:-124,y:800},{x:874,y:64,onComplete:function(){}}).repeat(-1);
            fishTween.add([fish1T,fish2T,fish3T,fish4T,fish5T]);
            fishTween.play();

            bgContainer.addChild(fish1,fish2,fish3,fish4,fish5,grass1);
    }

    /**
     * @param  {[type]} obj
     * @param  {[type]} target
     * @return {[type]}
     */
    function getAtan2(obj,target){
        return Math.atan2(obj.y - target.y, obj.x - target.x);
    }

    /**
     * @param  {[type]} px
     * @param  {[type]} py
     * @param  {[type]} mx
     * @param  {[type]} my
     * @return {[type]}
     */
    function getAngle(px,py,mx,my){
        var x = Math.abs(px-mx);
        var y = Math.abs(py-my);
        var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        var cos = y/z;
        var radina = Math.acos(cos);
        var angle = Math.floor(radina * 180 / Math.PI);

        if(mx>px&&my>py){
            angle = 180 - angle;
        }
        if(mx==px&&my>py){
            angle = 180;
        }
        if(mx>px&&my==py){
            angle = 90;
        }
        if(mx<px&&my>py){
            angle = 180+angle;
        }
        if(mx<px&&my==py){
            angle = 270;
        }
        if(mx<px&&my<py){
            angle = 360 - angle;
        }
        return angle;
    }

    function createSprite(name,opt){
        var newSprite = new PIXI.Sprite.fromImage(name);
        if (opt) {
        	for (var key in opt) {
                if (typeof newSprite[key]!="undefined") {
                    newSprite[key] = opt[key];
                }
            }
        }
        return newSprite;
    }

    function randnum(start, end) {
        return Math.floor(Math.random() * (end - start) + start)
    }
    function createAnimatedSprite(name, num, opt, start) {
        var Textures = [],
            i, AnimatedSpriteInstance;
        i = start || 0;
        for (; i < num; i++) {
            var Texture = PIXI.Texture.fromImage(name + i + '.png');
            Textures.push(Texture);
        }
        AnimatedSpriteInstance = new PIXI.extras.AnimatedSprite(Textures);
        if (opt) {
            for (var key in opt) {
                if (typeof AnimatedSpriteInstance[key]!="undefined") {
                    AnimatedSpriteInstance[key] = opt[key];
                }
            }
        }
        return AnimatedSpriteInstance;
    }

    function createText(text,opt) {
    	var Style = new PIXI.TextStyle();
    	if (opt) {
    		for (var key in opt) {
                if (typeof Style[key]!="undefined") {
                    Style[key] = opt[key];
                }
            }
    	}
    	var txt = new PIXI.Text(text,Style);
    	return txt;
    }
})();
