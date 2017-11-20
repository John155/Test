
var my = angular.module('myApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache','mwl.calendar', 'ngAnimate', 'ui.bootstrap', 'colorpicker.module']);

my.controller('AppCtrl', function($scope, $mdDialog) {
    $scope.editevent = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            clickOutsideToClose:true,
            templateUrl: '../ejs/eventDialog.ejs'

        })

        /*
        $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Title')
            .textContent('TextContent')
            .ariaLabel('ariaLabel')
            .ok('ok')
            .targetEvent(ev)
        */
        //);
    };

    function DialogController($scope, $mdDialog) {
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
});


my.controller('cltmy', function() {
    this.myDate = new Date();
    this.isOpen = false;
});

my.controller('DaysTest' ,function ($scope) {
    $scope.names = [{Name: 'Montag'}, {Name: 'Dienstag'}, {Name: 'Mittwoch'}, {Name: 'Donnerstag'}, {Name: 'Freitag'}, {Name: 'Samstag'}, {Name: 'Sonntag'}];
});

my.controller('DraggableExternalEventsCtrl', function(moment, calendarConfig) {

    var vm = this;

    vm.events = [];

    vm.externalEvents = [
        {
            title: 'Event 1',
            type: 'warning',
            color: calendarConfig.colorTypes.warning,
            startsAt: moment().startOf('month').toDate(),
            draggable: true
        },
        {
            title: 'Event 2',
            type: 'danger',
            color: calendarConfig.colorTypes.important,
            startsAt: moment().startOf('month').toDate(),
            draggable: true
        }
    ];

    vm.calendarView = 'month';
    vm.viewDate = moment().startOf('month').toDate();
    vm.cellIsOpen = false;

    vm.eventDropped = function(event, start, end) {
        var externalIndex = vm.externalEvents.indexOf(event);
        if (externalIndex > -1) {
            vm.externalEvents.splice(externalIndex, 1);
            vm.events.push(event);
        }
        event.startsAt = start;
        if (end) {
            event.endsAt = end;
        }
        vm.viewDate = start;
        vm.cellIsOpen = true;
    };
    vm.timespanClicked = function(date) {
        vm.lastDateClicked = date;
    };

});
