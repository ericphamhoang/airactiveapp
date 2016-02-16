/**
 * Created by John on 1/9/2016.
 */

app.controller('instructorEditController', ['$scope', '$kookies', '$window', '$http', function ($scope, $kookies, $window, $http) {

    var user = $kookies.get('User');

    if (user !== undefined) {
        $scope.user = user;
    }

    $scope.termsAndConditionsAccept = false;

    $scope.updateInstructor = function () {

        var requiredArray = [
            {field: $scope.user.first_name, message: "First name is required"},
            {field: $scope.user.last_name, message: "Last name is required"},
            {field: $scope.user.postcode, message: "Postcode is required"},
            {field: $scope.user.instructor.country, message: "Country is required"},
            {field: $scope.user.mobile_number, message: "Mobile Phone is required"},
            {field: $scope.user.instructor.mobile, message: "Mobile Phone is required"}
        ];

        for (i = 0; i < requiredArray.length; i++) {
            if (!requiredArray[i].field) {
                notie.alert(3, requiredArray[i].message, 2);
                return;
            }
        }

        var data = {
            "name": $scope.user.name,
            "first_name": $scope.user.first_name, //done
            "last_name": $scope.user.last_name, //done
            //"new_password": null,
            "instructor_fitness_au_registration": $scope.user.instructor.fitness_au_registration,
            "postcode": $scope.user.postcode,
            "instructor_country": $scope.user.instructor.country, //done
            "instructor_about_me": $scope.user.instructor.about_me,
            "instructor_qualifications": $scope.user.instructor.qualifications,
            "instructor_website": $scope.user.instructor.website,
            "instructor_facebook": $scope.user.instructor.facebook,
            "instructor_twitter": $scope.user.instructor.twitter,
            "instructor_instagram": $scope.user.instructor.instagram,
            "instructor_photo_url": "",
            "address": "",
            "instructor_mobile": $scope.user.instructor.mobile,
            "user_phone": $scope.user.mobile_number
        };

        console.log(JSON.stringify(data));

        var option = {
            "headers": {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $scope.user.token
            }
        };

        if (!$scope.termsAndConditionsAccept) {
            notie.alert(3, "Please accept term and condition");
            return;
        }

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.post(url + "/instructors/update", data, option).then(
                function (response) {
                    console.log(response);

                    //set token
                    response.data.data.token = $scope.user.token;

                    $kookies.set('User', response.data.data, {expires: 7, path: '/'});

                    console.log(JSON.stringify(response.data.data));

                    notie.alert(1, "Profile Updated!");

                    //back to instructor main page
                    setTimeout(function(){
                        window.location.href = "index.html";
                    }, 1000)
                })
        })
    }
}
]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);

//when load

//{
//    "data": {
//    "first_name": "Subodh Subhash",
//        "last_name": "Deshpande",
//        "name": "Subodh Subhash Deshpande",
//        "email": "subodh.deshpande@appscore.com.au",
//        "mobile_number": "1234567",
//        "timezone": true,
//        "create_at": true,
//        "id": 164,
//        "instructor": {
//        "ratings_total": 0,
//            "ratings_average": "0.0"
//    },
//    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE2NCwiaXNzIjoiaHR0cDpcL1wvNTIuNjUuNi42OFwvYXBpXC92MVwvYXV0aFwvbG9naW4iLCJpYXQiOjE0NTIzMjcyOTIsImV4cCI6MTQ1MzUzNjg5MiwibmJmIjoxNDUyMzI3MjkyLCJqdGkiOiI2ZmU4YjA3ZjJhNTA1M2QwMjlhMzM2ZGI3NjliYjEwOSJ9.t4hfV_WWsOUM9Dcztdo8NPIBwnNMQVt1-TZBqm0afRU"
//}
//}

//when edit


//return

//{
//    "data": {
//    "id": 164,
//        "name": "Subodh Subhash Deshpande",
//        "email": "subodh.deshpande@appscore.com.au",
//        "mobile_number": "1234567",
//        "postcode": null,
//        "date_of_birth": null,
//        "is_male": null,
//        "active": true,
//        "emergency_contact_name": null,
//        "emergency_contact_number": null,
//        "insurer_name": null,
//        "insurer_number": null,
//        "timezone": "Australia/Melbourne",
//        "created_at": 1450920330,
//        "first_name": "Subodh Subhash",
//        "last_name": "Deshpande",
//        "customer_id": null,
//        "is_disabled": false,
//        "staff_manager": false,
//        "staff_scheduler": false,
//        "staff_view_only": false,
//        "instructor": {
//        "id": 106,
//            "user_id": 164,
//            "photo_url": "picassa.com",
//            "fitness_au_registration": null,
//            "country": null,
//            "mobile": "123-123-123789",
//            "website": "www.website.comm",
//            "facebook": "www.facebook.comm",
//            "twitter": "www.twitter.comm",
//            "instagram": "www.instagram.comm",
//            "qualifications": "Masters in Computer Science",
//            "about_me": "I am Kewl"
//    }
//}
//}