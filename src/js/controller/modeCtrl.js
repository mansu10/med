app.controller('ModeCtrl', function($rootScope, $scope,http, $localstorage, $state){

	$scope.user = $localstorage.getObject('user');
	// console.log($scope.user);

	$scope.data = [{
		'title': '药材仓库',
		'nodes': [{
			'title': '第一药材仓库',
			'nodes': []
		},{
			'title': '第二药材仓库',
			'nodes': []
		},{
			'title': '第三药材仓库',
			'nodes': []
		}]
	}, {
		'title': '药材供应站',
		'nodes': [{
			'title': '第一药材供应站',
			'nodes': []
		},{
			'title': '第二药材供应站',
			'nodes': []
		},{
			'title': '第三药材供应站',
			'nodes': []
		}]
	}, {
		'title': '野战药材保障队',
		'nodes': [{
			'title': '第一野战药材保障队',
			'nodes': []
		},{
			'title': '第二野战药材保障队',
			'nodes': []
		},{
			'title': '第三野战药材保障队',
			'nodes': []
		}]
	}];
	/**
	 * 查询供应机构
	 * @type {查询条件 ：1.机构名称  2.机构类型}
	 */
	$scope.findAllSupplyAgencys = function() {

		http.post({
			'method': 'findAllSupplyAgencys'
		}, URL.SupplyAgencyServlet).then(
			function(respone) {
				
				if (respone.code != 0) {
					popAlert("操作失败："+JSON.stringify(respone));
				}else{
					popAlert("查询完成");
					var supplyAgency = response.supplyAgencies;

				}
				
			},
			function(respone) {
				console.log("findAllSupplyAgencys failed!" + JSON.stringify(respone));
				popAlert("操作失败："+JSON.stringify(respone));
			});
	}
	$scope.modeList = [{
		'title': '业务模式',
		'nextStep': 2
	},{
		'title': '练习模式',
		'nextStep': 3
	},{
		'title': '考核模式',
		'nextStep': 3
	}];
	$scope.toggle = function (scope) {
        scope.toggle();
    };
    $scope.mode = 1;
    $scope.modeName = '';
    $scope.changeMode = function(mode, index){
    	var agencyCode = $rootScope.user.agencyCode,
    		userCode = $rootScope.user.userCode;
    	var agencyCode = $rootScope.user.agencyCode;
    	switch(index){
    		case 0: 
    			$rootScope.currentMode = 'yw';
    			break;
    		case 1: 
    			$rootScope.currentMode = 'lx';
    			$rootScope.user.agencyCode = agencyCode + userCode + 'lx';
    			break;
    		case 2: 
    			$rootScope.currentMode = 'kh';
    			$rootScope.user.agencyCode = agencyCode + userCode + 'kh';
    			break;
    		default:;
    	}

    	if (mode == 2 && !!agencyCode) {
    		$state.go('home.dashboard');
    	}else{
	    	$scope.mode = mode;
	    	$scope.modeName = $scope.modeList[index].title;    		
    	}

    };

    $scope.updateAgencyCode = function(){
    		http.post({
    				'method':'updateAgencyCodeAndRole',
    				'roleName': '122',
    				'id': $rootScope.user.id,
    	            'agencyCode': '333'
    			},URL.UserServlet).then(
    				function(respone) {
    					$scope.users = respone.order;	
    					// popAlert('queryUser success!')
    				},
    				function(respone) {
    					console.log("queryUser failed!" + JSON.stringify(respone));
    					popAlert("操作失败："+JSON.stringify(respone));
    		});
    }

})