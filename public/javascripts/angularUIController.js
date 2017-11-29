
var my = angular.module('myApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache','mwl.calendar', 'ngAnimate', 'ui.bootstrap', 'colorpicker.module']);


my.controller('AppCtrl', function($scope, $mdDialog) {

/*
    $scope.editevent = function () {
        $mdDialog.show({
            controller: DialogController,
            clickOutsideToClose:true,
            templateUrl: '../ejs/eventDialog.ejs'

        })


        $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Title')
            .textContent('TextContent')
            .ariaLabel('ariaLabel')
            .ok('ok')
            .targetEvent(ev)

        );


    };
*/

});


my.controller('DaysTest' ,function ($scope) {
    $scope.names = [{Name: 'Montag'}, {Name: 'Dienstag'}, {Name: 'Mittwoch'}, {Name: 'Donnerstag'}, {Name: 'Freitag'}, {Name: 'Samstag'}, {Name: 'Sonntag'}];
});

my.controller('DraggableExternalEventsCtrl', function($scope,moment, calendarConfig, $mdDialog) {

    var vm = this;
    var counter = 0;

    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    var actions = [{
        label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
        onClick: function(args) {
            alert.show('Edited', args.calendarEvent);
        }
    }, {
        label: '<i class=\'glyphicon glyphicon-remove\'></i>',
        onClick: function(args) {
            alert.show('Deleted', args.calendarEvent);
        }
    }];

    vm.events = [];


    vm.cellIsOpen = true;

    vm.addEvent = function() {
        vm.events.push({
            date: vm.lastDateClicked,
            title: 'Titel',
            location: 'Ort',
            description: 'Beschreibung',
            alerttime: 0,
            startsAt: moment().startOf('day').toDate(),
            endsAt: moment().endOf('day').toDate(),
            color: calendarConfig.colorTypes.important,
            draggable: false,
            resizable: false
        });
    };



    vm.eventClicked = function(event) {

        //show eigen angefertigten dialog anzeigen
        $mdDialog.show({
            controller: DialogController,
            clickOutsideToClose:true,
            templateUrl: '../ejs/eventDialog.ejs'
        });
        function DialogController($scope, $mdDialog)  {

            $scope.title = event.title;
            $scope.description = event.description;
            $scope.location = event.location;
            $scope.alerttime = event.alerttime;
            $scope.color = event.color;


            $scope.eve = event;

            $scope.save = function() {

                event.title = $scope.title;
                event.description = $scope.description;
                event.location = $scope.location;
                event.alerttime = $scope.alerttime;
                event.color = $scope.color;

                $mdDialog.hide();
            };

            $scope.date = function ($event, field, event) {
                vm.toggle($event, field, event);
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.delete = function (event) {
                alert(event.startsAt.toString())
                $mdDialog.cancel();
            }

        }

        alert.show('Clicked', event);
    };

    vm.eventEdited = function(event) {
        alert.show('Edited', event);
    };

    vm.eventDeleted = function(event) {
        alert.show('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
        alert.show('Dropped or resized', event);
    };

    vm.toggle = function($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();
        event[field] = !event[field];
    };


    vm.timespanClicked = function(date, cell) {

        if (vm.calendarView === 'month') {
            if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
                vm.cellIsOpen = false;
                vm.timespanClicked = function (date) {
                    vm.lastDateClicked = date;

                    //show eigen angefertigten dialog anzeigen
                    $mdDialog.show({
                        controller: DialogController,
                        clickOutsideToClose: true,
                        templateUrl: '../ejs/eventDialog.ejs'
                    });

                    function DialogController($scope, $mdDialog, $http) {

                        var tempt = {
                            startsAt: vm.lastDateClicked,
                            endsAt: vm.lastDateClicked,
                            color: calendarConfig.colorTypes.important
                        };

                        $scope.eve = tempt;

                        $scope.date = function ($event, field, event) {
                            vm.toggle($event, field, event);
                        };

                        $scope.hide = function () {
                            $mdDialog.hide();
                        };

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };


                        $scope.save = function () {

                            vm.events.push({
                                index: counter,
                                date: vm.lastDateClicked,
                                title: $scope.title,
                                location: $scope.location,
                                description: $scope.description,
                                alerttime: $scope.alerttime,
                                startsAt: tempt.startsAt,
                                endsAt: tempt.endsAt,
                                color: tempt.color,
                                draggable: false,
                                resizable: false
                            });

                            console.log(tempt.startsAt.getTime());

                            var data = {
                                title: $scope.title,
                                location: $scope.location,
                                start: $scope.start,
                                ende: $scope.ende,
                                benachrichtigungZeit: $scope.benachrichtigungZeit,
                                benachrichtigungEinheit: $scope.benachrichtigungEinheit,
                                beschreibung: $scope.beschreibung
                            };
                            console.log($scope.name);
                            $http.post("/", JSON.stringify(data)).success(function (data, status) {
                                console.log('Data posted successfully');
                            });
                            counter = counter + 1;
                            $mdDialog.cancel();

                        }

                    }
                }
            }
        }

    }
});
