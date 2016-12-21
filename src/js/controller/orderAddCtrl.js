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

		var temp;
		$scope.newItem = {
			name:'',code:'',size:'',unit:'',price:'',amount:''
		}
		
		$scope.change = function(item,type){
			
			if(type == 'name'  && temp != item.name){
				matchDetail('',item.name,type);
				temp = angular.copy(item.name);
			}
			if(type == 'code' && temp != item.code){
				matchDetail(item.code,'',type);
				temp = angular.copy(item.code);
			}

		};

		var matchDetail = function(productCode,ordinaryName,type){

			http.post({'method':'findProductByCodeOrName',
				'productCode':productCode,
				'ordinaryName':ordinaryName},
				URL.ProductServlet).then(
					function(respone) {
						// console.log("!" + JSON.stringify(respone));
						$scope.newItem.code = respone.products.productCode;
						$scope.newItem.name = respone.products.ordinaryName;
						$scope.newItem.size = respone.products.specifications;
						$scope.newItem.unit = respone.products.unit;
						$scope.newItem.price = respone.products.price;
						$scope.newItem.amount = respone.products.averageNumber;
						$scope.newItem.sum = $scope.newItem.price * $scope.newItem.amount;
					},
					function(respone) {
						console.log("查询失败，请稍后再试!" + JSON.stringify(respone));
						if(type == 'name'){
							$scope.newItem.code = '';
						}else{
							$scope.newItem.name = '';
						}
						
						$scope.newItem.size = '';
						$scope.newItem.unit = '';
						$scope.newItem.price = '';
						$scope.newItem.amount ='';
						$scope.newItem.sum ='';
					});
		}
		
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









