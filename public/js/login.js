$(function () {

    document.getElementById("user").disabled = true;
    document.getElementById("group").disabled = true;

    // document.getElementById("user").disabled = true

    $('#userdiv').on('click', function (event) {
        event.preventDefault();

        if (document.getElementById("user").disabled) {
            $("#login").trigger('click');
        }
    });


    // CREATE/POST
    $('#login-form').on('submit', function (event) {
        event.preventDefault();

        var name = $('#username-log').val();
        var password = $('#password-log').val();

        localStorage.name = name;

        console.log(localStorage.name + " :===> local");


        logindata = {
            name,
            password
        }

        console.log(name + "   " + password);

        $.ajax({
            url: '/signin',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(logindata),
            success: function (response) {
                console.log("Client: " + response);
                document.getElementById("user").disabled = false;
                document.getElementById("group").disabled = false;
                document.getElementById('login-error').innerHTML = ""
            },
            error: function () {
                document.getElementById('login-error').innerHTML =
                    "<p style='color:#ff4000'>No such user, Please register</p>"
            }
        });

        $('#login-form')[0].reset();
    });


    // CREATE/POST
    $('#signup-form').on('submit', function (event) {
        event.preventDefault();


        var name = $('#username-reg').val();
        var password = $('#password-reg').val();
        var passwordrep = $('#password-reg-rep').val();

        if (password === passwordrep && password && name) {
            console.log(name, password, passwordrep)

            logindata = {
                name,
                password
            }

            console.log(name + "   " + password);

            $.ajax({
                url: '/signup',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(logindata),
                success: function (response) {
                    console.log("Client: " + response);
                }

            });
            document.getElementById('signup-error').innerHTML =
                "<p style='color:#40ff00'>Successfully signed up!</p>";

            $('#signup-form')[0].reset();
        }
        else {
            document.getElementById('signup-error').innerHTML =
                "<p style='color:#ff4000'>Password mismatch</p>";
            console.log("-------------------------------------------");
        }
    });

    // CREATE/POST
    $('#signout').on('click', function (event) {
        event.preventDefault();

        console.log(localStorage.name)
        $.ajax({
            url: '/signout',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name: localStorage.name }),
            success: function (response) {
                console.log(response);
                console.log('-----||||||--------------------');
                document.getElementById("user").disabled = true;
                document.getElementById("group").disabled = true;
            },
            error: console.log('Issues-------|||||------')
        });
    });

});