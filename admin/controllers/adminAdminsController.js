/**
 * Created by Admin on 12/22/2015.
 */
app.controller('adminAdminsController', ['$scope', '$rootScope', '$http', '$kookies', '$window', function ($scope, $rootScope, $http, $kookies, $window) {

    $scope.isListView = true;
    $scope.isAddAdminView = false;

    var user = $kookies.get('User');

    $scope.user = user;

    $http.get("/key.json").then(function(success) {
        var url = success.data.url;
        $http.get(url + "/users/admin/all?token=" + $scope.user.token)
            .then(function (response) {

                $scope.admins = response.data.data.items;

                console.log(JSON.stringify($scope.admins[1]));
            });
    });

    //toggle view
    $scope.toggleAddAdmin = function () {
        $scope.isListView = false;
        $scope.isAddAdminView = true;

        $scope.newAdmin = {
            "first_name": null,
            "last_name": null,
            "email": null,
            "password": null
        };


    };

    $scope.addAdmin = function () {

        var data = {
            "first_name": $scope.newAdmin.first_name,
            "last_name": $scope.newAdmin.last_name,
            "email": $scope.newAdmin.email,
            "password": $scope.newAdmin.password
        };

        var options = {
            "headers": {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $scope.user.token
            }
        };

        $http.get("/key.json").then(function(success) {

            var url = success.data.url;
            $http.post(url + "/users/admin", data, options).then(function (success) {

                alert("added admin");

                $scope.isListView = true;
                $scope.isAddAdminView = false;

                $http.get(url + "/users/admin/all?token=" + $scope.user.token)
                    .then(function (response) {

                        $scope.admins = response.data.data.items;

                        console.log(JSON.stringify($scope.admins[1]));
                    });

            }, function (fail) {

            })
        })
    }
}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);

//active: true
//created_at: 1452148804
//customer_id: null
//date_of_birth: null
//email: "subde@sub.com"
//emergency_contact_name: null
//emergency_contact_number: null
//first_name: "Admin_1"
//id: 3
//insurer_name: null
//insurer_number: null
//is_disabled: false
//is_male: null
//last_name: "Admin_1"
//mobile_number: null
//name: "Admin_1 Admin_1"
//postcode: null
//role_id: 1
//staff_manager: false
//staff_scheduler: false
//staff_view_only: false
//status: null
//timezone: "Australia/Melbourne"
//user_id: 186
//__proto__: Object