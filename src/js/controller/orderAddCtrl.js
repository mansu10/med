app.controller('OrderAddCtrl', function($scope,http){
	
	function FormatDate (strTime) {
    	var date = new Date(strTime);
    	return date.getFullYear()+(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getMilliseconds();
	}
		
		$scope.orderForm = {
			method:'addOrder',
			orderTime: '' ,
			deliveryTime: '',
			customerCode: '',
			customerName: '',
			receiver: '',
			tel: '',
			receiveMode: '',
			receiptAddress: '',
			memo: '',
			productIds:''
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
			
			$scope.orderForm.productIds = "[{'orderId':29,'productId':2,'productNumber':10,'total':100},{'orderId':29,'productId':3,'productNumber':20,'total':200}]",
			
			http.post($scope.orderForm,URL.orderAdd).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					alert("订单添加成功！")
					
				},
				function(respone) {
					console.log("submitOrder failed!" + JSON.stringify(respone));
					alert(respone);
			});
		}

	})









