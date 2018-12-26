
var agileApp = angular.module("agileApp", ['ngRoute']);

agileApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider

	.when('/listAllProjects', {
		templateUrl: 'allProjects.htm',
		controller: 'allProjectsController'
	})
	.when('/listOneProject', {
		templateUrl: 'oneProject.htm',
		controller: 'oneProjectController'
	})
}]);

agileApp.controller('oneProjectController', function($scope) {
	$scope.project = {
		name: "k4",
		sprints:[
			{sid:10, sStatus:'active', sName:'A-a123456789012345'},
			{sid:20, sStatus:'active', sName:'B'},
			{sid:30, sStatus:'active', sName:'C'},
			{sid:40, sStatus:'active', sName:'d'},
		]
	};
});

agileApp.controller('allProjectsController', ['$scope','agileService', function ($scope, agileService)
{
    $scope.getAllProjects = function () {
        agileService.getAllProjects()
          .then(function success(response){
              $scope.projects = response.data;
              $scope.p2 = "This is P2.. intentional !!";
              $scope.errorMessage = '';
          },
          function error (response ){
              $scope.errorMessage = 'Error getting projects!';
          });
    }

	// get list of projects from database
	$scope.getAllProjects();
}]);

agileApp.service('agileService',['$http', function ($http) {
    this.getAllProjects = function getAllProjects(){
        return $http({
          method: 'GET',
          url: 'http://localhost:8000/p/list'
        });
    }
}]);
