'use strict';

/**
 * @ngdoc function
 * @name testingItApp.directive:testManagementFind
 * @description
 * # testManagementFind
 * Directive of the testingItApp
 */
angular.module('testingItApp')
.directive('testSuiteCrudAdd', function() {
  return {
    restrict: 'E',
    scope: {
      type: '@',
    },
    controller: ['$scope', '$rootScope', 'TestSuiteCrudService', function($scope, $rootScope, TestSuiteCrudService) {

      $scope.isNewTestSuite = true;
      $scope.testSuite = {};

      //New test suite
      $rootScope.$on('tpj-panel.directive:newTestSuite', function($event, parentId){
        $scope.isNewTestSuite = true;
        $scope.testSuite = {};
        $('#newTSKeywords').tokenfield('setTokens', ',');
        $("#testSuiteAddModal").modal('show');
      });

      //Edit TestSuite
      $rootScope.$on('ts-panel.directive:editTestSuite', function($event, TestSuite){
        $scope.isNewTestSuite = false;
        $scope.testSuite = TestSuite;
        $('#newTSKeywords').tokenfield('setTokens', $scope.testSuite.keywords);
        $("#testSuiteAddModal").modal('show');
      });

      //The new TS has been added y tree must be added too:
      $scope.closeModal = function(){
          $("#TestSuiteAddModal").modal('hide');
          $rootScope.$emit('panel.controller:closeModal', $scope.testSuite, 'ts');
      };

      var newTsEngine = new Bloodhound({
        local: [],
        datumTokenizer: function(d) {
          return Bloodhound.tokenizers.whitespace(d.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace
      });

      newTsEngine.initialize();

      $('#newTSKeywords').tokenfield({typeahead: [null,{source: newTsEngine.ttAdapter()}]});

      //Add a new TestSuite
      $scope.addTestSuite = function(){
        $scope.testSuite.keywords = $('#newTSKeywords').val();
        $scope.testSuite.parent = $rootScope.selectedBranch._id;
        $scope.testSuite.tpjId = $rootScope.currentTpj._id;
        TestSuiteCrudService.addTestSuite($scope, $scope.testSuite);
        $("#testSuiteAddModal").modal('hide');
      };

      //Edit TestSuite
      $scope.updateTestSuite = function(){
        $scope.testSuite.keywords = $('#newTSKeywords').val();
        TestSuiteCrudService.updateTestSuite($scope, $scope.testSuite._id, 'name', $scope.testSuite.name);
        TestSuiteCrudService.updateTestSuite($scope, $scope.testSuite._id, 'description',$scope.testSuite.description);
        TestSuiteCrudService.updateTestSuite($scope, $scope.testSuite._id, 'keywords',$scope.testSuite.keywords);
        $("#testSuiteAddModal").modal('hide');
      };

    }],
    templateUrl: 'views/modal/test-suite/test-suite-crud-add.html'
  };
});
