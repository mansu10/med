app.controller('OrderQueryCtrl', function($rootScope, $scope,http,$localstorage){
	$scope.modalToggle = function(bool,item){
		$scope.modalState = bool;
		$scope.modalInfo = item;
	}
	var $user = $localstorage.getObject('user');
	var lists = [
	// {
	// 	id:1,
	// 	shipMethod:"专门",
 	//  payMethod:0,
 	//  shipTime:"",
 	//  level:0,
 	//  oldOrderId:0,
 	//  orderMark:0,
	// 	orderTime: '2016-07-25 10:00:00',
	// 	deliveryTime: '2016-08-03 10:00:00',
	// 	customerCode: '90010011',
	// 	customerName: '团救护所1',
	// 	receiver: '王大锤',
	// 	tel: '111111111111111',
	// 	receiveMode: 'header1',
	// 	receiptAddress: '地1',
	// 	orderStatus: '已审核',
	// 	memo: 'hello',
	// 	orderProgress: '在配货',
	// 	orderCode:'2016080210'
	// }
	];
	
//	$scope.orderList = lists;
	
	$scope.qureyInfo = {
	    'method':'queryAllOrders',
        'agencyCode':$user.agencyCode
	}
	
//	$scope.orderQurey = function() {
			
			http.post($scope.qureyInfo,URL.orderQurey).then(
				function(respone) {
					// console.log(JSON.stringify(respone));
					$scope.orderList = respone.order;
					lists = respone.order;
//					popAlert("查询成功！")	
				},
				function(respone) {
					console.log("Order qurey failed!" + JSON.stringify(respone));
					$scope.orderList = lists;
					popAlert("操作失败："+JSON.stringify(respone));
			});
//		}
	
	$scope.filters = {
		key:'all',
		value:''
	};
	
	//查询状态
	$scope.qureyParam = [
		{key:'all',value:'全部'},
		{key:'orderStatus',value:'未审核'},
		{key:'orderStatus',value:'已审核'},
		{key:'orderStatus',value:'有疑问'},
		{key:'orderProgress',value:'在配货'},
		{key:'orderProgress',value:'在集货'},
		{key:'orderProgress',value:'在装载'},
		{key:'orderProgress',value:'在运输'}
	];
	
	//时间状态
	$scope.times = [{tip:'6小时 |',hours:6},{tip:'12小时 |',hours:12},{tip:'24小时 |',hours:24},
					{tip:'48小时|',hours:48},{tip:'72小时 ',hours:72}]
	
	//根据条件过滤订单
	$scope.filterOrder = function(obj){
		var tempArray = [];
		if(obj.key == 'all'){
			$scope.orderList = lists;
			return ;
		}
		angular.forEach(lists,function(item){
			if(item[obj.key] == obj.value){
				tempArray.push(item);
			}
		});
		$scope.orderList = tempArray;
		if(isEmptyValue(tempArray)){
			popAlert('没有查询到相符合的订单！');
		}
	};
	

	// 根据交货时间查询
	$scope.filterTime = function(hours){
		
		var temp = [];
		var timestamp = Date.parse(new Date());
		timestamp = timestamp / 1000;
		
		angular.forEach(lists,function(item){
			var timestamp2 = Date.parse(new Date(item.deliveryTime));
			timestamp2 = timestamp2/1000;
			console.log("timestamp is "+timestamp+ " / timestamp2:"+timestamp2);
			var ll = parseInt((timestamp2 - timestamp) / 60 / 60);
			console.log("hours is "+ll+ " / hour:"+hours);
			if(Math.abs(ll) < hours){
				temp.push(item);
			}
		});
		$scope.orderList = temp;
		if(isEmptyValue(temp)){
			popAlert(hours+'小时内没有订单！');
		}
	};
	
	//根据收单时间查询
	$scope.qureyByOrderTime = function(){
		var temp = [];
		if(isEmptyValue($scope.date1)){
			popAlert('请输入收单开始日期！');
			return;
		}
		if(isEmptyValue($scope.date2)){
			popAlert('请输入收单结束日期！');
			return;
		}
		var time1 = Date.parse(new Date($scope.date1));
		var time2 = Date.parse(new Date($scope.date2));
		console.log("data1 is "+time1+"===date2 is "+time2);
		angular.forEach(lists,function(item){
			var time = Date.parse(new Date(item.orderTime));
			if(time < time2 && time >time1){
				temp.push(item);
			}
		});
		$scope.orderList = temp;
		if(isEmptyValue(temp)){
			popAlert('该时间段内没有订单！');
		}
	}
	
})