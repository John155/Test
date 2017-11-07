
var express = require('express');
var router = express.Router();

var my = angular.module("MyApp",['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])

    my.controller('AppCtrl', function($scope) {
        $scope.title1 = 'Button';
        $scope.title4 = 'Warn';
        $scope.isDisabled = true;

        $scope.googleUrl = 'http://google.com';

    });

module.exports = router;
/**
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
 **/