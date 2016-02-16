/**
 * Created by eric on 6/12/2015.
 */

jQuery(".form-password-reset .button-reset").click(function () {

    var email = jQuery.cookie('airactive_email');
    var password = jQuery("#password").val();
    var password_confirmation = jQuery("#password_confirmation").val();

    var token = getUrlParameter('token');

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://52.65.6.68/api/v1/auth/reset_password",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(
            {
                "email": email,
                "token": token,
                "password": password,
                "password_confirmation": password_confirmation
            }
        )
    };

    $.ajax(settings).done(function (response) {
        UIkit.notify(
            "Welcome " + response.data.name
        );

        UIkit.notify("Password has been reset!");

        setInterval(function () {
            window.location.href = "/";
        }, 1000);

    }).fail(function (response) {
        console.log(response);
        var error_messages = response.responseText;
        UIkit.notify(error_messages);
    });
});