
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

agileApp.controller('oneProjectController', ['$scope','agileService', function ($scope, agileService)
{
	$scope.getOneProject = function (p) {
		agileService.getOneProject(p)

		.then(function success(response){
			$scope.sprints = response.data;
			$scope.errorMessage = '';
		},
		function error (response ){
			$scope.errorMessage = 'Error getting details of k4 project';
		});
	}

	// get details of k4 project
	$scope.getOneProject("k4");
}]);

agileApp.service('agileService',['$http', function ($http) {
	this.getAllProjects = function getAllProjects(){
		return $http({
			method: 'GET',
			url: 'http://localhost:8000/p/list'
		})
	}

	this.getOneProject = function getOneProject(p) {
		return $http({
			method: 'GET',
			url: 'http://localhost:8000/' + 'k4' + '/sprints/active'
		});
	}
}]);
