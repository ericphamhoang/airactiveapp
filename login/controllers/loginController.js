/**
 * Created by eric on 10/12/2015.
 */

/**
 * Created by eric on 5/12/2015.
 */

var app = angular.module('airActiveApp', ['ngKookies']);

app.controller('loginController', ['$scope', '$http', '$kookies', '$window', function ($scope, $http, $kookies, $window) {
    //Init
    var user = $kookies.get('User');

    if (user != undefined) {
        if (user.instructor !== undefined)
            window.location.href = "/instructor/";
        else if (user.provider !== undefined)
            window.location.href = '/provider/';
        else
            window.location.href = '/admin/';
    }

    $scope.user = {
        email: null,
        password: null
    };

    $scope.loginController_functions = {
        //login
        login: function () {

            $http.get("/key.json").then(function (success) {
                var url = success.data.url;

                //validation

                if (!$scope.user.email) {
                    notie.alert(3, "Email is required", 2);
                    return;
                }

                if (!$scope.user.password) {
                    notie.alert(3, "Password is required", 2);
                    return;
                }

                var data = {
                    "email": $scope.user.email,
                    "password": $scope.user.password,
                    "timezone": jstz.determine().name()
                };

                $http.post(url + "/auth/login", data).then(
                    function (success) {
                        var user = success.data.data;

                        if (user.provider != undefined)
                            user.provider.encoded_address = null;

                        $kookies.set('User', user, {expires: 7, path: '/'});

                        if (user.instructor !== undefined)
                            window.location.href = "/instructor/";
                        else if (user.provider !== undefined)
                            window.location.href = '/provider/';
                        else
                            window.location.href = '/admin/';
                    },
                    function (fail) {
                        notie.alert(3, fail.data.error.messages[0], 2);
                    }
                )
            });
        }
    }

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);

//provider
//
//{
//    "email":"jahnavisdeshpande@gmail.com",
//    "password":"123456",
//    "timezone": "Australia/Melbourne"
//}
//
//USer
//
//{
//    "email":"subdeshpande@gmail.com",
//    "password":"123456",
//    "timezone": "Australia/Melbourne"
//}
//
//
//Instructor
//
//{
//    "email":"subodh.deshpande@appscore.com.au",
//    "password":"123456",
//    "timezone": "Australia/Melbourne"
//}