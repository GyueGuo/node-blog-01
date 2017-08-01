var common = (function(){
	var that = this;
	/*关闭顶部栏*/
    var top_close = function(obj){
        var ele = obj || this;
        ele.parentNode.style.display = "none";
    };
    /*显示侧边警告栏，需要传入内容和样式*/
    var warns = function(str,cls){
    	var div = document.createElement("div");
    	div.innerHTML = str;
    	div.className = "c-warn_item "+cls;
    	div.style.opacity = "1";
    	if(!that.warnsEle){
    		that.warnsEle = document.getElementById("side_alert");
    	}
    	that.warnsEle.appendChild(div);
    	return div;
    };

    var removeWarn = function(dom,time){
        setTimeout(function(){
            dom.remove();
        }, time);
    };

    var convertNum = function( n ){
        n = Number(n);
        var str = n.toString();
        if(n < 9){
            str = "0"+str;
        }
        return str;
    };

    var setCookie = function(name,value,days){
    	var d = new Date();
    	var extra = 0;
    	if(days){
			extra = (days*24*60*60*1000);
    	}
	    d.setTime(d.getTime() + extra);
	    var expires = "expires="+d.toUTCString();
	    document.cookie = name + "=" + value + "; expires=" + d.toGMTString()+";domain="+location.hostname+"; path=/";
    };
    var usernameCheck = function(str){
        var reg = /[^a-z0-9]/i;
        return reg.test(str);
    };
    var nickCheck = function(str){
        var reg = /^(?![\w\u4e00-\u9fa5_]+)$/;
        return reg.test(str);
    }
    var pagination = (function(){
        var parms;
        var num = /\D/g
        var go = function(str){
            if( parms.url.length === 0 || str === null ){
                return;
            }
            location.href = parms.url + str.toString();
        }
        var createElement = function(type){
            return document.createElement(type);
        }
        var init = function(arg){
            parms = arg;
            if( !parms.container || !parms.total || !parms.cur_page || !parms.limit || !parms.url){
                console.warn("分页控件初始化失败，缺少参数");
            }
            parms.max = Math.ceil( parms.total / parms.limit );
            if( parms.max === 0 ){
                parms.max = 1;
            }
            var doc = document.createDocumentFragment()
            var outer = createElement("div");
            outer.className = "g-pages";

            var index_btn = createElement("span");
            var previous_btn = createElement("span");
            var next_btn = createElement("span");
            var end_btn = createElement("span");
            var end_btn = createElement("span");
            var info_btn = createElement("span");
            var input_btn = createElement("span");
            var turn_btn = createElement("span");

            index_btn.className = "g-pagespan";
            index_btn.innerHTML = "首页";
            previous_btn.className = "g-pagespan";
            previous_btn.innerHTML = "上一页"
            next_btn.className = "g-pagespan";
            next_btn.innerHTML = "下一页";
            end_btn.className = "g-pagespan";
            end_btn.innerHTML = "尾页";
            info_btn.className = "g-pagespan";
            info_btn.innerHTML = '共' + parms.max + '页，' + parms.total + '条';
            input_btn.className = "g-pagespan";
            input_btn.innerHTML = "当前第<input type=\"text\" class=\"g-pagenum\" id=\"pagenum\" value=\""+parms.cur_page+"\" maxlength=\"5\">页";
            turn_btn.className = "g-pagespan";
            turn_btn.innerHTML = "跳转";

            if( parms.cur_page === 1){
                index_btn.classList.add("g-page_disabled");
                previous_btn.classList.add("g-page_disabled");
            }
            if( parms.cur_page === parms.max){
                next_btn.classList.add("g-page_disabled");
                end_btn.classList.add("g-page_disabled");
            }

            outer.appendChild(index_btn);
            outer.appendChild(previous_btn);
            outer.appendChild(next_btn);
            outer.appendChild(end_btn);
            outer.appendChild(info_btn);
            outer.appendChild(input_btn);
            outer.appendChild(turn_btn);
            doc.appendChild(outer);
            var par = document.querySelector(parms.container);
            par.classList.add("g-clr");
            par.appendChild(doc);

            index_btn.addEventListener("click", function(){
                if(this.className.match("g-page_disabled")){
                    return;
                }
                go(1);
            }, false);
            end_btn.addEventListener("click", function(){
                if(this.className.match("g-page_disabled")){
                    return;
                }
                go(max);
            }, false);
            previous_btn.addEventListener("click", function(){
                if(this.className.match("g-page_disabled")){
                    return;
                }
                go(parms.cur_page - 1);
            }, false);
            next_btn.addEventListener("click", function(){
                if(this.className.match("g-page_disabled")){
                    return;
                }
                go(parms.cur_page + 1);
            }, false);
            turn_btn.addEventListener("click", function(){
                var _tar = document.getElementById("pagenum").value.replace(num,"") - 0;
                (_tar > parms.max ) && (_tar = parms.max);
                if( _tar === parms.cur_page ){
                    return;
                }
                go();
            }, false);
        };
        return{
            "init" : init
        }
    })();

    var logout = function(){
        setCookie("Gtoken", "", -1);
        location.href ="/index";
        // document.getElementById("logborad").style.display = "inline";
        // document.getElementById("infoborad").remove();
    };

    return {
        "top_close" : top_close,
        "warns" : warns,
        "setCookie" :setCookie,
        "removeWarn" : removeWarn,
        "pagination" : pagination,
        "logout" : logout,
        "usernameCheck" : usernameCheck,
        "nickCheck" : nickCheck,
        "convertNum" : convertNum
    }
})();