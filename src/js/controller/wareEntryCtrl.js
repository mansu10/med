app.controller('WareEntryCtrl', function($scope,http){

	$scope.addItem = function(newItem){
		return;
	}
	// 增加明细
	$scope.iptState = false;
	$scope.iptToggle = function(bool){
		$scope.iptState = bool;
	}
	$scope.iptReset = function(newItem){
		$scope.newItem = {};
	}
	$scope.iptSave = function(newItem){
		$scope.addItem(newItem);
		$scope.iptToggle(false);
		$scope.iptReset(newItem);
	}
	$scope.reset = function(){
		$scope.items = [];
		$scope.orderForm = {};
	}

})