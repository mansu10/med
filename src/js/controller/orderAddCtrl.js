app.controller('OrderAddCtrl', function($scope,http){
		$scope.orderForm = {
			orderTime: '',
			deliveryTime: '',
			customerCode: '',
			customerName: '',
			receiver: '',
			tel: '',
			receiveMode: '',
			receiptAddress: '',
			memo: '',
			productIds:[]
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
		
		$scope.submitOrder = function() {
			
			$scope.orderForm.productIds = {
    'method': 'addOrder',
    'customerCode': 'B0001',
    'customerName': '1军1师1团团救护所',
    'orderTime': '20160726100750',
    'deliveryTime': '20160728100750',
    'receiptAddress': '上海浦东',
    'receiver': '张三',
    'tel': '12345678',
    'productIds': "[{'orderId':29,'productId':2,'productNumber':10,'total':100},{'orderId':29,'productId':3,'productNumber':20,'total':200}]",
    'memo': '备注'
};
			
			console.log("order info:" + JSON.stringify($scope.orderForm));
			
			http.post($scope.orderForm,URL.orderAdd).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					alert("order has submit!")
					
				},
				function(respone) {
					console.log("submitOrder failed!" + JSON.stringify(respone));
					alert("submitOrder failed!!");
			});
		}

	})









