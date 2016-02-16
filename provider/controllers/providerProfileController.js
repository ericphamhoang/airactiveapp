/**
 * Created by Admin on 12/29/2015.
 */

app.controller('providerProfileController', ['$scope','$kookies', '$window', function($scope,$kookies,$window) {
    $scope.date = new Date();
    var user = $kookies.get('User');

    if (user !== undefined) {
        $scope.user = user;
        console.log($scope.user);
    }
    else
    {
        //window.location.href = "/login/";
    }

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);