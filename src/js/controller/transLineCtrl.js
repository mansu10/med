app.controller('TransLineCtrl', function($rootScope, $scope,http){
	//查询线路分配
	$scope.queryAllCarLines = function(){
			http.post({
					'method': 'findAllGuaranteeRelationShipsBySupplyAgencyCode',
					'supplyAgencyCode':'',
		            'agencyCode':$rootScope.user.agencyCode
				}, URL.GuaranteeRelationShipServlet).then(
					function(respone) {
						popAlert("查询线路分配完成");
						$scope.carLines = respone.guaranteeRelationShips;
					},
					function(respone) {
						popAlert("操作失败："+JSON.stringify(respone));
					});
	}
	$scope.queryAllCarLines();

	$scope.edit = function(index){
		$scope.carLines[index].transportRouteEdit = !$scope.carLines[index].transportRouteEdit;

	};

	$scope.update = function(index){
		console.log("update item :"+index);
		http.post({
					'method': 'updateGuaranteeRelationShip',
					'guaranteeRelationShip':getUpdateInfo($scope.carLines[index])
				}, URL.GuaranteeRelationShipServlet).then(
					function(respone) {
						popAlert("线路已更新");
						$scope.edit(index);
					},
					function(respone) {
						popAlert("操作失败："+JSON.stringify(respone));
					});
	};

	var getUpdateInfo = function(item){

		return JSON.stringify({
				'demandAgencyCode':item.demandAgencyCode,
				'supplyAgencyCode':item.supplyAgencyCode,
				'transportRoute':item.transportRoute
			})
	}

})