var hello = angular.module('helloModule', []);
hello.controller('helloctrl', ['$scope'], function($scope){
	$scope.greeting = {
		text: 'hello'
	}
})
