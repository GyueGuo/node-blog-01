var ue = UE.getEditor("editor",{
	initialFrameWidth:716,
	initialFrameHeight:320,
	toolbars: [[
    'bold', 'italic', 'underline', '|', 'forecolor', 'backcolor', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'insertimage', '|', 'date', 'time', '|', 'help'
	]]
});
function saveArticle(obj) {
	if(obj.classList.contains("prevent")){
		return;
	}
	obj.classList.add("prevent");
	var title = $("#title").val();
	var content = ue.getContent();
	if(!title || !content){
		return;
	}
	var tempContent = content;
	tempContent = tempContent.replace(/'/g,"\"");
	var checkImage = /<img.*?src="(.*?)"/g;
	var page = [];
	var temp = checkImage.exec( tempContent );
	while(temp){     
		page.push(temp[1]);
		tempContent = tempContent.replace(temp[0],"");
		temp = tempContent.match(checkImage);
	};
	var data = {
		"title" : title,
		"content" : content,
		"cover" : page
	};
	$.ajax({
		"url" : "/article",
		"type" : "post",
		"data" : JSON.stringify(data),
		"contentType" : 'application/json; charset=utf-8', // 很重要
		"success" : function(){
			common.warns("发布成功", "c-warn_tips");
			setTimeout(function(){
				location.reload(true);
			}, 2000);
		},
		"fail" : function(){
			var dom = common.warns("发布失败", "c-warn_warn");
			removeWarn(dom, 5000);
			obj.classList.remove("prevent");
		}
	})
}