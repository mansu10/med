app.controller('WareInventoryCtrl', function($scope,http){

	$scope.states = {
		// 进入状态详细信息隐藏
		basicState : false,
		// 编辑模式状态
		editMode : false,
		// 添加模式状态
		addNewMode : true,
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
})