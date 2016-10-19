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
					alert("查询成功");
					$scope.guaranteeRelationShips = respone.guaranteeRelationShips;
				},
				function(respone) {
					alert(JSON.stringify(respone));
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
				alert("请先选择删除项！！")
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
				alert("提交的删除项编号为空，请检查后重新提交！！")
				return;
			}
			http.post({
				'method': 'deleteGuaranteeRelationShip',
				'ids': deleteID.substring(0, deleteID.length - 1)
			}, URL.GuaranteeRelationShipServlet).then(
				function(respone) {
					alert("删除成功");
				},
				function(respone) {
					alert(JSON.stringify(respone));
				});

			$scope.selected = [];
		}
		/************************选择删除  end*****************************/
	
})