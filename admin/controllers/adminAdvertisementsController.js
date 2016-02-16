app.controller('adminAdvertisementsController', ['$scope', '$rootScope', '$http', '$kookies', '$window', function ($scope, $rootScope, $http, $kookies, $window) {

    var user = $kookies.get('User');

    $scope.user = user;

    $scope.isListView = true;
    $scope.isAddView = false;

    $scope.loadAdvertisements = function () {

        var options = option = {
            "headers": {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $scope.user.token
            }
        };

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.get(url + "/advertisements", options)
                .then(function (response) {
                    $scope.advertisements = response.data.data.items;
                });
        })
    };

    $scope.loadAdvertisements();

    $scope.toggleAddView = function () {
        $scope.isListView = false;
        $scope.isAddView = true;
    }

    $scope.createAdvertisement = function () {
        var data = {
            "provider_id": "89",
            "name": "Judo",
            "enabled": "true",
            "members": "true",
            "image_url": "www.adv.com",
            "start_time": "3456565",
            "end_time": "422424",
            "shared_voice": "435"
        };

        var options = {
            "headers": {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $scope.user.token
            }
        };

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;

            $http.post(url + "/advertisements/create", data, options).then(function (success) {
                $scope.loadAdvertisements();
                $scope.isListView = true;
                $scope.isAddView = false;
            }, function (fail) {
                console.log(fail.data);
            });
        })
    }

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);