'use strict';

/**
 * @ngdoc function
 * @name elasticSearchAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the elasticSearchAngularApp
 */
angular.module('elasticSearchAngularApp')
  .controller('MainCtrl', ['$scope', 'searchService', function ($scope, searchService) {
        $scope.maxSize = 5;
        $scope.currentPage = 1;
        $scope.pageSizes = [
            {count: 5, label: '5 ' + $scope.translation.SEARCH_PAGE_RESULT},
            {count: 10, label: '10 ' + $scope.translation.SEARCH_PAGE_RESULT},
            {count: 20, label: '20 ' + $scope.translation.SEARCH_PAGE_RESULT},
            {count: 50, label: '50 ' + $scope.translation.SEARCH_PAGE_RESULT}
        ];
        $scope.pageSize = $scope.pageSizes[1]; // 10

        $scope.selectPage = function (page) {
            $scope.fullTextSearch($scope.searchText, page);
        };

        $scope.fullTextSearch = function (text, page) {
            $scope.currentPage = page;
            var from = ($scope.currentPage - 1) * $scope.pageSize.count;
            searchService.fullTextSearch(from, $scope.pageSize.count, text).then(
                function (resp) {
                    $scope.searchResp = resp;
                    $scope.totalItems = resp.hits.total;
                }
            );
        };

        $scope.isAvailableResults = function () {
            return $scope.searchResp ? true : false;
        };

        $scope.isAtLeastOneResult = function () {
            if (!$scope.isAvailableResults()) {
                return false;
            }
            return $scope.searchResp.hits.total > 0;
        };

        $scope.autocomplete = function (text) {
            return searchService.autocomplete(text).then(function (res) {
                var tags = [];
                angular.forEach(res.hits.hits, function (hit) {
                    /*angular.forEach(hit.fields.tags, function(tag){
                        albums.push(tag);
                    });*/
               
                if(tags.indexOf(hit.highlight.tags[0]) == -1)
                {
                    tags.push(hit.highlight.tags[0]);}
                });
                $scope.autocompleteResp = tags;

                return tags;
            });
        };
          //$scope.states = ['Alabama', 'Alaska' ,'Alabama','Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

        $scope.rangeGreaterThanZero = function (range) {
            return range.count > 0;
        };
    }]);
