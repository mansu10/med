app.controller('AllocateGoodsCtrl', function($scope,http,$timeout,$location, $state,printlist){
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
					// $localstorage.setObject('prints',respone.pickLists);
					// test.test = respone.pickLists;
					printlist.set(respone.pickLists);
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
	
	//拣货记录
	var OrderNote = function(orderCode){
		http.post({
				'method': 'findPickListByOrderCode',
				'orderCode': orderCode
			}, URL.PickListServlet).then(
				function(respone) {
					alert("拣货记录查询成功！");
					$scope.OrderNote = respone.pickLists;
		
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	};
	
	$scope.updateOrderNote = function(){
		var temp = [];
		
		angular.forEach($scope.OrderNote.products,function(item){
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
					alert("拣货记录保存成功！");
					
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	}
	
	$scope.addPrintList = function(index){
		$state.go('print.allocateGoods',{item:index});
	}

})
