app.controller('CollectStorageCtrl', function($scope,$rootScope, http, instruct){
	instruct.set(['555']);
	$rootScope.$broadcast('instructChange');
	// 需ajax请求列表
	$scope.storageList = [{
	            "medicName": "健胃消食片",
	            "medicCode": "A00101",
	            "spec": "规格1",
	            "type": "型号1",
	            "unit": "24粒/盒",
	            "vender": "厂家1",
	            "location": "货位1",
	            "boxNum": "001",
	            "price": 1.00,
	            "inventory": 100,
	            "inventValue": 0,
	            "minInvent": 1,
	            "maxInvent": 1000,
	            "inventLevel": 3/4,
	            "status": {value : 2, name : "正常",color:"success"}
	        },{
	            "medicName": "感冒通灵",
	            "medicCode": "A00102",
	            "spec": "规格2",
	            "type": "型号2",
	            "unit": "12粒/盒",
	            "vender": "厂家2",
	            "location": "货位2",
	            "boxNum": "002",
	            "price": 2.00,
	            "inventory": 20,
	            "inventValue": 0,
	            "minInvent": 30,
	            "maxInvent": 100,
	            "inventLevel": 1/2,
	            "status": {value : 0, name : "不足",color:"warning"},
	        },{
	            "medicName": "清热解毒胶囊",
	            "medicCode": "A00103",
	            "spec": "规格3",
	            "type": "型号3",
	            "unit": "12粒/盒",
	            "vender": "厂家3",
	            "location": "货位3",
	            "boxNum": "003",
	            "price": 1.00,
	            "inventory": 1110,
	            "inventValue": 0,
	            "minInvent": 130,
	            "maxInvent": 500,
	            "inventLevel": 1/4,
	            "status": {value : 1, name : "超量",color:"danger"}
	        }
	    ];
	    
	//库存状态 option
	$scope.inventStatus = [
			{value : 0, name : "不足",color:"warning"},
	    	{value : 1, name : "超量",color:"danger"},
	    	{value : 2, name : "正常",color:"success"},
	    	{value : 3, name : "全部",color:"success"}
		];
	$scope.defaultSelect = $scope.inventStatus[3];//默认选中
		
	//查询库存信息
	$scope.queryStorage = function(){
		http.post({'method':'queryAllStocks','productCodeOrName':$scope.qureyValue,
		            'agencyCode':$rootScope.user.agencyCode},URL.stockQurey).then(
				function(respone) {
					if (respone.code != 0) {
						popAlert(JSON.stringify(respone));
					}
					popAlert("库存查询成功!");
					refreshStorageList(respone.stocks);
				},
				function(respone) {
					console.log("queryAllStocks failed!" + JSON.stringify(respone));
					popAlert(JSON.stringify(respone));
		});
	}
	$scope.queryStorage();
	
	function refreshStorageList(list){
		var tempList = [];
		angular.forEach(list,function(item){
			if($scope.defaultSelect.value == 0 && item.stockQuantity >= item.product.minStock){
				console.log("库存不足时查询商品，不符合条件跳过"+item.stockQuantity+"/ "+item.product.minStock);
				return;
			}
			if($scope.defaultSelect.value == 1 && item.stockQuantity <= item.product.maxStock){
				console.log("库存超量时查询商品，不符合条件跳过"+item.stockQuantity+"/ "+item.product.maxStock);
				return;
			}
			if($scope.defaultSelect.value == 2 && (item.stockQuantity < item.product.minStock || item.stockQuantity > item.product.maxStock)){
				console.log("库存正常时查询商品，不符合条件跳过"+item.stockQuantity+"/ "+item.product.minStock+"/ "+item.product.maxStock);
				return;
			}
			tempList.push({
	            "medicName": item.product.productName,
	            "medicCode": item.productCode,
	            "spec": item.product.specifications,
	            "type": item.product.model,
	            "unit": item.product.unit,
	            "vender": item.product.manufactor,
	            "location": item.locatorName,
	            "boxNum": item.locatorCode,
	            "price": item.product.price,
	            "inventory": item.stockQuantity,
	            "inventValue": item.stockValue,
	            "minInvent": item.product.minStock,
	            "maxInvent": item.product.maxStock,
	            "inventLevel": item.stockLevel,
	            "status": getStatus(item.stockQuantity,item.product.minStock,item.product.maxStock)
	       });
		});
		$scope.storageList = tempList;
	}
	
	function getStatus(inventory,min,max){
		if(inventory > max){
			return {value : 1, name : "超量",color:"danger"};
		}else if(inventory < min){
			return {value : 0, name : "不足",color:"warning"};
		}else{
			return {value : 2, name : "正常",color:"success"};
		} 
	}
})