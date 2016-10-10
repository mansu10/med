app.controller('DicSingleCtrl', function($scope,http){

	/**
	 * 新增单一药材
	 * @type {Boolean}
	 */
	$scope.detailState = false;
	$scope.toggleDetailState = function(bool) {
		
		$scope.detailState = bool;
	}
	/**
	 * 新增组合药材
	 * @type {Boolean}
	 */
	$scope.isMulti = false;
	$scope.openMultiDetail = function(){

		$scope.isMulti = true;
		$scope.toggleDetailState(true);

	}
	/**
	 * 返回查询列表
	 * @return {[type]} [description]
	 */
	$scope.backToQuery = function(){
		$scope.isMulti = false;
		$scope.toggleDetailState(false);
	}

	/**
	 * 添加明细
	 * @type {Boolean}
	 */
	$scope.isAddNewItem = false;
	$scope.addNewItem = function(){
		$scope.isAddNewItem = !$scope.isAddNewItem;
	}
})