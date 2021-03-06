var websocket = null;
var baseUrl = document.location.host;

//判断当前浏览器是否支持WebSocket
if('WebSocket' in window){
    var wsUrl = "ws://" + document.location.host + "/websocket";
    websocket = new WebSocket(wsUrl);
}
else{
    alert('不支持 websocket');
}

websocket.onerror = function(){
    console.log('连接发送错误');
};

websocket.onopen = function(event){
    console.log("连接建立成功");
};

websocket.onmessage = function(event){
    console.log("收到消息："+ event.data);
    layer.msg('收到socket消息：'+ event.data , { icon:1, offset: ['20%', '60%'] });
    var obj = JSON.parse(event.data);
    if(obj.sessionId !== undefined ){
        sessionStorage.sessionKey = obj.sessionId;
    }
    msg(event);

    //创建房间
    if(obj.type === 'createRoom'){
        $('#roomList').append('<dd id="'+ obj.roomId +'"><a class="addRoom"  onclick="addRoom(this)" ><span data-id="'+ obj.roomId +'">'+ obj.roomName +'</span></a></dd>');
    }
    //开始发牌
    if(obj.type === 'licensingAction'){
        var types = orderBy(obj.brands, ['val'], 'desc');
        $(types.results).each(function (index, brand) {

            var bra = new Brand(brand);
            $('#brandList').append(bra.createBrandLiHtml());
        });
        brandsAddClick();
    }
    //抢地主
    if(obj.type === 'landlord'){
        //地主的牌
        if(obj.msg.IsLandlordUserId === sessionStorage.sessionKey){
            $(obj.msg.bottomBrand).each(function (index, brand) {

                var bra = new Brand(brand);
                $('#brandList').append(bra.createBrandLiHtml());
            });
        }
        // 底牌公示区域
        $(obj.msg.bottomBrand).each(function (index, brand) {
            var html = '<div class="layui-col-sm3">\n' +
                '            <div class="grid-demo grid-demo-bg1">' +
                '               <div class="layui-card" style="border: 1px black solid; padding: 10px; height: 100px;">\n' +
                '                  <div class="layui-card-header">id=：<span>'+ brand.id +'</span></div>\n' +
                '                  <div class="layui-card-body">\n' +
                '                    type=<span>'+ brand.type +'</span><br>\n' +
                '                    val= <spa>'+ brand.val +'</spa>\n' +
                '                  </div>\n' +
                '                </div>' +
                '            </div>\n' +
                '      </div>';
            $('#bottomBrand').append(html);
        });
        brandsAddClick();
    }

    if(obj.type === 'REMOVE_ROOM'){
        $('#'+obj.roomId).remove();
    }

};

//连接关闭的回调方法
websocket.onclose = function(){
    console.log("连接关闭");
};

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function(){
    websocket.close();
};

//将消息显示在网页上
function setMessageInnerHTML(innerHTML){
    document.getElementById('message').innerHTML += innerHTML + '<br/>';
}

//关闭连接
function closeWebSocket(){
    websocket.close();
}

/**
 * 抢地主
 */
function landlord(_this) {
    $(_this).button('reset');

    var json = socketSendJson('landlord');
    json.multiple = $('#multiple').val();

    websocket.send(JSON.stringify(json));
    $(_this).attr('disabled', 'disabled');
}

function socketSendJson(type) {
    var json = {};
    json.type = 'landlord';
    json.roomId = sessionStorage.roomKey;
    json.userId = sessionStorage.sessionKey;
    return json;
}