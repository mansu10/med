app.controller('AllocateGoodsCtrl', function($scope,http,$timeout,$location){

	$scope.stateFactory = {
		"query": true,
		"print": false,
		"record": false
	}
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
		} else{
			
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
				'orderTimeEnd':$scope.queryItem.orderTimeEnd
			}, URL.OrderServlet).then(
				function(respone) {
					alert("查询成功");
					$scope.goods = respone.orders;
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	}
	
	//打印拣货单
	var printOrder = function(orderCode){
		http.post({
				'method': 'findPickListsByOrderCode',
				'orderCode': orderCode
			}, URL.PickListServlet).then(
				function(respone) {
					alert("拣货单查询成功");
					$scope.printOrders = respone.pickLists;
					
					$timeout(function() {
						createbcTarget($scope.printOrders);
            		}, 1000);
				},
				function(respone) {
					alert(JSON.stringify(respone));
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
	

	/*print页使用*/

	/**
	 * 获取URL参数
	 * @param {[type]} name [description]
	 */
	 function getUrlParams(name){
	 	return $location.search()[name];
	 }
	 $scope.orderToPrint = [];

	 if (!getUrlParams('type')) {
	 	return;
	 } else {
	 	var printType = getUrlParams('type');

	 	if (printType == 0) {
	 		$scope.orderToPrint = $scope.printOrders;
	 	}else{
	 		var printItem = parseInt(Number(getUrlParams('item')));
	 		$scope.orderToPrint.push($scope.printOrders[printItem]);
	 	}
	 }

})
