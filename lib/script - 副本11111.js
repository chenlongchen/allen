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
    	// Sence.backgroundColor = 0x07fd5e;
        Sence.backgroundColor = 0xFFFFFF;
    var Stage = new PIXI.Container(); //创建舞台
    var StageContainer = new PIXI.Container(); //游戏元素容器
    var boxContainer = new PIXI.Container(); //创建舞台
    var bgContainer = new PIXI.Container(); //创建背景

    Loader.add(Imgs).onProgress.add(function(e){
    	$("#progress").html((Math.round(e.progress)+"%"));
    });
    Loader.load(function () {
        $("#loading").fadeOut(300);
        init();
    })

    $("#allen").append(Sence.view);
        Stage.interactive = true; //开启事件
        Stage.buttonMode = true;

    var player = null;
    var speed = 20; //小球移动的速度
    var gameOver = true;  //游戏是否结束
    var moveSpeed = 5; //背景移动的速度
    var scoreTxt = 0;//分数
    var StartPlay = null; //按钮
    var bgMask = null; //蒙层

    var game = {
        move:false, //控制小球移动
        isTouch:true, //控制是否可点击
        angleFlag:false,// 控制小球围绕旋转
        angle:0, //小球到柠檬上的旋转角度
        rotation:0, // 当前小球在第几象限
        target:null,// 当前第几个橘子
        isFirst:true,
    }
    $("#allen").on("touchstart",function () {
        if (game.isTouch) {
            game.angle = 0; //归为初始状态
            game.isTouch = false;
            game.move = true;
            game.angleFlag = false;
        }
    })

    function AgainGame() {
        //移除
        boxContainer.removeChildren(0,boxContainer.children.length);
        StageContainer.position.y = 0; //位置

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
        scoreTxt.num = 0; //分数归零
        scoreTxt.text = "得分："+scoreTxt.num;

        bgMask.visible = false;
        //隐藏按钮
        StartPlay.visible = false;
         //不可点击
        StartPlay.IsEnable = false;

         //归为初始状态
        game.move = false;
        game.isTouch = true;
        game.angleFlag = false;
        game.angle = 0;
        game.rotation = 0;
        game.target = null;
        game.isFirst = true;

        gameOver = false;
    }

    function init() {
        //背景
        background();
        //蒙层
            bgMask = new PIXI.Graphics();
            bgMask.beginFill(0x000000, 0.5);
            bgMask.drawRect(0,0, 750, screenHeight);
            //开始按钮
            StartPlay = createSprite("images/play.png",{x:375,y:screenHeight/2+200});
            StartPlay.type = true; //标记为开始按钮
            StartPlay.IsEnable = true; //是否可点击
            StartPlay.scale.set(0.5);
            StartPlay.anchor.set(0.5, 0.5);
            StartPlay.interactive = true; //开启事件
            StartPlay.buttonMode = true;

            StartPlay.on("touchstart",function () {
                if (this.type && this.IsEnable) {
                        //开始游戏
                        gameOver = false;
                        //隐藏按钮
                        StartPlay.visible = false;
                        //隐藏蒙层
                        bgMask.visible = false;
                        //更改状态值
                        StartPlay.type = false;
                         //不可点击
                        StartPlay.IsEnable = false;
                        //替换材质更换为再来一局
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

    /**
     * 判断是否发生碰撞圆形检测
     */
     function hitLemon(obj,target) {
        var distance = Math.sqrt(Math.pow(obj.x - target.x,2) + Math.pow(obj.y - target.y,2));
        return distance < (obj.width/2) + (target.width/2);
     }

    /**
     * 创建柠檬
     */
     function createLemon() {
        var lastObj = boxContainer.children[boxContainer.children.length-1];
        var angelSpeed = Math.random()>0.5?5:-5; //每一个的旋转速度 3度
        var dir = Math.random()>0.5?true:false; //是否需要左右移动
        var Sprite = createSprite("images/2.png");
            Sprite.x = randnum(100, 650);
            if (boxContainer.children.length>=1) {
                Sprite.y = (lastObj.y-500)
            }
            Sprite.anchor.set(0.5,0.5);
            Sprite.angelSpeed = angelSpeed;
            Sprite.dir = dir;
            Sprite.Ishit = true; //是否可以发生碰撞 避免与自身发生
            return Sprite;
     }

     //游戏结束
     function Over() {
         var position = player.getGlobalPosition();
         //左右判断
         if((position.x+player.width/2)<=0) return true;
         if((position.x-player.width/2)>=750) return true;
         //上下
         if(position.y-player.height/2>=screenHeight) return true;
         if(position.y+player.height/2<=0) return true;
         return false;
     }

    function animate() {
        if (!gameOver) {

            //控制所有的柠檬旋转
            for (var i = 0,data = boxContainer.children; i < data.length; i++) {
                if (data[i].dir) {

                }
                data[i].rotation += Math.PI/180*data[i].angelSpeed;
            }
            //开始移动背景
            StageContainer.position.y+=moveSpeed;
            //超出移除
            for (var i = 0,obj=boxContainer.children; i < obj.length; i++) {
                if (obj[i].getGlobalPosition().y-obj[i].height/2>=screenHeight) {
                    boxContainer.removeChild(obj[i]);

                    //移除一个 生成新的道具 保证页面在循环
                    var SpriteObj = createLemon();
                    boxContainer.addChild(SpriteObj)
                    // console.log(obj);
                }
            }
            //控制人物移动
            if (game.move) {

                for (var i = 0,obj=boxContainer.children; i < obj.length; i++) {
                    //判断是否标记过 不能跟已碰撞过的柠檬再次碰撞
                    if (hitLemon(player, obj[i])) {
                        //设置小人碰撞后的起始旋转弧度
                        game.angle = getAngle(player.x,player.y,obj[i].x,obj[i].y)* Math.PI / 180;
                        if (obj[i].Ishit) {
                            //替换材质
                            // obj[i].texture = PIXI.Texture.fromImage('images/3.png');
                            // obj[i].tint = Math.random() * 0xFFFFFF;
                            obj[i].tint = 0x0afd65;

                            scoreTxt.num++;
                            scoreTxt.text = "得分："+scoreTxt.num;
                             //标记为已发生过碰撞
                            obj[i].Ishit = false;
                            //记录当前与人物发生碰撞的柠檬
                            game.target = obj[i];
                            //人物不可在移动
                            game.move = false;
                            //开始让小人围绕柠檬旋转
                            game.angleFlag = true;
                            //是否是第一次点击
                            if (game.isFirst) {
                                game.isFirst = false;
                            }
                        }
                    }
                }

                if (!game.isFirst) {
                    //用于判断当前在第几象限获取当前角度
                    var Angle = getAngle(player.x,player.y,game.target.x,game.target.y);
                    player.x-=Math.sin(Angle*Math.PI/180)*speed;
                    player.y+=Math.cos(Angle*Math.PI/180)*speed;
                }else{
                    //第一次直接移动Y
                    player.y-=speed
                }
            }

            //第一次不做判断
            if (!game.isFirst) {
                //判断是否失败
                if (Over()&&game.move) {
                    //显示重新开始按钮
                    StartPlay.visible = true;
                    bgMask.visible = true;
                    StartPlay.IsEnable = true;
                    gameOver = true;
                }

                //没有移动中 小人下落至底部判断失败
                if (!game.move) {
                    if(player.getGlobalPosition().y-player.height/2>=screenHeight){
                        //显示重新开始按钮
                        StartPlay.visible = true;
                        bgMask.visible = true;
                        StartPlay.IsEnable = true;
                        gameOver = true;
                    }
                }
            }

            if (game.angleFlag) {
                //通过反切让小人始终围绕橘子中心点旋转  自身在旋转90
                player.rotation = getAtan2(player,game.target)+Math.PI/2;
                //旋转度数
                game.angle += Math.PI/180*game.target.angelSpeed;

                player.x = (game.target.x + Math.sin(-game.angle)*160);
                player.y = (game.target.y + Math.cos(-game.angle)*160);

                game.isTouch = true;
            }
        }

        TWEEN.update();
        requestAnimationFrame(animate);
        Sence.render(Stage);
    }

    //创建背景
    function background() {

        //背景
        var Img0 = createSprite("img/bg.png",{x:0,y:0});
            //鱼群
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

            //叶子动画
        var leaf1 = createSprite("img/yezi.png",{x:0,y:0});
            leaf1.scale.set(0.5,0.5);

        var leaf2 = createSprite("img/yezi.png",{x:0,y:0});
            leaf2.scale.set(0.5,0.5);

        var leaf3 = createSprite("img/yezi.png",{x:0,y:0});
            leaf3.scale.set(0.5,0.5);

            //水草
        var grass1 = createSprite("img/bg1.png",{x:0,y:0});

        var leaf1T = TweenMax.fromTo(leaf1,5,{x:500,y:200},{x:650,y:200,onComplete:function(){},ease: Power2.easeIn}).repeat(-1).yoyo(!0);
        var leaf2T = TweenMax.fromTo(leaf2,7,{x:200,y:500},{x:350,y:500,onComplete:function(){},ease: Power2.easeIn}).repeat(-1).yoyo(!0);
        var leaf3T = TweenMax.fromTo(leaf3,6,{x:350,y:800},{x:500,y:800,onComplete:function(){},ease: Power2.easeIn}).repeat(-1).yoyo(!0);

        var leafTween = new TimelineLite();
            leafTween.add([leaf1T,leaf2T,leaf3T]);
            leafTween.play();

        var fishTween = new TimelineLite();
        var fish1T = TweenMax.fromTo(fish1,8,{x:0,y:530},{x:500,y:-64,onComplete:function(){}}).repeat(-1);
        var fish2T = TweenMax.fromTo(fish2,13,{x:800,y:800},{x:100,y:-64,onComplete:function(){}}).repeat(-1);
        var fish3T = TweenMax.fromTo(fish3,12,{x:50,y:screenHeight-64},{x:700,y:-120,onComplete:function(){}}).repeat(-1);
        var fish4T = TweenMax.fromTo(fish4,9,{x:800,y:screenHeight-200},{x:-124,y:160,onComplete:function(){}}).repeat(-1);
        var fish5T = TweenMax.fromTo(fish5,10,{x:-124,y:800},{x:874,y:64,onComplete:function(){}}).repeat(-1);
            fishTween.add([fish1T,fish2T,fish3T,fish4T,fish5T]);
            fishTween.play();

            // bgContainer.addChild(Img0,fish1,fish2,fish3,fish4,fish5,leaf1,leaf2,leaf3,grass1);
            bgContainer.addChild(fish1,fish2,fish3,fish4,fish5,grass1);
    }

    /**
     * [getAtan2 反切函数]
     * @param  {[type]} obj    [description]
     * @param  {[type]} target [description]
     * @return {[type]}        [两点之间的反切夹角]
     */
    function getAtan2(obj,target){
        return Math.atan2(obj.y - target.y, obj.x - target.x);
    }

    /**
     * [getAngle 获取当前小球在第几象限]
     * @param  {[type]} px [小球x]
     * @param  {[type]} py [小球y]
     * @param  {[type]} mx [橙子x]
     * @param  {[type]} my [橙子y]
     * @return {[type]}    [角度]
     */
    function getAngle(px,py,mx,my){//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var x = Math.abs(px-mx);
        var y = Math.abs(py-my);
        var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        var cos = y/z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(radina * 180 / Math.PI);//将弧度转换成角度

        if(mx>px&&my>py){//鼠标在第四象限
            angle = 180 - angle;
        }
        if(mx==px&&my>py){//鼠标在y轴负方向上
            angle = 180;
        }
        if(mx>px&&my==py){//鼠标在x轴正方向上
            angle = 90;
        }
        if(mx<px&&my>py){//鼠标在第三象限
            angle = 180+angle;
        }
        if(mx<px&&my==py){//鼠标在x轴负方向
            angle = 270;
        }
        if(mx<px&&my<py){//鼠标在第二象限
            angle = 360 - angle;
        }
        return angle;
    }

    // 创建sprite对象
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
    // 创建序列帧动画
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
