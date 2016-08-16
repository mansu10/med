app.controller('OrderAddCtrl', function($scope,http){
	
	function FormatDate (strTime) {
    	var date = new Date(strTime);
    	return date.getFullYear()+(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getMilliseconds();
	}
		
		$scope.orderForm = {
			method:'addOrder',
			orderTime: secondsToData(new Date().getTime()) ,
			deliveryTime: '',
			customerCode: '',
			customerName: '',
			receiver: '',
			tel: '',
			receiveMode: '',
			receiptAddress: '',
			memo: '',
			orderItems:'[]'
		};
		$scope.items = [];
		$scope.newItem = {};
		$scope.addItem = function(newItem){
			$scope.items.push({
				productCode: newItem.code,
				total: newItem.price*newItem.amount,
				unit:newItem.unit,
				price:newItem.price,
				productNum:newItem.amount,
				size:newItem.size,
				name:newItem.name
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
		
		//订单提交
		$scope.submitOrder = function() {
			
			$scope.orderForm.orderItems = JSON.stringify($scope.items);
			console.log(JSON.stringify($scope.orderForm)+"==============="+$scope.orderForm.orderItems);
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
		
		var productList = [];//商品列表  
		//查询所有商品信息
		var queryProduct = function() {	
			
			http.post({'method':'queryProduct'},URL.productQurey).then(
				function(respone) {
					console.log("queryProduct info --->"+respone);
					productList = respone.products;
				},
				function(respone) {
					console.log("queryProduct failed!" + JSON.stringify(respone));
					alert(respone);
			});
		}
		queryProduct();
		
		$scope.change = function(item){
			angular.forEach(productList,function(product){
				if(item.code == product.productCode){
					
					$scope.newItem.name = product.productName;
					$scope.newItem.size = product.specifications;
					$scope.newItem.unit = product.unit;
					$scope.newItem.price = product.price;
					$scope.newItem.amount = product.averageNumber;
					$scope.newItem.sum = $scope.newItem.price * $scope.newItem.amount;
					
					return;
				}
			})
		};
		
		//收货方式 option
		$scope.receiptMethod = [
			{value : 0, name : "配送"},
	    	{value : 1, name : "自取"}
		];
		$scope.receiptSelect = $scope.receiptMethod[0];//默认选中
		
		//订单方式 option
		$scope.orderMethod = [
			{value : 0, name : "电话订单"},
	    	{value : 1, name : "网络电子订单"},
	    	{value : 2, name : "邮件订单"}
		];
		$scope.orderSelect = $scope.orderMethod[0];//默认选中

	})









