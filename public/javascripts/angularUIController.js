
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


my.controller('cltmy', function() {
    this.myDate = new Date();
    this.isOpen = false;
});

my.controller('DaysTest' ,function ($scope) {
    $scope.names = [{Name: 'Montag'}, {Name: 'Dienstag'}, {Name: 'Mittwoch'}, {Name: 'Donnerstag'}, {Name: 'Freitag'}, {Name: 'Samstag'}, {Name: 'Sonntag'}];
});

my.controller('DraggableExternalEventsCtrl', function($scope,moment, calendarConfig, $mdDialog) {

    var vm = this;

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


            $scope.eve = event;


            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
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
                vm.timespanClicked = function(date) {
                    vm.lastDateClicked = date;




                    //show eigen angefertigten dialog anzeigen
                    $mdDialog.show({
                        controller: DialogController,
                        clickOutsideToClose:true,
                        templateUrl: '../ejs/eventDialog.ejs'
                    });
                    function DialogController($scope, $mdDialog)  {

                        vm.addEvent();
                        $scope.eve = vm.events.get(vm.events.length);
                        vm.events.get(vm.events.length).date = vm.lastDateClicked;

                        $scope.hide = function() {
                        $mdDialog.hide();
                        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
        $scope.save = function(){
            $mdDialog.cancel();
            var data = {
                name: $scope.name,
                ort : $scope.ort,
                start : $scope.start,
                ende : $scope.ende,
                benachrichtigungZeit : $scope.benachrichtigungZeit,
                benachrichtigungEinheit : $scope.benachrichtigungEinheit,
                beschreibung : $scope.beschreibung
                };
            console.log($scope.name);
            $http.post("/",  JSON.stringify(data)).success(function(data, status) {
                console.log('Data posted successfully');
            })

        }

        }




            } else {
                vm.cellIsOpen = true;
                vm.viewDate = date;
            }
        } else if (vm.calendarView === 'year') {
            if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
                vm.cellIsOpen = false;
            } else {
                vm.cellIsOpen = true;
                vm.viewDate = date;
            }
        }

    };


});
