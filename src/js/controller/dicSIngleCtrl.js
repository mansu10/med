app.controller('DicSingleCtrl', function($scope,$rootScope, http, instruct){
	instruct.set(['']);
	$rootScope.$broadcast('instructChange');

	var currentIndex = 0;
	$scope.medList = [];
	$scope.editMode = true;
	$scope.addMode = false;

	$scope.midware = {
	}
	
	$scope.medTypeList = ['单品','成套'];
	
	function setMidware(item){
		$scope.midware = angular.copy(item);
	}
	
	function clearMidware(){
		$scope.midware = {};
	}


	/**
	 * 药材查询
	 * @type {Object}
	 */
	$scope.queryInfo = {
		'medName': '',
		'medType': ''
	}
	$scope.queryMed = function(){
		http.post({
				'method': 'queryProduct',
				'productName': $scope.queryInfo.medName,
				'herbsType': $scope.queryInfo.medType,
	            'agencyCode':$rootScope.user.agencyCode
			}, URL.ProductServlet).then(
				function(respone) {
					if (respone.code != 0) {
						popAlert(JSON.stringify(respone));
					}
					$scope.medList = respone.products;
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
			});
	}


	/**
	 * 显示详情
	 * @type {Boolean}
	 */
	$scope.detailState = false;
	$scope.toggleDetailState = function(bool) {
		
		$scope.detailState = bool;
	}

	/**
	 * 显示明细
	 * @param  {[type]} item [description]
	 * @return {[type]}      [description]
	 */
	$scope.showDetails = function(item,index){
		setMidware(item);
        currentIndex = index;
		$scope.toggleDetailState(true);
		backUpObj = angular.copy(item);
		$scope.addMode = false;
		$scope.editMode = true;
	}

	/**
	 * 新建单一药材
	 * @return {[type]} [description]
	 */
	$scope.openSingleDetail = function(){
		clearMidware();
		$scope.toggleDetailState(true);
		$scope.addMode = true;
		$scope.editMode = false;
	}

	/**
	 * 返回查询列表
	 * @return {[type]} [description]
	 */
	$scope.backToQuery = function(){

		$scope.toggleDetailState(false);
	}
	
	$scope.modifyDetail = function(){
		$scope.editMode = !$scope.editMode;
		if($scope.editMode){
			$scope.midware = angular.copy(backUpObj);
		}
	}
	var backUpObj;
	$scope.saveDetail = function(){
		if($scope.addMode){
			if(isEmptyValue($scope.midware)){
				return;
			}
			addMedList(angular.copy($scope.midware));
			return;
		}
		
		if(!$scope.editMode){//保存
			$scope.editMode = true;
			$scope.medList[currentIndex] = angular.copy($scope.midware)
			updateMedList($scope.midware);
		}else{//取消
			
		}
		
	}
	
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
	 * 根据编号删除对应的供应机构
	 */
	$scope.delMedListById = function() {

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
			var tempList = angular.copy($scope.medList);
			angular.forEach($scope.selected, function(item) { //根据坐标批量删除选择的机构 
				deleteID = tempList[item].id + ',' + deleteID;
				console.log("========= del ==========" + item);
				$scope.medList.splice(item, 1);
			});

			if(isEmptyValue(deleteID)) {
				popAlert("提交的删除项编号为空，请检查后重新提交！！")
				return;
			}
			http.post({
				'method': 'deleteProduct',
				'ids': deleteID.substring(0, deleteID.length - 1)
			}, URL.ProductServlet).then(
				function(respone) {
					popAlert("删除成功");
				},
				function(respone) {
					console.log("deleteSupplyAgency failed!" + JSON.stringify(respone));
					popAlert(JSON.stringify(respone));
					$scope.medList = tempList;
				});

			$scope.selected = [];
		}
		/************************选择删除  end*****************************/
	
	var updateMedList = function(item){
		http.post({
				'method': 'updateProduct',
				'product': JSON.stringify(item)
			}, URL.ProductServlet).then(
				function(respone) {
					popAlert("已更新修改！");
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
			});
	}
	
	var addMedList = function(item){
		http.post({
				'method': 'addProduct',
				'product': JSON.stringify(item),
		        'agencyCode':$rootScope.user.agencyCode
			}, URL.ProductServlet).then(
				function(respone) {
					popAlert("已添加！");
					$scope.midware.id = respone.id;
					$scope.medList.push(angular.copy($scope.midware));
					$scope.toggleDetailState(false);
				},
				function(respone) {
					popAlert(JSON.stringify(respone));
			});
	}
//	$scope.medList = [
//      {
//          "id": 1,
//          "productCode": 10000001,
//          "ordinaryName": "4430吸头",
//          "productName": "待补",
//          "specifications": "规格",
//          "unit": "个",
//          "minPrice": 0,
//          "minVolume": 0,
//          "minNumber": 0,
//          "minWeight": 0,
//          "price": 1.5,
//          "volume": 0,
//          "weight": 0,
//          "firstLevel": "试剂耗材",
//          "secondLevel": "耗材",
//          "manufactor": "厂家",
//          "approvalNumber": null,
//          "validity": 36,
//          "unitDose": 0,
//          "averageDose": 0,
//          "averageNumber": 0,
//          "maxNumber": 0,
//          "createTime": null,
//          "model": "型号",
//          "minStock": 0,
//          "maxStock": 0,
//          "supplier": null,
//          "herbsType": "单一",
//          "controlCode": null,
//          "unityProductCode": null,
//          "pinyinCode": null,
//          "thirdLevel": null,
//          "managementClassification": null,
//          "storageCoditions": null,
//          "storageMin": 0,
//          "storageMax": 0,
//          "standard1": null,
//          "standard2": null,
//          "standard3": null,
//          "standard4": null,
//          "standard5": null,
//          "specificationSets": null,
//          "caseType": null,
//          "caseNumber": 0,
//          "singleBoxVolume": 0,
//          "setVolume": 0,
//          "setPrice": 0,
//          "setWeight": 0,
//          "formulations": null,
//          "manufactorCode": null,
//          "minUnit": null,
//          "minConversionRatio": 0,
//          "material": null,
//          "minMaterial": null,
//          "maxUnit": null,
//          "maxConversionRatio": 0,
//          "maxLength": 0,
//          "maxWidth": 0,
//          "maxHeigth": 0,
//          "locatorCode": null
//      }]
	

})