app.controller('providerPromoCodesController', ['$scope', '$rootScope', '$http', '$kookies', '$window', function ($scope, $rootScope, $http, $kookies, $window) {

    //when click create promo, display add view
    $scope.isAddView = false;
    $scope.addViewTemplate = 'screens/promoCodes/providerCreatePromoCodeView.html';

    var user = $kookies.get('User');

    $scope.user = user;

    //Functions
    $scope.loadPromoCodes = function () {

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

    //update promocode
    $scope.updatePromocode = function (item) {

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

        var data = {
            "promo_code_id": item.id,
            "promo_code_name": item.name,
            "promo_code_discount": item.discount,
            "promo_code_start_date": item.start_date.getFullYear() + "-" + (item.start_date.getMonth() + 1) + "-" + item.start_date.getDate(),
            "promo_code_end_date": item.end_date.getFullYear() + "-" + (item.end_date.getMonth() + 1) + "-" + item.end_date.getDate(),
            "promo_code_status": item.status,
            "promo_code_total": item.total,
            "promo_code_email_forward": item.email_forward
        };

        var option = {
            "headers": {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $scope.user.token
            }
        };

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.post(url + "/promo_codes/update",
                //data
                data,
                option
            ).then(function (response) {

                },
                function (fail) {
                    console.log(errorMessages);
                })
        })
    };

    //update promocode
    $scope.tooglePromocodeStatus = function (item) {

        item.status = !item.status;
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

        var data = {
            "promo_code_id": item.id,
            "promo_code_name": item.name,
            "promo_code_discount": item.discount,
            "promo_code_start_date": item.start_date.getFullYear() + "-" + (item.start_date.getMonth() + 1) + "-" + item.start_date.getDate(),
            "promo_code_end_date": item.end_date.getFullYear() + "-" + (item.end_date.getMonth() + 1) + "-" + item.end_date.getDate(),
            "promo_code_status": item.status,
            "promo_code_total": item.total,
            "promo_code_email_forward": item.email_forward
        };

        var option = {
            "headers": {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $scope.user.token
            }
        };

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.post(url + "/promo_codes/update",
                //data
                data,
                option
            ).then(function (response) {

                },
                function (fail) {
                    console.log(errorMessages);
                })
        })
    };

    //End Functions

    //get promo codes from server
    //52.65.6.68/api/v1/providers

    $scope.loadPromoCodes();


    $scope.$on('providerCreatePromoCodeController_toListView', function (event, val) {
        $scope.isAddView = false;
        //reload
        $scope.loadPromoCodes();
    });

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);