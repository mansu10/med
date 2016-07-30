app.controller('OrderQueryCtrl', function($scope,http){
	$scope.modalToggle = function(bool){
		$scope.modalState = bool;
	}
	$scope.orderList = [{
		orderTime: '2016－07-25',
		deliveryTime: '2016-07-26',
		customerCode: '90010011',
		customerName: '团救护所',
		receiver: '王',
		tel: '13111111111',
		receiveMode: 'header',
		receiptAddress: '地址地址地址地址地址地址地址',
		unit: '件',
		orderStatus: '已审核',
		memo: '333',
		sum: '20',
		progress: '在运输'

	},{
		orderTime: '2016－07-25',
		deliveryTime: '2016-07-26',
		customerCode: '90010011',
		customerName: '团救护所',
		receiver: '王',
		tel: '13111111111',
		receiveMode: 'header',
		receiptAddress: '地址地址地址地址地址地址地址',
		unit: '件',
		orderStatus: '已审核',
		memo: '333',
		sum: '20',
		progress: '到达'

	},{
		orderTime: '2016－07-25',
		deliveryTime: '2016-07-26',
		customerCode: '90010011',
		customerName: '团救护所',
		receiver: '王',
		tel: '13111111111',
		receiveMode: 'header',
		receiptAddress: '地址地址地址地址地址地址地址',
		unit: '件',
		orderStatus: '已审核',
		memo: '333',
		sum: '20',
		progress: '在运输'

	}];
	
	$scope.qureyInfo = {
	    'method': 'queryOrder',
	    'orderTimeStart': '2016-07-2012: 21: 12',
	    'orderTimeStartEnd': '2016-07-2710: 00: 00',
	    'orderStatus': '0',
	    'orderProgress': '1',
	    'deliveryTime': '20160730240000'
	}
	
	$scope.orderQurey = function() {
			
			http.post($scope.qureyInfo,URL.orderQurey).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					alert("查询成功！")
					
				},
				function(respone) {
					console.log("Order qurey failed!" + JSON.stringify(respone));
					alert(respone);
			});
		}
})