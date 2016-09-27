var app = angular.module('app', [

// 'ngRoute', 'filters', 'service', 'directives'
	'ui.router',
	// 'angular-datepicker'
	'angularjs-datetime-picker',
	'ui.tree'

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
		.state('mode', {
			url: '/mode',
			templateUrl: paths.part + 'mode.html',
			controller:'ModeCtrl'
		})
		.state('home', {
			url: '',
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
		// 集货管理
		.state('home.collectStorage',{
			url: '/collect/storage',
			templateUrl: paths.part + 'collect.storage.html',
			controller: 'CollectStorageCtrl'
		})
		.state('home.collectSupplement',{
			url: '/collect/supplement',
			templateUrl: paths.part + 'collect.supplement.html',
			controller: 'CollectSupplementCtrl'
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
			templateUrl: paths.part + 'order.audit.html',
			controller: 'OrderAuditCtrl'
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
		
		.state('home.wareEntry', {
			url: '/ware/entry',
			templateUrl: paths.part + 'ware.entry.html',
			controller: 'WareEntryCtrl'
		})
		.state('home.wareInventory', {
			url: '/ware/inventory',
			templateUrl: paths.part + 'ware.inventory.html',
			controller: 'WareInventoryCtrl'
		})
		.state('home.wareShelves', {
			url: '/ware/shelves',
			templateUrl: paths.part + 'ware.shelves.html',
			controller: 'WareShelvesCtrl'
		})
		.state('home.wareMaintain', {
			url: '/ware/maintain',
			templateUrl: paths.part + 'ware.maintain.html',
			controller: 'wareMaintainCtrl'
		})
		// 配送管理
		.state('home.distrLoad', {
			url: '/distr/load',
			templateUrl: paths.part + 'distr.load.html',
			controller: 'DistrLoadCtrl'
		})
		.state('home.distrVehicle', {
			url: '/distr/vehicle',
			templateUrl: paths.part +'distr.vehicle.html',
			controller: 'DistrVehicleCtrl'
		})
		.state('home.distrTransport', {
			url: '/distr/transport',
			templateUrl: paths.part +'distr.transport.html'
		})
		// 药材字典
		.state('home.dicSingle', {
			url: '/dic/single',
			templateUrl: paths.part + 'dic.single.html'
		})
		// 统计分析
		.state('home.statistics', {
			url: '/statistics'
		})
		// 用户管理
		.state('home.userInstitute', {
			url: '/user/institute',
			templateUrl: paths.part + 'user.institute.html'
		})
		.state('home.userTeacher', {
			url: '/user/teacher',
			templateUrl: paths.part + 'user.teacher.html'
		})
		.state('home.userStudent', {
			url: '/user/student',
			templateUrl: paths.part + 'user.student.html'
		})
});












