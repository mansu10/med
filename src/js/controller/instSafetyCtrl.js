app.controller('InstSafetyCtrl', function($scope,http){

	$scope.addNewState = false;

	$scope.toggleAddNewState = function(bool) {
		
		$scope.addNewState = bool;
	}
	
	$scope.demandAgencyName = '';
	$scope.supplyAgencyCode = '';

	$scope.qurey = function(){
		
		http.post({
				'method': 'findAllGuaranteeRelationShips',
				'demandAgencyName': $scope.demandAgencyName,
				'supplyAgencyCode': $scope.supplyAgencyCode
			}, URL.GuaranteeRelationShipServlet).then(
				function(respone) {
					popAlert("查询成功");
					$scope.guaranteeRelationShips = respone.guaranteeRelationShips;
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
			});
	};
	
	$scope.guaranteeRelationShips = [
//      {
//          "id": 3,
//          "createTime": "2016-10-13",
//          "demandAgencyCode": "B00002",
//          "supplyAgencyCode": "G00001",
//          "demandAgencyName": null,
//          "demandAgencyAddress1": null,
//          "supplyAgencyName": "东区药检所",
//          "supplyAgencyAddress1": "浙江省湖州市吴兴区"
//      }
    ]
	

	/************************选择删除  start*****************************/
	$scope.selected = [];
	var updateSelected = function(action, index) {
		var id = index;
		if(action == 'add' && $scope.selected.indexOf(id) == -1) {
			$scope.selected.push(id);
		}
		if(action == 'remove' && $scope.selected.indexOf(id) != -1) {
			var idx = $scope.selected.indexOf(id);
			$scope.selected.splice(idx, 1);
		}
		console.log("=========$scope.selected==========" + JSON.stringify($scope.selected));
	}

	$scope.updateSelection = function($event, index) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, index);
	}

	$scope.isSelected = function(id) {
		return $scope.selected.indexOf(id) >= 0;
	}

	/**
	 * 根据编号删除对应的保障
	 */
	$scope.delGuaranteeRelationShip = function() {

			var deleteID = '';
			if(isEmptyValue($scope.selected)) {
				popAlert("请先选择删除项！！")
				return;
			}
			$scope.selected.sort( // 数组批量删除必须降序排序  不然会出问题
				function(a, b) {
					return b - a
				}
			);
			console.log("=========$scope.selected del ==========" + JSON.stringify($scope.selected));
			var tempList = angular.copy($scope.guaranteeRelationShips);
			angular.forEach($scope.selected, function(item) { //根据坐标批量删除选择的机构 
				deleteID = tempList[item].id + ',' + deleteID;
				console.log("========= del ==========" + item);
				$scope.guaranteeRelationShips.splice(item, 1);
			});

			if(isEmptyValue(deleteID)) {
				popAlert("提交的删除项编号为空，请检查后重新提交！！")
				return;
			}
			http.post({
				'method': 'deleteGuaranteeRelationShip',
				'ids': deleteID.substring(0, deleteID.length - 1)
			}, URL.GuaranteeRelationShipServlet).then(
				function(respone) {
					popAlert("删除成功");
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
				});

			$scope.selected = [];
		}
		/************************选择删除  end*****************************/
		
		var findAllSupplyAndDemands = function(){
			http.post({
				'method': 'findAllSupplyAgencyAndDemandAgencyCodes'
			}, URL.SupplyAgencyServlet).then(
				function(respone) {
					$scope.addInfoFilter.supplyAgencyCodes = respone.supplyAgencyCodes;
					$scope.addInfoFilter.demandAgencyCodes = respone.demandAgencyCodes;
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
				});
		}		
		$scope.addInfoFilter = {
			"supplyAgencyCodes":[],
			"demandAgencyCodes":[]
		}
		
		findAllSupplyAndDemands();

		$scope.newRelation = {'demandAgencyCode':'1','supplyAgencyCode':'2'};
		$scope.createNewRelation = function(){
			console.log("createNewRelation")
			if(isEmptyValue($scope.newRelation.supplyAgencyCode)){
				popAlert('请输入供应机构');
				return;
			}
			
			if(isEmptyValue($scope.newRelation.demandAgencyCode)){
				popAlert('请输入需求机构');
				return;
			}
			
			if($scope.addInfoFilter.supplyAgencyCodes.indexOf($scope.newRelation.supplyAgencyCode) == -1){
				popAlert('输入的供应机构不存在，请查证后重新输入！！！');
				return;
			}
			
			if($scope.addInfoFilter.demandAgencyCodes.indexOf($scope.newRelation.demandAgencyCode) == -1){
				popAlert('输入的需求机构不存在，请查证后重新输入！！！');
				return;
			}
			
			http.post({
				'method': 'addGuaranteeRelationShip',
				'guaranteeRelationShip': JSON.stringify($scope.newRelation)
			}, URL.GuaranteeRelationShipServlet).then(
				function(respone) {
					popAlert("建立成功！！！");
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
			});
		}
		
	
})