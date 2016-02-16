/**
 * Created by eric on 10/12/2015.
 */

/**
 * Created by eric on 5/12/2015.
 */

var app = angular.module('airActiveApp', ['ngKookies']);

app.controller('forgotPasswordController', ['$scope', '$http', '$kookies', '$window', function ($scope, $http, $kookies, $window) {

    $scope.showLoader = false;

    $scope.formSubmit = function () {

        $http.get("/key.json").then(function(success){
            var url = success.data.url;

            $scope.showLoader = true;

            $http.post(url + "/auth/forgot_password",
                {
                    "email": $scope.email
                }).then(
                //success
                function (success) {

                    $scope.showLoader = false;

                    notie.alert(1, "Please check your email for password reset link");

                    setTimeout(function(){
                        window.location.href = "/login/";
                    }, 1000)
                },
                //fail
                function (fail) {

                    $scope.showLoader = false;

                    var message = fail.data.error.messages;

                    notie.alert(3, message);
                }
            )
        });

    };

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