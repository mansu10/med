//var SideNavModule = angular.module('SideNavModule', []);
app.controller('SideNavCtrl', function($scope, $http, $state, $stateParams,$localstorage) {

		$scope.list = {
			"parent": {
						"title": "主页",
						"url": "index.html"
					},
					
			"items":[
//				{
//					"title": "商品管理",
//					"url": "javascript:;",
//					"isActive":false,
//					"icon":"fa fa-laptop",
//					"child": [{
//							"title": "单一商品",
//							"url": ".goodsSingle",
//							"isActive":false
//						},{
//							"title": "组合商品",
//							"url": ".goodsMulti",
//							"isActive":false
//					  }]					
//				},
//				{
//					"title": "客户管理",
//					"url": "javascript:;",
//					"isActive":false,
//					"icon":"fa fa-users",
//					"child": [{
//							"title": "客户管理",
//							"url": "./",
//							"isActive":false
//						}]					
//				},
//				{
//					"title": "店铺管理",
//					"url": "javascript:;",
//					"isActive":false,
//					"icon":"fa fa-book",
//					"child": [{
//							"title": "在售商品",
//							"url": ".storeSale",
//							"isActive":false
//						},{
//							"title": "商品陈列",
//							"url": ".storeDisplay",
//							"isActive":false
//					  }]					
//				},
				{
					"title": "集货管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-laptop",
					"child": [{
							"title": "库存查询",
							"url": "javascript:;",
							"isActive":false
						},{
							"title": "药材筹措",
							"url": "javascript:;",
							"isActive":false
					  }]					
				},
				{
					"title": "仓储管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-home",
					"child": [{
							"title": "验收入库",
							"url": "javascript:;",
							"isActive":false
						},{
							"title": "货位管理",
							"url": ".wareInventory",
							"isActive":false
					  	},
						{
							"title": "保管养护",
							"url": ".wareStorage",
							"isActive":false
					  	}]
				},
				{
					"title": "订单管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-cogs",
					"child": [{
							"title": "订单录入",
							"url": ".orderAdd",
							"isActive":false
						},{
							"title": "订单查询",
							"url": ".orderQuery",
							"isActive":false
					  },{
							"title": "订单审核",
							"url": ".orderAudit",
							"isActive":false
						}
//,{
//							"title": "退货处理",
//							"url": ".orderRefund",
//							"isActive":false
//					  }
					]
				},{
					"title": "配货管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-home",
					"child": [{
							"title": "订货分拣",
							"url": "javascript:;",
							"isActive":false
						},{
							"title": "复核装箱",
							"url": "javascript:;",
							"isActive":false
					  	}]					
				},
			
				{
					"title": "配载管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-truck",
					"child": [{
							"title": "订货配载",
							"url": ".distrLoad",
							"isActive":false
						}]					
				},
			
				
				{
					"title": "运输管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-truck",
					"child": [{
							"title": "车辆管理",
							"url": ".distrVehicle",
							"isActive":false
					  	},{
							"title": "配送区域",
							"url": "javascript:;",
							"isActive":false
						},{
							"title": "路线规划",
							"url": ".distrLoad",
							"isActive":false
						},{
							"title": "途中调度",
							"url": "javascript:;",
							"isActive":false
						},]					
				},{
					"title": "药材字典",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-bar-chart-o",
					"child": [{
							"title": "单一药材",
							"url": "javascript:;",
							"isActive":false
						},
						{
							"title": "组合药材",
							"url": "javascript:;",
							"isActive":false
						}]
				},{
					"title": "供应管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-shopping-cart",
					"child": [{
							"title": "受供单位",
							"url": "javascript:;",
							"isActive":false
						},{
							"title": "可供药材",
							"url": "javascript:;",
							"isActive":false
						}]					
				},{
					"title": "业务统计",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-user",
					"child": [
						{
							"title": "订单统计",
							"url": "javascript:;",
							"isActive":false
						},
						{
							"title": "保障能力",
							"url": "javascript:;",
							"isActive":false
						}]					
				},
				{
					"title": "用户管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-user",
					"child": [
						{
							"title": "供应机构",
							"url": "javascript:;",
							"isActive":false
						},
						{
							"title": "人员角色",
							"url": "javascript:;",
							"isActive":false
						}]					
				}
			]
		}
		$scope.isActive = false;
		$scope.listToggle = function(index){
			$scope.list.items[index].isActive = !$scope.list.items[index].isActive;
		}
	})
	
	