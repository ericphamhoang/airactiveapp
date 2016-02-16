/**
 * Created by Admin on 12/29/2015.
 */
app.controller('providerScheduleWeekController', ['$scope', '$rootScope', '$http', '$kookies', '$window', function ($scope, $rootScope, $http, $kookies, $window) {

    //52.65.6.68/api/v1/activities/list_activities

    var user = $kookies.get('User');

    $scope.user = user;

    //For scheduler

    $scope.scheduler = {
        resources: [],
        events: []
    };

    //end for scheduler

    var options = {
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

                console.log($scope.activities);

                $scope.today = new Date();

                $scope.lastSunday = Date.parse('last Sunday');

                $weekDays = [$scope.lastSunday];

                for (i = 1; i < 7; i++) {
                    var a = Date.parse('last Sunday').add(i).day();
                    $weekDays.push(a);
                }

                console.log($weekDays);

                angular.forEach($weekDays, function (day, key) {
                    $scope.scheduler.resources.push(
                        {
                            id: day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate(),
                            title: day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate(),
                            eventColor: '#a0be37'
                        }
                    );
                });

                //extract events
                angular.forEach($scope.activities, function (activity, key) {
                    $scope.scheduler.events.push(
                        {
                            id: activity.id,
                            resourceId: new Date(activity.start_time).getFullYear() + "-" + (new Date(activity.start_time).getMonth() + 1) + "-" + new Date(activity.start_time).getDate(),
                            start: activity.start_time,
                            end: activity.end_time,
                            title: activity.name
                        }
                    )
                });

                console.log($scope.scheduler.events);
            });
    });

    $scope.menu = [true, false, false, false, false, false, false, false];
    $scope.template = '../screens/providerScheduleWeekView.html';

    $scope.viewProviderProfile = function () {
        window.location.href = "index.html";
    };

    $scope.$watch('uiConfig.calendar.defaultDate', function (val) {
        jQuery("[role='gridcell']").removeClass("light-green");
        if ($scope.calendarObjects.isAgendaWeekView)
            jQuery(".k-state-selected").parents("tr").find("td").addClass("light-green");
    });

    //calendar object
    $scope.calendarObjects = {
        isAgendaDayView: false,
        isAgendaWeekView: true,
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
            window.location.href="week.html";
        },
        agendaDayView: function () {
            window.location.href="day.html";
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
        console.log($scope.isSingleView);
        //scroll top
        jQuery("body").animate({scrollTop: 0}, 500);

        $scope.singleViewItem = $scope.activities[date.id];
        $scope.singleViewItem.startDate = new Date($scope.activities[date.id].start_time);
        $scope.singleViewItem.startTime = new Date($scope.activities[date.id].start_time);

        console.log(JSON.stringify($scope.singleViewItem));
    };

    $scope.closeSingleView = function () {
        $scope.isSingleView = false;
    };

    /* config object */
    $scope.uiConfig = {
        calendar: {
            defaultView: 'timelineDay',
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

}]).config(['$kookiesProvider',
    function ($kookiesProvider) {
        $kookiesProvider.config.json = true;
    }
]);