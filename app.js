
var app = angular.module('app', ['ui.bootstrap', 'mgcrea.ngStrap', 'ngGrid', 'ngRoute']);


app.config(['$routeProvider',

    function($routeProvider) {

        $routeProvider.
            when('/allClothes', {
                templateUrl: 'partials/allClothes.html',
                controller: 'AllClothesController'
            }).
            when('/randomOutfit', {
                templateUrl: 'partials/randomOutfit.html',
                controller: 'RandomOutfitController'
            }).
            when('/findMatchingClothes', {
                templateUrl: 'partials/findMatchingClothes.html',
                controller: 'FindMatchingClothesController'
            }).
            otherwise({
                redirectTo: '/allClothes'
            });
    }]);

app.filter('map', function() {
    return function(input, propName) {
        return input.map(function(item) {
            return item[propName];
        });
    };
});


app.controller('AllClothesController', function ($scope, $http, $log, $filter, $modal, filterFilter) {

    $scope.filterOptions = {
        filterText: ''
    };

    $http.get('clothes.json').success(function(data) {
        $scope.myData = data;
    });

    $scope.gridOptions = {
        data: 'myData',
        rowHeight: '100',
        showGroupPanel: true,
        enableColumnResize: true,
        showFooter: true,
        plugins: [new ngGridFlexibleHeightPlugin()],

        filterOptions: $scope.filterOptions,
        columnDefs: [
            {
                field:'image_id',
                displayName:'Image',
                cellTemplate: 'imageTemplate.html',
                width: 100
            },
            {
                field: 'type',
                displayName: 'Type'
            },
            {
                field: 'detailed_type',
                displayName: 'Detailed Type'
            },
            {
                field: 'primary_color',
                displayName: 'Primary Color'
            },
            {
                field: 'secondary_color',
                displayName: 'Secondary Color'
            },
            {
                field: 'pattern',
                displayName: 'Pattern'
            },
            {
                field: 'brand',
                displayName: 'Brand'
            }
        ]
    };


    $scope.getMatchingItems = function($viewValue) {

        var matchingItems = [];

        for (var i=0; i< $scope.myData.length; i++) {

            if (
                $scope.myData[i].type.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||
                    $scope.myData[i].detailed_type.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||
                    $scope.myData[i].primary_color.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||
                    $scope.myData[i].secondary_color.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||
                    $scope.myData[i].brand.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ) {

                matchingItems.push($scope.myData[i]);
            }

        }

        return matchingItems;

    };
});

app.controller('RandomOutfitController', function ($scope, $http, $log, $filter, $modal, filterFilter) {

    $http.get('clothes.json').success(function(data) {
        $scope.myData = data;
    });

    // pick random shirt.

    // find a matching pants

    // find a matching shoes

});


app.controller('FindMatchingClothesController', function ($scope, $http, $log, $filter, $modal, filterFilter) {

    $http.get('clothes.json').success(function(data) {
        $scope.myData = data;
    });

    // pick random shirt.

    // find a matching pants

    // find a matching shoes

});



