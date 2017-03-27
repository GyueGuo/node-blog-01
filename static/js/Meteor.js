var meteor = (function(){
    var div = document.getElementById("cvs");
    var cvs = div.getContext("2d");
    var cvsratio = 0.2;
    var cvsW = 0;
    var cvsH = 0;
    var monr = 0;
    var grd, temp, star, img, timestrap, loops;
    var draw = function(){
        cvs.clearRect(0,0,cvsW,cvsH);
        restote();
        if(!star){
            newStar();
        }else{
            if( (star.x > cvsW) || (star.y >cvsH) ){
                newStar();
            }
        }
        move();
    };
    var newStar = function(){
        var x = {"x": (cvsW*Math.random()),"y" :(cvsH*Math.random()),"r" : (1+Math.random()*2),"blur":(1+Math.random()*2),"speed":(0.1+(Math.random()*0.2)),"rotate":(Math.random()*2)};
        star =  x;
    };
    var move = function(){
        var temp = (new Date()).getTime();
        var movement = star.speed*(temp-timestrap);
        timestrap = temp;
        star.x += movement;
        star.y += movement*star.rotate;
        cvs.beginPath();
        cvs.arc(star.x,star.y,star.r/2,0,2*Math.PI,false);
        cvs.shadowBlur=star.blur;
        cvs.fill();
        cvs.closePath();
    };
    var start = function(){
        if(div === null){
            console.log("canvas不存在，绘图中止");
            return;
        }
        cvsW = window.innerWidth
        cvsH = cvsW*cvsratio;
        if(cvsH> 300){
            cvsH = 400;    
        }
        var i = 0;
        div.setAttribute("width",cvsW);
        div.setAttribute("height",cvsH);
        grd = cvs.createLinearGradient(0,0,cvsW,cvsH);
        grd.addColorStop(0,"#040d5f");
        grd.addColorStop(0.3,"#02083f");
        grd.addColorStop(1,"#020414");
        cvs.fillStyle=grd;
        cvs.fillRect(0,0,cvsW,cvsH);
        monr = 1.3*cvsH;
        cvs.shadowColor="#fff";
        cvs.fillStyle = "#fff";
        for(; i<20; i++){
            cvs.beginPath();
            cvs.arc((cvsW*Math.random()), (cvsH*Math.random()), (0.5+Math.random()),0,2*Math.PI,false);
            cvs.shadowBlur = (2+(Math.random()*8));
            cvs.fill();
            cvs.closePath();
        }
        cvs.beginPath();
        cvs.arc(0,.02*monr,monr/2,0,2*Math.PI,false);
        cvs.shadowBlur=40;
        cvs.fill();
        cvs.closePath();
        img = cvs.getImageData(0,0,cvsW,cvsH);
        timestrap = (new Date()).getTime();
        loops = setInterval(draw,20);
        vh();
    };
    var restote = function(){
        cvs.putImageData(img, 0, 0);
    };
    var stop = function(){
        clearInterval(loops);
        loops = null;
        console.log("动画终止");
    };
    var vh = function(){
        var hidden = null;
        var state = null;
        var visibilityChange = null; 
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";visibilityChange = "visibilitychange";state = "visibilityState";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";visibilityChange = "mozvisibilitychange";state = "mozVisibilityState";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";visibilityChange = "msvisibilitychange";state = "msVisibilityState";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";visibilityChange = "webkitvisibilitychange";state = "webkitVisibilityState";
        }
        if(visibilityChange){
            document.addEventListener(visibilityChange, function() {
                if(document[state]=="visible"){
                    if(loops){
                        stop();
                    }
                    gon();
                }else{
                    stop();
                }
            }, false);
        }
    };
    var gon = function(){
        timestrap = (new Date()).getTime();
        loops = setInterval(draw,20);
        console.log("动画继续");
    };
    return{
        "start" : start,
        "stop" : stop,
        "gon" : gon
    }
})();