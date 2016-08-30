app.controller('WareInventoryCtrl', function($scope,http){
	
	$scope.testObj = [{
		title: '仓库1',
		collapse: false,
		division: [{
			title: '货区1',
			collpase: false,
			division: [{
				title: '货位1',
				collapse: false
			},{
				title: '货位2',
				collapse: false
			}]
		}]
	},{
		title: '仓库2',
		collapse: false
	},{
		title: '仓库3',
		collapse: false
	}];
	$scope.toggleCollapse = function(index){
		$scope.testObj[index].collapse = !$scope.testObj[index].collapse;
	}

})