/**
 * Created by Admin on 12/22/2015.
 */
app.controller('adminController', ['$scope','$kookies', '$window', function($scope,$kookies,$window) {
    $scope.menu = [true, false, false, false, false, false, false, false];
    $scope.template = 'screens/adminAdminsView.html';

    var user = $kookies.get('User');

    $scope.user = user;

    if ($scope.user === undefined)
    {
        window.location.href = '/logout/';
    }
    else if ($scope.user.provider !== undefined || $scope.user.instructor !== undefined)
    {
        window.location.href = '/logout/';
    }

    //change menu
    $scope.changeMenu = function (index, template) {
        for (i = 0; i < $scope.menu.length; i++)
            $scope.menu[i] = false;

        $scope.menu[index] = true;
        $scope.template = template;
    }
    $scope.viewAdminProfile = function () {
        $scope.template = 'screens/admin.profile.html';
    }

    $scope.redirect = function (location) {
        window.location.href = location;
    };
}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);