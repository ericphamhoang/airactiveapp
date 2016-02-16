/**
 * Created by eric on 10/12/2015.
 */

/**
 * Created by eric on 5/12/2015.
 */

var app = angular.module('airActiveApp', ['ngKookies']);

app.controller('logoutController', ['$scope', '$http', '$kookies', '$window', function ($scope, $http, $kookies, $window) {

    $kookies.remove('User', {path: '/'});

    window.location.href = '/';

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);