/**
 * Created by Admin on 12/22/2015.
 */
//When load
//Provider: http://jsonblob.com/56ad7cb7e4b01190df4c42ef.

app.controller('providerController', ['$scope','$kookies', '$window', function ($scope,$kookies,$window) {
    $scope.menu = [false, false, false, false, false, false, false, false];
    $scope.template = 'screens/providerProfileView.html';
    //$scope.template = 'screens/providerAddActivityView.html';


    var user = $kookies.get('User');
    $scope.user = user;

    if ($scope.user === undefined)
    {
        window.location.href = '/logout/';
    }
    else if ($scope.user.provider === undefined || $scope.user.instructor !== undefined)
    {
        window.location.href = '/logout/';
    }

    //check if provider has accepted term and condition
    if (user.provider.terms == false)
    {
        window.location.href = "edit.html";
    }

    //change menu
    $scope.changeMenu = function (index, template) {
        for (i = 0; i < $scope.menu.length; i++)
            $scope.menu[i] = false;

        $scope.menu[index] = true;
        $scope.template = template;
    };
    //end change menu

    $scope.viewProviderProfile = function () {
        $scope.template = 'screens/providerProfileView.html';
    };

    $scope.$on('viewProviderProfile', function(){
        $scope.template = 'screens/providerProfileView.html';
        $scope.menu = [false, false, false, false, false, false, false, false];
    });

    $scope.redirect = function (location) {
        window.location.href = location;
    };
}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);