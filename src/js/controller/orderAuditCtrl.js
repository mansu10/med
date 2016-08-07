app.controller('OrderAuditCtrl', function($scope,http){
	
	// 切换显示状态
	$scope.auditState = true;
	$scope.auditStateToggle = function(bool){
		$scope.auditState = bool;
	};

	// 临时列表
	// 需ajax请求订单列表
	$scope.orderList = {
		    "code": 0,
		    "order": [{
	            "id": 29,
	            "orderCode": "201601010010",
	            "customerCode": "B0001",
	            "customerName": "张三",
	            "orderType": "电子订单",
	            "orderTime": "2016-07-21 20:43:52",
	            "deliveryTime": "2016-07-22 20:44:03",
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
	            "id": 39,
	            "orderCode": "201601010010",
	            "customerCode": "B0001",
	            "customerName": "张五",
	            "orderType": "电子订单",
	            "orderTime": "2016-07-21 20:43:52",
	            "deliveryTime": "2016-07-22 20:44:03",
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
	};
	// 临时详细订单
	// 需要ajax请求明细信息
	$scope.items = [{
		'productCode': '100100010',
		'ordinaryName': '阿莫西林胶囊',
		'specifications': '10mg',
		'unit': '粒',
		'price': '0.15',
		'productNumber': '1000',
		'total': '150',
		'stockNumber': '',
		'lack': 200,
		'ditribute': 800
	}];

	// 详细信息model
	$scope.detail = {};
	$scope.showDetail = function(item){
		$scope.auditStateToggle(false);
		queryAuditOrder(item.orderCode);
	};
	/************ 添加新明细 start ***************/
	// 新增明细存储model
	$scope.newItem = {};
	$scope.addItem = function(newItem){
		$scope.items.push({
			productCode: newItem.productCode,
			ordinaryName: newItem.ordinaryName,
			specifications: newItem.specifications,
			unit: newItem.unit,
			price: newItem.price,
			productNumber: newItem.productNumber,
			total: newItem.total,
			stockNumber: newItem.stockNumber,
			lack: newItem.lack,
			ditribute: newItem.ditribute
		})
	};
	// 删除明细
	$scope.rmItem = function(index){
		$scope.items.splice(index,1);
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

	/************* 组装form start  ***********/
	$scope.auditForm = {};
	$scope.auditSubmit = function(){
		for (var o in $scope.item) {
			$scope.auditForm[o] = $scope.item[o];
		}
	}
	$scope.shipMethod = '';
	$scope.auditForm['shipMethod'] = $scope.shipMethod;
	/************* 组装form end    ***********/
	
	//每次进入审核页拉取订单信息
	http.post({'method':'queryAllOrders'},URL.orderQurey).then(
			function(respone) {
					console.log(JSON.stringify(respone));
					$scope.orderList.order = respone.order;
					console.log("==================="+JSON.stringify($scope.orderList.order));
//					alert("查询成功！")	
			},
			function(respone) {
				console.log("Order qurey failed!" + JSON.stringify(respone));
				
				alert(respone);
	});
	
	//进入审核明细时拉取
	var queryAuditOrder = function(id){
		
		http.post({'method':'queryOrderAndItem','orderCode':id},URL.orderQurey).then(
			function(respone) {
					console.log("queryOrderAndItem:"+JSON.stringify(respone));
					$scope.detail = respone.order;
					$scope.items = respone.order.orderItems;
					
			},
			function(respone) {
				console.log("Order qurey failed!" + JSON.stringify(respone));
				alert(respone);
		});
	}
	
	//订单确认
	var OrderConfirm = function(status){
		
		http.post({},URL.orderAudit).then(
			function(respone) {
				console.log("queryOrderAndItem:"+JSON.stringify(respone));	
			},
			function(respone) {
				console.log("Order qurey failed!" + JSON.stringify(respone));
				alert(respone);
		});
	}
	
})







