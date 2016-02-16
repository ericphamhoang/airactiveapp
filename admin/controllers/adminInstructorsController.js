/**
 * Created by Admin on 12/22/2015.
 */
app.controller('adminInstructorsController', ['$scope', '$rootScope', '$http', '$kookies', '$window', 'ngDialog', function ($scope, $rootScope, $http, $kookies, $window, ngDialog) {

    var user = $kookies.get('User');

    $scope.user = user;

    var options = option = {
        "headers": {
            "Content-Type": "application/json",
            "authorization": "Bearer " + $scope.user.token
        }
    };

    $http.get("/key.json").then(function (success) {
        var url = success.data.url;
        $http.get(url + "/instructors",
            options)
            .then(function (response) {

                $scope.instructors = response.data.data.data;

                console.log($scope.instructors);
            });
    });
    $scope.showProfile = function (instructor) {
        ngDialog.open({
            template: '<h2>' + instructor.name + '</h2>'
            + '<p><b>Email</b> ' + instructor.email + '</p>'
            + '<p><b>Mobile</b> ' + instructor.mobile_number + '</p>'
            + '<p><b>Postcode</b> ' + instructor.postcode + '</p>'
            + '<p><b>DOB</b> ' + instructor.date_of_birth + '</p>'
            + '<p><b>Insurer</b> ' + instructor.insurer_name + '</p>'
            + '<p><b>Fitness Australian Registration</b> ' + instructor.fitness_au_registration + '</p>'
            + '<p><b>Website</b> ' + instructor.website + '</p>'
            + '<p><b>Facebook</b> ' + instructor.facebook + '</p>'
            + '<p><b>Twitter</b> ' + instructor.twitter + '</p>'
            + '<p><b>Instagram</b> ' + instructor.instagram + '</p>',
            plain: true
        });
    }
}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);