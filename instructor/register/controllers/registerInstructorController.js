/**
 * Created by eric on 5/12/2015.
 */

window.validator =
{
    isInt: function (value) {
        return /^-?[0-9]+$/.test(value);
    },
    isFloat: function (value) {
        return value.match(/^-?\d*(\.\d+)?$/);
    }
}

var app = angular.module('airActiveApp', ['ngKookies']);

app.controller('registerInstructorController', ['$scope', '$http', '$kookies', '$window', function ($scope, $http, $kookies, $window) {

    $scope.newInstructor = {
        "name": "",
        "first_name": null,
        "last_name": null,
        "email": null,
        "email_confirm": null,
        "instructor_branch": "",
        "instructor_about_me": "",
        "instructor_qualifications": "",
        "instructor_website": "",
        "instructor_facebook": "",
        "instructor_twitter": "",
        "instructor_instagram": "",
        "instructor_photo_url": "",
        "address": "",
        "instructor_mobile": null,
        "user_phone": "",
        "country": "Afghanistan",
        "postcode": null
    };

    $scope.showLoader = false;

    $scope.countries = ["Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo, Republic of the (Brazzaville)", "Congo, the Democratic Republic of the (Kinshasa)", "Cook Islands", "Costa Rica", "Côte d'Ivoire, Republic of", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gambia, The", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Republic of", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia, Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine, State of", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russian Federation", "Rwanda", "Saint Barthélemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United Kingdom Overseas Territories", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela, Bolivarian Republic of", "Viet Nam", "Virgin Islands, British", "Virgin Islands, U.S.", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"];

    $scope.registerInstructor = function () {

        var requiredArray = [
            {field: $scope.newInstructor.last_name, message: "Last name is required"},
            {field: $scope.newInstructor.first_name, message: "First name is required"},
            {field: $scope.newInstructor.email, message: "Email is required"},
            {field: $scope.newInstructor.instructor_mobile, message: "Mobile is required"},
            {field: $scope.newInstructor.postcode, message: "Postcode is required"}
        ];

        for (i = 0; i < requiredArray.length; i++) {
            if (!requiredArray[i].field) {
                notie.alert(3, requiredArray[i].message, 2);
                return;
            }
        }

        if ($scope.newInstructor.email != $scope.newInstructor.email_confirm) {
            notie.alert(3, "Email and confirm email must be matched", 2);
            return;
        }

        if (!window.validator.isInt($scope.newInstructor.instructor_mobile))
        {
            notie.alert(3, "Mobile must be a number");
            return;
        }

        if (!window.validator.isInt($scope.newInstructor.postcode))
        {
            notie.alert(3, "Postcode must be a number");
            return;
        }

        var data = {
            "name": "",
            "first_name": $scope.newInstructor.first_name,
            "last_name": $scope.newInstructor.last_name,
            "email": $scope.newInstructor.email,
            "instructor_branch": "",
            "instructor_about_me": "",
            "instructor_qualifications": "",
            "instructor_website": "",
            "instructor_facebook": "",
            "instructor_twitter": "",
            "instructor_instagram": "",
            "instructor_photo_url": "",
            "address": "",
            "instructor_mobile": $scope.newInstructor.instructor_mobile,
            "country": $scope.newInstructor.country,
            "postcode": $scope.newInstructor.postcode,
            "user_phone": $scope.newInstructor.instructor_mobile
        };

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $scope.showLoader = true;
            $http.post(url + "/auth/register_instructor", data).then(
                function (success) {
                    console.log(success.data);
                    notie.alert(1, "Register successfully. Please check your email for password");

                    $scope.showLoader = false;

                    setTimeout(function () {
                        window.location.href = '/'
                    }, 1000);
                },
                function (fail) {

                    $scope.showLoader = false;

                    if (fail.data) {
                        var errorMessages = fail.data.error.messages;
                        notie.alert(3, errorMessages[0], 2);
                    }
                    else {
                        //when there's no JSON from server
                        notie.alert(3, "Opps! Something happen. Please try again", 2);
                    }
                })
        })
    }

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);