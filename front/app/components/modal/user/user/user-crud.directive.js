'use strict';

/**
 * @ngdoc function
 * @name testingItApp.directive:usersCrud
 * @description
 * # usersCrud
 * Directive of the testingItApp
 */
angular.module('testingItApp')
.directive('usersCrud', function() {
  return {
    restrict: 'E',
    scope: {
      type: '@',
    },
    controller: ['$scope', '$rootScope', 'UserService', 'TestProjectCrudService', function($scope, $rootScope, UserService, TestProjectCrudService) {

      //Init users when modal is show
      $rootScope.$on('user-management.directive:shown.bs.modal', function() {
        $scope.users = [];
        //To read in a combo in ng-grid
        UserService.getAllUsers($scope);
        TestProjectCrudService.getAllProjects($scope);
        UserService.getAllProjectsForDropDown($scope.userCrudGridOptions);
        window.setTimeout(function(){
          $(window).resize();
        }, 1000);
      });

      //Delete an user
      $scope.deleteUser = function(id){
        UserService.deleteUser($scope, id);
      };

      //Init uiGrid for users
      $scope.userCrudGridOptions = {
        data: 'users',
        columnDefs: [{field:'name', displayName: 'Name'},
                     {field:'firstName', displayName:'First Name'},
                     {field:'lastName', displayName: 'Last Name'},
                     {field:'email', displayName: 'Email'},
                     {field:'isAdmin', displayName: 'Is admin', enableCellEdit: false, cellTemplate: '<input type="checkbox" ng-model="row.entity.isAdmin"  ng-click="grid.appScope.clickIsAdminCheckBox(row.entity)">'},
                     //{field:'defaultTestProject', enableCellEdit: false, displayName: 'Test project by default'},
                     {field:'defaultTestProject',
                      displayName: 'Test Project',
                      editableCellTemplate: 'ui-grid/dropdownEditor',
                      editDropdownOptionsArray: $scope.testProjects,
                      editDropdownIdLabel: '_id',
                      editDropdownValueLabel: 'name',
                      cellFilter: 'testProjectsFilter:grid.appScope.testProjects'},
                     {field: 'delete', enableCellEdit: false, cellTemplate: '<button class="btn btn-default fa fa-times-circle" ng-click="grid.appScope.deleteUser(row.entity)" ></button>'}]
      };

      //when the table is editing
      $scope.userCrudGridOptions.onRegisterApi = function(gridApi) {
        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue) {
            UserService.updateUser($scope,rowEntity._id,colDef.field,newValue);
        });
      };

      //When isAdmin column is click:
      $scope.clickIsAdminCheckBox = function(rowEntity){
        UserService.updateUser($scope,rowEntity._id,'isAdmin',rowEntity.isAdmin);
      }

      //Open add a new users  modal
      $scope.openAddUserModal = function(){
        $('#userManagementModal').modal("hide");
        $('#userAddModal').modal('show');
      };
    }],
    templateUrl: 'views/modal/user/user/user-crud.html'
  };
})

.directive('userCrudAdd', function() {
  return {
    restrict: 'E',
    scope: {
      type: '@',
    },
    controller: ['$scope', '$rootScope', 'UserService', 'TestProjectCrudService', function($scope, $rootScope, UserService, TestProjectCrudService) {

      $scope.newUser = {};
      $scope.newUser.isAdmin = false;

      //A new user
      $scope.addUser = function(){
        UserService.addUser($scope, $scope.newUser);
      };

      //Close current modal and show userModal
      $scope.closeModal = function(){
        $('#userAddModal').modal("hide");
        $('#userManagementModal').modal('show');
      };

      //Load test projects for dropdown
      $('#userAddModal').on('shown.bs.modal', function() {
        TestProjectCrudService.getAllProjects($scope);
        UserService.getAllProjectsForDropDown($scope.userCrudGridOptions);
      });


    }],
    templateUrl: 'views/modal/user/user/user-crud-add.html'
  };
})

//In user management, the dropdown show the name of testProjects:
.filter('testProjectsFilter', function () {
    return function (input, map) {
        if (typeof map !== "undefined") {
            for (var i = 0; i < map.length; i++) {
                if (map[i]["_id"] == input) {
                    return map[i]["name"];
                }
            }
        }
    };
})
