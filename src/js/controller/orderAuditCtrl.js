app.controller('OrderAuditCtrl', function($rootScope, $scope,http){
	
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
		'id':0,
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
			total: newItem.price*newItem.productNumber,
			stockNumber: newItem.stockNumber,
			lack: (newItem.productNumber - newItem.stockNumber) < 0 ? (newItem.stockNumber - newItem.productNumber) : 0,
			ditribute: newItem.ditribute,
			id:$scope.items.length
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
	http.post({'method':'queryAllOrders', 'agencyCode':$rootScope.user.agencyCode},URL.orderQurey).then(
			function(respone) {
				$scope.orderList.order = filterOrderByStatus(respone.order);
			},
			function(respone) {
				console.log("查询失败，请稍后再试!" + JSON.stringify(respone));
				popAlert("操作失败："+JSON.stringify(respone));
	});
	
	//过滤订单 只显示未审核和有疑问的订单
	function filterOrderByStatus(items){
		
		var tempArray = [];
		angular.forEach(items,function(item){
			if(item.orderStatus == '未审核' || item.orderStatus == '有疑问'){
				tempArray.push(item);
			}
		});
		
		return tempArray;
	}
	
	//进入审核明细时拉取
	var queryAuditOrder = function(id){
		
		http.post({'method':'queryOrderAndItem','orderCode':id,
            'agencyCode':$rootScope.user.agencyCode},URL.orderQurey).then(
			function(respone) {
					console.log("queryOrderAndItem:"+JSON.stringify(respone));
					popAlert("数据已刷新!")
					$scope.detail = respone.order;
					$scope.items = respone.order.orderItems;
					$scope.detail.deliveryTime = secondsToData(respone.order.deliveryTime);
					$scope.detail.orderTime = secondsToData(respone.order.orderTime);	
					$scope.detail.intendDeliveryTime = secondsToData(respone.order.deliveryTime);
			},
			function(respone) {
				console.log("查询失败，请稍后再试!!" + JSON.stringify(respone));
				popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	
	//订单确认
	var OrderConfirm = function(status){
		
		http.post({},URL.orderAudit).then(
			function(respone) {
				console.log("queryOrderAndItem:"+JSON.stringify(respone));	
				popAlert("订单确认成功！")
			},
			function(respone) {
				console.log("查询失败，请稍后再试!" + JSON.stringify(respone));
				popAlert("操作失败："+JSON.stringify(respone));
		});
	};
	
	    /*****订单明细 输入商品号自动补齐   start*******/
	    var productList = [];//商品列表  
		//查询所有商品信息
		var queryProduct = function() {	
			
			http.post({'method':'queryProduct',
		        'agencyCode':$rootScope.user.agencyCode},URL.productQurey).then(
				function(respone) {
					console.log("queryProduct info --->"+respone);
					popAlert("数据已刷新!")
					productList = respone.products;
				},
				function(respone) {
					console.log("查询失败，请稍后再试!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
			});
		}
		queryProduct();
		
		$scope.change = function(item){
			angular.forEach(productList,function(product){
				if(item.productCode == product.productCode){
					$scope.newItem = product;
					return;
				}
			})
		}
		/*****订单明细 输入商品号自动补齐   end*******/
		
		/*****订单状态更改*******/
		var updateOrderObj = {
			    'method': 'updateOrderPass',
			    'oldOrderId': '50',
			    'orderCode': '20160804103205',
			    'itemIds': '37,38',
			    'customerCode': 'B0002',
			    'customerName': '1军1师2团团救护所',
			    'orderTime': '2016-08-0310: 07: 50',
			    'deliveryTime': '2016-08-0510: 07: 50',
			    'receiptAddress': '上海张江',
			    'receiver': '李四',
			    'tel': '2212345678',
			    'intendDeliveryTime': '2016-08-0610: 07: 50',
			    'packageMethod': '0',
			    'shipMethod': '0',
			    'orderStatus': '1',
			    'orderItems': "[{'orderCode':'20160804103205','productCode':10000001,'productNumber':15,'total':150}]",
			    'memo': '备注更新'
		}
		
		$scope.updateOrder = function(status){		
			http.post(getUpdateOrder(status),URL.orderAudit).then(
				function(respone) {
					popAlert(status=="1" ? "订单已确认":"已转至疑问订单");
				},
				function(respone) {
					popAlert("操作失败："+JSON.stringify(respone));
			});
		}
		
		var getUpdateOrder = function(status){
			
			updateOrderObj.oldOrderId = $scope.detail.id+'';
			updateOrderObj.orderCode = $scope.detail.orderCode+'';
			updateOrderObj.customerCode = $scope.detail.customerCode;
			updateOrderObj.customerName = $scope.detail.customerName;
			updateOrderObj.orderTime = $scope.detail.orderTime;
			updateOrderObj.deliveryTime = $scope.detail.deliveryTime;
			updateOrderObj.receiptAddress = $scope.detail.receiptAddress;
			updateOrderObj.receiver = $scope.detail.receiver;
			updateOrderObj.tel = $scope.detail.tel;
			updateOrderObj.intendDeliveryTime = $scope.detail.intendDeliveryTime;
			updateOrderObj.packageMethod = $scope.pmSelect.value+'';
			updateOrderObj.shipMethod = $scope.shipSelect.value+'';
			updateOrderObj.orderStatus = status;// 1:订单确认 2:转至疑问
			updateOrderObj.memo = $scope.detail.memo+'';
			updateOrderObj.orderItems = JSON.stringify($scope.items);
			updateOrderObj.itemIds = getItemIds();
			
			return updateOrderObj;
			
		}
		
		var getItemIds = function(){
			var itemIds = "";
			angular.forEach($scope.items,function(value){
				itemIds += value.id + ',';
			});
			return itemIds.substring(0,itemIds.length-1);
		}
		/*****订单状态更改*******/
		
		
		//包装方式 option
		$scope.packageMethod = [
			{value : 0, name : "纸箱"},
	    	{value : 1, name : "PP中空板箱"},
	    	{value : 2, name : "制式医疗箱"}
		];
		$scope.pmSelect = $scope.packageMethod[0];//默认选中
		
		//运输方式 option
		$scope.shipMethod = [
			{value : 0, name : "专车"},
	    	{value : 1, name : "拼车"}
		];
		$scope.shipSelect = $scope.shipMethod[0];//默认选中
	
		//收货方式 option
		$scope.receiptMethod = [
			{value : 0, name : "配送"},
	    	{value : 1, name : "自取"}
		];
		$scope.receiptSelect = $scope.receiptMethod[0];//默认选中
		
		$scope.getValue = function(type){
			
		}
		
		
	
})





//{
//  'method': 'updateOrderPass',
//  'oldOrderId': '50',
//  'orderCode': '20160804103205',
//  'itemIds': '37,38',
//  'customerCode': 'B0002',
//  'customerName': '1军1师2团团救护所',
//  'orderTime': '2016-08-0310: 07: 50',
//  'deliveryTime': '2016-08-0510: 07: 50',
//  'receiptAddress': '上海张江',
//  'receiver': '李四',
//  'tel': '2212345678',
//  'intendDeliveryTime': '2016-08-0610: 07: 50',
//  'packageMethod': '0',
//  'shipMethod': '0',
//  'orderStatus': '1',
//  'orderItems': "[{'orderCode':'20160804103205','productCode':10000001,'productNumber':15,'total':150}]",
//  'memo': '备注更新'
//}

