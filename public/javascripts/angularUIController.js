
var my = angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

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


