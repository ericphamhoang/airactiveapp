app.controller('providerCreatePromoCodeController', ['$scope', '$rootScope', '$http', '$kookies', '$window', function ($scope, $rootScope, $http, $kookies, $window) {

    //when click create promo, display add view
    $scope.isAddView = false;

    //$scope.promoCode = {
    //    "promo_code_name": "Subodh Deshpande",
    //    "promo_code_discount": "45",
    //    "promo_code_start_date": "2015-01-01",
    //    "promo_code_end_date": "2015-01-01",
    //    "promo_code_status": "true",
    //    "promo_code_total": "6",
    //    "promo_code_email_forward": "subdeshpande@gmail.com"
    //};

    $scope.createPromocode = function () {
        console.log($scope.promoCode);

        data = $scope.promoCode;

        //start date
        data.promo_code_start_date = data.promo_code_start_date.getFullYear()
            + "-" + (data.promo_code_start_date.getMonth() + 1) + "-" + data.promo_code_start_date.getDate();

        //end date
        data.promo_code_end_date = data.promo_code_end_date.getFullYear() +
            "-" + (data.promo_code_end_date.getMonth() + 1) +
            "-" + data.promo_code_end_date.getDate();

        data.promo_code_status = "true";

        var option = {
            "headers": {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $scope.user.token
            }
        };

        console.log($scope.promoCode);


        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.post(url + "/promo_code/create",
                //data
                data,
                option
            ).then(function (response) {

                    console.log(response);

                    alert('Create Promo Code Successfully');

                    $scope.promoCode = {};
                    //go back to list view
                    $rootScope.$broadcast('providerCreatePromoCodeController_toListView');
                },
                function (fail) {

                    console.log(errorMessages);

                })
        })
    };

    $scope.toListView = function () {
        $rootScope.$broadcast('providerCreatePromoCodeController_toListView');
    }
}]);