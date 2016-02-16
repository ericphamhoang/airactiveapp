/**
 * Created by Admin on 12/22/2015.
 */
app.controller('adminAdvertisingController', function ($scope) {

    $scope.advertising = {
        "image" : "",
        "allocate_sov": "",
        "advertiser": "",
        "club_member": false
    };

    $scope.createAdvertising = function(){
        console.log($scope.advertising);
    };
});