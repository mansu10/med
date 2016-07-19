var app = angular.module('app', [

// 'ngRoute', 'filters', 'service', 'directives'
	'ui.router'

])
/**
* 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
* 这里的run方法只会在angular启动的时候运行一次。
* @param  {[type]} $rootScope
* @param  {[type]} $state
* @param  {[type]} $stateParams
* @return {[type]}
*/
app.run(function($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
});

var paths = {
	tpl: './src/template/'
}

app.config(function($stateProvider, $urlRouterProvider) {
	//
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/login");
	//
	// Now set up the states
	$stateProvider
		.state('index', {
			url: '/login',
			templateUrl: paths.tpl + 'login.html'
			// views: {
			// 	'': {
			// 		templateUrl: paths.tpl + 'home.html'
			// 	},
			// 	'main@index': {
			// 		templateUrl: paths.tpl + 'login.html'
			// 	}
			// }
		})
		.state('home', {
			url: '/home',
			views: {
				'': {
					templateUrl: paths.tpl + 'home.html'
				},
				'side@home': {
					templateUrl: paths.tpl + 'sidenav.home.html'
				},
				'main@home': {
					templateUrl: paths.tpl + 'content.home.html'
				}
			}
		})
});












