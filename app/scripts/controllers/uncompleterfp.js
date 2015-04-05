angular.module('elasticSearchAngularApp')
  .controller('UncompleteCtrl', ['$scope', 'searchService','Data','$window', function ($scope, searchService,Data,$window) {

searchService.uncompletefiles().then(function(result) {$scope.searchResp = result;

$scope.isAvailableResults = function () {
            return ($scope.searchResp.hits.total>0)
        };});


$scope.setId=function(id)
 {

Data.Id=id;
$window.location='/#/importrfp/'+ id;


 }

  }]);