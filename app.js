
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

app.filter('hasImageId', function() {
    return function(outfit_data) {
        var filtered = [];
        angular.forEach(outfit_data, function(item) {
            if(item.image_id.length > 0) {
                filtered.push(item);
            }
        });
        return filtered;
    };
});

app.filter('shirts', function() {
    return function(outfit_data) {
        var filtered = [];
        angular.forEach(outfit_data, function(item) {
            if(item.type == 'Shirt') {
                filtered.push(item);
            }
        });
        return filtered;
    };
});


app.filter('pants', function() {
    return function(outfit_data) {
        var filtered = [];
        angular.forEach(outfit_data, function(item) {
            if(item.type == 'Pants') {
                filtered.push(item);
            }
        });
        return filtered;
    };
});

app.filter('shoes', function() {
    return function(outfit_data) {
        var filtered = [];
        angular.forEach(outfit_data, function(item) {
            if(item.type == 'Shoes') {
                filtered.push(item);
            }
        });
        return filtered;
    };
});

app.filter('matchesOutfit', ['WardrobeService', function(WardrobeService) {
    return function(outfit_data, outfit) {
        var filtered = [];
        angular.forEach(outfit_data, function(item) {
            if(item.type == 'Shirt') {

                if(outfit.pants.image_id) {
                    if(WardrobeService.doesShirtMatchPants(item, outfit.pants)) {
                        filtered.push(item);
                    }
                } else {
                    filtered.push(item);
                }


            } else if (item.type == 'Pants') {
                if(outfit.shirt.image_id) {
                    if(WardrobeService.doesShirtMatchPants(outfit.shirt, item)) {
                        filtered.push(item);
                    }
                } else {
                    filtered.push(item);
                }
            } else if (item.type == 'Shoes') {

                if(outfit.shirt.image_id && outfit.pants.image_id) {
                    if(WardrobeService.doesShoesMatchPantsAndShirt(outfit.shirt, outfit.pants, item)) {
                        filtered.push(item);
                    }
                } else {
                    filtered.push(item);
                }
            }
        });
        return filtered;
    };
}]);

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





    return {

        doesShirtMatchPants : function(shirt, pants) {

            if(shirt.type != 'Shirt' || pants.type != 'Pants') {
                return false;
            }

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
                } else if (pants.primary_color == 'Black' &&
                    !isSameColor(shirt.primary_color, pants.primary_color) &&
                    shirt.detailed_type == 'Dress Shirt') {
                    // TODO - Need advice on this one
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
        },
        doesShoesMatchPantsAndShirt : function(shirt, pants, shoes) {

            if(shoes.type != 'Shoes') {
                return false;
            }


            // TODO
            if(shoes.detailed_type == 'Sperries') {
                return true;
            }
        },
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
                    if(this.doesShirtMatchPants(outfit.shirt, item)) {
                        outfit.pants = item;
                        break;
                    }
                }
            }

            for(var i = 0; i < data.length; i++) {
                var item = data[i];

                if(item.image_id.length > 0) {

                    if(this.doesShoesMatchPantsAndShirt(outfit.shirt, outfit.pants, item)) {
                        outfit.shoes = item;
                        break;
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
        $scope.outfit_data = data;
    });

    $scope.gridOptions = {
        data: 'outfit_data',
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

        for (var i=0; i< $scope.outfit_data.length; i++) {

            if (
                $scope.outfit_data[i].type.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||
                    $scope.outfit_data[i].detailed_type.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||
                    $scope.outfit_data[i].primary_color.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||
                    $scope.outfit_data[i].secondary_color.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||
                    $scope.outfit_data[i].brand.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ) {

                matchingItems.push($scope.outfit_data[i]);
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

    $scope.outfit = {
        shirt: {},
        pants: {},
        shoes: {}
    };

    $http.get('clothes.json').success(function(data) {
        $scope.outfit_data = data;
    });

    $scope.clearOutfit = function() {
        $scope.outfit = {
            shirt: {},
            pants: {},
            shoes: {}
        };
    }

    $scope.toggleShirt = function(shirt) {
        if($scope.outfit.shirt == shirt) {
            $scope.outfit.shirt = {};
        } else {
            $scope.outfit.shirt = shirt;
        }
    };

    $scope.togglePants = function(pants) {
        if($scope.outfit.pants == pants) {
            $scope.outfit.pants = {};
        } else {
            $scope.outfit.pants = pants;
        }
    };

    $scope.toggleShoes = function(shoes) {
        if($scope.outfit.shoes == shoes) {
            $scope.outfit.shoes = {};
        } else {
            $scope.outfit.shoes = shoes;
        }
    };

    // pick a shirt.

    // find a matching pants

    // find a matching shoes

});



