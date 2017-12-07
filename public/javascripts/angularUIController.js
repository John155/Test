
var my = angular.module('myApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache','mwl.calendar', 'ngAnimate', 'ui.bootstrap', 'colorpicker.module']);
var vm;


function pushVmEvent(data) {
    vm.events = [];
    for ( var i = 0 ; i < data.length ; i++) {
        var farbe = {
            primary: data[i].ersteFarbe,
            secondary: data[i].zweiteFarbe
        };
        vm.events.push({
            idTermin: data[i].idtermin,
            date: vm.lastDateClicked,
            title: data[i].terminname,
            location: data[i].ort,
            description: data[i].beschreibung,
            alerttime: data[i].benachrichtigungZeit,
            startsAt: new Date (data[i].start),
            endsAt: new Date(data[i].ende),
            draggable: false,
            resizable: false,
            color: farbe,
            benachrichtigungEinheit: data[i].benachrichtigungseinheit
        });
    }
}
function getTermine($http) {
    var token = sessionStorage.getItem("token");
    refreshToolbar();
    if (token) {
        console.log("getTermine-Token: " + token);
        var tok = {
            token: token
        };
        $http.post("/gettermine", tok).success(function (data, status) {
            pushVmEvent(data);
        });
    } else {
        //alert("Sie sind nicht eingeloggt");
        vm.events = [];
    }
}

function refreshToolbar() {
    if (sessionStorage.getItem("name")) {
        document.getElementById("txtUserIndikator").innerText= "Hallo, " + sessionStorage.getItem("name");
        document.getElementById("btnAnmelden").style.display = "none";
        document.getElementById("btnRegistrieren").style.display = "none";
        document.getElementById("btnAbmelden").style.display = "initial";
    } else {
        document.getElementById("txtUserIndikator").innerText= "Hallo, nichtangemeldete Person";
        document.getElementById("btnAnmelden").style.display = "initial";
        document.getElementById("btnRegistrieren").style.display = "initial";
        document.getElementById("btnAbmelden").style.display = "none";
    }
}



my.controller('AppCtrl', function($scope, $mdDialog, $http) {



    $scope.registrierenDialog = function () {
        $mdDialog.show({
            controller: RegistrierenController,
            clickOutsideToClose: true,
            templateUrl: '../ejs/registrieren.ejs'
        });

        function RegistrierenController($scope, $mdDialog, $http) {

            $scope.registrieren = function () {
                var data = {
                    name: $scope.username,
                    email: $scope.email,
                    password: $scope.password
                };

                console.log($scope.username);
                console.log($scope.email);
                console.log($scope.password);
                if (data.name != null && data.email != null && data.password != null) {
                    $http.post("/registrieren", JSON.stringify(data)).success(function (data, status) {
                        console.log('Data posted successfully');
                    });
                    $mdDialog.cancel();
                }
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

        };
    };

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
                if (data.email != null && data.password != null) {
                    $http.post("/login", JSON.stringify(data)).success(function (data, status) {
                        if (data.success == true) {
                            var token = data.token;
                            sessionStorage.setItem('token', token); // write
                            sessionStorage.setItem('name', data.username);
                            console.log(sessionStorage.getItem('token')); // read
                            //refreshUserindikator();
                            getTermine($http);
                            console.log($scope.parent);
                            $mdDialog.cancel();
                        } else {
                            //alert("Falscher Benutzername oder Passwort");
                            console.log(data.message);
                        }
                        console.log('Data posted successfully');
                    });
                }

            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

        };
    };



    $scope.abmelden = function () {
        sessionStorage.clear();
        getTermine($http);
    };
});


my.controller('DraggableExternalEventsCtrl', function($scope,moment, calendarConfig, $mdDialog, $http) {

    vm = this;

    $scope.onPageLoad = getTermine($http);

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
        function DialogController($scope, $mdDialog,$http)  {

            $scope.date = function ($event, field, event) {
                vm.toggle($event, field, event);
            };
            $scope.title = event.title;
            $scope.description = event.description;
            $scope.location = event.location;
            $scope.alerttime = event.alerttime;
            $scope.color = event.color;
            $scope.zeitOption = event.benachrichtigungEinheit;


            $scope.eve = event;

            $scope.save = function() {
                /*event.title = $scope.title;
                event.description = $scope.description;
                event.location = $scope.location;
                event.alerttime = $scope.alerttime;
                event.color = $scope.color;*/
                var farbe = {
                    primary: "#f01010",
                    secondary: "#ffffff"
                };

                var tempt = {
                    startsAt: vm.lastDateClicked,
                    endsAt: vm.lastDateClicked,
                    color:  farbe
                };
                var editTerminData = {
                    idTermin: event.idTermin,
                    token:  sessionStorage.getItem("token"),
                    title: $scope.title,
                    location: $scope.location,
                    start: $scope.eve.startsAt.getTime(),
                    ende: $scope.eve.endsAt.getTime(),
                    benachrichtigungZeit: $scope.alerttime,
                    benachrichtigungEinheit: $scope.zeitOption,
                    beschreibung: $scope.description,
                    ersteFarbe: event.color.primary.toString(),
                    zweiteFarbe: event.color.secondary.toString()
                };

                $http.post("/editTermin", JSON.stringify(editTerminData)).success(function (data, status) {
                    pushVmEvent(data);
                });
                $mdDialog.cancel();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.delete = function () {
                var deleteTerminData = {
                    idTermin: event.idTermin,
                    token:  sessionStorage.getItem("token")
                };

                $http.post("/deleteTermin", JSON.stringify(deleteTerminData)).success(function (data, status) {
                    pushVmEvent(data);
                });
                $mdDialog.cancel();
            }

            $scope.timeout = function() {

            };

        }
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
                    console.log(document);
                    console.log(document.getElementById("btnDelete"));

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

                        $scope.timeout = function() {
                            document.getElementById('btnDelete').style.display = "none";
                        };
                        $scope.eve = tempt;

                        $scope.date= function ($event, field, event) {
                            vm.toggle($event, field, event);
                        };

                        $scope.hide = function () {
                            $mdDialog.hide();
                        };

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };


                        $scope.save = function () {

                            var newTermindata = {
                                token:  sessionStorage.getItem("token"),
                                title: $scope.title,
                                location: $scope.location,
                                start: $scope.eve.startsAt.getTime(),
                                ende: $scope.eve.endsAt.getTime(),
                                benachrichtigungZeit: $scope.alerttime,
                                benachrichtigungEinheit: $scope.zeitOption,
                                beschreibung: $scope.description,
                                ersteFarbe: tempt.color.primary.toString(),
                                zweiteFarbe: tempt.color.secondary.toString()
                            };
                            console.log($scope.name);
                            $http.post("/", JSON.stringify(newTermindata)).success(function (data, status) {
                                pushVmEvent(data);
                            });

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



