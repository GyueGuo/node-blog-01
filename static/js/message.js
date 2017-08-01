$(document).ready(function(){
    $("body").on("click", ".c_message_tags", function(){
        var that = $(this);
        if( that.hasClass("active") ){
            that.removeClass("active");
        }else{
            that.addClass("active");
        }
    });
    $("body").on("click", ".c-message_opposition, .c-message_favor", function(){
        if(!user){
            return;
        }
        var that = $(this);
        var json = {};
        if( that.hasClass("c-message_opinion") ){
            json.action = 0;
        }else{
            json.action = 1;
        }
        json._id = that.closest(".c-message").attr("_id");
        if( that.hasClass("c-message_opposition") ){
            json.opinion = 0;
        }else{
            json.opinion = 1;
        }
        $.ajax({
            "url" : "/message",
            "type" : "put",
            "timeout" : 5000,
            "contentType" : 'application/json; charset=utf-8', // 很重要
            "data" : JSON.stringify(json),
            "success" : function(data){
                if(json.action === 0){
                    that.removeClass("c-message_opinion");
                }else{
                    that.addClass("c-message_opinion");
                }
                that.find("span").eq(0).html(data.length);
            },
            "error" : function(err){
                var fail = common.warns("提交失败，请重试","c-warn_tips");
                common.removeWarn(fail, 5000);
            }
        });
    });
    $("#message").keyup(function(){
        var that = $(this);
        if( that.val().length > 200){
            that.addClass("c-message_warning");
        }else{
            if( that.hasClass("c-message_warning") ){
                that.removeClass("c-message_warning");
            };
        }
    });
    $("#sendMessage").click(function(){
        if(!user){
            var cfm = window.confirm("您还未登录，去登录？");
            if(cfm === true){
                location.href = "/login";
            }
        }
        var cnt = $("#message").val().trim();
        var tags = [];
        $(".c_message_tags").each(function(){
            var temp = $(this);
            if( temp.hasClass("active") ){
                tags.push( temp.html() );
            }
        });
        if(cnt.length === 0 || cnt.length > 200){
            $("#message").addClass("c-message_warning");
            return;
        }else{
            var tip = common.warns("正在提交...","c-warn_tips");
            $.ajax({
                "url" : "/message",
                "type" : "post",
                "timeout" : 5000,
                "contentType" : 'application/json; charset=utf-8', // 很重要
                "data" : JSON.stringify({ "content" : cnt, "tags" : tags }),
                "success" : function(){
                    location.reload();
                },
                "error" : function(err){
                    tip.remove();
                    var fail = common.warns("正在提交...","c-warn_tips");
                    common.removeWarn(fail, 5000);
                }
            });
        }
    });
});