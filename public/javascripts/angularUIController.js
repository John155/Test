
var my = angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

    my.controller('AppCtrl', function($scope) {

    });


    my.controller('cltmy', function() {
    this.myDate = new Date();
    this.isOpen = false;
});
