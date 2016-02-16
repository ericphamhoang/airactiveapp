/**
 * Created by Admin on 12/22/2015.
 */
app.controller('adminTermsAndConditionsController', ['$scope', '$kookies', '$http', '$window', function ($scope, $kookies, $http, $window) {

    //provider
    $scope.provider = {
        isEdit: false,
        editOn: function () {
            $scope.provider.isEdit = true;
        },
        editOff: function () {

            var data = {
                "terms_condition_role_name": "Provider",
                "terms_condition_content": $scope.provider.termsAndConditions
            };

            var options = {
                "headers": {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + $scope.user.token
                }
            };

            $http.get("/key.json").then(function (success) {
                var url = success.data.url;
                $http.post(url + '/terms_conditions/update', data, options).then(function (success) {
                    $scope.provider.isEdit = false;
                })
            })
        },
        termsAndConditions: ''
    }

    //instructor
    $scope.instructor = {
        isEdit: false,
        editOn: function () {
            $scope.instructor.isEdit = true;
        },
        editOff: function () {

            var data = {
                "terms_condition_role_name": "Instructor",
                "terms_condition_content": $scope.instructor.termsAndConditions
            }

            var options = {
                "headers": {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + $scope.user.token
                }
            }

            $http.get("/key.json").then(function (success) {
                var url = success.data.url;
                $http.post(url + '/terms_conditions/update', data, options).then(function (success) {
                    $scope.instructor.isEdit = false;
                })
            })
        },
        termsAndConditions: ''
    }

    var user = $kookies.get('User');

    if (user !== undefined) {
        $scope.user = user;
    }

    var options = {
        "headers": {
            "Content-Type": "application/json",
            "authorization": "Bearer " + $scope.user.token
        }
    };
    //load tc for provider
    $http.get("/key.json").then(function (success) {
        var url = success.data.url;
        $http.get(url + "/terms_conditions/get/Provider", options).then(function (success) {
            $scope.provider.termsAndConditions = success.data.data.content;
        });

        //load tc for instructor
        $http.get(url + "/terms_conditions/get/Instructor", options).then(function (success) {
            $scope.instructor.termsAndConditions = success.data.data.content;
        })
    })

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);