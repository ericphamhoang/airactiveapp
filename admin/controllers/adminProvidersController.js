/**
 * Created by Admin on 12/22/2015.
 */
app.controller('adminProvidersController', ['$scope', '$rootScope', '$http', '$kookies', '$window', function ($scope, $rootScope, $http, $kookies, $window) {

    var user = $kookies.get('User');

    $scope.user = user;

    $scope.isProfileView = false;
    $scope.isTableView = true;
    $scope.status = "";

    var options = {
        "headers": {
            "Content-Type": "application/json",
            "authorization": "Bearer " + $scope.user.token
        }
    };

    $http.get("/key.json").then(function (success) {
        var url = success.data.url;
        $http.get(url + "/providers", options).then(
            function (success) {
                $scope.providers = success.data.data;
                console.log($scope.providers);
            },
            function (error) {
            })
    });

    $scope.showProviderProfile = function () {
    }
}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);