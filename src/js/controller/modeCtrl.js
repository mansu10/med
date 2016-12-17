app.controller('ModeCtrl', function($rootScope, $scope,http, $localstorage, $state){

	$scope.user = $localstorage.getObject('user');
	// console.log($scope.user);

	// $scope.data = [{
	// 	'title': '药材仓库',
	// 	'nodes': [{
	// 		'title': '第一药材仓库',
	// 		'nodes': []
	// 	},{
	// 		'title': '第二药材仓库',
	// 		'nodes': []
	// 	},{
	// 		'title': '第三药材仓库',
	// 		'nodes': []
	// 	}]
	// }, {
	// 	'title': '药材供应站',
	// 	'nodes': [{
	// 		'title': '第一药材供应站',
	// 		'nodes': []
	// 	},{
	// 		'title': '第二药材供应站',
	// 		'nodes': []
	// 	},{
	// 		'title': '第三药材供应站',
	// 		'nodes': []
	// 	}]
	// }, {
	// 	'title': '野战药材保障队',
	// 	'nodes': [{
	// 		'title': '第一野战药材保障队',
	// 		'nodes': []
	// 	},{
	// 		'title': '第二野战药材保障队',
	// 		'nodes': []
	// 	},{
	// 		'title': '第三野战药材保障队',
	// 		'nodes': []
	// 	}]
	// }];
	$scope.data = [];
	/**
	 * 查询供应机构
	 * @type {查询条件 ：1.机构名称  2.机构类型}
	 */
	
	$scope.findAllSupplyAgencys = function() {

		http.post({
			'method':'findSupplyAgencysInitialization'
		}, URL.SupplyAgencyServlet).then(
			function(res) {
				
				if (res.code != 0) {
					popAlert("操作失败："+JSON.stringify(res));
				}else{
					var supplyAgency = res.supplyAgencies;
					var t = {};
					for(var key in supplyAgency){
						t.title = key;
						t.nodes = [];
						if (supplyAgency[key].length > 0) {
							var names = supplyAgency[key];
							for(var i=0; i < names.length; i++){
								var p = {};

								p.title = names[i].supplyAgencyName;
								
								p.nodes = [];
								var jobs = names[i].supplyAgencyJobs;
								if (jobs.length > 0) {
									for(var j = 0; j < jobs.length; j++){
										var q = {};
										q.title = jobs[j].roleName;
										q.nodes = [];
										q.code = jobs[i].supplyAgencyCode;
										q.jobs = 1;
										q.supplyAgency = t.title;
										q.supplyType = p.title;
										p.nodes.push(q);
									}
								}else{
									p.nodes.push({
										title: '暂无职位',
										nodes: [],
										jobs: 0
									})
								}

								
								t.nodes.push(p);
							}
						}
						$scope.data.push(t);
						t = {};
						console.log(JSON.stringify($scope.data));
					}
				}
				
			},
			function(res) {
				console.log("findAllSupplyAgencys failed!" + JSON.stringify(res));
				popAlert("操作失败："+JSON.stringify(res));
			});
	}
	$scope.findAllSupplyAgencys();
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

    	if ($scope.user.userType == 0) {
    		$state.go('home.dashboard');
    	}else{
	    	$scope.mode = mode;
	    	$scope.modeName = $scope.modeList[index].title;    		
    	}

    };

    $scope.updateAgencyCode = function(node){
    	$rootScope.user.roleName = node.title;
    	$rootScope.user.sAgency = node.supplyAgency;
    	$rootScope.user.agencyCode = node.supplyAgency;
    	$rootScope.user.sAgencyType = node.supplyType;
    	$localstorage.setObject('agency', {"roleName":node.title,
    										"sAgency":node.supplyAgency,
	    									"sAgencyType": node.supplyType})
		http.post({
				'method':'updateAgencyCodeAndRole',
				'roleName': node.title,
				'id': $rootScope.user.id,
	            'agencyCode': node.code,
	            'supplyAgency': node.supplyAgency,
	            'supplyType': node.supplyType
			},URL.UserServlet).then(
				function(res) {
					if (res.code != 0) {
						popAlert("操作失败："+JSON.stringify(res));
					}else{
						$state.go('home.dashboard');
					}
					
				},
				function(res) {
					console.log("queryUser failed!" + JSON.stringify(res));
					popAlert("操作失败："+JSON.stringify(res));
		});
    }

})