app.controller('OrderQueryCtrl', function($scope,http){
	$scope.modalToggle = function(bool,item){
		$scope.modalState = bool;
		$scope.modalInfo = item;
	}
	var lists = [{
		id:1,
		shipMethod:"专门",
        payMethod:0,
        shipTime:"",
        level:0,
        oldOrderId:0,
        orderMark:0,
		orderTime: '2016-07-25 10:00:00',
		deliveryTime: '2016-08-03 10:00:00',
		customerCode: '90010011',
		customerName: '团救护所1',
		receiver: '王大锤',
		tel: '111111111111111',
		receiveMode: 'header1',
		receiptAddress: '地1',
		orderStatus: '已审核',
		memo: 'hello',
		orderProgress: '在配货',
		orderCode:'2016080210'
	},{
		id:2,
		shipMethod:"专门",
        payMethod:0,
        shipTime:"",
        level:0,
        oldOrderId:0,
        orderMark:0,
		orderTime: '2016-08-02 10:00:00',
		deliveryTime: '2016-08-04 17:50:00',
		customerCode: '90010012',
		customerName: '团救护所2',
		receiver: '张欣',
		tel: '2222222',
		receiveMode: 'header2',
		receiptAddress: '地2',
		orderStatus: '未审核',
		memo: '222',
		orderProgress: '在集货',
		orderCode:'2016080211'
	},{
		id:3,
		shipMethod:"专门",
        payMethod:0,
        shipTime:"",
        level:0,
        oldOrderId:0,
        orderMark:0,
		orderTime: '2016-08-03 10:00:00',
		deliveryTime: '2016-08-02 04:30:00',
		customerCode: '90010013',
		customerName: '团救护所3',
		receiver: '李楠',
		tel: '333333333',
		receiveMode: 'header3',
		receiptAddress: '地3',
		orderStatus: '有疑问',
		memo: '333',
		orderProgress: '在运输',
		orderCode:'2016080212'
	},
	{
		id:4,
		shipMethod:"专门",
        payMethod:0,
        shipTime:"",
        level:0,
        oldOrderId:0,
        orderMark:0,
		orderTime: '2016-08-03 10:00:00',
		deliveryTime: '2016-08-02 23:00:00',
		customerCode: '90010014',
		customerName: '团救护所4',
		receiver: '胡云',
		tel: '444444',
		receiveMode: 'header4',
		receiptAddress: '地4',
		orderStatus: '已审核',
		memo: '444',
		orderProgress: '在运输',
		orderCode:'2016080213'
	},{
		id:5,
		shipMethod:"专门",
        payMethod:0,
        shipTime:"",
        level:0,
        oldOrderId:0,
        orderMark:0,
		orderTime: '2016-08-04 10:00:00',
		deliveryTime: '2016-08-04 10:00:00',
		customerCode: '90010015',
		customerName: '团救护所5',
		receiver: '小红',
		tel: '5555555',
		receiveMode: 'header5',
		receiptAddress: '地5',
		orderStatus: '未审核',
		memo: '555',
		orderProgress: '在运输',
		orderCode:'2016080214'
	},{
		id:6,
		shipMethod:"专门",
        payMethod:0,
        shipTime:"",
        level:0,
        oldOrderId:0,
        orderMark:0,
		orderTime: '2016-08-05 10:00:00',
		deliveryTime: '2016-08-06 10:00:00',
		customerCode: '90010016',
		customerName: '团救护所6',
		receiver: '逍遥',
		tel: '666666',
		receiveMode: 'header6',
		receiptAddress: '地6',
		orderStatus: '已审核',
		memo: '6666',
		orderProgress: '在运输',
		orderCode:'2016080215'
	}];
	
//	$scope.orderList = lists;
	
	$scope.qureyInfo = {
	    'method':'queryAllOrders'
	}
	
//	$scope.orderQurey = function() {
			
			http.post($scope.qureyInfo,URL.orderQurey).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					$scope.orderList = respone.order;
					lists = respone.order;
//					alert("查询成功！")	
				},
				function(respone) {
					console.log("Order qurey failed!" + JSON.stringify(respone));
					$scope.orderList = lists;
					alert(respone);
			});
//		}
	
	$scope.filters = {
		key:'all',
		value:''
	};
	
	//查询状态
	$scope.qureyParam = [
		{key:'all',value:'全部'},
		{key:'orderStatus',value:'未审核'},
		{key:'orderStatus',value:'已审核'},
		{key:'orderStatus',value:'有疑问'},
		{key:'orderProgress',value:'在配货'},
		{key:'orderProgress',value:'在集货'},
		{key:'orderProgress',value:'在装载'},
		{key:'orderProgress',value:'在运输'}
	];
	
	//时间状态
	$scope.times = [{tip:'6小时 |',hours:6},{tip:'12小时 |',hours:12},{tip:'24小时 |',hours:24},
					{tip:'48小时|',hours:48},{tip:'72小时 ',hours:72}]
	
	//根据条件过滤订单
	$scope.filterOrder = function(obj){
		var tempArray = [];
		if(obj.key == 'all'){
			$scope.orderList = lists;
			return ;
		}
		angular.forEach(lists,function(item){
			if(item[obj.key] == obj.value){
				tempArray.push(item);
			}
		});
		$scope.orderList = tempArray;
	};
	

	// 根据交货时间查询
	$scope.filterTime = function(hours){
		
		var temp = [];
		var timestamp = Date.parse(new Date());
		timestamp = timestamp / 1000;
		
		angular.forEach(lists,function(item){
			var timestamp2 = Date.parse(new Date(item.deliveryTime));
			timestamp2 = timestamp2/1000;
			var ll = parseInt((timestamp2 - timestamp) / 60 / 60);
			if(ll < hours){
				temp.push(item);
			}
		});
		$scope.orderList = temp;
	};
	
	//根据收单时间查询
	$scope.qureyByOrderTime = function(){
		var temp = [];
		var time1 = Date.parse(new Date($scope.date1));
		var time2 = Date.parse(new Date($scope.date2));
		console.log("data1 is "+time1+"===date2 is "+time2);
		angular.forEach(lists,function(item){
			var time = Date.parse(new Date(item.orderTime));
			if(time < time2 && time >time1){
				temp.push(item);
			}
		});
		$scope.orderList = temp;
	}
	
})