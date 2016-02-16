/**
 * Created by Admin on 12/29/2015.
 */

app.controller('providerStaffsController', ['$scope', '$rootScope', '$http', '$kookies', '$window', function ($scope, $rootScope, $http, $kookies, $window) {
    //initial value
    $scope.isAddStaff = false;

    var user = $kookies.get('User');
    $scope.user = user;

    var options = {
        "headers": {
            "Content-Type": "application/json",
            "authorization": "Bearer " + $scope.user.token
        }
    };

    $http.get("/key.json").then(function (success) {
        var url = success.data.url;
        $http.get(url + "/providers/" + $scope.user.provider.id,
            options)
            .then(function (response) {
                $scope.staffs = response.data.data[0].staff_providers;
            });
    });

    $scope.openAddStaffView = function () {
        $scope.isAddStaff = true;
        $scope.newStaff = {
            "first_name": null,
            "last_name": null,
            "email": null,
            "password": null,
            "staff_manager": false,
            "staff_scheduler": false,
            "staff_view_only": false
        }
    }

    $scope.addStaff = function () {

        var validator = [
            {field: $scope.newStaff.first_name, message: 'First name is required'},
            {field: $scope.newStaff.last_name, message: 'Last name is required'},
            {field: $scope.newStaff.email, message: 'Email is required'},
            {field: $scope.newStaff.first_name, message: 'First name is required'},
            {field: $scope.newStaff.first_name, message: 'First name is required'}
        ];

        var data = {
            "first_name": $scope.newStaff.first_name,
            "last_name": $scope.newStaff.last_name,
            "email": $scope.newStaff.email,
            "password": $scope.newStaff.password,
            "staff_manager": $scope.newStaff.staff_manager,
            "staff_scheduler": $scope.newStaff.staff_scheduler,
            "staff_view_only": $scope.newStaff.staff_view_only
        };

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.post(url + "/providers/staff/create", data, options).then(function (response) {

                alert("add staff successfully!");
                $scope.isAddStaff = false;

                $http.get(url + "/providers/" + $scope.user.provider.id,
                    options)
                    .then(function (response) {
                        $scope.staffs = response.data.data[0].staff_providers;
                    });
            })
        })

    }

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }]);