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
	            "id": 29,
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
		'code': '100100010',
		'name': '阿莫西林胶囊',
		'size': '10mg',
		'unit': '粒',
		'price': '0.15',
		'amount': '1000',
		'sum': '150',
		'storage': '',
		'lack': 200,
		'ditribute': 800
	}];

	// 详细信息model
	$scope.detail = {};
	$scope.showDetail = function(item){
		$scope.auditStateToggle(false);
		$scope.detail = item;
	};
	/************ 添加新明细 start ***************/
	// 新增明细存储model
	$scope.newItem = {};
	$scope.addItem = function(newItem){
		$scope.items.push({
			code: newItem.code,
			name: newItem.name,
			size: newItem.size,
			unit: newItem.unit,
			price: newItem.price,
			amount: newItem.amount,
			sum: newItem.sum,
			storage: newItem.storage,
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
})







