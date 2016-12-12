app.controller('WareEntryCtrl', function($rootScope, $scope,http){
    //入库管理表
    $scope.entryInfo = {
    	"recevier":"收货人",
    	"receiveStore":"收货仓库",
    	"recevierTime":secondsToData(new Date().getTime()),
    	"goodsDes":"11111",
    	"resource":"来源",
    	"supplier":{
    		"supply":"大润发",
    		"linkMan":"李新雨",
    		"tel":"1111111111"
    	},
    	"deliver":{
    		"deliver":"1号店",
    		"linkMan":"田栋炜",
    		"tel":"22222222"
    	},
    	"receivingNote":"收货单",
    	"receivingCode":"凭证号",
    	"appearence":"外观",
    	"direction":"说明书",
    	"qualityReport":"质检报告",
    	"checkRecord":"验收",
    	"checkMan":"张益达",
    	"conclusion":"结论",
    	"remark":"备注"    	
    },
    
    //验收结论 option
		$scope.conclusion = [
			{value : 0, name : "合格"},
	    	{value : 1, name : "不合格"},
		];
		$scope.defaultSelect = $scope.conclusion[0];//默认选中
		
		//
		$scope.receiverType = [
			{value : 0, name : "请领收货"},
	    	{value : 1, name : "配发收货"},
	    	{value : 2, name : "外购收货"},
	    	{value : 3, name : "其他"}
		];
		$scope.receiverSelect = $scope.receiverType[0];//默认选中
    //明细列表
    $scope.items = [{
	            "name": "感冒通灵",	    
	            "productCode":"000002",
	            "size": "规格2",
	            "type": "型号2",
	            "unit": "12粒/盒",
	            "factory": "厂家2",	
	            "productionBatch":"002",
	            "purchasePrice": 1.00,
	            "quantity": 200,
	            "factoryTime":"2016-09-02",
	            "singleAmount":2,
	            "boxQuantity":3,
	            "smallAmount":6,
	            "boxMark":0,
	            "memo":"xxx",
	            "editDisabled":true
	        }	     
	    ];
	$scope.newItem = {};
	$scope.addItem = function(newItem){
		newItem.editDisabled = true;
		if(!newItem.smallAmount){
			newItem.smallAmount = newItem.boxQuantity * newItem.singleAmount;
		}
	
		$scope.items.push(newItem);
		return;
	}
	// 增加明细
	$scope.iptState = false;
	$scope.iptToggle = function(bool){
		$scope.iptState = bool;
	}
	$scope.iptReset = function(newItem){
		$scope.newItem = {};
	}
	$scope.iptSave = function(newItem){
		$scope.addItem(newItem);
		$scope.iptToggle(false);
		$scope.iptReset(newItem);
	}
	$scope.reset = function(){
		$scope.items = [];
		$scope.orderForm = {};
	}
	$scope.rmItem = function(index){
		$scope.items.splice(index,1);
		return;
	}
	
	$scope.edit = function(index){
		$scope.items[index].editDisabled = false;
	}
	//保存更改
	$scope.save = function(index){
		$scope.items[index].editDisabled = true;
	}
	//取消
	$scope.cancel = function(index){
		$scope.items[index].editDisabled = true;
	}
	//验收确认
	var AcceptanceRecord = {};
	$scope.confirm = function(){
		AcceptanceRecord = {
			'receiptType': $scope.receiverSelect.value,
	        'receiver': $scope.entryInfo.recevier,
	        'receiptDepot': $scope.entryInfo.receiveStore,
	        'receiptTime': $scope.entryInfo.recevierTime,
	        'goodsDescription': $scope.entryInfo.goodsDes,
	        'source': $scope.entryInfo.resource,
	        'supplierName': $scope.entryInfo.supplier.supply,
	        'supplierContacts': $scope.entryInfo.supplier.linkMan,
	        'supplierTel': $scope.entryInfo.supplier.tel,
	        'deliveryName': $scope.entryInfo.deliver.supply,
	        'deliveryContactes': $scope.entryInfo.deliver.linkMan,
	        'deliveryTel': $scope.entryInfo.deliver.tel,
	        'receiptCertificate': $scope.entryInfo.receivingNote,
	        'certificateNumber': $scope.entryInfo.receivingCode,
	        'acceptanceRecord': $scope.entryInfo.checkRecord,
	        'acceptor': $scope.entryInfo.checkMan,
	        'acceptanceResult': $scope.defaultSelect.name,
	        'memo': $scope.entryInfo.remark
		}
		
		submit();
	}
	
	var submit = function(){
		
		http.post({
				'method':'addReceiptAcceptanceRecord',
				'receiptAcceptanceRecord':JSON.stringify(AcceptanceRecord),
				'receiptItems':JSON.stringify($scope.items),
		        'agencyCode':$rootScope.user.agencyCode
			},URL.RARS).then(
				function(respone) {
					popAlert("已确认！")
				},
				function(respone) {
					console.log("addReceiptAcceptanceRecord failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}

})