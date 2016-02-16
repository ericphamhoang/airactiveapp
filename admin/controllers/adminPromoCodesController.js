app.controller('adminPromoCodesController', ['$scope', '$rootScope', '$http', '$kookies', '$window', function ($scope, $rootScope, $http, $kookies, $window) {

    $scope.loadPromoCodes = function () {

        var user = $kookies.get('User');

        $scope.user = user;

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.get(url + "/promo_codes?token=" + $scope.user.token)
                .then(function (response) {
                    /*
                     * {
                     "id": 4,
                     "provider_id": 89,
                     "name": "Subodh Deshpande",
                     "discount": "45",
                     "start_date": "2015-01-01 00:00:00",
                     "end_date": "2015-01-01 00:00:00",
                     "status": true,
                     "total": 6,
                     "email_forward": "subdeshpande@gmail.com"
                     }*/

                    $scope.promoCodes = response.data.data.data;

                    angular.forEach($scope.promoCodes, function (item, key) {
                        item.start_date = new Date(item.start_date);
                        item.end_date = new Date(item.end_date);
                        item.isEdit = false;
                    });

                    //order by name
                    //$scope.orderStatus = 'name';

                    console.log($scope.promoCodes);
                });
        })
    };

    $scope.loadPromoCodes();

    $scope.newPromoCode = {
        "name": "",
        "start_date": "",
        "end_date": "",
        "discount_type": "",
        "provider_type": "",
        "code": "Code will display here (Press Generate to create a code"
    };

    $scope.isListView = true;
    $scope.isAddPromoView = false;

    $scope.toggleAddPromoView = function () {
        $scope.isListView = false;
        $scope.isAddPromoView = true;
    }

    $scope.removePromocode = function (index) {
        $scope.promoCodes.splice(index, 1);
    }

    //Add Promo
    $scope.generateCode = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        $scope.newPromoCode.code = text;
    }
}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);