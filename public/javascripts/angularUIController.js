
var my = angular.module('myApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache','mwl.calendar', 'ngAnimate', 'ui.bootstrap', 'colorpicker.module']);
var vm;

function getTermine($http, token) {
    console.log("getTermine-Token: " + token);
    var tok = {
        token: token
    };
    $http.post("/gettermine", tok).success(function (data, status) {
        vm.events = [];
        for ( var i = 0 ; i < data.length ; i++){
            vm.events.push({
                date: vm.lastDateClicked,
                title: data[i].terminname,
                location: data[i].ort,
                description: data[i].beschreibung,
                alerttime: data[i].benachrichtigungZeit,
                startsAt: data[i].start,
                endsAt: data[i].ende,
                draggable: false,
                resizable: false,
                benachrichtigungEinheit: data[i].benachrichtigungseinheit
            });
        }

        console.log(data);
    });
}


my.controller('AppCtrl', function($scope, $mdDialog) {

    $scope.registrierenDialog = function () {
        $mdDialog.show({
            controller: RegistrierenController,
            clickOutsideToClose: true,
            templateUrl: '../ejs/registrieren.ejs'
        });

        function RegistrierenController($scope, $mdDialog, $http) {

            $scope.registrieren = function () {
                var data = {
                    email: $scope.email,
                    password: $scope.password
                };
                console.log($scope.email);
                $http.post("/registrieren", JSON.stringify(data)).success(function (data, status) {
                    console.log('Data posted successfully');
                });
                $mdDialog.cancel();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

        };
    }

    $scope.loginDialog = function () {
        $mdDialog.show({
            controller: LoginController,
            clickOutsideToClose: true,
            templateUrl: '../ejs/login.ejs'
        });

        function LoginController($scope, $mdDialog, $http) {

            $scope.login = function () {
                var data = {
                    email: $scope.email,
                    password: $scope.password
                };
                console.log($scope.email);
                $http.post("/login", JSON.stringify(data)).success(function (data, status) {
                    if(data.success == true){
                        var token = data.token;
                        localStorage.setItem('token', token); // write
                        console.log(localStorage.getItem('token')); // read
                        getTermine($http, token);
                    } else {
                        console.log(data.message);
                    }
                    console.log('Data posted successfully');
                });
                $mdDialog.cancel();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

        };
    }
});


my.controller('DaysTest' ,function ($scope) {
    $scope.names = [{Name: 'Montag'}, {Name: 'Dienstag'}, {Name: 'Mittwoch'}, {Name: 'Donnerstag'}, {Name: 'Freitag'}, {Name: 'Samstag'}, {Name: 'Sonntag'}];
});

my.controller('DraggableExternalEventsCtrl', function($scope,moment, calendarConfig, $mdDialog) {

    vm = this;
    var counter = 0;

    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    var actions = [{
        label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
        onClick: function(args) {
            //edit event
            vm.eventClicked(args.calendarEvent);
            alert.show('Edited', args.calendarEvent);
        }
    }, {
        label: '<i class=\'glyphicon glyphicon-remove\'></i>',
        onClick: function(args) {
            vm.cellIsOpen = false;
            alert.show('Deleted', args.calendarEvent);
        }
    }];

    vm.events = [];

    vm.cellIsOpen = false;

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
            } else {
                vm.cellIsOpen = true;
                vm.viewDate = date;
            }

            if(vm.calendarView === 'month') {
                if (!vm.cellIsOpen) {
                    vm.cellIsOpen = false;
                    vm.lastDateClicked = date;

                    //show eigen angefertigten dialog anzeigen
                    $mdDialog.show({
                        controller: DialogController,
                        clickOutsideToClose: true,
                        templateUrl: '../ejs/eventDialog.ejs'
                    });

                    function DialogController($scope, $mdDialog, $http) {

                        var farbe = {
                            primary: "#f01010",
                            secondary: "#ffffff"
                        };

                        var tempt = {
                            startsAt: vm.lastDateClicked,
                            endsAt: vm.lastDateClicked,
                            color:  farbe
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
                                resizable: false,
                                benachrichtigungEinheit: $scope.zeitOption,
                                actions: actions
                            });


                            var data = {
                                title: $scope.title,
                                location: $scope.location,
                                start: tempt.startsAt.getTime(),
                                ende: tempt.endsAt.getTime(),
                                benachrichtigungZeit: $scope.alerttime,
                                benachrichtigungEinheit: $scope.zeitOption,
                                beschreibung: $scope.description,
                                ersteFarbe: tempt.color.primary.toString(),
                                zweiteFarbe: tempt.color.secondary.toString()
                            };
                            console.log($scope.name);
                            $http.post("/", JSON.stringify(data)).success(function (data, status) {
                                vm.events = [];
                                for ( var i = 0 ; i < data.length ; i++){
                                    vm.events.push({
                                        index: counter,
                                        date: vm.lastDateClicked,
                                        title: data[i].terminname,
                                        location: data[i].ort,
                                        description: data[i].beschreibung,
                                        alerttime: data[i].benachrichtigungZeit,
                                        startsAt: data[i].start,
                                        endsAt: data[i].ende,
                                        color: tempt.color,
                                        draggable: false,
                                        resizable: false,
                                        benachrichtigungEinheit: data[i].benachrichtigungseinheit
                                    });
                                }

                                console.log(data);
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

my.controller('LoginCtrl', function($scope, $mdDialog, $mdMedia, $mdToast) {
    var lc = this;
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.$mdToast = $mdToast;
    this.status = '';


    lc.prototype.showDialog = function (event) {
        var _this = this;
        this.$mdDialog.show({
            controller: LoginDialogController,
            controllerAs: 'dialog',
            templateUrl: 'login-dialog.template.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
        })
            .then(function (credentials) {
                return _this.showToast("Thanks for logging in, " + credentials.username + ".");
            }, function () {
                return _this.showToast('You canceled the login.');
            });
        this.$scope.$watch(function () {
            return _this.$mdMedia('xs') || _this.$mdMedia('sm');
        }, function (wantsFullScreen) {
            return _this.customFullscreen = wantsFullScreen === true;
        });
    };
    lc.prototype.showToast = function (content) {
        this.$mdToast.show(this.$mdToast.simple()
            .content(content)
            .position('top right')
            .hideDelay(3000));
    };
});


var LoginDialogController = (function () {
    function LoginDialogController($mdDialog) {
        this.$mdDialog = $mdDialog;
    }
    LoginDialogController.prototype.hide = function () {
        this.$mdDialog.hide();
    };
    LoginDialogController.prototype.close = function () {
        this.$mdDialog.cancel();
    };
    LoginDialogController.prototype.login = function () {
        this.$mdDialog.hide({ username: this.username, password: this.password });
    };
    return LoginDialogController;
});



