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

var app = angular.module('airActiveApp', ['ngKookies', 'google.places', 'ui.bootstrap']);

app.controller('registerProviderController', ['$scope', '$http', '$kookies', '$window', function ($scope, $http, $kookies, $window) {


    $scope.selectableProviderTypes = [
        {id: 1, name: "Club/Studio"},
        {id: 2, name: "Personal Trainer"},
        {id: 3, name: "Recreation"},
        {id: 4, name: "Wellness"},
        {id: 5, name: "Sport"}
    ];

    $scope.newProvider = {
        "name": null,
        "first_name": null,
        "last_name": null,
        "email": null,
        "email_confirm": null,
        "user_phone": null,
        "branch": null,
        "googleLocation":null,
        "postcode": null,
        "country":null,
        "state":null,
        "city":null,
        "address": null,
        "phone": null,
        "mobile": null,
        "custom_association": null,
        "selected_association": null,
        "providerType": $scope.selectableProviderTypes[0],
        "email_provider": null,
        "email_provider_confirm": null
    };

    $scope.showLoader = false;

    $scope.registerProvider = function () {

        if (!$scope.newProvider.name) {
            notie.alert(3, "Name of Business is required!", 2);
            return;
        }

        if (!$scope.newProvider.googleLocation) {
            notie.alert(3, "Address of Business is required!", 2);
            return;
        }

        //Branch - to trick the API
        if (!$scope.newProvider.branch) {
            $scope.newProvider.branch = "";
        }

        if (!$scope.newProvider.phone && !$scope.newProvider.mobile) {
            notie.alert(3, "Please enter business phone or mobile phone", 2);
            return;
        }

        //Business Email
        if (!$scope.newProvider.email || !$scope.newProvider.email_confirm) {
            notie.alert(3, "Business email is required!", 2);
            return;
        }

        //Business Email + confirm
        if ($scope.newProvider.email != $scope.newProvider.email_confirm) {
            notie.alert(3, "Business email and confirm email must be matched!", 2);
            return;
        }

        //Last name
        if (!$scope.newProvider.last_name) {
            notie.alert(3, "Last name is required", 2);
            return;
        }

        //First name
        if (!$scope.newProvider.first_name) {
            notie.alert(3, "First name is required", 2);
            return;
        }

        //Manager email
        if (!$scope.newProvider.email_provider || !$scope.newProvider.email_provider_confirm) {
            notie.alert(3, "Last name is required", 2);
            return;
        }

        if ($scope.newProvider.email_provider != $scope.newProvider.email_provider_confirm) {
            notie.alert(3, "Manager email and confirm email must be matched!", 2);
            return;
        }

        //Phone
        if (!$scope.newProvider.user_phone) {
            notie.alert(3, "Manager phone is required", 2);
            return;
        }


        //get info from Google Location
        $scope.newProvider.address = $scope.newProvider.googleLocation.formatted_address;

        for (i = 0; i < $scope.newProvider.googleLocation.address_components.length; i++) {
            var value = $scope.newProvider.googleLocation.address_components[i];
            if (value.types.indexOf("country") !== -1) {
                $scope.newProvider.country = value.long_name;
            }
            else if (value.types.indexOf("administrative_area_level_1") !== -1)
            {
                $scope.newProvider.state = value.long_name;
            }
            else if (value.types.indexOf("locality") !== -1)
            {
                $scope.newProvider.city = value.long_name;
            }
            else if (value.types.indexOf("postal_code") !== -1)
            {
                $scope.newProvider.postcode = value.long_name;
            }
        }

        if (!window.validator.isInt($scope.newProvider.mobile))
        {
            notie.alert(3, "Mobile Phone must be a number");
            return;
        }

        if (!window.validator.isInt($scope.newProvider.phone))
        {
            notie.alert(3, "Business Phone must be a number");
            return;
        }

        if (!window.validator.isInt($scope.newProvider.user_phone))
        {
            notie.alert(3, "Manager Phone must be a number");
            return;
        }

        data = {
            "name": $scope.newProvider.name,
            "first_name": $scope.newProvider.first_name,
            "last_name": $scope.newProvider.last_name,
            "email": $scope.newProvider.email,
            "user_phone": $scope.newProvider.user_phone,
            "postcode": $scope.newProvider.postcode,
            "country":$scope.newProvider.country,
            "state":$scope.newProvider.state,
            "city":$scope.newProvider.city,
            "branch": $scope.newProvider.branch,
            "address": $scope.newProvider.address,
            "encoded_address": JSON.stringify($scope.newProvider.googleLocation), //encoded address
            "provider_type_id": $scope.newProvider.providerType.id,
            "phone": $scope.newProvider.phone,
            "mobile": $scope.newProvider.mobile,
            "email_provider": $scope.newProvider.email_provider
        };

        $scope.showLoader = true;

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.post(url + "/auth/register_provider",
                //data
                data
            ).then(function (response) {
                    $scope.showLoader = false;
                    notie.alert(1, "Welcome " + response.data.data.user.name + " Please check your email for login password", 2);

                    setTimeout(
                        function () {
                            window.location.href = "/";
                        }, 3000);
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
    };

    $scope.functions = {
        showMessage: function (message) {
            UIkit.notify(message);
        }
    }

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);