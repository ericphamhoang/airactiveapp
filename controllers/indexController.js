/**
 * Created by eric on 10/12/2015.
 */

/**
 * Created by eric on 5/12/2015.
 */

var app = angular.module('airActiveApp', ['ngKookies']);

app.controller('indexController', ['$scope', '$http', '$kookies', '$window', function ($scope, $http, $kookies, $window) {

    var user = $kookies.get('User');

    if (user == undefined)
    {
        window.location.href = '/login/';
    }
    else
    {
        if (user.instructor !== undefined)
            window.location.href = '/instructor/';
        else if (user.provider !== undefined)
            window.location.href = '/provider/';
        else
            window.location.href = '/admin/';
    }

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);