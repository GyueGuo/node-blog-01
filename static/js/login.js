$(document).ready(function(){
    $(".c-r_input").keydown(function(event){
        var code = event.keyCode;
        if(code === 13){
            var parent = $(this).closest(".g-text_center");
            var queue = parent.find(".c-r_input");
            var ind = queue.index(this);
            if(ind < queue.length -1){
                queue.eq(ind+1).focus();
            }else{
                parent.find(".c-r-btn").click();
            }
        }
    })
});
function r_rotate(id,_id){
    var tar1 = document.getElementById(id);
    var tar2 = document.getElementById(_id);
    tar2.classList.remove("c-r_active");
    tar1.classList.add("c-r_active");
};
function login(){
    $(".c-warn_item").remove();
    var username = $("#lusername").val();
    var pwd = $("#lpwd").val();
    if(username.length < 4){
        var fail = common.warns("用户名长度不能少于4","c-warn_alert");
        common.removeWarn(fail, 5000);
        return;
    }
    if( common.usernameCheck( username ) ){
        var fail = common.warns("用户名只能由数字、字母组成","c-warn_alert");
        common.removeWarn(fail, 5000);
        return;
    }
    if(pwd.length === 0){
        var fail = common.warns("登录密码不能为空","c-warn_alert");
        common.removeWarn(fail, 5000);
        return;
    }
    var uploading = common.warns("正在登录...","c-warn_tips");
    $.ajax({
        "url" : "/login",
        "type" : "post",
        "timeout" : 5000,
        "data" : {
            "username" : username,
            "password" : hex_md5(pwd)
        },
        "success" : function(data){
            common.setCookie("Gtoken",data.token,2);
            uploading.remove();
            if(data.success === "2"){
                var success = common.warns("登录成功","c-warn_tips");
                common.removeWarn(success, 5000);
                $("#setting").addClass("c-r_active").siblings().removeClass("c-r_active");
            }else{
                common.warns("登录成功，正在跳转...","c-warn_tips");
                location.href = "/setting";
            }
            
        },
        "error" : function(err){
            var data = JSON.parse(err.responseText);
            uploading.remove();
            if(err.status === 400){
                if(data.error === "3"){
                    var fail = common.warns("用户名或密码不正确","c-warn_alert");
                    common.removeWarn(fail, 5000);
                }else if(data.error === "2"){
                    var fail = common.warns("用户不存在","c-warn_alert");
                    common.removeWarn(fail, 5000);
                }
            }else{
                var fail = common.warns("登录失败，请稍候再试","c-warn_alert");
                common.removeWarn(fail, 5000);
            }
        }
    })
}
function r_jump(){
    location.replace("/index");
}
function register(){
    $(".c-warn_item").remove();
    var username = $("#rusername").val();
    var pwd = $("#rpwd").val();
    var rpwd = $("#rrpwd").val();
    if(username.length < 4){
        var fail = common.warns("用户名长度不能少于4","c-warn_alert");
        common.removeWarn(fail, 5000);
        return;
    }else if( common.usernameCheck( username ) ){
        var fail = common.warns("用户名只能由数字、字母组成","c-warn_alert");
        common.removeWarn(fail, 5000);
        return;
    }else if(pwd.length < 6){
        var fail = common.warns("密码长度不能少于6","c-warn_alert");
        common.removeWarn(fail, 5000);
        return;
    }else if(pwd !== rpwd){
        var fail = common.warns("两次输入密码不一致","c-warn_alert");
        common.removeWarn(fail, 5000);
        return;
    }
    var uploading = common.warns("正在注册...","c-warn_tips");
    $.ajax({
        "url" : "/register",
        "type" : "post",
        "timeout" : 5000,
        "data" : { "username" : username, "password" : hex_md5(pwd) },
        "success" : function(data){
            uploading.remove();
            var fail = common.warns("注册成功","c-warn_alert");
            common.removeWarn(fail, 5000);
            $("#setting").addClass("c-r_active").siblings().removeClass("c-r_active");
            setting.writeCookie(data.token)
        },
        "error" : function(err){
            uploading.remove();
            var data = JSON.parse(err.responseText);
            if(err.status === 400 && data.error === "2"){
                var fail = common.warns( data.reason, "c-warn_alert" );
                common.removeWarn(fail, 5000);
            }else{
                var fail = common.warns("注册失败，请稍候再试","c-warn_alert");
                common.removeWarn(fail, 5000);
            }
        }
    });
}

var setting =  (function(){
    var cookie = "";
    function submit(){
        $(".c-warn_item").remove();
        var nick = $("#nick").val();
        var portrait = $("#portrait").attr("src");
        if( !nick){
            var fail = common.warns("请输入昵称","c-warn_alert");
            common.removeWarn(fail, 5000);
            return;
        }else if( !common.nickCheck(nick) ){
            var fail = common.warns("昵称只能由汉字、数字、字母组成","c-warn_alert");
            common.removeWarn(fail, 5000);
            return;
        }
        if( !portrait ){
            var fail = common.warns("请上传头像","c-warn_alert");
            common.removeWarn(fail, 5000);
            return;
        }
        var uploading = common.warns("正在提交...","c-warn_process");
        $.ajax({
            "type" : "put",
            "url" : "/setting", 
            "cache" : false, 
            "timeout" : 5000,
            "data" : {
                "nick" : nick,
                "portrait" : portrait,
                "token" : cookie
            },
            "success" : function(data){
                uploading.remove();
                common.setCookie("Gtoken", cookie, 2);
                location.href = "/setting"
            },
            "fail" : function(data){
                uploading.remove();
                var fail = common.warns("提交失败，请重试","c-warn_alert");
                setTimeout(function(){fail.remove()},5000);
            }
        });
    }
    function write(str){
        cookie = str;
    }
    return {
        "submit" : submit,
        "writeCookie" : write
    }
})();
var uploadPortrait = (function(){
    var portrait = "", url = "/imageUpload";
    var preview = function(obj){
        if(obj.files.length  === 0){
            return;
        }
        var file = obj.files[0];
        if(file.size > 2*1024*1024){
            alert("图片不能超过2m");
            return;
        }
        var reader = new FileReader();
        reader.onload = function(){
            portrait = this.result;
            var newNode = obj.cloneNode(true);
            frames["cropper_frame"].postMessage(portrait,"http://"+location.host);
            obj.parentNode.append(newNode);
            obj.remove();
        };
        reader.readAsDataURL(file); 
    };
    var upload = function(portrait,callback){
        $(".c-warn_item").remove();
        var uploading = common.warns("正在上传...","c-warn_process");
        $.ajax({
            "url" : url,
            "type" : "post",
            "timeout" : 5000,
            "data" : {"type":"base64","data" : portrait},
            "success" : function(data){
                uploading.remove();
                callback(data);
            },
            "error" : function(err){
                uploading.remove();
                var fail = common.warns("登录失败，请重试","c-warn_alert");
                setTimeout(function(){fail.remove()},5000);
            }
        });
    };
    return {
        "preview" : preview,
        "upload" : upload
    };
})($);
function cropperCallBack(){
    $("#cropper").show();
}   
window.addEventListener("message",function(e){
    var temp = e.data;
    if(temp.from === "cropper"){
        uploadPortrait.upload(temp.data,function(data){
            $("#portrait").attr("src", data.url).css({"display":"block"});
            $("#cropper").hide();
        });
    }
},false);