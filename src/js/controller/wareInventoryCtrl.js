app.controller('WareInventoryCtrl', function($scope,http){

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
	 	 	'id': '01',
	 	 	'name': '战备药材库',
	 	 	'type': '战备药材',
	 	 	'address': '地址地址',
	 	 	'category': '品类品类',
	 	 	'charge': '负责人',
	 	 	'length': '内长',
	 	 	'width': '内宽',
	 	 	'height': '内高',
	 	 	'area': '使用面积'

	 	 },{
	 	 	'id': '02',
	 	 	'name': '战备药材库2',
	 	 	'type': '战备药材2',
	 	 	'address': '地址地址2',
	 	 	'category': '品类品类2',
	 	 	'charge': '负责人2',
	 	 	'length': '内长2',
	 	 	'width': '内宽',
	 	 	'height': '内高',
	 	 	'area': '使用面积'

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
		catInfoByCode(item.id);
    }
	$scope.selectWare = function(index){
		$scope.states.editMode = false;
		$scope.toggleMode(false);
		$scope.states.currentWare = index;
	}
	$scope.saveEditWare = function(){

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
	
	http.post({
				'method':'queryAllDepots'
			},URL.DepotServlet).then(
				function(respone) {
					refreshWareList(respone.depots);
					console.log("=========货位管理========="+JSON.stringify(respone));
				},
				function(respone) {
					console.log("addReceiptAcceptanceRecord failed!" + JSON.stringify(respone));
					alert(respone);
		});
		
	function refreshWareList(items){
		angular.forEach(items,function(item){
			$scope.wareList.push({
				'id': item.id,
		 	 	'name': item.depotName,
		 	 	'type': item.depotType,
		 	 	'address': item.depotAddress,
		 	 	'category': item.depotType,
		 	 	'charge': item.pricipal,
		 	 	'length': item.depotLength,
		 	 	'width': item.depotWidth,
		 	 	'height': item.depotHeigth,
		 	 	'area': item.cargoAreas
			})
		})
	}
	
	function catInfoByCode(codeNum){
		
		http.post({
				'method':'findDepotByCode',
				'depotCode':codeNum
			},URL.DepotServlet).then(
				function(respone) {
					$scope.selectedList.cargoAreas = respone.depots.cargoAreas;
					console.log("=========货位管理byId========="+JSON.stringify(respone));
				},
				function(respone) {
					console.log("addReceiptAcceptanceRecord failed!" + JSON.stringify(respone));
					alert(respone);
		});
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
	
	
})