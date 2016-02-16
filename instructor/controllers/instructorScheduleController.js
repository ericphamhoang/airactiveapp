app.controller('instructorScheduleController', function ($scope, uiCalendarConfig) {
    $scope.menu = [true, false, false, false, false, false, false, false];
    $scope.template = 'screens/instructor.schedule.html';

    $scope.viewInstructorProfile = function () {
        window.location.href = "index.html";
    };

    $scope.$watch('uiConfig.calendar.defaultDate', function(val){
        jQuery("[role='gridcell']").removeClass("light-green");
        if($scope.calendarObjects.isAgendaWeekView)
            jQuery(".k-state-selected").parents("tr").find("td").addClass("light-green");
    });

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
            timeOfDay:{
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
            jQuery("[ui-calendar]").fullCalendar('changeView', 'agendaWeek');

            $scope.calendarObjects.isAgendaDayView = false;
            $scope.calendarObjects.isAgendaWeekView = true;
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

            resources: [
                {id: 'a', title: 'Wattina'},
                {id: 'b', title: 'Monash Pool', eventColor: 'green'},
                {id: 'c', title: 'La Trobe University', eventColor: 'orange'},
                {id: 'd', title: 'Victoria University', eventColor: 'red'},
                {id: 'e', title: 'WME', eventColor: 'blue'}
            ]
        }
    };

    /* event source that contains custom events on the scope */
    $scope.events = [[
        {
            id: '2',
            resourceId: 'a',
            start: '2015-12-25T09:00:00',
            end: '2015-12-25T23:00:00',
            title: 'All Day: Gym Access (7/100)'
        },
        {
            id: '3',
            resourceId: 'b',
            start: '2015-12-26T12:00:00',
            end: '2015-12-26T06:00:00',
            title: '7:00: Attack Room 3 (25/40)'
        },
        {
            id: '4',
            resourceId: 'c',
            start: '2015-12-25T07:00:00',
            end: '2015-12-25T09:00:00',
            title: '9:00: Zumba Cardio A (38/40)'
        }
    ]];

    $scope.eventSources = [$scope.events];

});