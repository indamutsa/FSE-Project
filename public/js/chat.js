const socket = io();
var params = $.deparam(window.location.search);

socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
        else {
            $('#admin').text("You joined as: " + params.username);
            $('#groupn').text("Group name: " + params.group_name);

            console.log('No error')
        }
    });


    $('#leave').on('click', function () {
        socket.emit('leave', params, function (err) {

            if (err) {
                alert(err);
            }
            else {
                window.location.href = '/';
            }
        });
    });
});


socket.on('disconnect', () => {
    console.log('Disconnected to server')
});

socket.on('updateUserList', function (users) {
    console.log('Users list ', users);

    var ol = $('<ul></ul>');
    users.forEach(function (users) {
        ol.append($('<li></li>').text(users));
    });

    $('#users').html(ol);
})


socket.on('newMessage', (message) => {

    var formattedTime = moment(message.createdAt).format('h:mm a');

    $(".messages").stop().animate({ scrollTop: $(".messages")[0].scrollHeight }, 1000);

    if (message.from === params.username) {
        $('<li class="sent"><p> <b>' + message.from +
            '</b>   <i style="color:#778899;">' + formattedTime + ' </i> <br/>' +
            message.text + '</p></li>').appendTo($('.messages ul'));
    }
    else {
        $('<li class="replies"><p> <b>' + message.from +
            '</b>   <i style="color:#778899;">' + formattedTime + ' </i> <br/>' +
            message.text + '</p></li>').appendTo($('.messages ul'));
    }



});

$('#message-form').on('submit', function (e) {

    e.preventDefault();
    var messageTextBox = $('[name=message]');

    socket.emit('createMessage', {
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('')
    });
});



