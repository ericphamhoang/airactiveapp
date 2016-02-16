/**
 * Created by John on 1/9/2016.
 */

app.controller('providerTermsAndConditionsController', ['$scope', '$kookies', '$window', '$http', function ($scope, $kookies, $window, $http) {

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

    $http.get("/key.json").then(function (success) {
        var url = success.data.url;
        $http.get(url + "/terms_conditions/get/Provider", options).then(function (success) {
            $scope.termsAndConditions = success.data.data.content;
        })
    })

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);
