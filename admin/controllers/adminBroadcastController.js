/**
 * Created by Admin on 12/22/2015.
 */
app.controller('adminBroadcastController', ['$scope', '$rootScope', '$http', '$kookies', '$window', function ($scope, $rootScope, $http, $kookies, $window) {

    var user = $kookies.get('User');

    $scope.user = user;

    $scope.sendBroadcast = function () {

        var data = {
            "broadcast_content": $scope.broadcast.broadcast_content,
            "broadcast_to_roles": $scope.broadcast.broadcast_to_roles
        };

        var options = {
            "headers": {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $scope.user.token
            }
        };

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.post(url + "/broadcasts", data, options).then(function (success) {

                    alert("created broadcast!");

                    $scope.broadcast = {
                        broadcast_content: "",
                        broadcast_to_roles: []
                    };
                },
                function (error) {

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