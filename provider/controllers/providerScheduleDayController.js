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

app.controller('providerScheduleDayController', ['$scope', '$rootScope', '$http', '$kookies', '$window', 'ngGPlacesAPI', function ($scope, $rootScope, $http, $kookies, $window, ngGPlacesAPI) {

    $scope.menu = [true, false, false, false, false, false, false, false];
    $scope.template = '../screens/providerScheduleDayView.html';

    var user = $kookies.get('User');

    $scope.user = user;

    $scope.isSingleView = false;

    $scope.closeEditView = function () {
        $scope.editView.enable = false
    };

    //TODO: Load data
    $http.get("/key.json").then(function (success) {
        var url = success.data.url;
        //----TODO: get category
        $http.get(url + "/categories?token=" + user.token)
            .then(function (response) {
                $scope.selectableCategories = response.data.data.items;
                $scope.copyView.selectableCategories = $scope.selectableCategories;
                $scope.editView.selectableCategories = $scope.selectableCategories;
            });

        //----TODO: get activity type
        $http.get(url + "/activity_types?token=" + user.token)
            .then(function (response) {
                $scope.selectableActivityTypes = response.data.data.items;

                //--------TODO: for copy view

                //divide by 4
                var length = $scope.selectableCategories.length;

                var mileStoneSub = [2, 6, 9, length - 1];
                var count = 0;

                $scope.selectableActivityTypesSub = [[], [], [], []];

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

                    if (count <= mileStoneSub[0]) {
                        $scope.selectableActivityTypesSub[0].push(activityType);
                    }
                    else {
                        if (count <= mileStoneSub[1])
                            $scope.selectableActivityTypesSub[1].push(activityType);
                        else {
                            if (count <= mileStoneSub[2])
                                $scope.selectableActivityTypesSub[2].push(activityType);
                            else {
                                if (count <= mileStoneSub[3])
                                    $scope.selectableActivityTypesSub[3].push(activityType);
                            }
                        }

                    }
                });

                //copy view
                $scope.copyView.selectableActivityTypes = $scope.selectableActivityTypes;
                $scope.copyView.selectableActivityTypesSub = $scope.selectableActivityTypesSub;
                //edit view
                $scope.editView.selectableActivityTypes = $scope.selectableActivityTypes;
                $scope.editView.selectableActivityTypesSub = $scope.selectableActivityTypesSub;
            });

        //----TODO: get environment
        $http.get(url + "/environments?token=" + user.token)
            .then(function (response) {
                $scope.copyView.environments = response.data.data.items;
                $scope.editView.environments = response.data.data.items;
            });

        //----TODO: get instructors
        $http.get(url + "/instructors?token=" + user.token)
            .then(function (response) {
                $scope.copyView.instructors = response.data.data.data;
                $scope.editView.instructors = response.data.data.data;
            });

        //----TODO: get recent instructors
        $http.get(url + "/activities/instructors?token=" + user.token)
            .then(function (response) {
                $scope.copyView.recentInstructors = response.data.instructors;
            });

        //----TODO: get recent locations
        $http.get(url + "/locations?token=" + user.token)
            .then(function (response) {
                $scope.copyView.recentLocations = response.data.locations;
                //TODO: comment this to let user choose location or add new location
                //$scope.newActivity.location = response.data.locations[0];
            });

        //-----TODO: get intensity
        $http.get(url + "/intensities?token=" + user.token)
            .then(function (response) {
                $scope.copyView.intensities = response.data.data.items;
                $scope.editView.intensities = response.data.data.items;
                $scope.copyView.enable = false;
                $scope.editView.enable = false;
            });
    });

    //TODO: delete activity
    $scope.deleteActivity = function (activity) {

        var data = {
            "activity_id": activity.id,
            "is_cancel": true
        };

        var options = {
            "headers": {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $scope.user.token
            }
        };

        $http.get("/key.json").then(function (success) {
            var url = success.data.url;
            $http.post(url + "/activities/Editdelete",
                //data
                data,
                options
            ).then(function (success) {
                    notie.alert(1, "Deleted activity successfully!Reloading...");

                    setTimeout(function () {
                        window.location.href = "/provider/schedule/day.html";
                    }, 1000)
                },
                function (fail) {

                    var errors = fail.data.error.messages;

                    notie.alert(3, errors[0]);

                });
        })

    };

    //copy controller
    $scope.openEditView = function () {

        $scope.isSingleView = false;

        console.log(JSON.stringify($scope.singleViewItem));

        $scope.editView.enable = true;
    };

    //For scheduler

    $scope.scheduler = {
        resources: [],
        events: []
    };

    //end for scheduler

    var options = option = {
        "headers": {
            "Content-Type": "application/json",
            "authorization": "Bearer " + $scope.user.token
        }
    };

    $http.get("/key.json").then(function (success) {
        var url = success.data.url;
        $http.get(url + "/activities/list_activities",
            options)
            .then(function (response) {

                $scope.activities = response.data.data;

                //extract resource
                var resourcesSet = [];
                angular.forEach($scope.activities, function (activity, key) {

                    if (resourcesSet.indexOf(activity.location) === -1) {
                        resourcesSet.push(activity.location);
                        $scope.scheduler.resources.push(
                            {
                                id: activity.location,
                                title: activity.location,
                                eventColor: '#a0be37'
                            }
                        );
                    }

                });

                //extract events
                angular.forEach($scope.activities, function (activity, key) {
                    if (activity.is_cancel === false) {
                        $scope.scheduler.events.push(
                            {
                                id: key,
                                resourceId: activity.location,
                                start: activity.start_time,
                                end: activity.end_time,
                                title: activity.name
                            }
                        )
                    }
                });
            });
    });

    $scope.viewProviderProfile = function () {
        window.location.href = "index.html";
    };

    //calendar object
    $scope.calendarObjects = {
        isAgendaDayView: true,
        isAgendaWeekView: false,
        filters: {
            view: ["day"],
            showProvider: [],
            timeOfDay: [],
            provider: [],
            capacity: [],
            activityName: []
        },
        filterOptions: {
            showProvider: {
                all: false,
                only_with_activity: false
            },
            timeOfDay: {
                early: false,
                am: false,
                om: false,
                late: false
            }
        },
        clearEvents: function () {
            $scope.events.splice(0, $scope.events.length);
        },
        nextDate: function () {
            $scope.uiConfig.calendar.defaultDate.setDate($scope.uiConfig.calendar.defaultDate.getDate() + 1);
            $scope.uiConfig.calendar.defaultDate = new Date($scope.uiConfig.calendar.defaultDate.toString());
        },
        previousDate: function () {
            $scope.uiConfig.calendar.defaultDate.setDate($scope.uiConfig.calendar.defaultDate.getDate() - 1);
            $scope.uiConfig.calendar.defaultDate = new Date($scope.uiConfig.calendar.defaultDate.toString());
        },
        agendaWeekView: function () {
            window.location.href = "week.html";
        },
        agendaDayView: function () {
            jQuery("[ui-calendar]").fullCalendar('changeView', 'agendaDay');
            jQuery("[role='gridcell']").removeClass("light-green");
            $scope.calendarObjects.isAgendaDayView = true;
            $scope.calendarObjects.isAgendaWeekView = false;
        },
        todayView: function () {
            jQuery("[ui-calendar]").fullCalendar('changeView', 'agendaDay');
            $scope.uiConfig.calendar.defaultDate = new Date();

            $scope.calendarObjects.isAgendaDayView = true;
            $scope.calendarObjects.isAgendaWeekView = false;
        }
    };

    $scope.showSingleView = function (date, jsEvent, view) {
        $scope.isSingleView = true;
        //scroll top
        jQuery("body").animate({scrollTop: 0}, 500);

        $scope.singleViewItem = $scope.activities[date.id];
        $scope.singleViewItem.startDate = new Date($scope.activities[date.id].start_time);
        $scope.singleViewItem.startTime = new Date($scope.activities[date.id].start_time);
        $scope.singleViewItem.googleLocation = JSON.parse($scope.activities[date.id].encoded_address);

        console.log(JSON.stringify($scope.singleViewItem));
    };

    $scope.closeSingleView = function () {
        $scope.isSingleView = false;
    };

    /* config object */
    $scope.uiConfig = {
        calendar: {
            defaultView: 'agendaDay',
            //today
            defaultDate: new Date(),
            editable: false,
            selectable: true,
            clickable: true,
            header: {
                left: '',
                center: '',
                right: ''
            },
            //// uncomment this line to hide the all-day slot
            allDaySlot: false,
            eventClick: $scope.showSingleView,
            resources: $scope.scheduler.resources
        }
    };

    /* event source that contains custom events on the scope */
    $scope.events = [$scope.scheduler.events];

    $scope.eventSources = [$scope.events];

    $scope.gotoProfile = function () {
        $rootScope.$broadcast('viewProviderProfile');
    };

    $scope.timePickerOptions = {
        step: 10,
        timeFormat: 'H:i',
        appendTo: 'body'
    };

    //TODO: -------------------------------View Objects-----------------------------------
    //TODO: Copy View Object
    $scope.copyView =
    {
        enable: true,
        selectableCategories: [],
        selectableActivityTypes: [],
        environments: [],
        intensities: [],
        instructors: [],
        isCategorySelectView: false,
        isActivityTypeSelectView: false,
        //--TODO: open copy view
        open: function () {

            $scope.isSingleView = false;

            //input value
            $scope.newActivity = {
                "name": $scope.singleViewItem.name, //done
                "description": $scope.singleViewItem.description, //done
                "categories": [], //done
                "activity_types": [], //done
                "environment": $scope.singleViewItem.environment, //done
                "hasInstructor": false,
                "instructor": $scope.singleViewItem.instructor, //done
                "intensity": $scope.singleViewItem.intensity, //done
                "price": $scope.singleViewItem.price, //done
                "startDate": new Date($scope.singleViewItem.start_time), //done
                "startTime": new Date($scope.singleViewItem.start_time), //done
                "googleLocation": JSON.parse($scope.singleViewItem.encoded_address),
                "sameAddress": true,
                "googleLocation2": null,
                "duration": $scope.singleViewItem.duration,
                "hasLocation": true,
                "location": $scope.singleViewItem.location,
                "new_location": null,
                "recurrency_frequency": $scope.singleViewItem.recurrency_frequency,
                "recurrency_every": $scope.singleViewItem.recurrency_every,
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
                "recurrency_on": $scope.singleViewItem.recurrency_on,
                "recurrenceEnd": new Date($scope.singleViewItem.recurrency_end),
                "recurrency_end": "2016-01-20",
                "color": 3,
                "is_recurrent": $scope.singleViewItem.is_recurrent,
                "capacity": $scope.singleViewItem.capacity,
                "flag_all_day": $scope.singleViewItem.flag_all_day, //done
                "flag_midnight": $scope.singleViewItem.flag_midnight, //done
                "flag_free_members": $scope.singleViewItem.flag_free_members, //done
                "flag_adition_fees": $scope.singleViewItem.flag_adition_fees //done
            };

            //TODO: weekly case
            if ($scope.newActivity.recurrency_frequency == "weekly") {

                $scope.newActivity.recurrency_on = $scope.singleViewItem.recurrency_on.split(",");
                for (i = 0; i < $scope.newActivity.recurrency_on.length; i++) {
                    $scope.newActivity.recurrenceArray[$scope.newActivity.recurrency_on[i]].status = true;
                }
            }

            //--TODO: copy selectable category
            angular.forEach($scope.singleViewItem.categories, function (category, key) {

                angular.forEach($scope.copyView.selectableCategories, function (selectableCategory, key) {
                    if (selectableCategory.id == category.id) {
                        selectableCategory.isSelected = true;
                    }
                })
            });

            //--TODO: copy selectable category
            angular.forEach($scope.singleViewItem.activity_types, function (activity_type, key) {

                angular.forEach($scope.copyView.selectableActivityTypes, function (selectableActivityType, key) {
                    if (selectableActivityType.id == activity_type.id) {
                        selectableActivityType.isSelected = true;
                    }
                })
            });

            $scope.copyView.enable = true;
        },
        close: function () {
            $scope.copyView.enable = false
        },
        isMaxCategory: function () {

            var count = 0;

            angular.forEach($scope.copyView.selectableCategories, function (category, key) {
                if (category.isSelected)
                    count++;
            });

            if (count >= 5)
                return true;
            else
                return false;
        },

        isMaxActivityType: function () {

            var count = 0;

            angular.forEach($scope.copyView.selectableActivityTypes, function (activityType, key) {
                if (activityType.isSelected)
                    count++;
            })

            if (count >= 5)
                return true;
            else
                return false;
        },
        addActivity: function () {

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

                        //$scope.copyView.close();

                        setTimeout(function(){
                            window.location.href = '/provider/schedule/day.html';
                        },
                        1000)
                    },
                    function (fail) {

                        notie.alert(3, fail.data.error.messages[0]);
                    });
            })
        }
    };

    //TODO: Edit View Object
    $scope.editView =
    {
        enable: true,
        selectableCategories: [],
        selectableActivityTypes: [],
        environments: [],
        intensities: [],
        instructors: [],
        isCategorySelectView: false,
        isActivityTypeSelectView: false,
        isMaxCategory: function () {

            var count = 0;

            angular.forEach($scope.copyView.selectableCategories, function (category, key) {
                if (category.isSelected)
                    count++;
            })

            if (count >= 5)
                return true;
            else
                return false;
        },

        isMaxActivityType: function () {

            var count = 0;

            angular.forEach($scope.copyView.selectableActivityTypes, function (activityType, key) {
                if (activityType.isSelected)
                    count++;
            })

            if (count >= 5)
                return true;
            else
                return false;
        },
        updateActivity: function () {

            var data =
            {
                "activity_id": 979,
                "is_cancel": false,
                "categories": [],
                "activity_types": [],
                "recurrance_delete_confirmation": false,
                "name": "Test 4",
                "description": "Test Activity again and again",
                "environment": 2,
                "intensity": 3,
                "price": 200,
                "free_members": true,
                "start_time": "2016-01-29 15:01:00",
                "latitude": 126.123456,
                "longitude": 33.335,
                "encoded_address": "23432434234234324",
                "duration": 1,
                "address": "This is the full adrress",
                "location": "Room 2",
                "new_location": "",
                "color": 3,
                "capacity": 16,
                "flag_all_day": true,
                "flag_midnight": false,
                "flag_free_members": true,
                "flag_adition_fees": false,
                "is_recurrent": false

            };

            //category array
            angular.forEach($scope.copyView.selectableCategories, function (category, key) {
                if (category.isSelected)
                    data.categories.push(category.id);
            });

            //activity types array
            angular.forEach($scope.copyView.selectableActivityTypes, function (activityType, key) {
                if (activityType.isSelected)
                    data.activity_types.push(activityType.id);
            });

            $http.get("/key.json").then(function (success) {
                var url = success.data.url;
                $http.post(url + "/activities",
                    //data
                    data,
                    //config
                    {
                        "headers": {
                            "Content-Type": "application/json",
                            "authorization": "Bearer " + user.token
                        }
                    }
                ).then(function (success) {
                        notie.alert(1, "Updated activity successfully!");
                        window.location.href = "/provider/schedule/day.html";
                    },
                    function (fail) {
                    });
            })
        }
    };

    //TODO: Attendees View Object
    $scope.attendeesView = {
        enable: false,
        //--TODO: open()
        open: function () {
            //----TODO:+close single view
            $scope.isSingleView = false;

            //----TODO:+load attendees list from
            $http.get("/key.json").then(function (success) {
                var url = success.data.url;
                //get attendee list
                $http.get(url + "/activities/viewAttendees/" + $scope.singleViewItem.id + "?token=" + user.token)
                    .then(function (response) {
                        $scope.attendeesView.items = response.data.data;
                    });
            });

            //open attendee view
            $scope.attendeesView.enable = true;


        },
        //--TODO: close()
        close: function () {
            $scope.attendeesView.enable = false;
        }
    }

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);