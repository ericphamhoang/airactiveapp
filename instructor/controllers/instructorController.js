app.controller('instructorController', ['$scope','$kookies', '$window', function($scope,$kookies,$window) {
    $scope.menu = [false, false, false, false, false, false, false, false];
    $scope.template = 'screens/instructor.profile.html';

    $scope.date = new Date();
    var user = $kookies.get('User');

    $scope.user = user;

    console.log(JSON.stringify($scope.user));

    if ($scope.user === undefined)
    {
        window.location.href = '/logout/';
    }
    else if ($scope.user.provider !== undefined || $scope.user.instructor == undefined)
    {
        window.location.href = '/logout/';
    }

    if (user.instructor.terms == false)
    {
        window.location.href = "edit.html";
    }


    //edit flag
    $scope.isEdit = false;

    //change menu
    $scope.changeMenu = function (index, template) {
        for (i = 0; i < $scope.menu.length; i++)
            $scope.menu[i] = false;

        $scope.menu[index] = true;
        $scope.template = template;
    };

    $scope.redirect = function(location){
      window.location.href = location;
    };

    $scope.viewInstructorProfile = function () {
        $scope.menu = [false, false, false, false, false, false, false, false];
        $scope.template = 'screens/instructor.profile.html';
    }

    $scope.gotoEdit = function(){
        window.location.href='edit.html'
    }
}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);