app.controller('OrderQueryCtrl', function($scope){
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
})