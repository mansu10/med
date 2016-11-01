app.controller('AllocateCheckCtrl', function($scope,http){

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
	$scope.changeState = function(option){
	
		for(o in $scope.stateFactory){
			$scope.stateFactory[o] = false;
		}
		$scope.stateFactory[option] = true;
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
})