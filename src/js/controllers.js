var SideNavModule = angular.module('SideNavModule', []);
SideNavModule.controller('SideNavCtrl', function($scope, $http, $state, $stateParams) {
	$scope.greeting = {
		text: 'hello'
	}
})
