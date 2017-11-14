
var my = angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

my.controller('AppCtrl', function($scope) {

});


my.controller('cltmy', function() {
    this.myDate = new Date();
    this.isOpen = false;

});

my.controller('DaysTest' ,function ($scope) {
    $scope.names = [{Name: 'Monatg'}, {Name: 'Dinestag'}, {Name: 'Mittwoch'}, {Name: 'Donnerstag'}, {Name: 'Freitag'}, {Name: 'Samstag'}, {Name: 'Sonnstag'}];
});


