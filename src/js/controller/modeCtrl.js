app.controller('ModeCtrl', function($scope,http){
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
    	$scope.mode = mode;
    	$scope.modeName = $scope.modeList[index].title;
    };


})