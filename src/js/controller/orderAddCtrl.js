app.controller('OrderAddCtrl', function($scope){
		$scope.orderForm = {
			orderTime: '',
			deliveryTime: '',
			customerCode: '',
			customerName: '',
			receiver: '',
			tel: '',
			receiveMode: '',
			receiptAddress: '',
			memo: ''
		};
		$scope.items = [];
		$scope.newItem = {};
		$scope.addItem = function(newItem){
			$scope.items.push({
				code: newItem.code,
				name: newItem.name,
				size: newItem.size,
				unit: newItem.unit,
				price: newItem.price,
				amount: newItem.amount,
				sum: newItem.sum
			})
		}
		$scope.rmItem = function(index){
			$scope.items.splice(index,1);
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









