// 聊天窗口处理

function msg(event) {
    var obj = JSON.parse(event.data);
    if(obj.type === 'addRoom'){
        var html = '<p><b>系统：</b>有新的用户加入，用户ID：'+ obj.userId +'，现有人数'+ obj.userList +'</p>';
        $('#room_msg').append(html);

    } else if(obj.type === undefined){
        $('#userDetail').append('用户ID：'+obj.sessionId);

    } else if(obj.type === 'roomSequence'){
        if(obj.msg.sequenceUserId === sessionStorage.sessionKey){
            $('#robLandlord').removeAttr('disabled');
        }
        var html = '<p><b>系统：</b>【顺序操作】用户ID：'+ obj.msg.sequenceUserId +'</p>';
        $('#room_msg').append(html);
    }

    else {
        $('#room_msg').append('<p><b>系统：</b>'+ event.data +'</p>');
    }

    $("#room_msg").getNiceScroll().resize();
    setPos();
}

function setPos() {
    var div = document.getElementById('room_msg');
    div.scrollTop = div.scrollHeight;
}