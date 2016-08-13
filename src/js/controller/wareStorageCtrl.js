app.controller('WareStorageCtrl', function($scope,http){
	// 浮层控制
	$scope.modalToggle = function(bool){
		$scope.modalState = bool;
	}
	// mapping
	$scope.mapping = {
        "productCode": '商品编号',
        "ordinaryName": "通用名",
        "productName": "商品名",
        "specifications": "规格型号",
        "manufactory": "生产厂家",
        "unit": "计量单位",
        "carLoad": "包装规格",
        "validity": "有效期",
        "driver": "生产日期",
        "stockNumber": "库存数量",
        "memo": "备注"		
	}

	// 需ajax请求订单列表
	$scope.vehicleList = {
		    "code": 0,
		    "vehicle": [{
	            "carCode": '车辆编号',
	            "carNumber": "车牌号",
	            "carName": "车名",
	            "carType": "车型",
	            "carUnit": "所属单位",
	            "carSize": "尺寸",
	            "carLoad": "载重",
	            "capacity": "容积",
	            "driver": "司机",
	            "status": "状态",
	            "memo": "备注"
	        },{
	            "carCode": 'C0001',
	            "carNumber": "沪C0001",
	            "carName": "1号车",
	            "carType": "车型",
	            "carUnit": "第1车队",
	            "carSize": "5000",
	            "carLoad": "50",
	            "capacity": "5000",
	            "driver": "王二",
	            "status": "运输中",
	            "memo": "备注"
	        }]
		}
	// 详细信息model
	$scope.detail = {};
	$scope.tempItem = {};
	$scope.showDetail = function(index,item){
		$scope.modalToggle(true);
		cp($scope.tempItem, item);
		$scope.detail.item = item;
		$scope.detail.index = index;
	};
	$scope.saveChange = function(){
		var i = $scope.detail.index;
		var origin = $scope.vehicleList.vehicle[i];
		cp(origin, $scope.tempItem);
		$scope.modalToggle(false);
	}
	$scope.cancelChange = function(){
		cp($scope.tempItem, $scope.detail.item);
		$scope.modalToggle(false);
	}
	// 拷贝对象
	function cp(a, b){
		for(var o in b){
			a[o] = b[o];
		}
	}
	/************ 添加新明细 start ***************/
	// 新增明细存储model
	$scope.newItem = {};
	$scope.addItem = function(newItem){
		$scope.vehicleList.vehicle.push({
			"carCode": newItem.carCode,
			"carNumber": newItem.carNumber,
			"carName": newItem.carName,
			"carType": newItem.carType,
			"carUnit": newItem.carUnit,
			"carSize": newItem.carSize,
			"carLoad": newItem.carLoad,
			"capacity": newItem.capacity,
			"driver": newItem.driver,
			"memo": newItem.memo
		})
	};
	// 删除明细
	$scope.rmItem = function(index){
		$scope.vehicleList.vehicle.splice(index,1);
	};
	// 显示明细
	$scope.iptState = false;
	$scope.iptToggle = function(bool){
		$scope.iptState = bool;
	};
	// 清空明细输入框
	$scope.iptReset = function(newItem){
		$scope.newItem = {};
	};
	// 保存
	$scope.iptSave = function(newItem){
		$scope.addItem(newItem);
		$scope.iptToggle(false);
		$scope.iptReset(newItem);
	};
	/************* 添加明细 end ***************/		
	
	//查询库存信息
	$scope.queryStorage = function(){
		http.post({'method':'queryAllStocks'},URL.stockQurey).then(
				function(respone) {
					console.log("=========查询库存信息========="+JSON.stringify(respone));
				},
				function(respone) {
					console.log("queryAllStocks failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}
	$scope.queryStorage();
})