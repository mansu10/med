app.controller('DistrVehicleCtrl', function($scope,http){
	// 浮层控制
	$scope.modalToggle = function(bool){
		$scope.modalState = bool;
	}
	// 需ajax请求订单列表
	$scope.vehicleList = {
		    "code": 0,
		    "cars": [{
		    	"id":1,
	            "carCode": "C0001",
	            "carName": "1号车",
	            "carUnit": "第1车队",
	            "carDriver": "李一",
	            "maxWeight": 3000000,
	            "carVolume": 26796000,
	            "carNumber": "NC20001",
	            "carType": "客车",
	            "carLength": 580,
	            "carWidth": 210,
	            "carHeigth": 220,
	            "carStatus": 0,
	            "memo": "运输车1"
	        },{
	            "id":2,
	            "carCode": "C0002",
	            "carName": "2号车",
	            "carUnit": "第2车队",
	            "carDriver": "孙二",
	            "maxWeight": 20000,
	            "carVolume": 222960,
	            "carNumber": "NC20002",
	            "carType": "大巴",
	            "carLength": 380,
	            "carWidth": 230,
	            "carHeigth": 230,
	            "carStatus": 1,
	            "memo": "运输车2"
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
		var origin = $scope.vehicleList.cars[i];
		cp(origin, $scope.tempItem);
		$scope.modalToggle(false);
		$scope.updateCars($scope.tempItem);
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
		$scope.vehicleList.cars.push({
			"carCode": newItem.carCode,
			"carNumber": newItem.carNumber,
			"carName": newItem.carName,
			"carType": newItem.carType,
			"carUnit": newItem.carUnit,
			"carVolume": newItem.carVolume,
			"carLength": newItem.carLength,
	        "carWidth": newItem.carWidth,
	        "carHeigth": newItem.carHeigth,
			"carDriver": newItem.carDriver,
			"memo": newItem.memo,
			"id":0
		})
	};
	// 删除明细
	$scope.rmItem = function(index,id){
		$scope.vehicleList.cars.splice(index,1);
		$scope.deleteCars(id);
		
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
		$scope.addCars(JSON.stringify(newItem));
		$scope.iptReset(newItem);
	};
	/************* 添加明细 end ***************/		
	
	//查询车辆信息
	$scope.queryCars = function(queryItem){
		
		http.post({'method':'queryAllCars','numberOrType':queryItem},URL.carQurey).then(
				function(respone) {
					console.log("=========查询车辆信息========="+JSON.stringify(respone));
					$scope.vehicleList = respone;
				},
				function(respone) {
					console.log("queryCars failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}
	
	$scope.queryCars("");	//进入该页面自动拉取所有车辆信息	
	
	//添加车辆信息
    $scope.addCars = function(newItem){
		console.log("===========add cars============"+newItem);
    	http.post({'method':'addCar','car': newItem},URL.carQurey).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					alert(JSON.stringify("添加成功"+JSON.stringify(respone)));
				},
				function(respone) {
					console.log("addCars failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
			});
    }
    
    //修改车辆信息
    $scope.updateCars = function(item){
		console.log("===========updateCars============"+item);
    	http.post({'method':'updateCar','car': item},URL.carQurey).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					alert(JSON.stringify("updateCars成功"+JSON.stringify(respone)));
				},
				function(respone) {
					console.log("updateCars failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
			});
    }
    
    //删除车辆信息
    $scope.deleteCars = function(id){
		console.log("===========deleteCars============"+id);
    	http.post({'method':'deleteCar','id':id},URL.carQurey).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					alert(JSON.stringify("deleteCars成功"+JSON.stringify(respone)));
				},
				function(respone) {
					console.log("deleteCars!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
			});
    }
    
    
})