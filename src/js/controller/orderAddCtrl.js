app.controller('OrderAddCtrl', function($rootScope, $scope,http, $localstorage){
	var $user = $localstorage.getObject('user');
	function secondsToData (strTime) {
    	var date = new Date(strTime);
    	console.log("================secondsToData==============="+" / strTime"+strTime+" / date："+date);
    	return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	}
		var ds = new Date().getTime();
		$scope.orderForm = {
			method:'addOrder',
			orderTime: secondsToData(ds),
			deliveryTime: secondsToData(ds + 24*60*60*1000),
			customerCode: '',
			customerName: '',
			receiver: '',
			tel: '',
			receiveMode: '',
			receiptAddress: '',
			memo: '',
			orderItems:''
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
				name:newItem.name,
				agencyCode: $user.agencyCode
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
			$scope.orderForm = {
				method:'addOrder',
				orderTime: secondsToData(ds),
				deliveryTime: secondsToData(ds + 24*60*60*1000),
				customerCode: '',
				customerName: '',
				receiver: '',
				tel: '',
				receiveMode: '',
				receiptAddress: '',
				memo: '',
				orderItems:''
			};
		}
		
		//订单提交
		$scope.submitOrder = function() {

			
			$scope.orderForm.orderItems = JSON.stringify($scope.items);
			console.log(JSON.stringify($scope.orderForm)+"==============="+$scope.orderForm.orderItems);
			if (isEmptyValue($scope.orderForm.orderItems)) {
				popAlert('请填写完整');
				return;
			}
			$scope.orderForm.agencyCode = $rootScope.user.agencyCode;
			http.post($scope.orderForm,URL.orderAdd).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					popAlert("订单添加成功！", function(){
						$scope.reset();
					})
					
				},
				function(respone) {
					console.log("submitOrder failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
					
			});
		}
		
		var productList = [];//商品列表  
		//查询所有商品信息
		var queryProduct = function() {	
			
			http.post({'method':'queryProduct',
		        'agencyCode':$rootScope.user.agencyCode},URL.productQurey).then(
				function(respone) {
					console.log("queryProduct info --->"+respone);
					productList = respone.products;
				},
				function(respone) {
					console.log("queryProduct failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
			});
		}
		queryProduct();
		
		$scope.change = function(item,type){
			for (var i = 0; i < productList.length; i++) {
				if (type == 'code') {
					$scope.newItem.name = '';
				}else if(type == 'name') {
					$scope.newItem.code = '';
				}
				
				$scope.newItem.size = '';
				$scope.newItem.unit = '';
				$scope.newItem.price = '';
				$scope.newItem.amount = '';
				$scope.newItem.sum = '';
				var product = productList[i];
				if(item.code == productList[i].productCode && type == 'code'){
					

					$scope.newItem.name = product.ordinaryName;
					$scope.newItem.size = product.specifications;
					$scope.newItem.unit = product.unit;
					$scope.newItem.price = product.price;
					$scope.newItem.amount = product.averageNumber;
					$scope.newItem.sum = $scope.newItem.price * $scope.newItem.amount;
					return;
				}else if(productList[i].ordinaryName==item.name && type == 'name'){

					$scope.newItem.code = product.productCode;
					$scope.newItem.size = product.specifications;
					$scope.newItem.unit = product.unit;
					$scope.newItem.price = product.price;
					$scope.newItem.amount = product.averageNumber;
					$scope.newItem.sum = $scope.newItem.price * $scope.newItem.amount;
					return;
				}
			}
			// angular.forEach(productList,function(product){
			// 	if(item.code == product.productCode){
					
			// 		$scope.newItem.name = product.productName;
			// 		$scope.newItem.size = product.specifications;
			// 		$scope.newItem.unit = product.unit;
			// 		$scope.newItem.price = product.price;
			// 		$scope.newItem.amount = product.averageNumber;
			// 		$scope.newItem.sum = $scope.newItem.price * $scope.newItem.amount;

			// 	}
			// })
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









