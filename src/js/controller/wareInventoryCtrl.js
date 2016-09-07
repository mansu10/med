app.controller('WareInventoryCtrl', function($scope,http){

	/**
	 * 输入框编辑模式
	 * @type {Boolean}
	 */
	$scope.editMode = false;
	$scope.editWare = function(){
		$scope.editMode = !$scope.editMode;
	}
	/**
	 * 添加模式
	 * @type {Boolean}
	 */
	$scope.addNewMode = true;

	/**
	 * 切换显示模式
	 */
	$scope.toggleMode = function(bool){
		$scope.addNewMode = bool;
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