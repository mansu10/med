app.controller('InstSupplyCtrl', function($scope,http){

	$scope.detailState = false;

	$scope.toggleDetailState = function(bool) {
		
		$scope.detailState = bool;
	}


	/**
	 * 编辑模式
	 * @type {Boolean}
	 */
	$scope.editMode = true;

	$scope.toggleEditMode = function(bool) {
		$scope.editMode = bool;
	}

	/**
	 * 添加分组
	 * @type {Boolean}
	 */
	$scope.addGroupState = false;

	$scope.toggleAddGroupState = function(bool) {
		$scope.addGroupState = bool;
	}

	/**
	 * 添加岗位
	 * @type {Boolean}
	 */
	$scope.addPosiState = false;

	$scope.toggleAddPosiState = function(bool) {
		$scope.addPosiState = bool;
	}
	
	$scope.type = [
		'药材仓库',
		'药材供应站',
		'野战药材仓库',
		'野战药材保障队'
	],
	
	$scope.selectedName = '药材仓库';
})