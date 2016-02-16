/**
 * Created by Admin on 12/29/2015.
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

app.controller('providerAddActivityController', ['$scope', '$rootScope', '$http', '$kookies', '$window', function ($scope, $rootScope, $http, $kookies, $window) {

    var user = $kookies.get('User');

    $scope.user = user;

    console.log($scope.user);

    //For GG Auto complete
    $scope.autocompleteOptions = {
        types: ['geocode']
    };

    //step 10
    $scope.timePickerOptions = {
        step: 10,
        timeFormat: 'H:i',
        appendTo: 'body'
    };

    //TODO: [1] load data from server
    $http.get("/key.json").then(function (success) {

        var url = success.data.url;

        //get Provider address
        $http.get(url + "/activities/getProviderAddress?token=" + user.token)
            .then(function (response) {

                $scope.newActivity.googleLocation = JSON.parse(response.data.provider_address);
            });

        //get category
        $http.get(url + "/categories?token=" + user.token)
            .then(function (response) {
                $scope.selectableCategories = response.data.data.items;

                angular.forEach($scope.selectableCategories, function (category, key) {
                    category.isSelected = false;
                });

                $scope.isCategorySelectView = false;
            });

        //get activity type
        $http.get(url + "/activity_types?token=" + user.token)
            .then(function (response) {
                //console.log(response.data.data.items);

                $scope.selectableActivityTypes = response.data.data.items;

                //divide by 4
                var length = $scope.selectableCategories.length;

                var mileStoneSub = [2, 6, 9, length-1];
                var count = 0;

                $scope.selectableActivityTypesSub = [[],[],[],[]];

                var categoryName = "";
                angular.forEach($scope.selectableActivityTypes, function (activityType, key) {
                    if (activityType.category.name != categoryName) {
                        categoryName = activityType.category.name;
                        //count 1 more category
                        count++;
                    }
                    else {
                        //same category
                        activityType.category.name = null;
                    }
                    activityType.isSelected = false;

                    if (count <= mileStoneSub[0])
                    {
                        $scope.selectableActivityTypesSub[0].push(activityType);
                    }
                    else
                    {
                        if (count <= mileStoneSub[1])
                            $scope.selectableActivityTypesSub[1].push(activityType);
                        else
                        {
                            if (count <= mileStoneSub[2])
                                $scope.selectableActivityTypesSub[2].push(activityType);
                            else
                            {
                                if (count <= mileStoneSub[3])
                                    $scope.selectableActivityTypesSub[3].push(activityType);
                            }
                        }

                    }
                });

                $scope.isActivityTypeSelectView = false;
            });

        //get environment
        $http.get(url + "/environments?token=" + user.token)
            .then(function (response) {
                console.log(response.data.data.items);
                $scope.environments = response.data.data.items;
                $scope.newActivity.environment = $scope.environments[0];
            });

        //get instructors
        $http.get(url + "/instructors?token=" + user.token)
            .then(function (response) {
                console.log(response.data.data.items);
                $scope.instructors = response.data.data.data;
                $scope.newActivity.instructor = $scope.instructors[0];
            });

        //--TODO: get recent instructors
        $http.get(url + "/activities/instructors?token=" + user.token)
            .then(function (response) {
                $scope.recentInstructors = response.data.instructors;
            });

        //--TODO: get recent locations
        $http.get(url + "/locations?token=" + user.token)
            .then(function (response) {
                $scope.recentLocations = response.data.locations;
                //TODO: comment this to let user choose location or add new location
                //$scope.newActivity.location = response.data.locations[0];
            });

        //get intensity
        $http.get(url + "/intensities?token=" + user.token)
            .then(function (response) {
                console.log(response.data.data.items);
                $scope.intensities = response.data.data.items;
                $scope.newActivity.intensity = $scope.intensities[0];
            });
    });

    $scope.newActivity = {
        "name": null,
        "description": null,
        "categories": [],
        "activity_types": [],
        "environment": null,
        "hasInstructor": false,
        "instructor": null,
        "intensity": null, //done
        "price": null, //done
        "startDate": null,
        "startTime": null,
        "googleLocation": null,
        "sameAddress": true,
        "googleLocation2": null,
        "duration": null,
        "hasLocation": true,
        "location": null,
        "new_location": null,
        "recurrency_frequency": "daily",
        "recurrency_every": null,
        "recurrency_string": "day",
        "recurrency_string_extension" : "sunday",
        "recurrenceArray": [
            {name: "S", status: false},
            {name: "M", status: false},
            {name: "T", status: false},
            {name: "W", status: false},
            {name: "T", status: false},
            {name: "F", status: false},
            {name: "S", status: false}
        ],
        "recurrency_on": [],
        "recurrenceEnd": null,
        "recurrency_end": null,
        "color": 3,
        "is_recurrent": false,
        "capacity": null,
        "flag_all_day": false, //done
        "flag_midnight": false, //done
        "flag_free_members": false, //done
        "flag_adition_fees": false //done
    };

    $scope.gotoProfile = function () {
        $rootScope.$broadcast('viewProviderProfile');
    };

    $scope.showMessage = function (message) {
        UIkit.notify(message);
    };

    $scope.isMaxCategory = function () {

        var count = 0;

        angular.forEach($scope.selectableCategories, function (category, key) {
            if (category.isSelected)
                count++;
        });

        if (count >= 5)
            return true;
        else
            return false;
    };

    $scope.isMaxActivityType = function () {

        var count = 0;

        angular.forEach($scope.selectableActivityTypes, function (activityType, key) {
            if (activityType.isSelected)
                count++;
        })

        if (count >= 5)
            return true;
        else
            return false;
    };

    $scope.show_weekly = false;
    $scope.show_monthly = false;

    $scope.data = {
        repeatSelect: null
    };

    //$scope.recurrency_on = "1";

    $scope.setRecurrence = false;
    $scope.toggleSetRecurrence = function () {
        $scope.setRecurrence = !$scope.setRecurrence;
    };

    $scope.flag_recurrency = [false, false, false, false, false, false, false, false];

    //$scope.toggleRecurrency = function (number) {
    //    $scope.flag_recurrency[number] = !$scope.flag_recurrency[number];
    //
    //    var sum = 0;
    //
    //    for (i = 0; i < $scope.flag_recurrency; i++) {
    //        if (scope.flag_recurrency[i])
    //            sum++;
    //    }
    //
    //    $scope.recurrency_on = sum + "";
    //};

    //$scope.changeRecurrence = function () {
    //
    //    if ($scope.recurrency_frequency == "weekly") {
    //
    //        $scope.show_weekly = true;
    //        $scope.show_monthly = false;
    //        $scope.frequency_translate = "Weeks";
    //    }
    //    else if ($scope.recurrency_frequency == "daily") {
    //        $scope.show_weekly = false;
    //        $scope.show_monthly = false;
    //        $scope.frequency_translate = "Days";
    //    }
    //    else if ($scope.recurrency_frequency == "monthly") {
    //        $scope.show_weekly = false;
    //        $scope.show_monthly = true;
    //        $scope.frequency_translate = "Months";
    //    }
    //};

    $scope.addActivity = function () {


        var requiredArray = [
            {field: $scope.newActivity.name, message: "Activity Name is required"},
            {field: $scope.newActivity.description, message: "Activity Description is required"},
            {field: $scope.newActivity.price, message: "Price is required"},
            {field: $scope.newActivity.startDate, message: "Start date is required"},
            {field: $scope.newActivity.startTime, message: "Start time is required"},
            {field: $scope.newActivity.duration, message: "Duration is required"},
            {field: $scope.newActivity.googleLocation, message: "Address is required"},
            {field: $scope.newActivity.capacity, message: "Capacity is required"}
        ];

        for (i = 0; i < requiredArray.length; i++) {
            if (!requiredArray[i].field) {
                notie.alert(3, requiredArray[i].message, 2);
                return;
            }
        }

        if (!window.validator.isFloat($scope.newActivity.price)) {
            notie.alert(3, "price is invalid", 2);
            return;
        }

        if (!window.validator.isInt($scope.newActivity.capacity)) {
            notie.alert(3, "capacity is invalid", 2);
            return;
        }

        if (!window.validator.isInt($scope.newActivity.duration)) {
            notie.alert(3, "duration is invalid", 2);
            return;
        }

        if ($scope.newActivity.is_recurrent) {
            if (!window.validator.isInt($scope.newActivity.recurrency_every)) {
                notie.alert(3, "Location recurrence frequency is required");
                return;
            }

            if (!$scope.newActivity.recurrenceEnd) {
                notie.alert(3, "end date is required");
                return;
            }
        }

        //TODO: Monthly case
        if ($scope.newActivity.recurrency_frequency == "monthly") {

            if (!$scope.newActivity.recurrency_string) {
                notie.alert(3, "string is required");
                return;
            }

            //$scope.newActivity.recurrency_on = [$scope.newActivity.recurrency_on];
        }
        var data;

        if ($scope.newActivity.is_recurrent) {
            data = {
                "name": $scope.newActivity.name,
                "description": $scope.newActivity.description,
                "categories": [], //bind in for loop
                "activity_types": [], //bind in for loop
                "environment": $scope.newActivity.environment.id,
                "instructor": $scope.newActivity.instructor.id,
                "intensity": $scope.newActivity.intensity.id,
                "price": $scope.newActivity.price,
                "free_members": $scope.newActivity.flag_free_members, // (?)
                "start_time": $scope.newActivity.startDate.getFullYear() + "-" + ($scope.newActivity.startDate.getMonth() + 1) + "-" +
                $scope.newActivity.startDate.getDate() + " " + $scope.newActivity.startTime.getHours() + ":" + $scope.newActivity.startTime.getMinutes(),
                "latitude": $scope.newActivity.googleLocation.geometry.location.lat,
                "longitude": $scope.newActivity.googleLocation.geometry.location.lng,
                "encoded_address": JSON.stringify($scope.newActivity.googleLocation),
                "address": $scope.newActivity.googleLocation.formatted_address,
                "duration": $scope.newActivity.duration,
                "location": $scope.newActivity.location,
                "new_location": $scope.newActivity.new_location,
                "recurrenceArray": $scope.newActivity.recurrenceArray,
                "recurrency_frequency": $scope.newActivity.recurrency_frequency,
                "recurrency_string": $scope.newActivity.recurrency_string,
                "recurrency_string_extension": $scope.newActivity.recurrency_string_extension,
                "recurrency_every": $scope.newActivity.recurrency_every,
                "recurrency_on": $scope.newActivity.recurrency_on,
                "recurrency_end": $scope.newActivity.recurrenceEnd.getFullYear() + "-" + ($scope.newActivity.recurrenceEnd.getMonth() + 1) + "-" +
                $scope.newActivity.recurrenceEnd.getDate(),
                "color": 3,
                "is_recurrent": $scope.newActivity.is_recurrent,
                "capacity": $scope.newActivity.capacity,
                "flag_all_day": $scope.newActivity.flag_all_day,
                "flag_midnight": $scope.newActivity.flag_midnight,
                "flag_free_members": $scope.newActivity.flag_free_members,
                "flag_adition_fees": $scope.newActivity.flag_adition_fees
            };
        } else {
            data = {
                "name": $scope.newActivity.name,
                "description": $scope.newActivity.description,
                "categories": [], //bind in for loop
                "activity_types": [], //bind in for loop
                "environment": $scope.newActivity.environment.id,
                "instructor": $scope.newActivity.instructor.id,
                "intensity": $scope.newActivity.intensity.id,
                "price": $scope.newActivity.price,
                "free_members": $scope.newActivity.flag_free_members, // (?)
                "start_time": $scope.newActivity.startDate.getFullYear() + "-" + ($scope.newActivity.startDate.getMonth() + 1) + "-" +
                $scope.newActivity.startDate.getDate() + " " + $scope.newActivity.startTime.getHours() + ":" + $scope.newActivity.startTime.getMinutes(),
                "latitude": $scope.newActivity.googleLocation.geometry.location.lat,
                "longitude": $scope.newActivity.googleLocation.geometry.location.lng,
                "encoded_address": JSON.stringify($scope.newActivity.googleLocation),
                "address": $scope.newActivity.googleLocation.formatted_address,
                "duration": $scope.newActivity.duration,
                "location": $scope.newActivity.location,
                "new_location": $scope.newActivity.new_location,
                "color": 3,
                "is_recurrent": $scope.newActivity.is_recurrent,
                "capacity": $scope.newActivity.capacity,
                "flag_all_day": $scope.newActivity.flag_all_day,
                "flag_midnight": $scope.newActivity.flag_midnight,
                "flag_free_members": $scope.newActivity.flag_free_members,
                "flag_adition_fees": $scope.newActivity.flag_adition_fees
            };
        }


        //TODO: Weekly case
        if (data.recurrency_frequency == "weekly") {
            data.recurrency_on = [];

            for (i = 0; i < 7; i++) {
                if (data.recurrenceArray[i].status == true) {
                    data.recurrency_on.push(i);
                }
            }

            if (data.recurrency_on.length == 0) {
                notie.alert(3, "Please select at least one day from Sunday to Saturday");
                return;
            }
        }

        //TODO: Monthly case (2)
        if (data.recurrency_frequency == "monthly") {
            if (data.recurrency_string == "day") {
                var abc = data.recurrency_on.split(",");

                data.recurrency_on = [];

                for (i = 0; i < abc.length; i++) {
                    data.recurrency_on.push(parseInt(abc[i]));
                }
            }
            else {
                data.recurrency_string += " " + data.recurrency_string_extension;
            }
        }

        //category array
        angular.forEach($scope.selectableCategories, function (category, key) {
            if (category.isSelected)
                data.categories.push(category.id);
        });

        //check category
        if (data.categories.length == 0) {
            notie.alert(3, "Please select at least 1 category", 2);
            return;
        }

        //activity types array
        angular.forEach($scope.selectableActivityTypes, function (activityType, key) {
            if (activityType.isSelected)
                data.activity_types.push(activityType.id);
        });

        //check category
        if (data.activity_types.length == 0) {
            notie.alert(3, "Please select at least 1 activity type", 2);
            return;
        }

        //TODO: Instructor case
        if ($scope.newActivity.hasInstructor == false)
            data.instructor = null;

        //TODO: Location case
        if ($scope.newActivity.hasLocation == false)
            data.location = "N/A";
        else {
            if (!data.location) {
                if (!data.new_location) {
                    notie.alert(3, "Location is required");
                    return;
                }
                else {
                    data.location = data.new_location;
                }
            }
        }

        console.log(JSON.stringify(data));

        //TODO: send data
        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.post(url + "/activities",
                //data
                data,
                //config
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "authorization": "Bearer " + $scope.user.token
                    }
                }
            ).then(function (success) {
                    notie.alert(1, "Added activity successfully!");

                    //TODO: for testing
                    $rootScope.$broadcast('viewProviderProfile');
                },
                function (fail) {

                    notie.alert(3, fail.data.error.messages[0]);
                });
        })
    }

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);