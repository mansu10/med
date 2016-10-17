app.controller('DicSingleCtrl', function($scope,http){


	$scope.medList = [];
	$scope.medList = [{
		'synType': 'zong',
		'firstClass': 'yijilei',
		'secondClass': 'erjilei'
	}]

	$scope.midware = {
		'recognizeCode':'',
		'barCode': '222',
		'compareCode': '',
		'pinyinCode': '',
		'commonName': '',
		'productName': ''
	}
	function setMidware(item){
		$scope.midware.barCode = item.synType;
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
		// http.post({
		// 	'medName': $scope.queryInfo.medName,
		// 	'medType': $scope.queryInfo.medType
		// },URL).then(
		// 	function(response){
		// 		$scope.medList = response.list;
		// 	}
		// )
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
	$scope.showDetails = function(item){
		setMidware(item);

		$scope.toggleDetailState(true);
	}

	/**
	 * 新建单一药材
	 * @return {[type]} [description]
	 */
	$scope.openSingleDetail = function(){
		clearMidware();
		$scope.toggleDetailState(true);
	}

	/**
	 * 返回查询列表
	 * @return {[type]} [description]
	 */
	$scope.backToQuery = function(){

		$scope.toggleDetailState(false);
	}

})