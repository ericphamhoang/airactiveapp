/**
 * Created by Admin on 12/22/2015.
 */
app.controller('adminProfileController', ['$scope','$kookies', '$window', function($scope,$kookies,$window) {

    var user = $kookies.get('User');

    $scope.user = user;

    console.log($scope.user);

    $scope.isEditView = false;
    $scope.editButtonName = "Edit";

    $scope.toggleAdminProfileEditView = function () {
        $scope.isEditView = !$scope.isEditView;
        //change edit button name
        if ($scope.isEditView)
            $scope.editButtonName = "Save";
        else
            $scope.editButtonName = "Edit";
    }
}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);