app.controller('CollectSupplementCtrl', function($rootScope, $scope,http, instruct){
	instruct.set(['666']);
	$rootScope.$broadcast('instructChange');
	// 需ajax请求列表
	$scope.storageList = [{
	            "medicName": "健胃消食片",
	            "medicCode": "A00101",
	            "spec": "规格1",
	            "type": "型号1",
	            "unit": "24粒/盒",
	            "vender": "厂家1",
	            "price": 1.00,
	            "inventory": 100,
	            "minInvent": 1,
	            "maxInvent": 300,
	            "inventLevel": 3/4,
	            "supplier": "供应商",
	            "approvalNumber":0,
	            "status": {value : 2, name : "正常",color:"success"}
	        },{
	            "medicName": "感冒通灵",
	            "medicCode": "A00102",
	            "spec": "规格2",
	            "type": "型号2",
	            "unit": "12粒/盒",
	            "vender": "厂家2",	         
	            "price": 1.00,
	            "inventory": 30,	            
	            "minInvent": 100,
	            "maxInvent": 200,
	            "inventLevel": 1/2,
	            "supplier": "供应商",
	            "approvalNumber":0,
	            "status": {value : 0, name : "不足",color:"warning"}
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
	            "inventory": 600,
	            "inventValue": 0,
	            "minInvent": 130,
	            "maxInvent": 300,
	            "inventLevel": 1/3,
	            "supplier": "供应商",
	            "approvalNumber":300,
	            "status": {value : 1, name : "超量",color:"danger"}
	        }
	    ];
	    
	    //库存状态 option
		$scope.inventStatus = [
			{value : 0, name : "不足"},
	    	{value : 1, name : "超量"},
	    	{value : 2, name : "正常"},
	    	{value : 3, name : "全部"}
		];
		$scope.defaultSelect = $scope.inventStatus[3];//默认选中
		
	//查询库存信息
	$scope.queryStorage = function(){
		http.post({
			'method':'queryAllStocks',
			'productCodeOrName':$scope.qureyValue,
            'agencyCode':$rootScope.user.agencyCode
		},URL.stockQurey).then(
				function(respone) {
					if(respone.stocks.length > 0){
						popAlert("查询成功！");
					}else{
						popAlert("无相关结果");
					}
					
					refreshStorageList(respone.stocks);
				},
				function(respone) {
					console.log("查询失败，请稍后再试!" + JSON.stringify(respone));
					popAlert(respone);
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
	            "supplier": item.product.supplier,
	            "approvalNumber":item.product.maxStock - item.stockQuantity,
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
	
	$scope.selected = [];
    $scope.selectedTags = [];
    $scope.selectedList = [];
 
    var updateSelected = function(action,item,name){
    	var id = item.medicCode
        if(action == 'add' && $scope.selected.indexOf(id) == -1){
             $scope.selected.push(id);
             $scope.selectedTags.push(name);
             $scope.selectedList.push(item);
        }
        if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
             var idx = $scope.selected.indexOf(id);
             $scope.selected.splice(idx,1);
             $scope.selectedTags.splice(idx,1);
             $scope.selectedList.splice(idx,1);
        }
        console.log("=========$scope.selected=========="+JSON.stringify($scope.selected));
        console.log("=========$scope.selectedTags=========="+JSON.stringify($scope.selectedTags));
        console.log("=========selectedList=========="+JSON.stringify($scope.selectedList));
    }
 
    $scope.updateSelection = function($event, item){
         var checkbox = $event.target;
         var action = (checkbox.checked?'add':'remove');
         updateSelected(action,item,checkbox.name);
    }
 
    $scope.isSelected = function(id){
         return $scope.selected.indexOf(id)>=0;
    }
    
    $scope.inventList = [];
    //添加商品到筹措清单列表
    $scope.addInventory = function(){
//  	temp = $scope.selectedList.concat();
//  	temp = [];
//  	$scope.inventList = angular.copy($scope.selectedList);
    	angular.forEach(angular.copy($scope.selectedList),function(item){
    		if(!containSubCategory(item)){
    			item.editDisabled = true;
    			$scope.inventList.push(item);
    		}
    	})
    	
//  	$scope.inventList.orderAmount = $scope.inventList.maxInvent - $scope.inventList.inventory;
    }
    
    //判断数组中是否包含某对象
    function containSubCategory(element){
    	for (var i= 0;i<$scope.inventList.length;i++) {
    		if($scope.inventList[i].medicCode == element.medicCode){
    			return true;
    		}
    	}
    	return false;
    }
    
    //确认筹措清单
	$scope.confirmInventory = function(){
		
		var temp = [];
		angular.forEach($scope.inventList,function(item){
			temp.push({'productCode':item.medicCode,'orderAmount':item.approvalNumber,'memo':'筹措清单备注'})
		});
		
		var submitInfo = {'productCode':'10000001','orderAmount':'30','memo':'筹措清单备注'};
		
		http.post({'method':'addRaiseInventory','inventorys':JSON.stringify(temp)},URL.raiseInventory).then(
				function(respone) {
		
					popAlert("筹措清单提交成功！",function(){window.location.reload()})
				},
				function(respone) {
					console.log("提交失败：" + JSON.stringify(respone));
					popAlert(respone);
		});
	}
	
	//编辑订购量
	$scope.editDisabled = true;
	$scope.editOrderAmount = function(index){
		$scope.inventList[index].editDisabled = false;
	}
	//删除清单项
	$scope.remove = function(index){
		$scope.inventList.splice(index,1);
	}
	//保存更改
	$scope.save = function(index){
		$scope.inventList[index].editDisabled = true;
	}
	//取消
	$scope.cancel = function(index){
		$scope.inventList[index].editDisabled = true;
		$scope.inventList[index].approvalNumber = $scope.inventList[index].maxInvent - $scope.inventList[index].inventory;
	}
})