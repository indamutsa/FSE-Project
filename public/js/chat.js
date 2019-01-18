// const socket = io();
var socket = io.connect('http://localhost:4600');
var params = $.deparam(window.location.search);
var feedback = document.getElementById('feedback');

socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('join', params, function (err) {
        if (err) {
            alert("Please SIGN IN and fill all the fields!");
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

        document.getElementById("user").disabled = true;
        document.getElementById("group").disabled = true;
    });
});


message.addEventListener('keypress', function () {
    socket.emit('typing', params.username);
});

socket.on('typing', function (data) {
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>'
    console.log('#######');
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
    feedback.innerHTML = '';
    $(".messages").stop().animate({ scrollTop: $(".messages")[0].scrollHeight }, 1000);

    if (message.from === params.username) {
        $('<li class="sent"><p>' + message.from +
            '<i style="color:#778899; ">  ' + formattedTime + ' </i> <br/> <em style="font-size: 12px;">' +
            message.text + ' </em> </p></li>').appendTo($('.messages ul'));
    }
    else {
        $('<li class="replies"><p> <b>' + message.from +
            '<i style="color:#778899;">  ' + formattedTime + ' </i> <br/> <em style="font-size: 12px;">' +
            message.text + '  </em> </p></li>').appendTo($('.messages ul'));
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected to server')
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



