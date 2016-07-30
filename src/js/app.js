var app = angular.module('app', [

// 'ngRoute', 'filters', 'service', 'directives'
	'ui.router',
	'angular-datepicker'

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
	$rootScope.dateOptions = {
	  format: 'yyyy-mm-dd', // ISO formatted date
	  onClose: function(e) {
	    // do something when the picker closes   
	  }
	}
});

var paths = {
	tpl: './src/template/',
	part: './src/template/parts/'
}

app.config(function($stateProvider, $urlRouterProvider) {
	//
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise('/login');
	//
	// Now set up the states
	$stateProvider
		.state('index', {
			url: '/login',
			templateUrl: paths.tpl + 'login.html',
			controller:'LoginCtrl'
		})
		.state('home', {
			url: '/home',
			views: {
				'': {
					templateUrl: paths.tpl + 'content.html',
					controller: function($state){
						// $state.go('home.dashboard');
					}
				},
				'side@home': {
					templateUrl: paths.tpl + 'sidenav.html',
					controller: 'SideNavCtrl'
				},
				'header@home': {
					templateUrl: paths.tpl + 'header.html',
					controller: 'HeaderCtrl'
				}
			}
		})
		.state('home.dashboard',{
			url: '/dashboard',
			templateUrl: paths.part + 'dashboard.html'
		})
		// 订单部分
		.state('home.orderAdd',{
			url: '/order/add',
			templateUrl: paths.part + 'order.add.html',
			controller: 'OrderAddCtrl'
		})
		.state('home.orderQuery', {
			url: '/order/query',
			templateUrl: paths.part + 'order.query.html',
			controller: 'OrderQueryCtrl'
		})
		.state('home.orderAudit', {
			url: '/order/audit',
			templateUrl: paths.part + 'order.audit.html'
		})
		.state('home.orderRefund', {
			url: '/order/refund',
			templateUrl: paths.part + 'order.refund.html'
		})
		// 商店部分
		.state('home.storeSale', {
			url: '/store/sale'
		})
		.state('home.storeDisplay', {
			url: '/store/display'
		})
		// 商品管理
		.state('home.goodsSingle', {
			url: '/goods/single'
		})
		.state('home.goodsMulti', {
			url: '/goods/multi'
		})
		// 仓库部分
		.state('home.wareInventory', {
			url: '/ware/inventory'
		})
		.state('home.wareStorage', {
			url: '/ware/storage',
			templateUrl: paths.part + 'ware.storage.html'
		})
		// 配送管理
		.state('home.distrLoad', {
			url: '/distr/load'
		})
		.state('home.distrVehicle', {
			url: '/distr/vehicle',
			templateUrl: paths.part +'distr.vehicle.html'
		})
		// 统计分析
		.state('home.statistics', {
			url: '/statistics'
		})
		// 用户管理
		.state('home.userManage', {
			url: 'user/manage'
		})
});












