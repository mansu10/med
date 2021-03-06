app.controller('AllocateGoodsCtrl', function($localstorage,$scope,$rootScope, http,$timeout,$location, $state){
	$scope.stateFactory = {
		"query": true,
		"print": false,
		"record": false
	}
	var $user = $localstorage.getObject('user');
	/**
	 * 切换页面状态
	 * @param  {[type]} option [description]
	 * @return {[type]}        [description]
	 */
	$scope.changeState = function(option,orderCode){
	
		for(o in $scope.stateFactory){
			$scope.stateFactory[o] = false;
		}
		$scope.stateFactory[option] = true;
		if (option == 'print') {
			printOrder(orderCode);
		} else if(option == 'record'){
			OrderNote(orderCode);
		}
	}
	
	var code11 = function(id){
//		alert("生成条形码!");
//		id = "bcTarget";
		$('#'+id).empty().barcode(""+id, "code128",{barWidth:2, barHeight:30,showHRI:false});
	}

	/*查询*/
	$scope.queryItem = {
		'orderCode':"",
		'demandAgencyName': '',
		'orderTimeStart':'',
		'orderTimeEnd':''
	}
	$scope.queryAllOrdersWithDemandAgency = function(){
		http.post({
				'method': 'queryAllOrdersWithDemandAgency',
				'orderCode': $scope.queryItem.orderCode,
				'demandAgencyName': $scope.queryItem.demandAgencyName,
				'orderTimeStart':$scope.queryItem.orderTimeStart,
				'orderTimeEnd':$scope.queryItem.orderTimeEnd,
		        'agencyCode':$user.agencyCode
			}, URL.OrderServlet).then(
				function(respone) {
					popAlert("查询成功");
					$scope.goods = respone.orders;
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
			});
	}
	
	//打印拣货单
	var printOrder = function(orderCode){
		http.post({
				'method': 'findPickListsByOrderCode',
				'orderCode': orderCode
			}, URL.PickListServlet).then(
				function(respone) {
					popAlert("拣货单查询成功");
					$scope.printOrders = respone.pickLists;

					$timeout(function() {
						createbcTarget($scope.printOrders);
            		}, 1000);
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
			});
	};
	
	$scope.renderFinish = function(){
    	console.log('渲染完之后的操作');
	}
	
	var createbcTarget = function(items){
		angular.forEach(items,function(item){
			code11(item.pickListCode);
			console.log("----------------"+item.pickListCode);
		});
	}
	
	//拣货记录
	var OrderNote = function(orderCode){
		http.post({
				'method': 'findPickListByOrderCode',
				'orderCode': orderCode,
		        'agencyCode':$user.agencyCode
			}, URL.PickListServlet).then(
				function(respone) {

					if (respone.code == 0 && !!respone.pickLists) {
						popAlert("拣货记录查询成功！");
						$scope.OrderNote = respone.pickLists;	
					}else{
						popAlert("无相关拣货记录");
					}

		
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
			});
	};
	
	$scope.updateOrderNote = function(){
		var temp = [];
		// if (!!$scope.OrderNote.pickListItems) {return;}
		angular.forEach($scope.OrderNote.pickListItems,function(item){
			temp.push({
				'productCode':item.productCode,
				'pickListRecord':item.pickListRecord
			})
		});
		
		http.post({
				'method': 'updatePickListItem',
				'orderCode': $scope.OrderNote.orderCode,
				'pickListItems':JSON.stringify(temp)
			}, URL.PickListServlet).then(
				function(respone) {
					popAlert("拣货记录保存成功！");
					
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
			});
	}

	$scope.stringItemList = function(obj){
		return JSON.stringify(obj[index]);

	}
})
