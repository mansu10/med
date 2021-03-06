app.controller('WareInventoryCtrl', function($rootScope, $scope,http){

	var currentDepotCode;
	$scope.states = {
		// 进入状态详细信息隐藏
		basicState : false,
		// 编辑模式状态
		editMode : false,
		// 添加模式状态
		addNewMode : false,
		// 当前选中仓库
		currentWare : -1

	}

	/**
	 * 输入框编辑模式
	 * @type {Boolean}
	 */
	$scope.editWare = function(){
		if (!$scope.states.addNewMode) {
			$scope.states.editMode = !$scope.states.editMode;			
		}

	}
	/**
	 * 新增模式
	 * @type {Boolean}
	 */
	$scope.addWare = function(){
		$scope.toggleMode(true);
		$scope.states.basicState = true;
		$scope.hasSaveDepot = false;
//		$scope.newDepot = {};
		clearList();
	}
	/**
	 * 切换显示模式
	 * ｛新建/编辑｝
	 */
	$scope.toggleMode = function(bool){
		$scope.states.addNewMode = bool;
	}

	/**
	 * 仓库列表
	 */
	$scope.wareList = [{
	        "id": 1,
	        "depotCode": 12,
	        "depotName": "测试仓库",
	        "depotType": "品类",
	        "depotAddress": "东大街1号",
	        "principal": null,
	        "depotLength": 0,
	        "depotWidth": 0,
	        "depotHeigth": 0,
	        "depotVolume": 0,
	        "cargoAreas": null,
	        "depotNumber": 0,
	        "reservoirs": null,
	        "depotCount": 0
    	}];

	$scope.selectedList = {};
    $scope.updateSelection = function($event, item, index){
        var checkbox = $event.target;
        $scope.states.basicState = true;
		$scope.states.editMode = false;
		$scope.toggleMode(false);
        $scope.selectedList = {};
        $scope.selectedList = angular.copy(item);
		$scope.states.currentWare = index;
		catInfoByCode(item.depotCode);
		queryAllShelfsByDepotCode(item.depotCode);
		catCargoAreaCodesByDepotCode(item.depotCode);
    }
	$scope.selectWare = function(index){
		$scope.states.editMode = false;
		$scope.toggleMode(false);
		$scope.states.currentWare = index;
	}
	

	/**
	 * [addNewArea description]
	 */
	$scope.newAreaList = {};
	$scope.isNewArea = false;
	$scope.addNewArea = function(){
		$scope.isNewArea = !$scope.isNewArea;
	}
	$scope.saveNewArea = function(){
		// 
		$scope.isNewArea = false;
	}

	$scope.newShelveList = {};
	$scope.isNewShelve = false;
	$scope.addNewShelve = function(){
		$scope.isNewShelve = !$scope.isNewShelve;
	}
	$scope.saveNewShelve = function(){
		// 
		$scope.isNewShelve = false;
	}
	
	/**********************************************************************
	 *****************************查看仓库 **********************************
	 ***********************************************************************/
	
	http.post({
				'method':'queryAllDepots',
	            'agencyCode':$rootScope.user.agencyCode
			},URL.DepotServlet).then(
				function(respone) {
					$scope.wareList = respone.depots;
					
				},
				function(respone) {
					console.log("queryAllDepots failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
		
	/**
	 * 根据仓库编号查询仓库详细信息
	 * @param {depotCode} -仓库编号
	 * @return {无返回}
	 */
	function catInfoByCode(depotCode){
		currentDepotCode = depotCode;
		http.post({
				'method':'findDepotByCode',
				'depotCode':depotCode,
	            'agencyCode':$rootScope.user.agencyCode
			},URL.DepotServlet).then(
				function(respone) {
					$scope.selectedList.cargoAreas = respone.depots.cargoAreas;
					createLocatorList($scope.selectedList.cargoAreas);//生成货位表
					popAlert("仓库查询完成！")
				},
				function(respone) {
					console.log("findDepotByCode failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	
	/**
	 * 根据仓库列表生成货位信息
	 * @param {cargoAreasList} -仓库列表
	 * @return {无返回}
	 */
	function createLocatorList(cargoAreasList){
		var temp = [];
		angular.forEach(cargoAreasList,function(item){
			temp = temp.concat(item.locators);
		});
		$scope.locators = temp;
		console.log("========create locators========"+JSON.stringify(temp));
	}
	
//	{
//  "code": 0,
//  "depots": {
//      "id": 1,
//      "depotCode": 12,
//      "depotName": "药品常温库",
//      "depotType": "1",
//      "depotAddress": "东大街1号",
//      "pricipal": "负者人",
//      "depotLength": 200,
//      "depotWidth": 60,
//      "depotHeigth": 200,
//      "depotVolume": 2400000,
//      "cargoAreas": [
//          {
//              "id": 1,
//              "depotCode": 12,
//              "cargoAreaCode": "A",
//              "cargoAreaName": "口服剂型区",
//              "cargoAreaDesc": "口服剂",
//              "shelfCount": 3,
//              "locatorCount": 13,
//              "boxCount": 0
//          },
//          {
//              "id": 2,
//              "depotCode": 12,
//              "cargoAreaCode": "B",
//              "cargoAreaName": "针剂输液去",
//              "cargoAreaDesc": "针剂",
//              "shelfCount": 1,
//              "locatorCount": 3,
//              "boxCount": 0
//          }
//      ],
//      "depotNumber": 0,
//      "reservoirs": null,
//      "depotCount": 0
//  }
//}
/***************************************************************************
*****************************新建仓库 start**********************************
****************************************************************************/      
	$scope.hasSaveDepot = false;
	$scope.newDepot = {
						"id": null,
				        "depotCode": null,
				        "depotName": null,
				        "depotType": null,
				        "depotAddress": null,
				        "principal": null,
				        "depotLength": null,
				        "depotWidth": null,
				        "depotHeigth": null,
				        "depotVolume": null,
				        "cargoAreas": null,
				        "depotNumber": null,
				        "reservoirs": null,
				        "depotCount": null
				};
	/**
	 * 新增仓库 保存
	 * @return {无返回}
	 */
	$scope.addNewDepot = function(){
		if(isEmptyValue($scope.newDepot)){
			popAlert("仓库信息不能为空！");
			return;
		}

		if(isEmptyValue($scope.wareList)){
			$scope.newDepot.id = 1;
		}else{
			$scope.newDepot.id = $scope.wareList[$scope.wareList.length-1].id + 1;
		}

		$scope.wareList.push(angular.copy($scope.newDepot));
	
		$scope.hasSaveDepot = true;
		
		$scope.newDepot.agencyCode = $rootScope.user.agencyCode;
		http.post({
				'method':'addDepot',
				'depot':JSON.stringify($scope.newDepot)
			},URL.DepotServlet).then(
				function(respone) {
					console.log("=========新建仓库========="+JSON.stringify(respone));
					popAlert("新建仓库保存成功！");
				},
				function(respone) {
					console.log("addDepot failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	
	//新建货区
	$scope.selectCargoAreaList = [],//货区选择列表
	$scope.addCargoAreas = [
//	    {
//	        'depotCode': null,
//	        'cargoAreaName': null,
//	        'cargoAreaCode': null,
//	        'cargoAreaDesc': null
//	    }
	],
	
	$scope.newCargoArea = {
//		'depotCode': null,
//	    'cargoAreaName': null,
//	    'cargoAreaCode': null,
//	    'cargoAreaDesc': null
	},

	/**
	 * 新增货区 保存
	 * @return {无返回}
	 */
	$scope.addNewCargoArea = function(){
		if(isEmptyValue($scope.newDepot)){
			popAlert("请先输入仓库基本信息，并保存！");
			return;
		}
		$scope.newCargoArea.depotCode = angular.copy($scope.newDepot).depotCode;
		$scope.addCargoAreas.push(angular.copy($scope.newCargoArea));
		$scope.newCargoArea = {}; 
		
	}
	$scope.editNewCargoArea = true;
	$scope.cancelCargoArea = function(type,index){
		switch(type){
			case 0:
				$scope.isNewArea = !$scope.isNewArea;
				break;
			case 1:
				$scope.addCargoAreas.splice(index,1);
				break;
			case 2:
				break;
		}
	}
	$scope.editCargoArea = function(){
		$scope.editNewCargoArea = !$scope.editNewCargoArea;
	}
	
	$scope.saveNewCargoAreas = function(){
		if(isEmptyValue($scope.newDepot)){
			popAlert("请先输入仓库基本信息，并保存！");
			return;
		}
		$scope.isNewArea = false;
		if(isEmptyValue($scope.addCargoAreas)){
			popAlert('货区信息不能为空！');
			return;
		}
		
		http.post({
				'method':'addCargoArea',
				'cargoAreas':JSON.stringify($scope.addCargoAreas),
		        'agencyCode':$rootScope.user.agencyCode
			},URL.CargoAreaServlet).then(
				function(respone) {
					console.log("=========新建货区========="+JSON.stringify(respone));
					popAlert('操作成功！');
				//	$scope.selectCargoAreaList = angular.copy($scope.addCargoAreas);
					createSelectCargoAreaList(angular.copy($scope.addCargoAreas));
				},
				function(respone) {
					console.log("CargoAreaServlet add failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	
	function createSelectCargoAreaList(objs){
		angular.forEach(objs, function(data,index,array){
			//data等价于array[index]
			if(!isInArray($scope.selectCargoAreaList,{'cargoCode':data.cargoAreaCode})){
				$scope.selectCargoAreaList.push({'cargoCode':data.cargoAreaCode})
			}
		});
		console.log("$scope.selectCargoAreaList:"+JSON.stringify($scope.selectCargoAreaList));
	}
	$scope.selectCargoArea = function(item,index){
		
		if ($scope.states.addNewMode) {	
			$scope.addShelfList[index].cargoAreaCode = item.cargoAreaCode.cargoCode;
			console.log("添加模式："+JSON.stringify($scope.addShelfList[index]));
		}else{
			//$scope.addAdjustShelfList[index].cargoAreaCode = item.cargoAreaCode.cargoCode;
			console.log("调整模式："+JSON.stringify($scope.addAdjustShelfList[index]));	
		}
		
	}
	
	/**
	 * 新增货架
	 */
	$scope.addShelfList = [
//	     {
//	        'shelfSpecification': 2,
//	        'shelfLayer': 2,
//	        'shelfCount': 2
//  	}
	],
	
	$scope.newShelft = {
//			'shelfSpecification': 2,
//	        'shelfLayer': 2,
//	        'shelfCount': 2
	}
	
	$scope.addNewShelft = function(){
		if(isEmptyValue($scope.newDepot)){
			popAlert("请先输入仓库基本信息，并保存！");
			return;
		}
		
		if(isEmptyValue($scope.newShelft)){
			popAlert("请填写货架信息！");
			return;
		}
		
		$scope.newShelft.depotCode = angular.copy($scope.newDepot).depotCode;
		$scope.newShelft.shelfCode = $scope.addShelfList.length + 1;
		$scope.addShelfList.push(angular.copy($scope.newShelft));
		$scope.newShelft = {}; 
		
		console.log("------$scope.addShelfList------"+JSON.stringify($scope.addShelfList))
		
	}
	$scope.editNewShelft = true;
	$scope.cancelShelft = function(type,index){
		switch(type){
			case 0:
				$scope.isNewShelve = !$scope.isNewShelve;
				break;
			case 1:
				$scope.addShelfList.splice(index,1);
				break;
			case 2:
				break;
		}
	}
	$scope.editShelft = function(){
		$scope.editNewShelft = !$scope.editNewShelft;
	}
	
	$scope.saveNewShelft = function(){
		if(isEmptyValue($scope.newDepot)){
			popAlert("请先输入仓库基本信息，并保存！");
			return;
		}
		$scope.isNewShelve= false;
		if(isEmptyValue($scope.addShelfList)){
			popAlert('货架信息为空！');
			return;
		}
		
		http.post({
				'method':'addShelf',
				'shelfs':JSON.stringify($scope.addShelfList),
		        'agencyCode':$rootScope.user.agencyCode
			},URL.ShelfServlet).then(
				function(respone) {
					console.log("=========新建货架========="+JSON.stringify(respone));
					// popAlert(JSON.stringify(respone));
					//货区调整 / 分配
					$scope.addNewShelfs = angular.copy($scope.addShelfList);
				},
				function(respone) {
					console.log("addShelf add failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	
	/**
	 * 根据仓库编号查询货位   货位分配/调整  货位下拉列表
	 * @param {depotCode} -仓库编号
	 * @return {无返回}
	 */	
	function catCargoAreaCodesByDepotCode(depotCode){//货位查询
		http.post({
				'method':'findCargoAreaCodesByDepotCode',
				'depotCode':depotCode,
		        'agencyCode':$rootScope.user.agencyCode
			},URL.CargoAreaServlet).then(
				function(respone) {
					console.log("=========货区分配========="+JSON.stringify(respone));
					$scope.cargoAreaAssignArray = respone.cargoAreaCodes;
					/*angular.forEach(respone.cargoAreaCodes,function(item){
						$scope.cargoAreaAssignArray.push({
							'cargoCode':item
						});
					});
					*/
					console.log("=========$scope.cargoAreaAssignArray========="+JSON.stringify($scope.cargoAreaAssignArray));
					// popAlert("findCargoAreaCodesByDepotCode success!")
				},
				function(respone) {
					console.log("CargoAreaServlet failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
		
	/*
	 * 根货位分配/调整  保存
	 */	
	$scope.updateCargoAreaCodes = function(){
		var shlfsStr = '';
		if ($scope.states.addNewMode) {		
			shlfsStr = JSON.stringify($scope.addShelfList)
		}else{
			shlfsStr = JSON.stringify($scope.addAdjustShelfList)
		}
		
		http.post({
				'method':'updateShelf',
				'shelfs':shlfsStr
			},URL.ShelfServlet).then(
				function(respone) {
					console.log("=========updateShelf========="+JSON.stringify(respone));
					popAlert('操作成功！');
				},
				function(respone) {
					console.log("updateShelf failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
		
//		"shelfs": [
//      {
//          "shelfCode": 1,
//          "shelfName": null,
//          "shelfSpecification": 0,
//          "shelfLayer": 4,
//          "cargoAreaCode": null,
//          "shelfStorageCategory": null,
//          "locators": null,
//          "shelfNumber": null,
//          "shelfCount": 0,
//          "locatorCount": 0,
//          "layers": null
//			"cargoAreaOptions":[]
//      },
		
	function clearList(){
		$scope.newDepot = {};
		
		$scope.addCargoAreas = [];
		$scope.newCargoArea = {};
		
		$scope.addShelfList = [];
		$scope.newShelft = {};
		
		$scope.addNewShelfs = [];
		
		$scope.isNewAdjustShelve = false;
			
	}
/**********************************************************************
*****************************调整仓库 **********************************
***********************************************************************/

	/**************************************调整货仓 start*********************************************/
	
	/**
	 * 仓库调整
	 */
	$scope.saveEditWare = function(){
		if ($scope.states.addNewMode) {
			return;	
		}
		
		$scope.states.editMode = !$scope.states.editMode;
		$scope.wareList[$scope.states.currentWare] = angular.copy($scope.selectedList);
		
		http.post({
				'method':'updateDepot',
				'depot':JSON.stringify($scope.selectedList)
			},URL.DepotServlet).then(
				function(respone) {
					console.log("=========调整仓库========="+JSON.stringify(respone));
					popAlert('操作成功');
				},
				function(respone) {
					console.log("调整货仓库failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	/**************************************调整货仓 end*********************************************/
	
	
	/**************************************调整货区  start*********************************************/
	/**
	 * 调整货区 
	 */
	$scope.newCargoAreaAdjust = {};
	$scope.isNewAreaAdjust = false;
	
	$scope.editAdjustCargoArea = true;
	
	$scope.addCargoArea = function(){
		$scope.isNewAreaAdjust = !$scope.isNewAreaAdjust;
	}

	$scope.addAdjustCargoArea = function(){
		$scope.newCargoAreaAdjust.depotCode = currentDepotCode;
		$scope.selectedList.cargoAreas.push(angular.copy($scope.newCargoAreaAdjust));
		$scope.newCargoAreaAdjust = {}; 
	}
	
	$scope.cancelAdjustCargoArea = function(type,index){
		switch(type){
			case 0:
				$scope.isNewAreaAdjust = !$scope.isNewAreaAdjust;
				$scope.newCargoAreaAdjust = {};
				break;
			case 1:
				$scope.selectedList.cargoAreas.splice(index,1);
				break;
			case 2:
				break;
		}
	}
	
	$scope.editAdjust = function(){
		$scope.editAdjustCargoArea = !$scope.editAdjustCargoArea;
	}
	
	$scope.saveAdjustCargoAreas = function(){
		
		$scope.isNewAreaAdjust = false;
		if(isEmptyValue($scope.selectedList.cargoAreas)){
			popAlert('货区信息不能为空！');
			return;
		}
		
		http.post({
				'method':'updateCargoArea',
				'cargoAreas':JSON.stringify($scope.selectedList.cargoAreas)
			},URL.CargoAreaServlet).then(
				function(respone) {
					console.log("=========调整货区========="+JSON.stringify(respone));
					popAlert('操作成功');
				},
				function(respone) {
					console.log("updateCargoArea failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	/**************************************调整货区  end*********************************************/
	

	
	
	/**
	 * 调整货架
	 */
	//新建货架
	
	$scope.addAdjustShelfList = [
//	     {
//	        'shelfSpecification': 2,
//	        'shelfLayer': 2,
//	        'shelfCount': 2
//  	}
	],
	
	$scope.newAdjustShelft = {
//			'shelfSpecification': 2,
//	        'shelfLayer': 2,
//	        'shelfCount': 2
	}
	
	$scope.addNewAdjustShelve = function(){
		$scope.isNewAdjustShelve = !$scope.isNewAdjustShelve;
	}
	
	$scope.addNewAdjustShelft = function(){
		if(isEmptyValue($scope.newAdjustShelft)){
			popAlert("请填写货架信息！");
			return;
		}
		$scope.newAdjustShelft.depotCode = currentDepotCode;
		$scope.newAdjustShelft.shelfCode = $scope.addAdjustShelfList.length+1;
		
		$scope.addAdjustShelfList.push(angular.copy($scope.newAdjustShelft));
		$scope.newAdjustShelft = {}; 
		
		
	}
	$scope.editNewAdjustShelft = true;
	$scope.cancelAdjustShelft = function(type,index){
		switch(type){
			case 0:
				$scope.isNewAdjustShelve = !$scope.isNewAdjustShelve;
				break;
			case 1:
				$scope.addAdjustShelfList.splice(index,1);
				break;
			case 2:
				break;
		}
	}
	$scope.editAdjustShelft = function(){
		$scope.editNewAdjustShelft = !$scope.editNewAdjustShelft;
	}
	
	$scope.saveNewAdjustShelft = function(){
		
		$scope.isNewAdjustShelve= false;
		if(isEmptyValue($scope.addAdjustShelfList)){
			popAlert('货架信息为空！');
			return;
		}
		
		http.post({
				'method':'updateShelf',
				'shelfs':JSON.stringify($scope.addAdjustShelfList)
			},URL.ShelfServlet).then(
				function(respone) {
					console.log("=========调整货架修改提交========="+JSON.stringify(respone));
					// popAlert(JSON.stringify(respone));
				},
				function(respone) {
					console.log("addShelf add failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	
	function queryAllShelfsByDepotCode(depotCode){
		http.post({//货架查询
				'method':'queryAllShelfs',
				'depotCode':depotCode,
		        'agencyCode':$rootScope.user.agencyCode
			},URL.ShelfServlet).then(
				function(respone) {
					console.log("=========查询货架调整========="+JSON.stringify(respone));
					$scope.addAdjustShelfList = respone.shelfs;
					// popAlert("queryAllShelfsByDepotCode success!")
				},
				function(respone) {
					console.log("queryAllShelfs failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	
	
})