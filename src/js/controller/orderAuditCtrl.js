app.controller('OrderAuditCtrl', function($scope,http){
	
	// 切换显示状态
	$scope.auditState = true;
	$scope.auditStateToggle = function(bool){
		$scope.auditState = bool;
	}

// 临时列表
	$scope.orderList = {
		    "code": 0,
		    "order": [{
	            "id": 29,
	            "orderCode": "201601010010",
	            "customerCode": "B0001",
	            "customerName": "张三",
	            "orderType": "电子订单",
	            "orderTime": "2016-07-21 20:43:52.0",
	            "deliveryTime": "2016-07-22 20:44:03.0",
	            "orderStatus": "未处理",
	            "receiver": "王建国",
	            "receiptAddress": "浙江省湖州市",
	            "tel": "13456780101",
	            "receiptType": "配送",
	            "shipMethod": "专门",
	            "payMethod": 1,
	            "shipTime": "",
	            "orderProgress": "",
	            "memo": "2222",
	            "level": 0
	        },{
	            "id": 29,
	            "orderCode": "201601010010",
	            "customerCode": "B0001",
	            "customerName": "张三",
	            "orderType": "电子订单",
	            "orderTime": "2016-07-21 20:43:52.0",
	            "deliveryTime": "2016-07-22 20:44:03.0",
	            "orderStatus": "未处理",
	            "receiver": "王建国",
	            "receiptAddress": "浙江省湖州市",
	            "tel": "13456780101",
	            "receiptType": "配送",
	            "shipMethod": "专门",
	            "payMethod": 1,
	            "shipTime": "",
	            "orderProgress": "",
	            "memo": "2222",
	            "level": 0
	        }
	    ]
	}
	// 临时详细订单
	$scope.orderDetail = {
		
	}
	$scope.showDetail = function(index){
		$scope.auditStateToggle(false);

	}
})