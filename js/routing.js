/**
 * Created by eric on 5/12/2015.
 */


jQuery(document).ready(function(){

    //password reset routing
    if (window.location.href.indexOf('/index.html#/validate/password-reset/') !== -1)
    {
        var start = window.location.href.indexOf('/index.html#/validate/password-reset/') + '/index.html#/validate/password-reset/'.length;
        window.location.href = "/password-reset/?token=" + window.location.href.substr(start);
        return;
    }

    //read cookie
    var user_cookie = jQuery.cookie('airactive_user');

    if (user_cookie == undefined)
        window.location.href="/login/";
    else
        window.location.href="/profile/";
});