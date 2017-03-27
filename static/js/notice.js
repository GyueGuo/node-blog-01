$(document).ready(function(){
    $("#save").click(function(){
        var nick = $("#nick").val();
        var portrait = $("#portrait").attr("src");
        if(!nick || !portrait){
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
                console.log(1)
            },
            "fail" : function(data){
                console.log(2)
            }
        });
    });
    $("#edit").click(function(){
        $("#nick").removeAttr("disabled").focus();
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
            $("#portrait").attr("src", data.url).css({"display":"block"});
            $("#cropper").hide();
        });
    }
},false);