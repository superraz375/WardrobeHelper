
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

app.factory("WardrobeService", function() {


    shuffle = function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };


    isWhiteOrKhaki = function(color) {
        return color == 'White' || color == 'Khaki';
    };

    isBlackAndNavy = function(color1, color2) {
        return (color1 == 'Black' && color2 == 'Navy') ||
            (color1 == 'Navy' && color2 == 'Black');
    }

    isBrownAndGrey = function(color1, color2) {
        return (color1 == 'Brown' && color2 == 'Grey') ||
            (color1 == 'Grey' && color2 == 'Brown');
    }

    isSameColor = function(color1, color2) {
      return color1 == color2;
    };

    doesShirtMatchPants = function(shirt, pants) {

        //Keep to one pattern only per outfit, even if the colours match.
        if(pants.pattern != 'Plain' && shirt.pattern != 'Plain') {
            if(pants.pattern != shirt.pattern) {
                return false;
            }
        }

        //Don't mix black and navy
        if(pants.detailed_type != 'Jeans' && isBlackAndNavy(shirt.primary_color, pants.primary_color)) {
            return false;
        }

        // Don't mix brown and grey
        if(isBrownAndGrey(shirt.primary_color, pants.primary_color)) {
            return false;
        }


        if(pants.detailed_type == 'Swimsuit') {

            if(shirt.detailed_type == 'T-Shirt') {

            } else {
                return false;
            }
        } else if (pants.detailed_type == 'Jeans') {
            return shirt.detailed_type != 'Tanktop';
        } else if (pants.detailed_type == 'Slacks') {
            if(isWhiteOrKhaki(pants.primary_color) && !isSameColor(shirt.primary_color, pants.primary_color)) {
                return true;
            } else {
                return false;
            }
        } else if (pants.detailed_type == 'Shorts') {

            if(shirt.detailed_type == 'Dress Shirt') {
                return false;
            }

            if(isWhiteOrKhaki(pants.primary_color) && !isSameColor(shirt.primary_color, pants.primary_color)) {
                return true;
            }

            if(shirt.secondary_color == pants.primary_color) {
                return true;
            }

            return false;

        } else {
            return false;
        }
    };

    return {
        selectRandomOutfit: function(data) {

            data = shuffle(data);

            var outfit = {
                shirt: {},
                pants: {},
                shoes: {}
            };

            for(var i = 0; i < data.length; i++) {
                var item = data[i];

                if(item.image_id.length > 0) {

                    if(item.type == 'Shirt') {
                        outfit.shirt = item
                        break;
                    }
                }
            }

            for(var i = 0; i < data.length; i++) {
                var item = data[i];

                if(item.image_id.length > 0) {
                    if(item.type == 'Pants') {
                        if(doesShirtMatchPants(outfit.shirt, item)) {
                            outfit.pants = item;
                            break;
                        }
                    }
                }
            }

            for(var i = 0; i < data.length; i++) {
                var item = data[i];

                if(item.image_id.length > 0) {
                    if(item.type == 'Shoes') {

                        if(item.detailed_type == 'Sperries') {
                            outfit.shoes = item;
                            break;
                        }

                    }
                }
            }

            return outfit;
        },
        first: function() {
            return;
        }
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

app.controller('RandomOutfitController', function ($scope, $http, $log, $filter, $modal, filterFilter, WardrobeService) {

    $http.get('clothes.json').success(function(data) {
        $scope.outfit_data = data;

        $scope.outfit = WardrobeService.selectRandomOutfit(data);
    });

    $scope.outfit = {
        shirt: {},
        pants: {},
        shoes: {}
    };
});


app.controller('FindMatchingClothesController', function ($scope, $http, $log, $filter, $modal, filterFilter) {

    $http.get('clothes.json').success(function(data) {
        $scope.myData = data;
    });

    // pick a shirt.

    // find a matching pants

    // find a matching shoes

});



