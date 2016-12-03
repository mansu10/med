app.controller('WareShelvesCtrl', function($rootScope, $scope,http){

	$scope.items = [
			{
	            "id": 1,
	            "receiptCode": "20160906111111",
	            "receiptTime": "2016-09-06 11:11:11",
	            "goodsDescription": "货物描述",
	            "receiptType": "配发收货",
	            "supplierName": "供货商名称",
	            "deliveryName": "送货商"
	        },
	        {
	            "id": 2,
	            "receiptCode": "20160907121212",
	            "receiptTime": "2016-09-07 12:12:12",
	            "goodsDescription": "货物描述",
	            "receiptType": "外购收货",
	            "supplierName": "供货商名称",
	            "deliveryName": "送货商名称"
	        },
	        {
	            "id": 5,
	            "receiptCode": "20160907113740",
	            "receiptTime": "2016-09-07 11:37:40",
	            "goodsDescription": "11111",
	            "receiptType": "配发收货",
	            "supplierName": "大润发"
	        }
		];

	/**
	 * [stateBox 用于切换收货明细显示状态]
	 * 3种
	 * @type {Array}
	 */
	$scope.stateBox = [false, false, false];
	$scope.toggleState = function(index, event,receiptCode){
		var e = event;
		e.stopPropagation();
		for (var i = 0; i < $scope.stateBox.length; i++) {
			$scope.stateBox[i] = false;
		}
		$scope.stateBox[index] = true;
		$scope.queryDetail(receiptCode);
	}
	
	

	//收货查询
	$scope.queryReciver = function(){
		
		console.log("llllllllll:"+$scope.startTime+" / endTime :"+$scope.endTime);
		
		http.post({'method':'queryAllReceiptAcceptanceRecords','receiptTimeStartStr':$scope.startTime,'receiptTimeEndStr':$scope.endTime,
            'agencyCode':$rootScope.user.agencyCode},URL.RARS).then(
				function(respone) {
					$scope.items = respone.receiptAcceptanceRecords;
					console.log("=========queryAllReceiptAcceptanceRecords========="+JSON.stringify(respone));
				},
				function(respone) {
					console.log("queryAllReceiptAcceptanceRecords failed!" + JSON.stringify(respone));
					popAlert(respone);
		});
	}
	
	//明细查询
	$scope.queryDetail = function(receiptCode){
		http.post({'method':'queryRecordAndItemByCode','receiptCode':receiptCode,
            'agencyCode':$rootScope.user.agencyCode},URL.RARS).then(
				function(respone) {
					$scope.entryInfo = respone.receiptAcceptanceRecord;
					angular.forEach($scope.entryInfo.items,function(item){
						item.productArea = '';
						item.plotRatio = 0;
					})
					console.log("=========queryRecordAndItemByCode========="+JSON.stringify(respone));
				},
				function(respone) {
					console.log("queryRecordAndItemByCode failed!" + JSON.stringify(respone));
					popAlert(respone);
		});
	},
//	$scope.queryDetail();

//	{
//  "code": 0,
//  "receiptAcceptanceRecords": [
//      {
//          "id": 1,
//          "receiptCode": "20160906111111",
//          "receiptTime": "2016-09-06 11:11:11",
//          "goodsDescription": "货物描述",
//          "receiptType": "配发收货",
//          "supplierName": "供货商名称",
//          "deliveryName": "送货商"
//      },
//      {
//          "id": 2,
//          "receiptCode": "20160907121212",
//          "receiptTime": "2016-09-07 12:12:12",
//          "goodsDescription": "货物描述",
//          "receiptType": "外购收货",
//          "supplierName": "供货商名称",
//          "deliveryName": "送货商名称"
//      },
//      {
//          "id": 5,
//          "receiptCode": "20160907113740",
//          "receiptTime": "2016-09-07 11:37:40",
//          "goodsDescription": "11111",
//          "receiptType": "配发收货",
//          "supplierName": "大润发"
//      }
//  ]
//}

	$scope.receiverType = [
			{value : 0, name : "请领收货"},
	    	{value : 1, name : "配发收货"},
	    	{value : 2, name : "外购收货"},
	    	{value : 3, name : "其他"}
		];
		$scope.receiverSelect = $scope.receiverType[0];//默认选中
		
	//确认入库
	$scope.confirmEntryInfo = function(items){
		
		var stocks = [];
		angular.forEach(items,function(item){
				stocks.push({
					'productCode':item.productCode,
					'caseQuantity':item.quantity,
					'banchNumber':item.productionBatch,
					'locatorName':item.productArea,
					'caseNumber':item.boxMark,
					'factoryTime':item.factoryTime ,
					'status':1,
					'receiptCode':item.receiptCode ,
					'memo':item.memo
				});
		})
		
		http.post({'method':'addStock','stocks':JSON.stringify(stocks)},URL.stockQurey).then(
				function(respone) {
					console.log("=========入库提交========="+JSON.stringify(respone));
					popAlert("已成功入库！");
				},
				function(respone) {
					console.log("=========入库失败============" + JSON.stringify(respone));
					popAlert(JSON.stringify(respone));
		});
	}
	
	$scope.entryInfo = {
        "id": 1,
        "receiptCode": "20160906111111",
        "receiptTime": 1473174671000,
        "receiptDepot": "收货仓库",
        "receiver": "收货人",
        "goodsDescription": "货物描述",
        "supplierName": "供货商名称",
        "supplierContacts": "供货商联系人",
        "supplierTel": "供货商电话",
        "deliveryName": "送货商",
        "deliveryContactes": "送货商联系人",
        "deliveryTel": "送货商电话",
        "appearanceDetermination": 0,
        "manualDetermination": 0,
        "qualityDetermination": 0,
        "acceptanceRecord": null,
        "acceptor": null,
        "acceptanceResult": null,
        "receiptType": 1,
        "source": "来源",
        "memo": "备注",
        "receiptCertificate": "收货凭证",
        "certificateNumber": "凭证号",
        "items": [
            {
                "id": 1,
                "receiptCode": "20160906111111",
                "productCode": 10000001,
                "purchasePrice": 1.5,
                "boxMark": 0,
                "boxQuantity": 2,
                "quantity": 40,
                "factoryTime": 1470922737000,
                "productionBatch": "20160811",
                "memo": "收货明细",
                "product": {
                    "id": 1,
                    "productCode": 10000001,
                    "ordinaryName": "4430吸头",
                    "productName": "待补",
                    "specifications": "规格",
                    "unit": "个",
                    "minPrice": 100.1,
                    "minVolume": 0.01,
                    "minNumber": 1,
                    "minWeight": 1,
                    "price": 1.5,
                    "volume": 0.001,
                    "weight": 1,
                    "firstLevel": "试剂耗材",
                    "secondLevel": "耗材",
                    "manufactor": "厂家",
                    "approvalNumber": null,
                    "validity": 36,
                    "unitDose": 0,
                    "averageDose": 0,
                    "averageNumber": 0,
                    "maxNumber": 0,
                    "createTime": 1465398097000,
                    "model": "型号",
                    "minStock": 10,
                    "maxStock": 1000,
                    "supplier": "供应商"
                },
                "stock": {
                    "id": 8,
                    "productCode": 10000001,
                    "caseQuantity": 50,
                    "inStockTime": 1473476364000,
                    "outStockTime": null,
                    "banchNumber": 20160606,
                    "locatorName": "fenpeihuowei",
                    "locatorCode": null,
                    "memo": "入库",
                    "caseNumber": "2",
                    "status": 0,
                    "factoryTime": null,
                    "receiptCode": null,
                    "stockQuantity": 0,
                    "stockValue": 0,
                    "stockLevel": 0,
                    "stockStatus": null,
                    "product": null
                }
            }
        ]
    }
})