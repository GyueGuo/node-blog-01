$(document).ready(function(){
    $("#save").click(function(){
        if( $(this).hasClass("g-distabled") ){
            return;
        }
        var nick = $("#nick").val();
        var portrait = $("#portrait").attr("src");
         if( !nick){
            var fail = common.warns("请输入昵称","c-warn_alert");
            common.removeWarn(fail, 5000);
            return;
        }else if( common.nickCheck(nick) ){
            var fail = common.warns("昵称只能由汉字、数字、字母组成","c-warn_alert");
            common.removeWarn(fail, 5000);
            return;
        }
        if( !portrait ){
            var fail = common.warns("请上传头像","c-warn_alert");
            common.removeWarn(fail, 5000);
            return;
        }
        $.ajax({
            "type" : "put",
            "url" : "/setting", 
            "cache" : false, 
            "timeout" : 5000,
            "data" : {
                "nick" : nick,
                "portrait" : portrait
            },
            "success" : function(data){
                common.warns("修改成功","c-warn_tips");
            },
            "fail" : function(data){
                common.warns("修改失败","c-warn_fail");
            }
        });
    });
    $("#edit").click(function(){
        $("#nick").removeAttr("disabled").focus();
        $("#save").removeClass("g-distabled");
    });
    $("#nick").blur(function(){
        $(this).attr("disabled", "disabled");
    });
});
var uploadPortrait = (function(){
    var portrait = "", url = "/imageUpload";
    var preview = function(obj){
        if(obj.files.length === 0){
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
        common.warns("正在上传...","c-warn_process");
        $.ajax({
            "url" : url,
            "type" : "post",
            "timeout" : 5000,
            "data" : {"type":"base64","data" : portrait},
            "success" : function(data){
                callback(data);
            },
            "error" : function(err){

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
            $("#save").removeClass("g-distabled");
            $("#portrait").attr("src", data.url).css({"display":"block"});
            $("#cropper").hide();
        });
    }
},false);