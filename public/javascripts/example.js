
/*
angular.module('myCalendar', ['mwl.calendar', 'ngAnimate', 'ui.bootstrap', 'colorpicker.module']);
angular
    .module('myCalendar')
    .controller('DraggableExternalEventsCtrl', function(moment, alert, calendarConfig) {

        var vm = this;

        vm.events = [];

        vm.externalEvents = [];


        vm.calendarView = 'month';
        vm.viewDate = moment().startOf('month').toDate();
        vm.cellIsOpen = true;

        vm.addEvent = function() {
             vm.events.push({
             title: 'New event',
             location: 'Ort',
             startsAt: moment().startOf('day').toDate(),
             endsAt: moment().endOf('day').toDate(),
             draggable: true,
             resizable: true
        });
        };

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

    });
*/