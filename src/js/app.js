var app = angular.module('app', [

// 'ngRoute', 'filters', 'service', 'directives'
	'ui.router',
	'ui.bootstrap',
	// 'angular-datepicker'
	'angularjs-datetime-picker',
	'ui.tree',
	'customFilter'

])
/**
* 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
* 这里的run方法只会在angular启动的时候运行一次。
* @param  {[type]} $rootScope
* @param  {[type]} $state
* @param  {[type]} $stateParams
* @return {[type]}
*/
app.run(function($rootScope, $state, $stateParams, $localstorage) {
	
	$rootScope.user = $localstorage.getObject('user');
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
		if(toState.name=='login' || toState.name == '404')return;// 如果是进入登录界面则允许
		// 如果用户不存在
		// alert($rootScope.user);
		// if(!$rootScope.user || !$rootScope.user.token){
		// 	event.preventDefault();// 取消默认跳转行为
		// 	$state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
		// }
		if (toState == 'home.userTeacher') {
			// $state.go("home.userStudent");
		}
		
	});	
});



var paths = {
	tpl: './src/template/',
	part: './src/template/parts/'
}
app.value("test",{"test":{}})
app.config(function($stateProvider, $urlRouterProvider) {
	//
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise('/404');
	//
	// Now set up the states
	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: paths.tpl + 'login.html',
			controller:'LoginCtrl'
		})
		.state('mode', {
			url: '/mode',
			templateUrl: paths.part + 'mode.html',
			controller:'ModeCtrl'
		})
		.state('404', {
			url: '/404',
			templateUrl: paths.tpl + '404.html'
		})
		// .state('print', {
		// 	url: '/print',
		// 	templateUrl: paths.part + 'load.query.print.html'
		// })
		.state('print', {
			url: '/print',
			views: {
				'': {
					templateUrl: paths.tpl + 'print.html',
					controller: function($state){

					}
				}
			}
		})
		.state('print.page', {
			url: '/page',
			templateUrl: paths.part + 'load.query.print.html'
		})
		.state('print.allocateGoods', {
			url: '/allocate/goods/?items',
			templateUrl: paths.part + 'allocate.goods.print.html',
			controller: 'PrintCtrl'
		})
		.state('print.allocateCheck', {
			url: '/allocate/check/?items',
			templateUrl: paths.part + 'allocate.check.print.html',
			controller: 'PrintCtrl'
		})
		.state('print.loadQuery', {
			url: '/load/query/?items',
			templateUrl: paths.part + 'load.query.print.html',
			controller: 'PrintCtrl'
		})
		// .state('print.allocateGoods', {
		// 	url: '/allocate/goods/:item',
		// 	templateUrl: paths.part + 'allocate.goods.print.html',
		// 	controller: 'PrintCtrl'
		// })
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
		//配载管理
		.state('home.loadSelect', {
			url: '/load/select',
			templateUrl: paths.part + 'load.select.html',
			controller: 'LoadSelectCtrl'
		})
		.state('home.loadQuery', {
			url: '/load/query',
			templateUrl: paths.part + 'load.query.html',
			controller: 'LoadQueryCtrl'
		})
		//配货管理
		.state('home.allocateGoods', {
			url: '/allocate/goods',
			templateUrl: paths.part + 'allocate.goods.html',
			controller: 'AllocateGoodsCtrl'
		})
		.state('home.allocateCheck', {
			url: '/allocate/check',
			templateUrl: paths.part + 'allocate.check.html',
			controller: 'AllocateCheckCtrl'
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
		// 运输管理
		.state('home.transVehicle', {
			url: '/trans/vehicle',
			templateUrl: paths.part + 'trans.vehicle.html',
			controller: 'TransVehicleCtrl'
		})
		.state('home.transLine', {
			url: '/trans/line',
			templateUrl: paths.part + 'trans.line.html',
			controller: 'TransLineCtrl'
		})
		.state('home.transDispatch', {
			url: '/trans/dispatch',
			templateUrl: paths.part + 'trans.dispatch.html',
			controller: 'TransDispatchCtrl'
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
			templateUrl: paths.part + 'dic.single.html',
			controller: 'DicSingleCtrl'
		})
		// 统计分析
		.state('home.statistics', {
			url: '/statistics'
		})
		// 机构管理
		.state('home.instSupply', {
			url: '/inst/supply',
			templateUrl: paths.part + 'inst.supply.html',
			controller: 'InstSupplyCtrl'
		})
		.state('home.instDemand', {
			url: '/inst/demand',
			templateUrl: paths.part + 'inst.demand.html',
			controller: 'InstDemandCtrl'
		})
		.state('home.instSafety', {
			url: '/inst/safety',
			templateUrl: paths.part + 'inst.safety.html',
			controller: 'InstSafetyCtrl'
		})
		// 用户管理
		.state('home.userTeacher', {
			url: '/user/teacher',
			templateUrl: paths.part + 'user.teacher.html',
			controller: 'UserTeacherCtrl'
		})
		.state('home.userStudent', {
			url: '/user/student',
			templateUrl: paths.part + 'user.student.html',
			controller: 'UserStudentCtrl'
		})
});












