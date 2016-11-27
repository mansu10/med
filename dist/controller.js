app.controller('AllocateCheckCtrl', ["$scope", "http", "$timeout", function($scope, http, $timeout) {

    $scope.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    function setAlertClose(){
    	var timer = setTimeout(function(){
    		$scope.closeAlert(-1);
    	},5000)
    }

    $scope.stateBox = {
        "query": true,
        "print": false,
        "record": false
    }

    /**
     * 切换页面状态
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    $scope.changeState = function(option, orderCode) {

        for (o in $scope.stateBox) {
            $scope.stateBox[o] = false;
        }
        $scope.stateBox[option] = true;

        if (option == 'print') {
            printOrder(orderCode);
        } else if (option == 'record') {
            checkNote(orderCode);
        }
    }

    /*查询*/
    $scope.queryItem = {
        'orderCode': "",
        'demandAgencyName': '',
        'orderTimeStart': '',
        'orderTimeEnd': ''
    }
    $scope.queryAllOrdersWithDemandAgency = function() {
        http.post({
            'method': 'queryAllOrdersWithDemandAgency',
            'orderCode': $scope.queryItem.orderCode,
            'demandAgencyName': $scope.queryItem.demandAgencyName,
            'orderTimeStart': $scope.queryItem.orderTimeStart,
            'orderTimeEnd': $scope.queryItem.orderTimeEnd
        }, URL.OrderServlet).then(
            function(respone) {
                alert("查询成功");
                $scope.goods = respone.orders;
            },
            function(respone) {
                alert(JSON.stringify(respone));
            });
    };

    //打印拣货单
    var printOrder = function(orderCode) {
        http.post({
            'method': 'findOrderWithCheckByOrderCode',
            'orderCode': orderCode
        }, URL.OrderServlet).then(
            function(respone) {
                alert("打印拣货单查询成功");
                $scope.printOrder = respone.order;
                $timeout(function() {
                    $('#' + $scope.printOrder.orderCode).empty().barcode("" + $scope.printOrder.orderCode, "code128", { barWidth: 2, barHeight: 30, showHRI: false });
                }, 1000);
            },
            function(respone) {
                alert(JSON.stringify(respone));
            });
    };

    //复核记录
    $scope.checkVerify = function(orderCode) {
        http.post({
            'method': 'checkOrder',
            'orderCode': orderCode
        }, URL.PickListServlet).then(
            function(respone) {
                alert("复核确认成功！");
                $scope.checkNote = respone.pickLists;

            },
            function(respone) {
                alert(JSON.stringify(respone));
            });
    };

    //拣货记录
    var checkNote = function(orderCode) {

        http.post({
            'method': 'findPickListByOrderCode',
            'orderCode': orderCode
        }, URL.PickListServlet).then(
            function(respone) {
                alert("复核记录查询成功！");
                $scope.OrderNote = respone.pickLists;

            },
            function(respone) {
                alert(JSON.stringify(respone));
            });
    };

    $scope.updateOrderNote = function() {
        var temp = [];

        angular.forEach($scope.OrderNote.pickListItems, function(item) {
            temp.push({
                'productCode': item.productCode,
                'pickListRecord': item.pickListRecord,
                'checkRecord': item.checkRecord
            })
        });

        http.post({
            'method': 'updatePickListItem',
            'orderCode': $scope.OrderNote.orderCode,
            'pickListItems': JSON.stringify(temp)
        }, URL.PickListServlet).then(
            function(respone) {
                alert("复核记录保存成功！");

            },
            function(respone) {
                alert(JSON.stringify(respone));
            });
    }

    $scope.stringItemList = function(obj) {
        return JSON.stringify(obj[index]);

    }
}])

app.controller('AllocateGoodsCtrl', ["$scope", "http", "$timeout", "$location", "$state", function($scope,http,$timeout,$location, $state){
	$scope.stateFactory = {
		"query": true,
		"print": false,
		"record": false
	}
	/**
	 * 切换页面状态
	 * @param  {[type]} option [description]
	 * @return {[type]}        [description]
	 */
	$scope.changeState = function(option,orderCode){
	
		for(o in $scope.stateFactory){
			$scope.stateFactory[o] = false;
		}
		$scope.stateFactory[option] = true;
		if (option == 'print') {
			printOrder(orderCode);
		} else if(option == 'record'){
			OrderNote(orderCode);
		}
	}
	
	var code11 = function(id){
//		alert("生成条形码!");
//		id = "bcTarget";
		$('#'+id).empty().barcode(""+id, "code128",{barWidth:2, barHeight:30,showHRI:false});
	}

	/*查询*/
	$scope.queryItem = {
		'orderCode':"",
		'demandAgencyName': '',
		'orderTimeStart':'',
		'orderTimeEnd':''
	}
	$scope.queryAllOrdersWithDemandAgency = function(){
		http.post({
				'method': 'queryAllOrdersWithDemandAgency',
				'orderCode': $scope.queryItem.orderCode,
				'demandAgencyName': $scope.queryItem.demandAgencyName,
				'orderTimeStart':$scope.queryItem.orderTimeStart,
				'orderTimeEnd':$scope.queryItem.orderTimeEnd
			}, URL.OrderServlet).then(
				function(respone) {
					alert("查询成功");
					$scope.goods = respone.orders;
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	}
	
	//打印拣货单
	var printOrder = function(orderCode){
		http.post({
				'method': 'findPickListsByOrderCode',
				'orderCode': orderCode
			}, URL.PickListServlet).then(
				function(respone) {
					alert("拣货单查询成功");
					$scope.printOrders = respone.pickLists;

					$timeout(function() {
						createbcTarget($scope.printOrders);
            		}, 1000);
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	};
	
	$scope.renderFinish = function(){
    	console.log('渲染完之后的操作');
	}
	
	var createbcTarget = function(items){
		angular.forEach(items,function(item){
			code11(item.pickListCode);
			console.log("----------------"+item.pickListCode);
		});
	}
	
	//拣货记录
	var OrderNote = function(orderCode){
		http.post({
				'method': 'findPickListByOrderCode',
				'orderCode': orderCode
			}, URL.PickListServlet).then(
				function(respone) {
					alert("拣货记录查询成功！");
					$scope.OrderNote = respone.pickLists;
		
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	};
	
	$scope.updateOrderNote = function(){
		var temp = [];
		
		angular.forEach($scope.OrderNote.pickListItems,function(item){
			temp.push({
				'productCode':item.productCode,
				'pickListRecord':item.pickListRecord
			})
		});
		
		http.post({
				'method': 'updatePickListItem',
				'orderCode': $scope.OrderNote.orderCode,
				'pickListItems':JSON.stringify(temp)
			}, URL.PickListServlet).then(
				function(respone) {
					alert("拣货记录保存成功！");
					
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	}

	$scope.stringItemList = function(obj){
		return JSON.stringify(obj[index]);

	}
}])

app.controller('CollectStorageCtrl', ["$scope", "$rootScope", "http", "instruct", function($scope,$rootScope, http, instruct){
	instruct.set(['555']);
	$rootScope.$broadcast('instructChange');
	// 需ajax请求列表
	$scope.storageList = [{
	            "medicName": "健胃消食片",
	            "medicCode": "A00101",
	            "spec": "规格1",
	            "type": "型号1",
	            "unit": "24粒/盒",
	            "vender": "厂家1",
	            "location": "货位1",
	            "boxNum": "001",
	            "price": 1.00,
	            "inventory": 100,
	            "inventValue": 0,
	            "minInvent": 1,
	            "maxInvent": 1000,
	            "inventLevel": 3/4,
	            "status": {value : 2, name : "正常",color:"success"}
	        },{
	            "medicName": "感冒通灵",
	            "medicCode": "A00102",
	            "spec": "规格2",
	            "type": "型号2",
	            "unit": "12粒/盒",
	            "vender": "厂家2",
	            "location": "货位2",
	            "boxNum": "002",
	            "price": 2.00,
	            "inventory": 20,
	            "inventValue": 0,
	            "minInvent": 30,
	            "maxInvent": 100,
	            "inventLevel": 1/2,
	            "status": {value : 0, name : "不足",color:"warning"},
	        },{
	            "medicName": "清热解毒胶囊",
	            "medicCode": "A00103",
	            "spec": "规格3",
	            "type": "型号3",
	            "unit": "12粒/盒",
	            "vender": "厂家3",
	            "location": "货位3",
	            "boxNum": "003",
	            "price": 1.00,
	            "inventory": 1110,
	            "inventValue": 0,
	            "minInvent": 130,
	            "maxInvent": 500,
	            "inventLevel": 1/4,
	            "status": {value : 1, name : "超量",color:"danger"}
	        }
	    ];
	    
	//库存状态 option
	$scope.inventStatus = [
			{value : 0, name : "不足",color:"warning"},
	    	{value : 1, name : "超量",color:"danger"},
	    	{value : 2, name : "正常",color:"success"},
	    	{value : 3, name : "全部",color:"success"}
		];
	$scope.defaultSelect = $scope.inventStatus[3];//默认选中
		
	//查询库存信息
	$scope.queryStorage = function(){
		http.post({'method':'queryAllStocks','productCodeOrName':$scope.qureyValue},URL.stockQurey).then(
				function(respone) {
					alert("queryAllStocks success!");
					refreshStorageList(respone.stocks);
				},
				function(respone) {
					console.log("queryAllStocks failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}
	$scope.queryStorage();
	
	function refreshStorageList(list){
		var tempList = [];
		angular.forEach(list,function(item){
			if($scope.defaultSelect.value == 0 && item.stockQuantity >= item.product.minStock){
				console.log("库存不足时查询商品，不符合条件跳过"+item.stockQuantity+"/ "+item.product.minStock);
				return;
			}
			if($scope.defaultSelect.value == 1 && item.stockQuantity <= item.product.maxStock){
				console.log("库存超量时查询商品，不符合条件跳过"+item.stockQuantity+"/ "+item.product.maxStock);
				return;
			}
			if($scope.defaultSelect.value == 2 && (item.stockQuantity < item.product.minStock || item.stockQuantity > item.product.maxStock)){
				console.log("库存正常时查询商品，不符合条件跳过"+item.stockQuantity+"/ "+item.product.minStock+"/ "+item.product.maxStock);
				return;
			}
			tempList.push({
	            "medicName": item.product.productName,
	            "medicCode": item.productCode,
	            "spec": item.product.specifications,
	            "type": item.product.model,
	            "unit": item.product.unit,
	            "vender": item.product.manufactor,
	            "location": item.locatorName,
	            "boxNum": item.locatorCode,
	            "price": item.product.price,
	            "inventory": item.stockQuantity,
	            "inventValue": item.stockValue,
	            "minInvent": item.product.minStock,
	            "maxInvent": item.product.maxStock,
	            "inventLevel": item.stockLevel,
	            "status": getStatus(item.stockQuantity,item.product.minStock,item.product.maxStock)
	       });
		});
		$scope.storageList = tempList;
	}
	
	function getStatus(inventory,min,max){
		if(inventory > max){
			return {value : 1, name : "超量",color:"danger"};
		}else if(inventory < min){
			return {value : 0, name : "不足",color:"warning"};
		}else{
			return {value : 2, name : "正常",color:"success"};
		} 
	}
}])
app.controller('CollectSupplementCtrl', ["$rootScope", "$scope", "http", "instruct", function($rootScope, $scope,http, instruct){
	instruct.set(['666']);
	$rootScope.$broadcast('instructChange');
	// 需ajax请求列表
	$scope.storageList = [{
	            "medicName": "健胃消食片",
	            "medicCode": "A00101",
	            "spec": "规格1",
	            "type": "型号1",
	            "unit": "24粒/盒",
	            "vender": "厂家1",
	            "price": 1.00,
	            "inventory": 100,
	            "minInvent": 1,
	            "maxInvent": 300,
	            "inventLevel": 3/4,
	            "supplier": "供应商",
	            "approvalNumber":0,
	            "status": {value : 2, name : "正常",color:"success"}
	        },{
	            "medicName": "感冒通灵",
	            "medicCode": "A00102",
	            "spec": "规格2",
	            "type": "型号2",
	            "unit": "12粒/盒",
	            "vender": "厂家2",	         
	            "price": 1.00,
	            "inventory": 30,	            
	            "minInvent": 100,
	            "maxInvent": 200,
	            "inventLevel": 1/2,
	            "supplier": "供应商",
	            "approvalNumber":0,
	            "status": {value : 0, name : "不足",color:"warning"}
	        },{
	            "medicName": "清热解毒胶囊",
	            "medicCode": "A00103",
	            "spec": "规格3",
	            "type": "型号3",
	            "unit": "12粒/盒",
	            "vender": "厂家3",
	            "location": "货位3",
	            "boxNum": "003",
	            "price": 1.00,
	            "inventory": 600,
	            "inventValue": 0,
	            "minInvent": 130,
	            "maxInvent": 300,
	            "inventLevel": 1/3,
	            "supplier": "供应商",
	            "approvalNumber":300,
	            "status": {value : 1, name : "超量",color:"danger"}
	        }
	    ];
	    
	    //库存状态 option
		$scope.inventStatus = [
			{value : 0, name : "不足"},
	    	{value : 1, name : "超量"},
	    	{value : 2, name : "正常"},
	    	{value : 3, name : "全部"}
		];
		$scope.defaultSelect = $scope.inventStatus[3];//默认选中
		
	//查询库存信息
	$scope.queryStorage = function(){
		http.post({'method':'queryAllStocks','productCodeOrName':$scope.qureyValue},URL.stockQurey).then(
				function(respone) {
					
					alert("queryAllStocks success!");
					refreshStorageList(respone.stocks);
				},
				function(respone) {
					console.log("queryAllStocks failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}
	$scope.queryStorage();
	
	function refreshStorageList(list){
		var tempList = [];
		angular.forEach(list,function(item){
			if($scope.defaultSelect.value == 0 && item.stockQuantity >= item.product.minStock){
				console.log("库存不足时查询商品，不符合条件跳过"+item.stockQuantity+"/ "+item.product.minStock);
				return;
			}
			if($scope.defaultSelect.value == 1 && item.stockQuantity <= item.product.maxStock){
				console.log("库存超量时查询商品，不符合条件跳过"+item.stockQuantity+"/ "+item.product.maxStock);
				return;
			}
			if($scope.defaultSelect.value == 2 && (item.stockQuantity < item.product.minStock || item.stockQuantity > item.product.maxStock)){
				console.log("库存正常时查询商品，不符合条件跳过"+item.stockQuantity+"/ "+item.product.minStock+"/ "+item.product.maxStock);
				return;
			}
			tempList.push({
	            "medicName": item.product.productName,
	            "medicCode": item.productCode,
	            "spec": item.product.specifications,
	            "type": item.product.model,
	            "unit": item.product.unit,
	            "vender": item.product.manufactor,
	            "location": item.locatorName,
	            "boxNum": item.locatorCode,
	            "price": item.product.price,
	            "inventory": item.stockQuantity,
	            "inventValue": item.stockValue,
	            "minInvent": item.product.minStock,
	            "maxInvent": item.product.maxStock,
	            "inventLevel": item.stockLevel,
	            "supplier": item.product.supplier,
	            "approvalNumber":item.product.maxStock - item.stockQuantity,
	            "status": getStatus(item.stockQuantity,item.product.minStock,item.product.maxStock)
	       });
		});
		$scope.storageList = tempList;
	}
	
	function getStatus(inventory,min,max){
		if(inventory > max){
			return {value : 1, name : "超量",color:"danger"};
		}else if(inventory < min){
			return {value : 0, name : "不足",color:"warning"};
		}else{
			return {value : 2, name : "正常",color:"success"};
		} 
	}
	
	$scope.selected = [];
    $scope.selectedTags = [];
    $scope.selectedList = [];
 
    var updateSelected = function(action,item,name){
    	var id = item.medicCode
        if(action == 'add' && $scope.selected.indexOf(id) == -1){
             $scope.selected.push(id);
             $scope.selectedTags.push(name);
             $scope.selectedList.push(item);
        }
        if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
             var idx = $scope.selected.indexOf(id);
             $scope.selected.splice(idx,1);
             $scope.selectedTags.splice(idx,1);
             $scope.selectedList.splice(idx,1);
        }
        console.log("=========$scope.selected=========="+JSON.stringify($scope.selected));
        console.log("=========$scope.selectedTags=========="+JSON.stringify($scope.selectedTags));
        console.log("=========selectedList=========="+JSON.stringify($scope.selectedList));
    }
 
    $scope.updateSelection = function($event, item){
         var checkbox = $event.target;
         var action = (checkbox.checked?'add':'remove');
         updateSelected(action,item,checkbox.name);
    }
 
    $scope.isSelected = function(id){
         return $scope.selected.indexOf(id)>=0;
    }
    
    $scope.inventList = [];
    //添加商品到筹措清单列表
    $scope.addInventory = function(){
//  	temp = $scope.selectedList.concat();
//  	temp = [];
//  	$scope.inventList = angular.copy($scope.selectedList);
    	angular.forEach(angular.copy($scope.selectedList),function(item){
    		if(!containSubCategory(item)){
    			item.editDisabled = true;
    			$scope.inventList.push(item);
    		}
    	})
    	
//  	$scope.inventList.orderAmount = $scope.inventList.maxInvent - $scope.inventList.inventory;
    }
    
    //判断数组中是否包含某对象
    function containSubCategory(element){
    	for (var i= 0;i<$scope.inventList.length;i++) {
    		if($scope.inventList[i].medicCode == element.medicCode){
    			return true;
    		}
    	}
    	return false;
    }
    
    //确认筹措清单
	$scope.confirmInventory = function(){
		
		var temp = [];
		angular.forEach($scope.inventList,function(item){
			temp.push({'productCode':item.medicCode,'orderAmount':item.approvalNumber,'memo':'筹措清单备注'})
		});
		
		var submitInfo = {'productCode':'10000001','orderAmount':'30','memo':'筹措清单备注'};
		
		http.post({'method':'addRaiseInventory','inventorys':JSON.stringify(temp)},URL.raiseInventory).then(
				function(respone) {
		
					alert("筹措清单提交成功！")
				},
				function(respone) {
					console.log("addRaiseInventory failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}
	
	//编辑订购量
	$scope.editDisabled = true;
	$scope.editOrderAmount = function(index){
		$scope.inventList[index].editDisabled = false;
	}
	//删除清单项
	$scope.remove = function(index){
		$scope.inventList.splice(index,1);
	}
	//保存更改
	$scope.save = function(index){
		$scope.inventList[index].editDisabled = true;
	}
	//取消
	$scope.cancel = function(index){
		$scope.inventList[index].editDisabled = true;
		$scope.inventList[index].approvalNumber = $scope.inventList[index].maxInvent - $scope.inventList[index].inventory;
	}
}])
app.controller('DicSingleCtrl', ["$scope", "http", "instruct", function($scope,http, instruct){
	instruct.set(['']);
	$rootScope.$broadcast('instructChange');

	var currentIndex = 0;
	$scope.medList = [];
	$scope.editMode = true;
	$scope.addMode = false;

	$scope.midware = {
	}
	
	$scope.medTypeList = ['单品','成套'];
	
	function setMidware(item){
		$scope.midware = angular.copy(item);
	}
	
	function clearMidware(){
		$scope.midware = {};
	}


	/**
	 * 药材查询
	 * @type {Object}
	 */
	$scope.queryInfo = {
		'medName': '',
		'medType': ''
	}
	$scope.queryMed = function(){
		http.post({
				'method': 'queryProduct',
				'productName': $scope.queryInfo.medName,
				'herbsType': $scope.queryInfo.medType
			}, URL.ProductServlet).then(
				function(respone) {
					alert("查询成功");
					$scope.medList = respone.products;
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	}


	/**
	 * 显示详情
	 * @type {Boolean}
	 */
	$scope.detailState = false;
	$scope.toggleDetailState = function(bool) {
		
		$scope.detailState = bool;
	}

	/**
	 * 显示明细
	 * @param  {[type]} item [description]
	 * @return {[type]}      [description]
	 */
	$scope.showDetails = function(item,index){
		setMidware(item);
        currentIndex = index;
		$scope.toggleDetailState(true);
		backUpObj = angular.copy(item);
		$scope.addMode = false;
		$scope.editMode = true;
	}

	/**
	 * 新建单一药材
	 * @return {[type]} [description]
	 */
	$scope.openSingleDetail = function(){
		clearMidware();
		$scope.toggleDetailState(true);
		$scope.addMode = true;
		$scope.editMode = false;
	}

	/**
	 * 返回查询列表
	 * @return {[type]} [description]
	 */
	$scope.backToQuery = function(){

		$scope.toggleDetailState(false);
	}
	
	$scope.modifyDetail = function(){
		$scope.editMode = !$scope.editMode;
		if($scope.editMode){
			$scope.midware = angular.copy(backUpObj);
		}
	}
	var backUpObj;
	$scope.saveDetail = function(){
		if($scope.addMode){
			if(isEmptyValue($scope.midware)){
				return;
			}
			addMedList(angular.copy($scope.midware));
			return;
		}
		
		if(!$scope.editMode){//保存
			$scope.editMode = true;
			$scope.medList[currentIndex] = angular.copy($scope.midware)
			updateMedList($scope.midware);
		}else{//取消
			
		}
		
	}
	
	/************************选择删除  start*****************************/
	$scope.selected = [];
	var updateSelected = function(action, index) {
		var id = index;
		if(action == 'add' && $scope.selected.indexOf(id) == -1) {
			$scope.selected.push(id);
		}
		if(action == 'remove' && $scope.selected.indexOf(id) != -1) {
			var idx = $scope.selected.indexOf(id);
			$scope.selected.splice(idx, 1);
		}
		console.log("=========$scope.selected==========" + JSON.stringify($scope.selected));
	}

	$scope.updateSelection = function($event, index) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, index);
	}

	$scope.isSelected = function(id) {
		return $scope.selected.indexOf(id) >= 0;
	}

	/**
	 * 根据编号删除对应的供应机构
	 */
	$scope.delMedListById = function() {

			var deleteID = '';
			if(isEmptyValue($scope.selected)) {
				alert("请先选择删除项！！")
				return;
			}
			$scope.selected.sort( // 数组批量删除必须降序排序  不然会出问题
				function(a, b) {
					return b - a
				}
			);
			console.log("=========$scope.selected del ==========" + JSON.stringify($scope.selected));
			var tempList = angular.copy($scope.medList);
			angular.forEach($scope.selected, function(item) { //根据坐标批量删除选择的机构 
				deleteID = tempList[item].id + ',' + deleteID;
				console.log("========= del ==========" + item);
				$scope.medList.splice(item, 1);
			});

			if(isEmptyValue(deleteID)) {
				alert("提交的删除项编号为空，请检查后重新提交！！")
				return;
			}
			http.post({
				'method': 'deleteProduct',
				'ids': deleteID.substring(0, deleteID.length - 1)
			}, URL.ProductServlet).then(
				function(respone) {
					alert("删除成功");
				},
				function(respone) {
					console.log("deleteSupplyAgency failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
					$scope.medList = tempList;
				});

			$scope.selected = [];
		}
		/************************选择删除  end*****************************/
	
	var updateMedList = function(item){
		http.post({
				'method': 'updateProduct',
				'product': JSON.stringify(item)
			}, URL.ProductServlet).then(
				function(respone) {
					alert("已更新修改！");
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	}
	
	var addMedList = function(item){
		http.post({
				'method': 'addProduct',
				'product': JSON.stringify(item)
			}, URL.ProductServlet).then(
				function(respone) {
					alert("已添加！");
					$scope.midware.id = respone.id;
					$scope.medList.push(angular.copy($scope.midware));
					$scope.toggleDetailState(false);
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	}
//	$scope.medList = [
//      {
//          "id": 1,
//          "productCode": 10000001,
//          "ordinaryName": "4430吸头",
//          "productName": "待补",
//          "specifications": "规格",
//          "unit": "个",
//          "minPrice": 0,
//          "minVolume": 0,
//          "minNumber": 0,
//          "minWeight": 0,
//          "price": 1.5,
//          "volume": 0,
//          "weight": 0,
//          "firstLevel": "试剂耗材",
//          "secondLevel": "耗材",
//          "manufactor": "厂家",
//          "approvalNumber": null,
//          "validity": 36,
//          "unitDose": 0,
//          "averageDose": 0,
//          "averageNumber": 0,
//          "maxNumber": 0,
//          "createTime": null,
//          "model": "型号",
//          "minStock": 0,
//          "maxStock": 0,
//          "supplier": null,
//          "herbsType": "单一",
//          "controlCode": null,
//          "unityProductCode": null,
//          "pinyinCode": null,
//          "thirdLevel": null,
//          "managementClassification": null,
//          "storageCoditions": null,
//          "storageMin": 0,
//          "storageMax": 0,
//          "standard1": null,
//          "standard2": null,
//          "standard3": null,
//          "standard4": null,
//          "standard5": null,
//          "specificationSets": null,
//          "caseType": null,
//          "caseNumber": 0,
//          "singleBoxVolume": 0,
//          "setVolume": 0,
//          "setPrice": 0,
//          "setWeight": 0,
//          "formulations": null,
//          "manufactorCode": null,
//          "minUnit": null,
//          "minConversionRatio": 0,
//          "material": null,
//          "minMaterial": null,
//          "maxUnit": null,
//          "maxConversionRatio": 0,
//          "maxLength": 0,
//          "maxWidth": 0,
//          "maxHeigth": 0,
//          "locatorCode": null
//      }]
	

}])
app.controller('DistrLoadCtrl', ["$scope", "http", function($scope,http){

	/**
	 * 切换车辆
	 * 
	 */
	$scope.currentIndex = 0;
	$scope.carDetail = {
		'id': '车辆ID',
		'carCode': '车辆编号',
		'carVolume': '车辆容积',
		'maxWeight': '最大载重'
	};
	/**
	 * [chgCar description]
	 * @param  {number} param 1:next -1:previous
	 * @return {null}
	 */
	$scope.chgCar = function(param){
		var cars = $scope.vehicleList.cars;
		if (param<0 && $scope.currentIndex != 0) {
			$scope.currentIndex--;
			$scope.carDetail = cars[$scope.currentIndex];
		}else if(param>0 && $scope.currentIndex != cars.length-1){
			$scope.currentIndex++;
			$scope.carDetail = cars[$scope.currentIndex];
		}
	}
	function clone(t, obj){
		var cp = {};
		for(var o in t){
			cp[o] = obj[o];
		}
		return cp;
	} 
	function construct(list){
		var t = {
			'id': '',
			'carCode': '',
			'carVolume': '',
			'maxWeight': ''
		};
		for (var i = 0; i < list.cars.length; i++) {
			var item = clone(t, list.cars[i]);
			//angular.copy
			item.orders = [];
			$scope.transportList.push(item);
			// console.log($scope.transportList);
		}
	}
	$scope.transportList = [];

	// 获取ajax数据存放对象
	$scope.vehicleList = {};
	http.post({'method':'queryAllCars','numberOrType':''},URL.carQurey).then(
			function(respone) {
				// console.log(JSON.stringify(respone));
				$scope.vehicleList = respone;
				$scope.carDetail = $scope.vehicleList.cars[0]; 

				construct($scope.vehicleList);
			},
			function(respone) {
				console.log("Order qurey failed!" + JSON.stringify(respone));
				alert(respone);
		});

	/**
	 * [loadOrders description]
	 * @return {[type]} [description]
	 */
	$scope.orders = [{
		orderCode: '2011010101',
		receiptAddress: '2ewewewewe',
		volume: '2000',
		weight: '900'
	},{
		orderCode: '2011010991',
		receiptAddress: '2ewewewewe',
		volume: '200',
		weight: '1000'
	},{
		orderCode: '2011056701',
		receiptAddress: '2ewewewewe',
		volume: '7000',
		weight: '1400'
	},{
		orderCode: '2011033301',
		receiptAddress: '2ewewewewe',
		volume: '2900',
		weight: '1900'
	}];
	$scope.checkedOrder = [];
	$scope.addToTemp = function(index){
		$scope.checkedOrder.push($scope.orders[index]);
	}
	$scope.loadOrders = function(){
		$scope.transportList[$scope.currentIndex].orders
		.concat($scope.checkedOrder);
	}

    $scope.genre = [
//                    {
//                    city:"配送区域",
//                    cityGenre:[{
//                        distributionSites: "配送点",
//                        genreNumber:[{
//                            order:"订单号",
//                            piece:"件数",
//                            bulk:"体积",
//                            weight:"重量",
//                            deliveryTime:"交货期限",
//                            remainingTime:"剩余时间",
//                            stowage:"配载选择"
//                        }]
//                    }]
//
//                },
        {
        city:"浙江",
        cityGenre:[{
            distributionSites: "杭州",
            genreNumber:[{
                order:"2016hz1111",
                piece:"hz1",
                bulk:"hz28",
                weight:"hz120",
                deliveryTime:"hz2016-08-19",
                remainingTime:"hz24h",
                stowage:"hz444"
            }]
        },{
            distributionSites: "嘉兴",
            genreNumber:[{
                order:"2016jx22222222",
                piece:"jx1",
                bulk:"jx28",
                weight:"jx120",
                deliveryTime:"2jx016-08-19",
                remainingTime:"jx24h",
                stowage:"jx444"
            },{
                order:"20162jxv2224422",
                piece:"jxv2",
                bulk:"3jxv8",
                weight:"1jxv40",
                deliveryTime:"20jxv16-08-18",
                remainingTime:"jxv20h"
            }]
        },{
            distributionSites: "湖州",
            genreNumber:[{
                order:"201hz622222222",
                piece:"hz1",
                bulk:"2hz8",
                weight:"hz120",
                deliveryTime:"2hz016-08-19",
                remainingTime:"2hz4h",
                stowage:"4hz44"
            },{
                order:"2016hzs22224422",
                piece:"hzs2",
                bulk:"3hzs8",
                weight:"1hzs40",
                deliveryTime:"20hzs16-08-18",
                remainingTime:"2hzs0h"
            },{
                order:"20162hzd2224422",
                piece:"hzd2",
                bulk:"3hzd8",
                weight:"14hzd0",
                deliveryTime:"2hzd016-08-18",
                remainingTime:"2hzd0h"
            }]
        }]

    },{
        city:"dd江",
        cityGenre:[{
            distributionSites: "嘉ddd兴",
            genreNumber:"111"
        }]

    }
    ];
    $scope.car = [{brand:"NB0000"},{brand:"NB0002"},{brand:"NB0003"},{brand:"NB0004"},{brand:"NB0005"},{brand:"NB0006"},{brand:"NB0007"},{brand:"NB0008"},{brand:"NB0009"}];




}])
app.controller('DistrVehicleCtrl', ["$scope", "http", function($scope,http){
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
		$scope.updateCars(JSON.stringify($scope.tempItem));
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
    
    
}])
app.controller('HeaderCtrl', ["$rootScope", "$scope", "$localstorage", "instruct", function($rootScope, $scope,$localstorage, instruct){
	$rootScope.collapse = false;
	$scope.toggle = function(){
		$rootScope.collapse = !$rootScope.collapse;
	}
	
	var user1 = $localstorage.getObject("user");
	$scope.username = user1.userName;
	// console.log("USER2==="+JSON.stringify(user1)+"-----"+$scope.username)

	$scope.userInfo = false;
	$scope.toggleUserInfo = function(){
		$scope.userInfo = !$scope.userInfo;

	}

	$scope.itemList = instruct.get();
	// $scope.itemLists = ['llll'];
	
	$scope.$on('instructChange', function(){
		$scope.itemList = instruct.get();
		// $scope.itemLists = ['kkk'];
	})
	
	$scope.isInstruct = false;
	$scope.toggleInstruct = function(){
		$scope.isInstruct = !$scope.isInstruct;
	}

}])
app.controller('IndexCtrl', ["$scope", "$rootScope", "http", function($scope,$rootScope,http){

}])
app.controller('InstDemandCtrl', ["$scope", "http", function($scope,http){
	
	$scope.detailState = false;//查看详情
	$scope.addState = false;//新增
	$scope.editMode = true;//编辑模式（明细）
	var currentIndex = 0;
	
	/**
	 * 切换至明细界面
	 * @type {Boolean}
	 */
	$scope.toggleDetailState = function(bool,item,index) {
		$scope.detailState = bool;
		$scope.editMode = true;//不可修改
		$scope.addState = false;
		currentIndex = index;
		$scope.demandAgency = angular.copy(item);
	}
	
	/**
	 * 切换至机构添加界面
	 * @type {}
	 */
	$scope.toggleAddState = function(){
		$scope.addState = true;
		$scope.detailState = true;
		$scope.editMode = false;//可修改
		$scope.demandAgency = {};
	}

	/**
	 * 切换至编辑模式 (明细修改)
	 * @type {Boolean}
	 */
	$scope.toggleEditMode = function(bool) {
		$scope.editMode = bool;
		$scope.addState = false;
	}
	
	/**
	 * 切换至编辑模式 机构修改
	 * @type {Boolean}
	 */
	$scope.editDemandAgency = function(item,index) {
		$scope.editMode = false;
		$scope.detailState = true;
		$scope.addState = false;
		currentIndex = index;
		$scope.demandAgency = angular.copy(item);
	}
	
	/**
	 * 保存
	 */
	$scope.saveAddOrDetailInfo = function() {
		if(isEmptyValue($scope.demandAgency)){
			alert("请填写内容后再进行保存！！")
			return;
		}
		$scope.editMode = false;
		$scope.detailState = false;
		if ($scope.addState) {//添加
			addDemandAgency();
//			$scope.demandAgencyList.push(angular.copy($scope.demandAgency));
		} else{//修改
			$scope.demandAgencyList[currentIndex] = angular.copy($scope.demandAgency);
			updateDemandAgency();
		}
		
	}
	
	//查询模块
	$scope.type = [
	    '',
		'师救护所',
		'团救护所',
		'营救护所',
		'野战医疗所',
		'野战医疗队',
		'野战医院',
		'基地医院'
	],
	$scope.selectedName = '';//机构类型
	$scope.demandAgencyName = '';//机构名称
	/**
	 * 查询需求机构
	 * @type {查询条件 ：1.机构名称  2.机构类型}
	 */
	$scope.queryDemandAgency = function(){
	
		http.post({
				'method':'findAllDemandAgencys',
				'demandAgencyType':$scope.selectedName,
				'demandAgencyCode':$scope.demandAgencyName
			},URL.DemandAgencyServlet).then(
				function(respone) {
					console.log("========= findAllDemandAgencys success！========="+JSON.stringify(respone));
					$scope.demandAgencyList = respone.demandAgencies;
					alert("findAllDemandAgencys success！")
				},
				function(respone) {
					console.log("findAllDemandAgencys failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
	
	$scope.demandAgencyList = [
//		{
//			'demandAgencyCode': 'B00001',
//	        'demandAgencyName': '1军1师1团团救护所',
//	        'demandAgencyType': '团救护所',
//	        'demandAgencyLevel': '级别',
//	        'demandAgencyAddress1': '浙江省湖州市吴兴区',
//	        'demandAgencyAddress2': '车站路9号',
//	        'demandAgencyCoordinate': '120.104566,30.861911',
//	        'demandAgencyNumber': 30,
//	        'demandAgencyProtect': '20',
//	        'contacts': '王建国',
//	        'tel': '13902102101'
//		}
	]
	
	$scope.demandAgency = {
//		'demandAgencyCode': 'B00001',
//      'demandAgencyName': '1军1师1团团救护所',
//      'demandAgencyType': '团救护所',
//      'demandAgencyLevel': '级别',
//      'demandAgencyAddress1': '浙江省湖州市吴兴区',
//      'demandAgencyAddress2': '车站路9号',
//      'demandAgencyCoordinate': '120.104566,30.861911',
//      'demandAgencyNumber': 30,
//      'demandAgencyProtect': '20',
//      'contacts': '王建国',
//      'tel': '13902102101'
	}
	
	/**
	 * 添加需求机构
	 * @type {}
	 */
	var addDemandAgency = function(){
		
		http.post({
				'method':'addDemandAgency',
				'demandAgency':JSON.stringify($scope.demandAgency)
			},URL.DemandAgencyServlet).then(
				function(respone) {
			
					$scope.demandAgency.id = respone.id;
					$scope.demandAgencyList.push(angular.copy($scope.demandAgency));
					alert("addDemandAgency success!")
				},
				function(respone) {
					console.log("demandAgency failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
	/**
	 * 更新需求机构
	 * @type {}
	 */
	var updateDemandAgency = function(){
		http.post({
				'method':'updateDemandAgency',
				'demandAgency':JSON.stringify($scope.demandAgency)
			},URL.DemandAgencyServlet).then(
				function(respone) {
					alert("updateDemandAgency success！")
					
				},
				function(respone) {
					console.log("updateDemandAgency failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
	/************************选择删除  start*****************************/
	$scope.selected = [];
	var updateSelected = function(action,index){
    	var id = index;
        if(action == 'add' && $scope.selected.indexOf(id) == -1){
            $scope.selected.push(id);
        }
        if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
        	var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx,1);
        }
        console.log("=========$scope.selected=========="+JSON.stringify($scope.selected));
    }
 
    $scope.updateSelection = function($event,index){
         var checkbox = $event.target;
         var action = (checkbox.checked?'add':'remove');
         updateSelected(action,index);
    }
 
    $scope.isSelected = function(id){
         return $scope.selected.indexOf(id)>=0;
    }
    
    /**
	 * 根据编号删除对应的需求机构
	 */
	$scope.delDemandAgency = function() {
		
		var deleteID = '';
		if(isEmptyValue($scope.selected)){
			alert("请先选择删除项！！")
			return;
		}
		$scope.selected.sort(// 数组批量删除必须降序排序  不然会出问题
			function(a,b){
            	return b-a
			}
		);
		console.log("=========$scope.selected del =========="+JSON.stringify($scope.selected));
		var tempList = angular.copy($scope.demandAgencyList);
		angular.forEach($scope.selected,function(item){//根据坐标批量删除选择的机构 
			deleteID = tempList[item].id + ',' + deleteID; 
			$scope.demandAgencyList.splice(item,1);
		});
		
		if(isEmptyValue(deleteID)){
			alert("提交的删除项编号为空，请检查后重新提交！！")
			return;
		}
		http.post({
				'method':'deleteDemandAgency',
				'ids':deleteID.substring(0,deleteID.length-1)
			},URL.DemandAgencyServlet).then(
				function(respone) {
					alert("eleteDemandAgency success！")
				},
				function(respone) {
					console.log("deleteDemandAgency failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
		
		$scope.selected = [];
	}
   /************************选择删除  end*****************************/
    

}])
app.controller('InstSafetyCtrl', ["$scope", "http", function($scope,http){

	$scope.addNewState = false;

	$scope.toggleAddNewState = function(bool) {
		
		$scope.addNewState = bool;
	}
	
	$scope.demandAgencyName = '';
	$scope.supplyAgencyCode = '';

	$scope.qurey = function(){
		
		http.post({
				'method': 'findAllGuaranteeRelationShips',
				'demandAgencyName': $scope.demandAgencyName,
				'supplyAgencyCode': $scope.supplyAgencyCode
			}, URL.GuaranteeRelationShipServlet).then(
				function(respone) {
					alert("查询成功");
					$scope.guaranteeRelationShips = respone.guaranteeRelationShips;
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
	};
	
	$scope.guaranteeRelationShips = [
//      {
//          "id": 3,
//          "createTime": "2016-10-13",
//          "demandAgencyCode": "B00002",
//          "supplyAgencyCode": "G00001",
//          "demandAgencyName": null,
//          "demandAgencyAddress1": null,
//          "supplyAgencyName": "东区药检所",
//          "supplyAgencyAddress1": "浙江省湖州市吴兴区"
//      }
    ]
	

	/************************选择删除  start*****************************/
	$scope.selected = [];
	var updateSelected = function(action, index) {
		var id = index;
		if(action == 'add' && $scope.selected.indexOf(id) == -1) {
			$scope.selected.push(id);
		}
		if(action == 'remove' && $scope.selected.indexOf(id) != -1) {
			var idx = $scope.selected.indexOf(id);
			$scope.selected.splice(idx, 1);
		}
		console.log("=========$scope.selected==========" + JSON.stringify($scope.selected));
	}

	$scope.updateSelection = function($event, index) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, index);
	}

	$scope.isSelected = function(id) {
		return $scope.selected.indexOf(id) >= 0;
	}

	/**
	 * 根据编号删除对应的保障
	 */
	$scope.delGuaranteeRelationShip = function() {

			var deleteID = '';
			if(isEmptyValue($scope.selected)) {
				alert("请先选择删除项！！")
				return;
			}
			$scope.selected.sort( // 数组批量删除必须降序排序  不然会出问题
				function(a, b) {
					return b - a
				}
			);
			console.log("=========$scope.selected del ==========" + JSON.stringify($scope.selected));
			var tempList = angular.copy($scope.guaranteeRelationShips);
			angular.forEach($scope.selected, function(item) { //根据坐标批量删除选择的机构 
				deleteID = tempList[item].id + ',' + deleteID;
				console.log("========= del ==========" + item);
				$scope.guaranteeRelationShips.splice(item, 1);
			});

			if(isEmptyValue(deleteID)) {
				alert("提交的删除项编号为空，请检查后重新提交！！")
				return;
			}
			http.post({
				'method': 'deleteGuaranteeRelationShip',
				'ids': deleteID.substring(0, deleteID.length - 1)
			}, URL.GuaranteeRelationShipServlet).then(
				function(respone) {
					alert("删除成功");
				},
				function(respone) {
					alert(JSON.stringify(respone));
				});

			$scope.selected = [];
		}
		/************************选择删除  end*****************************/
		
		var findAllSupplyAndDemands = function(){
			http.post({
				'method': 'findAllSupplyAgencyAndDemandAgencyCodes'
			}, URL.SupplyAgencyServlet).then(
				function(respone) {
					$scope.addInfoFilter.supplyAgencyCodes = respone.supplyAgencyCodes;
					$scope.addInfoFilter.demandAgencyCodes = respone.demandAgencyCodes;
				},
				function(respone) {
					alert(JSON.stringify(respone));
				});
		}		
		$scope.addInfoFilter = {
			"supplyAgencyCodes":[],
			"demandAgencyCodes":[]
		}
		
		findAllSupplyAndDemands();

		$scope.newRelation = {'demandAgencyCode':'1','supplyAgencyCode':'2'};
		$scope.createNewRelation = function(){
			console.log("createNewRelation")
			if(isEmptyValue($scope.newRelation.supplyAgencyCode)){
				alert('请输入供应机构');
				return;
			}
			
			if(isEmptyValue($scope.newRelation.demandAgencyCode)){
				alert('请输入需求机构');
				return;
			}
			
			if($scope.addInfoFilter.supplyAgencyCodes.indexOf($scope.newRelation.supplyAgencyCode) == -1){
				alert('输入的供应机构不存在，请查证后重新输入！！！');
				return;
			}
			
			if($scope.addInfoFilter.demandAgencyCodes.indexOf($scope.newRelation.demandAgencyCode) == -1){
				alert('输入的需求机构不存在，请查证后重新输入！！！');
				return;
			}
			
			http.post({
				'method': 'addGuaranteeRelationShip',
				'guaranteeRelationShip': JSON.stringify($scope.newRelation)
			}, URL.GuaranteeRelationShipServlet).then(
				function(respone) {
					alert("建立成功！！！");
				},
				function(respone) {
					alert(JSON.stringify(respone));
			});
		}
		
	
}])
app.controller('InstSupplyCtrl', ["$scope", "http", function($scope, http) {

	$scope.detailState = false;//查看详情
	$scope.addState = false;//新增
	$scope.editMode = true;//编辑模式（明细）
	var currentIndex = 0;
	
	/**
	 * 切换至明细界面
	 * @type {Boolean}
	 */
	$scope.toggleDetailState = function(bool,item,index) {
		$scope.detailState = bool;
		$scope.editMode = true;//不可修改
		$scope.addState = false;
		$scope.selected = [];
		if(!bool){
			return;
		}
		currentIndex = index;
		$scope.supplyAgency = angular.copy(item);
		console.log("===="+JSON.stringify($scope.supplyAgency));
		$scope.supplyAgencyJobs = $scope.supplyAgency.supplyAgencyJobs;
		
		$scope.addPosiState = false;
		$scope.newSupplyJob = {'roleCode':'','roleName':'','roleGroup':''};
		
	}
	
	/**
	 * 切换至机构添加界面
	 * @type {}
	 */
	$scope.toggleAddState = function(){
		$scope.addState = true;
		$scope.detailState = true;
		$scope.editMode = false;//可修改
		$scope.addPosiState = false;
		$scope.newSupplyJob = {'roleCode':'','roleName':'','roleGroup':''};
		
		$scope.supplyAgency = {};
		$scope.supplyAgencyJobs = [];
		$scope.supplyAgency.supplyAgencyJobs = $scope.supplyAgencyJobs ;
		$scope.selected = [];
	}

	/**
	 * 切换至编辑模式 (明细修改)
	 * @type {Boolean}
	 */
	$scope.toggleEditMode = function(bool) {
		$scope.editMode = bool;
		$scope.addState = false;
		
		$scope.addPosiState = false;
		$scope.newSupplyJob = {'roleCode':'','roleName':'','roleGroup':''};
		
	}
	
	/**
	 * 切换至编辑模式 机构修改
	 * @type {Boolean}
	 */
	$scope.editSupplyAgency = function(item,index) {
		$scope.editMode = false;
		$scope.detailState = true;
		$scope.addState = false;
		currentIndex = index;
		$scope.supplyAgency = angular.copy(item);
		$scope.selected = [];
		
	}
	
	/**
	 * 保存
	 */
	$scope.saveAddOrDetailInfo = function() {
		if(isEmptyValue($scope.supplyAgency)){
			alert("请填写内容后再进行保存！！")
			return;
		}
		$scope.selected = [];
		$scope.editMode = false;
		$scope.detailState = false;
		if ($scope.addState) {//添加
			addSupplyAgency();
//			$scope.demandAgencyList.push(angular.copy($scope.demandAgency));
		} else{//修改
			$scope.supplyAgencies[currentIndex] = angular.copy($scope.supplyAgency);
			updateSupplyAgency();
		}
		
	}

	/**
	 * 添加分组
	 * @type {Boolean}
	 */
	$scope.addGroupState = false;

	$scope.toggleAddGroupState = function(bool) {
		$scope.addGroupState = bool;
	}

	/**
	 * 添加岗位
	 * @type {Boolean}
	 */
	$scope.addPosiState = false;

	$scope.toggleAddPosiState = function(bool) {
		$scope.addPosiState = bool;
	}

	$scope.type = [
			'',
			'药材仓库',
			'药材供应站',
			'野战药材仓库',
			'野战药材保障队'
		],

	$scope.selectedName = ''; //机构类型
	$scope.supplyAgencyName = ''; //机构名称
	/**
	 * 查询供应机构
	 * @type {查询条件 ：1.机构名称  2.机构类型}
	 */
	$scope.findAllSupplyAgencys = function() {

		http.post({
			'method': 'findAllSupplyAgencys',
			'supplyAgencyName': $scope.supplyAgencyName,
			'supplyAgencyType': $scope.selectedName
		}, URL.SupplyAgencyServlet).then(
			function(respone) {
				$scope.supplyAgencies = respone.supplyAgencies;
				alert("findAllSupplyAgencys success！")
			},
			function(respone) {
				console.log("findAllSupplyAgencys failed!" + JSON.stringify(respone));
				alert(JSON.stringify(respone));
			});
	}

	$scope.supplyAgencies = [
//		{
//			'id': 2,
//			'supplyAgencyAddress1': "浙江省湖州市吴兴区",
//			'supplyAgencyAddress2': "车站路9号",
//			'supplyAgencyCode': "B00001",
//			'supplyAgencyCoordinate': "120.104566,30.861911",
//			'supplyAgencyJobs': [],
//			'supplyAgencyLevel': "级别",
//			'supplyAgencyName': "1军1师1团团救护所",
//			'supplyAgencyNumber': 30,
//			'supplyAgencyType': "团救护所"
//		}
	];

	$scope.supplyAgency = {
//		'id': 2,
//		'supplyAgencyAddress1': "浙江省湖州市吴兴区",
//		'supplyAgencyAddress2': "车站路9号",
//		'supplyAgencyCode': "B00001",
//		'supplyAgencyCoordinate': "120.104566,30.861911",
//		'supplyAgencyJobs': [],
//		'supplyAgencyLevel': "级别",
//		'supplyAgencyName': "1军1师1团团救护所",
//		'supplyAgencyNumber': 30,
//		'supplyAgencyType': "团救护所"
	},
	

	/**
	 * 添加供应机构
	 * @type {}
	 */
	addSupplyAgency = function() {

		http.post({
			'method': 'addSupplyAgency',
			'supplyAgency': JSON.stringify($scope.supplyAgency),
			'supplyAgencyJobs':JSON.stringify($scope.supplyAgency.supplyAgencyJobs)
		}, URL.SupplyAgencyServlet).then(
			function(respone) {
				
				alert("addSupplyAgency success！");
				$scope.supplyAgency.id = respone.id;
				$scope.supplyAgencies.push(angular.copy($scope.supplyAgency));
			},
			function(respone) {
				console.log("addSupplyAgency failed!" + JSON.stringify(respone));
				alert(JSON.stringify(respone));
			});
	};

	/**
	 * 更新供应机构
	 * @type {}
	 */
	var updateSupplyAgency = function() {
		http.post({
			'method': 'updateSupplyAgency',
			'supplyAgency': JSON.stringify($scope.supplyAgency),
			'supplyAgencyJobs':JSON.stringify($scope.supplyAgency.supplyAgencyJobs)
		}, URL.SupplyAgencyServlet).then(
			function(respone) {
				alert("updateSupplyAgency success!")
			},
			function(respone) {
				console.log("updateSupplyAgency failed!" + JSON.stringify(respone));
				alert(JSON.stringify(respone));
			});
	};

	/************************选择删除  start*****************************/
	$scope.selected = [];
	var updateSelected = function(action, index) {
		var id = index;
		if(action == 'add' && $scope.selected.indexOf(id) == -1) {
			$scope.selected.push(id);
		}
		if(action == 'remove' && $scope.selected.indexOf(id) != -1) {
			var idx = $scope.selected.indexOf(id);
			$scope.selected.splice(idx, 1);
		}
		console.log("=========$scope.selected==========" + JSON.stringify($scope.selected));
	}

	$scope.updateSelection = function($event, index) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, index);
	}

	$scope.isSelected = function(id) {
		return $scope.selected.indexOf(id) >= 0;
	}

	/**
	 * 根据编号删除对应的供应机构
	 */
	$scope.delSupplyAgency = function() {

			var deleteID = '';
			if(isEmptyValue($scope.selected)) {
				alert("请先选择删除项！！")
				return;
			}
			$scope.selected.sort( // 数组批量删除必须降序排序  不然会出问题
				function(a, b) {
					return b - a
				}
			);
			console.log("=========$scope.selected del ==========" + JSON.stringify($scope.selected));
			var tempList = angular.copy($scope.supplyAgencies);
			angular.forEach($scope.selected, function(item) { //根据坐标批量删除选择的机构 
				deleteID = tempList[item].id + ',' + deleteID;
				console.log("========= del ==========" + item);
				$scope.supplyAgencies.splice(item, 1);
			});

			if(isEmptyValue(deleteID)) {
				alert("提交的删除项编号为空，请检查后重新提交！！")
				return;
			}
			http.post({
				'method': 'deleteSupplyAgency',
				'ids': deleteID.substring(0, deleteID.length - 1)
			}, URL.DemandAgencyServlet).then(
				function(respone) {
					alert("删除成功");
				},
				function(respone) {
					console.log("deleteSupplyAgency failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
				});

			$scope.selected = [];
		}
		/************************选择删除  end*****************************/
		
		/************************明细 岗位设置  start*****************************/
		$scope.supplyAgencyJobs = [
			{'roleCode':'101','roleName':'保障队队长','roleGroup':'保障队'},
			{'roleCode':'102','roleName':'供应组组长','roleGroup':'供应组'}
		];
		
		$scope.editJobMode = true;
		
		$scope.newSupplyJob = {'roleCode':'','roleName':'','roleGroup':''};
		
		$scope.addNewJob = function(){
			if(isEmptyValue($scope.newSupplyJob)){
				alert("请输入岗位信息后再保存！")
				return;
			}
			$scope.supplyAgencyJobs.push(angular.copy($scope.newSupplyJob));
		};
		var temp = {};
		$scope.setSupplyJob = function(index,item){
			
			if (!$scope.supplyAgencyJobs[index].editJobMode) {//修改岗位
				temp = angular.copy($scope.supplyAgencyJobs[index])
				$scope.supplyAgencyJobs[index].editJobMode = true;
			} else{//取消修改
			
				$scope.supplyAgencyJobs[index] = temp;
				$scope.supplyAgencyJobs[index].editJobMode = false;
			}
		
		}
		
		$scope.saveSupplyJob = function(index,item){
			$scope.supplyAgencyJobs[index].editJobMode = false;
			$scope.newSupplyJob = {'roleCode':'','roleName':'','roleGroup':''};
		}
		

		$scope.delSupplyJobs = function(){
			if(isEmptyValue($scope.selected)) {
				alert("请先选择删除项！！")
				return;
			}
			$scope.selected.sort( // 数组批量删除必须降序排序  不然会出问题
				function(a, b) {
					return b - a
				}
			);
			console.log("=========$scope.selected del ==========" + JSON.stringify($scope.selected));
			var tempList = angular.copy($scope.supplyAgencyJobs);
			angular.forEach($scope.selected, function(item) { //根据坐标批量删除选择的机构 
				console.log("========= del ==========" + item);
				$scope.supplyAgencyJobs.splice(item, 1);
			});

			$scope.selected = [];
		}
		
		
		/************************明细 岗位设置  end*****************************/
}])
app.controller('LoadQueryCtrl', ["$scope", "http", "$timeout", function($scope,http,$timeout){

	$scope.stateFactory = {
		"query": true,
		"print": false
	}
	/**
	 * 切换页面状态
	 * @param  {[type]} option [description]
	 * @return {[type]}        [description]
	 */
	$scope.changeState = function(option,item){
	
		for(o in $scope.stateFactory){
			$scope.stateFactory[o] = false;
		}
		$scope.stateFactory[option] = true;
		if(option == 'print'){
			$scope.clickPrintOrder(item);
		}
		if(option == 'query'){
			
		}
	}

	$scope.print = function(id){
		var content = document.getElementById(id).innerHTML;
		document.body.innerHTML = content;
		window.print();
	}
	
	//配载查询
	$scope.findAllStowages = function(){
			http.post({
					'method': 'findAllStowages',
					'stowageCode':$scope.stowageCode,
					'carCode':$scope.carCode,
					'orderCode':$scope.orderCode
				}, URL.StowageServlet).then(
					function(respone) {
						alert("配载查询成功");
						$scope.stowages = respone.stowages;
					},
					function(respone) {
						alert(JSON.stringify(respone));
			});
	}
	
	$scope.clickPrintOrder = function(item){
		$scope.orderPrintInfo = item;
		
		$timeout(function() {
				$('#'+item.stowageCode).empty().barcode(""+item.stowageCode, "code128",{barWidth:2, barHeight:30,showHRI:false});
            }, 500);
	}
	
	/************************选择删除  start*****************************/
	$scope.selected = [];
	var updateSelected = function(action, index) {
		var id = index;
		if(action == 'add' && $scope.selected.indexOf(id) == -1) {
			$scope.selected.push(id);
		}
		if(action == 'remove' && $scope.selected.indexOf(id) != -1) {
			var idx = $scope.selected.indexOf(id);
			$scope.selected.splice(idx, 1);
		}
		console.log("=========$scope.selected==========" + JSON.stringify($scope.selected));
	}

	$scope.updateSelection = function($event, index) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, index);
	}

	$scope.isSelected = function(id) {
		return $scope.selected.indexOf(id) >= 0;
	}

	/**
	 * 批量删除对应的配载
	 */
	$scope.delStowages = function() {

			var deleteID = '';
			if(isEmptyValue($scope.selected)) {
				alert("请先选择删除项！！")
				return;
			}
			$scope.selected.sort( // 数组批量删除必须降序排序  不然会出问题
				function(a, b) {
					return b - a
				}
			);
			console.log("=========$scope.selected del ==========" + JSON.stringify($scope.selected));
			var tempList = angular.copy($scope.stowages);
			angular.forEach($scope.selected, function(item) { //根据坐标批量删除选择的机构 
				deleteID = tempList[item].id + ',' + deleteID;
				console.log("========= del ==========" + item);
				$scope.stowages.splice(item, 1);
			});

			if(isEmptyValue(deleteID)) {
				alert("提交的删除项编号为空，请检查后重新提交！！")
				return;
			}
			deleteStowage(deleteID.substring(0, deleteID.length - 1));
			$scope.selected = [];
		}
	
	$scope.deleStowageByIndex = function(index,id){
		$scope.stowages.splice(index, 1);
		deleteStowage(id);
		
	}
	
	var deleteStowage = function(ids){
		alert(ids)
		http.post({
				'method': 'deleteStowage',
				'ids': ids
			}, URL.StowageServlet).then(
				function(respone) {
					alert("删除成功");
				},
				function(respone) {
					console.log("delete stowages failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
				});
	}
		/************************选择删除  end*****************************/
}])
app.controller('LoadSelectCtrl', ["$scope", "http", function($scope,http){

	$scope.model={'isChecked':'0','isChecked1':'0'};
	//待选车辆
	$scope.queryAllCarsWithStatus = function(){
			http.post({
					'method': 'queryAllCarsWithStatus'
				}, URL.CarServlet).then(
					function(respone) {
//						alert("待选车辆查询成功");
						$scope.cars = respone.cars;
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	}
	
	//待装载货物
	$scope.findAllInvoices = function(){
			http.post({
					'method': 'findAllInvoices'
				}, URL.InvoiceServlet).then(
					function(respone) {
//						alert("待装载货物查询成功");
						$scope.invoices = respone.invoices;
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	}
	
	$scope.queryAllCarsWithStatus();
	$scope.findAllInvoices();
	
	//待确认
	$scope.stowage = 
		{
			'carCode':'',
			'volumePercent':0.0,
			'weightPercent':0.0,
			'carVolume':0,
			'maxWeight':0,
			'transportRoute':'',
			'invoiceCode':''
		}
		
	$scope.commit =function(){
		http.post({
					'method': 'addStowage',
					'stowage':JSON.stringify($scope.stowage)
				}, URL.StowageServlet).then(
					function(respone) {
						alert("确认成功！！！");
					},
					function(respone) {
						alert(JSON.stringify(respone));
				});
	}
	
	var tempCar;
	$scope.selectCar = function(index){
		
		$scope.stowage.carCode = $scope.cars[index].carCode;
		$scope.stowage.carVolume = $scope.cars[index].carVolume;
		$scope.stowage.maxWeight = $scope.cars[index].maxWeight;
		
		if(!isEmptyValue(tempInvoice)){
			$scope.stowage.invoiceCode = tempInvoice.invoiceCodes;
			$scope.stowage.weightPercent = tempInvoice.weight / $scope.cars[index].maxWeight;
			$scope.stowage.volumePercent = tempInvoice.volume / $scope.cars[index].carVolume;
		}
		
		tempCar = angular.copy($scope.cars[index]);
	}
	
	/************************多选  start*****************************/
	$scope.selected = [];
	var updateSelected = function(action, index ,item) {
		var id = index;
		if(action == 'add' && !isSelected(id)) {
			$scope.selected.push(id);
		}
		if(action == 'remove' && isSelected(id)) {
			var idx = $scope.selected.indexOf(id);
			$scope.selected.splice(idx, 1);
		}
		
		$scope.selectInvoice(index);
		console.log("=========$scope.selected==========" + JSON.stringify($scope.selected));
	}

	$scope.updateSelection = function($event, index ,item) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, index ,item);
	}

	var isSelected = function(id) {
		return $scope.selected.indexOf(id) >= 0;
	}
	
	var getSelectInvoice = function() {

			var invoiceCodes = '';
			var invoice = {
				'invoiceCodes':'',
				'weight':0,
				'volume':0
			}
			var tempList = angular.copy($scope.invoices);
			angular.forEach($scope.selected, function(item) { //根据坐标批量删除选择的机构 
				invoice.invoiceCodes = tempList[item].invoiceCode + ',' + invoice.invoiceCodes;	
				invoice.weight = invoice.weight + tempList[item].weight;
				invoice.volume = invoice.volume + tempList[item].volume;
			});
			invoice.invoiceCodes = invoice.invoiceCodes.substring(0, invoice.invoiceCodes.length - 1)
			return invoice;
	}
	
	/////////////////////单选
	var tempInvoice;
	$scope.selectInvoice = function(index){
		
		if(!isEmptyValue(tempCar)){
			$scope.stowage.carCode = tempCar.carCode;
			$scope.stowage.carVolume = tempCar.carVolume;
			$scope.stowage.maxWeight = tempCar.maxWeight;
		}
		
		$scope.stowage.invoiceCode = getSelectInvoice().invoiceCodes;
		$scope.stowage.weightPercent = getSelectInvoice().weight / $scope.stowage.maxWeight;
		$scope.stowage.volumePercent = getSelectInvoice().volume / $scope.stowage.carVolume;
		tempInvoice = angular.copy(getSelectInvoice());
	}
	
	$scope.cancel = function(){
		$scope.stowage = {};
		$scope.model={'isChecked':'0','isChecked1':'0'};
		$scope.selected = [];
		angular.forEach($scope.invoices,function(item){
			item.isChecked = "";
		})
	}
	
}])
app.controller('LoginCtrl', ["$scope", "http", "$state", "$localstorage", function($scope, http, $state,$localstorage) {

		$scope.loginInfo = {
			name: '',
			password: ''
		}


		$scope.login = function() {
			
			console.log("login info:" + JSON.stringify($scope.loginInfo));
			
			if (!$scope.loginInfo.name) {
				alert("请输入用户名");
				return;
			} 
			if (!$scope.loginInfo.password) {
				alert("请输入密码");
				return;
			} 
			
			http.post($scope.loginInfo,URL.login).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					if (respone.flag) {
						var user = {
							"userCode":respone.userCode,
							"userName":respone.userName,
							"role":respone.role
						};
						console.log("USER==="+JSON.stringify(user))
						$localstorage.setObject("user",user);
						var user1 = $localstorage.getObject("user");
						console.log("USER1==="+JSON.stringify(user1))
						$state.go('home.dashboard');
					} else{
						alert("密码或用户名有误，请重新输入！！");
					}
					
				},
				function(respone) {
					console.log("login failed!" + JSON.stringify(respone));
					alert(respone);
				});
		}
	}])
app.controller('ModeCtrl', ["$scope", "http", function($scope,http){
	$scope.data = [{
		'title': '药材仓库',
		'nodes': [{
			'title': '第一药材仓库',
			'nodes': []
		},{
			'title': '第二药材仓库',
			'nodes': []
		},{
			'title': '第三药材仓库',
			'nodes': []
		}]
	}, {
		'title': '药材供应站',
		'nodes': [{
			'title': '第一药材供应站',
			'nodes': []
		},{
			'title': '第二药材供应站',
			'nodes': []
		},{
			'title': '第三药材供应站',
			'nodes': []
		}]
	}, {
		'title': '野战药材保障队',
		'nodes': [{
			'title': '第一野战药材保障队',
			'nodes': []
		},{
			'title': '第二野战药材保障队',
			'nodes': []
		},{
			'title': '第三野战药材保障队',
			'nodes': []
		}]
	}];

	$scope.modeList = [{
		'title': '业务模式',
		'nextStep': 2
	},{
		'title': '练习模式',
		'nextStep': 3
	},{
		'title': '考核模式',
		'nextStep': 3
	}];
	$scope.toggle = function (scope) {
        scope.toggle();
    };
    $scope.mode = 1;
    $scope.modeName = '';
    $scope.changeMode = function(mode, index){
    	$scope.mode = mode;
    	$scope.modeName = $scope.modeList[index].title;
    };


}])
app.controller('OrderAddCtrl', ["$scope", "http", function($scope,http){
	
	function FormatDate (strTime) {
    	var date = new Date(strTime);
    	return date.getFullYear()+(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getMilliseconds();
	}
		
		$scope.orderForm = {
			method:'addOrder',
			orderTime: secondsToData(new Date().getTime()) ,
			deliveryTime: '',
			customerCode: '',
			customerName: '',
			receiver: '',
			tel: '',
			receiveMode: '',
			receiptAddress: '',
			memo: '',
			orderItems:'[]'
		};
		$scope.items = [];
		$scope.newItem = {};
		$scope.addItem = function(newItem){
			$scope.items.push({
				productCode: newItem.code,
				total: newItem.price*newItem.amount,
				unit:newItem.unit,
				price:newItem.price,
				productNum:newItem.amount,
				size:newItem.size,
				name:newItem.name
			})
		}
		$scope.rmItem = function(index){
			$scope.items.splice(index,1);
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
		
		//订单提交
		$scope.submitOrder = function() {
			
			$scope.orderForm.orderItems = JSON.stringify($scope.items);
			console.log(JSON.stringify($scope.orderForm)+"==============="+$scope.orderForm.orderItems);
			http.post($scope.orderForm,URL.orderAdd).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					alert("订单添加成功！")
					
				},
				function(respone) {
					console.log("submitOrder failed!" + JSON.stringify(respone));
					// alert(respone);
			});
		}
		
		var productList = [];//商品列表  
		//查询所有商品信息
		var queryProduct = function() {	
			
			http.post({'method':'queryProduct'},URL.productQurey).then(
				function(respone) {
					console.log("queryProduct info --->"+respone);
					productList = respone.products;
				},
				function(respone) {
					console.log("queryProduct failed!" + JSON.stringify(respone));
					// alert(respone);
			});
		}
		queryProduct();
		
		$scope.change = function(item){
			angular.forEach(productList,function(product){
				if(item.code == product.productCode){
					
					$scope.newItem.name = product.productName;
					$scope.newItem.size = product.specifications;
					$scope.newItem.unit = product.unit;
					$scope.newItem.price = product.price;
					$scope.newItem.amount = product.averageNumber;
					$scope.newItem.sum = $scope.newItem.price * $scope.newItem.amount;
					
					return;
				}
			})
		};
		
		//收货方式 option
		$scope.receiptMethod = [
			{value : 0, name : "配送"},
	    	{value : 1, name : "自取"}
		];
		$scope.receiptSelect = $scope.receiptMethod[0];//默认选中
		
		//订单方式 option
		$scope.orderMethod = [
			{value : 0, name : "电话订单"},
	    	{value : 1, name : "网络电子订单"},
	    	{value : 2, name : "邮件订单"}
		];
		$scope.orderSelect = $scope.orderMethod[0];//默认选中

	}])










app.controller('OrderAuditCtrl', ["$scope", "http", function($scope,http){
	
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
	http.post({'method':'queryAllOrders'},URL.orderQurey).then(
			function(respone) {
				$scope.orderList.order = filterOrderByStatus(respone.order);
			},
			function(respone) {
				console.log("Order qurey failed!" + JSON.stringify(respone));
				// alert(respone);
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
		
		http.post({'method':'queryOrderAndItem','orderCode':id},URL.orderQurey).then(
			function(respone) {
					console.log("queryOrderAndItem:"+JSON.stringify(respone));
					alert("queryOrderAndItem success!")
					$scope.detail = respone.order;
					$scope.items = respone.order.orderItems;
					$scope.detail.deliveryTime = secondsToData(respone.order.deliveryTime);
					$scope.detail.orderTime = secondsToData(respone.order.orderTime);	
					$scope.detail.intendDeliveryTime = secondsToData(respone.order.deliveryTime);
			},
			function(respone) {
				console.log("Order qurey failed!" + JSON.stringify(respone));
				// alert(respone);
		});
	}
	
	//订单确认
	var OrderConfirm = function(status){
		
		http.post({},URL.orderAudit).then(
			function(respone) {
				console.log("queryOrderAndItem:"+JSON.stringify(respone));	
				alert("订单确认成功！")
			},
			function(respone) {
				console.log("Order qurey failed!" + JSON.stringify(respone));
				// alert(respone);
		});
	};
	
	    /*****订单明细 输入商品号自动补齐   start*******/
	    var productList = [];//商品列表  
		//查询所有商品信息
		var queryProduct = function() {	
			
			http.post({'method':'queryProduct'},URL.productQurey).then(
				function(respone) {
					console.log("queryProduct info --->"+respone);
					alert("queryProduct success!")
					productList = respone.products;
				},
				function(respone) {
					console.log("queryProduct failed!" + JSON.stringify(respone));
					// alert(respone);
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
					alert(status=="1" ? "订单已确认":"已转至疑问订单");
				},
				function(respone) {
					// alert(respone);
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
		
		
	
}])





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


app.controller('OrderQueryCtrl', ["$scope", "http", function($scope,http){
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
	
}])
app.controller('PrintCtrl', ["$scope", "http", "$location", "printlist", "$state", "$stateParams", function($scope, http, $location, printlist,$state, $stateParams) {
    function getUrlParams(name) {
        return $location.search()[name];
    }
    $scope.orderToPrint = [];
    // var printList = printlist.get();
    // var itemId = Number($stateParams.item);
    // if (itemId == undefined) {
    // 	alert("something wrong");
    //     return;
    // } else {
    //     if (itemId == -1) {
    //     	$scope.orderToPrint = printList;
    //     }else{
    //     	$scope.orderToPrint[0] = printList[itemId];
    //     }

    // }
    // 
    var items = JSON.parse(getUrlParams('items'));
    if (items instanceof Array) {
    	$scope.orderToPrint = items;
    }else{
    	$scope.orderToPrint[0] = items;
    }
    // $scope.orderToPrint = JSON.parse(items)
    $scope.print = function(){
    	window.print();
    }

    $scope.$on('ngRepeatFinished', function() {
    	$('.barcode').each(function(index, el) {
    		var num = $(this).data('code');
    		// console.log(num);
    		$(this).barcode(''+num, "code128",{barWidth:2, barHeight:30,showHRI:false})
    	});
    	// $('#code').empty().barcode("567845678567", "code128",{barWidth:2, barHeight:30,showHRI:false});
    })
}])

//var SideNavModule = angular.module('SideNavModule', []);
app.controller('SideNavCtrl', ["$scope", "$http", "$state", "$stateParams", "$localstorage", function($scope, $http, $state, $stateParams,$localstorage) {

		$scope.list = {
			"parent": {
						"title": "主页",
						"url": "index.html"
					},
					
			"items":[
//				{
//					"title": "商品管理",
//					"url": "javascript:;",
//					"isActive":false,
//					"icon":"fa fa-laptop",
//					"child": [{
//							"title": "单一商品",
//							"url": ".goodsSingle",
//							"isActive":false
//						},{
//							"title": "组合商品",
//							"url": ".goodsMulti",
//							"isActive":false
//					  }]					
//				},
//				{
//					"title": "客户管理",
//					"url": "javascript:;",
//					"isActive":false,
//					"icon":"fa fa-users",
//					"child": [{
//							"title": "客户管理",
//							"url": "./",
//							"isActive":false
//						}]					
//				},
//				{
//					"title": "店铺管理",
//					"url": "javascript:;",
//					"isActive":false,
//					"icon":"fa fa-book",
//					"child": [{
//							"title": "在售商品",
//							"url": ".storeSale",
//							"isActive":false
//						},{
//							"title": "商品陈列",
//							"url": ".storeDisplay",
//							"isActive":false
//					  }]					
//				},
				{
					"title": "集货管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-laptop",
					"child": [{
							"title": "库存查询",
							"url": ".collectStorage",
							"isActive":false
						},{
							"title": "药材筹措",
							"url": ".collectSupplement",
							"isActive":false
					  }]					
				},
				{
					"title": "仓储管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-home",
					"child": [{
							"title": "收货验收",
							"url": ".wareEntry",
							"isActive":false
						},{
							"title": "入库上架",
							"url": ".wareShelves",
							"isActive":false
						},{
							"title": "货位管理",
							"url": ".wareInventory",
							"isActive":false
					  	},
						{
							"title": "保管养护",
							"url": ".wareMaintain",
							"isActive":false
					  	}]
				},
				{
					"title": "订单管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-cogs",
					"child": [{
							"title": "订单录入",
							"url": ".orderAdd",
							"isActive":false
						},{
							"title": "订单查询",
							"url": ".orderQuery",
							"isActive":false
					  },{
							"title": "订单审核",
							"url": ".orderAudit",
							"isActive":false
						}
//,{
//							"title": "退货处理",
//							"url": ".orderRefund",
//							"isActive":false
//					  }
					]
				},{
					"title": "配货管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-briefcase",
					"child": [{
							"title": "拆单拣货",
							"url": ".allocateGoods",
							"isActive":false
						},{
							"title": "装箱核对",
							"url": ".allocateCheck",
							"isActive":false
					  	}]					
				},
			
				{
					"title": "配载管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-archive",
					"child": [{
							"title": "选配货载",
							"url": ".loadSelect",
							"isActive":false
						},{
							"title": "配载查询",
							"url": ".loadQuery",
							"isActive":false
						}]					
				},
			
				
				{
					"title": "运输管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-truck",
					"child": [{
							"title": "车辆信息",
							"url": ".transVehicle",
							"isActive":false
					  	},{
							"title": "线路分配",
							"url": ".transLine",
							"isActive":false
						},{
							"title": "车辆调度",
							"url": ".transDispatch",
							"isActive":false
						},]					
				},{
					"title": "药材管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-bar-chart-o",
					"child": [{
							"title": "药材字典",
							"url": ".dicSingle",
							"isActive":false
						}]
				},{
					"title": "业务统计",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-book",
					"child": [
						{
							"title": "订单统计",
							"url": "javascript:;",
							"isActive":false
						},
						{
							"title": "保障能力",
							"url": "javascript:;",
							"isActive":false
						}]					
				},{
					"title": "机构管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-sitemap",
					"child": [
						{
							"title": "供应机构",
							"url": ".instSupply",
							"isActive":false
						},
						{
							"title": "需求机构",
							"url": ".instDemand",
							"isActive":false
						},
						{
							"title": "保障关系",
							"url": ".instSafety",
							"isActive":false
						}]					
				},{
					"title": "用户管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-user",
					"child": [
						{
							"title": "教员用户",
							"url": ".userTeacher",
							"isActive":false
						},
						{
							"title": "学员用户",
							"url": ".userStudent",
							"isActive":false
						}]					
				}
			]
		}
		$scope.isActive = false;
		$scope.listToggle = function(index){
			$scope.list.items[index].isActive = !$scope.list.items[index].isActive;
		}
	}])
	
	
app.controller('TransDispatchCtrl', ["$scope", "$rootScope", "http", "$filter", "instruct", function($scope,$rootScope, http,$filter, instruct){
	instruct.set(['本页面是车辆调度页面<h1>a</h1>','此处放置有关页面调度的说明文字','又是一条说明']);
	$rootScope.$broadcast('instructChange');
    $scope.alerts = [
        // { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        // { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.setAlertClose = function(obj){
    	$scope.alerts.push(obj);
    	var timer = setTimeout(function(){
    		$scope.closeAlert(-1);
    	},5000)
    }

	$scope.stateFactory = {
		"query": true,
		"detail": false,
		"dispatch": false
	}
	/**
	 * 切换页面状态
	 * @param  {[type]} option [description]
	 * @return {[type]}        [description]
	 */
	$scope.changeState = function(option){
	
		for(o in $scope.stateFactory){
			$scope.stateFactory[o] = false;
		}
		$scope.stateFactory[option] = true;
	}
	$scope.carStatusList = [{
		'state':'休整中',
		'color':'btn-info'
	},{
		'state':'休整完毕',
		'color':'btn-info'
	},{
		'state':'待命中',
		'color':'btn-success'
	},{
		'state':'装载中',
		'color':'btn-warning'
	},{
		'state':'装载完毕',
		'color':'btn-warning'
	},{
		'state':'发车中',
		'color':'btn-danger'
	},{
		'state':'发车完毕',
		'color':'btn-danger'
	},{
		'state':'前运中',
		'color':'btn-default'
	},{
		'state':'回程中',
		'color':'btn-primary'
	},{
		'state':'回程完毕',
		'color':'btn-primary'
	}]



	//车辆调度查询
	$scope.queryAllCarsWithCode = function(){
			http.post({
					'method': 'queryAllCarsWithCode',
					'agencyCode':'B0004'
				}, URL.CarServlet).then(
					function(respone) {
						// alert("查询线路分配");
						$scope.cars = respone.carStatus;
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	}
	$scope.queryAllCarsWithCode();

	/**
	 * 查看详细运输、单号
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	$scope.queryTrancarDetail = function(carCode, status){
		var data = {
			"method": "findStowageCodesByCarCode",
			"carCode": carCode,
			"carStatus": status
		}
		http.post(data, URL.CarServlet).then(
			function(res){
				
				$scope.stowageCodeList = res.stowageCode;
				$scope.changeState('detail');
			}, 
			function(res){
				alert(JSON.stringify(res));
			})


	}
	/**
	 * 选择单号查看明细
	 * @param  {[type]} code [description]
	 * @return {[type]}      [description]
	 */
	$scope.queryStowageList = function(code){
		var obj = {
			"method": "findStowageByCode",
			"stowageCode":code
		}
		http.post(obj, URL.StowageServlet).then(
			function(res){
				if (res.code === 0) {
					var result = res.stowage;
					angular.forEach(result.stowageItems, function(item,index,array){
						item.invoiceTime = $filter('date')(item.invoiceTime, 'yyyy-MM-dd HH:mm:ss');
						item.signedTime = $filter('date')(item.signedTime, 'yyyy-MM-dd HH:mm:ss');
					})
					$scope.stowageList = angular.copy(result)
				}else{
					alert("数据返回错误");
				}
				
			}, 
			function(res){
				alert(JSON.stringify(res));
			})
	}
	/**
	 * 更新单号时间信息 TODO
	 * @return {[type]} [description]
	 */
	$scope.updateStowageItems = function(){
		angular.forEach($scope.stowageList.stowageItems, function(item,index,array){
			item.stowageCode = $scope.stowageCode;
		})

		var obj = {
			'method':'updateStowageItems',
			'stowageItems': JSON.stringify($scope.stowageList.stowageItems) 
		}
		console.log(JSON.stringify($scope.stowageList.stowageItems))
		http.post(obj, URL.StowageServlet).then(
			function(res){
				if (res.code === 0) {
					alert("保存成功")
				}else{
					alert("数据返回错误");
				}
				
			}, 
			function(res){
				alert(JSON.stringify(res));
			})
	}
	/**
	 * 调度页
	 * @param  {[type]} carCode [description]
	 * @return {[type]}         [description]
	 */
	
	// 当前选中的车辆编号
	$scope.currentCar = '';
	// 司机临时列表
	$scope.operatorList = [];
	$scope.queryDispatchDetail = function(carCode){
		$scope.getOperator();
		$scope.changeState('dispatch');
		$scope.currentCar = carCode;
		$scope.queryDispatchPlan(carCode, '休整完毕');

	}

	/**
	 * 获取司机信息
	 * @return {[type]} [description]
	 */
	$scope.getOperator = function(){
		var obj = {
			'method':'findOperatorByPosition',
			'position':'驾驶员'
		}
		http.post(obj, URL.OperatorServlet).then(
			function(res){
				$scope.operatorList = res.operators;
				console.log(JSON.stringify(res.operators))
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}

	/**
	 * 更新车辆状态信息
	 * @param  {[type]} carCode [description]
	 * @param  {[type]} status  [description]
	 * @return {[type]}         [description]
	 */
	$scope.updateCarStatus = function(carCode, status){
		var obj = {
			"method": "updateCarStatusByCode",
			"carCode": carCode,
			"carStatus": status
		}
		http.post(obj, URL.CarServlet).then(
			function(res){
				alert("状态更新成功");
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}
	/**
	 * 发送文本指令
	 * @type {String}
	 */
	$scope.dispatchDirect = '';
	$scope.updateDirectives = function(){

		var obj = {
			"method": "updateInstructionByCode",
			"instruction": $scope.dispatchDirect,
			"carCode": $scope.currentCar
		}
		http.post(obj, URL.CarServlet).then(
			function(res){
				if (res.code === 0) {
					alert("指令发送成功");
				}else{
					alert("数据返回错误，请再次尝试");
				}
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}
	/**
	 * 修改发车计划
	 * @return {[type]} [description]
	 */
	$scope.queryDispatchPlan = function(carCode, status){
		var obj = {
			"method": "findStowageCodesByCarCode",
			"carCode": carCode,
			"carStatus": status	
		}
		http.post(obj, URL.CarServlet).then(
			function(res){
				$scope.dispatchOrders = res.stowageCode;
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}
	$scope.dispatchOrdersDetail = {};
	$scope.dispatchOrdersItems = '';
	$scope.queryDispatchPlanDetail = function(code){
		var obj = {
			"method": "findStowageByCode",
			"stowageCode":code
		}
		http.post(obj, URL.StowageServlet).then(
			function(res){
				if (res.code === 0) {
					$scope.dispatchOrdersDetail = res.stowage;
					console.log(JSON.stringify(res.stowage))
					var items = [];
					angular.forEach($scope.dispatchOrdersDetail.stowageItems, function(item,index,array){
						items.push(item.receiptAddress);
					})
					$scope.dispatchOrdersItems = items.join(',');
				}else{
					alert("数据返回错误");
				}
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)

	}
	$scope.updateDispatchPlan = function(){
		var obj = JSON.stringify({
				"stowageCode":$scope.selectedOg,
				"operator":$scope.selectedOperator.operatorName,
				"loadTime":$scope.dispatchOrdersDetail.loadTime,
				"departureTime":$scope.dispatchOrdersDetail.departureTime
			});
		var data = {
			"method": "updateStowage",
			"stowage": obj + ''
		}
		http.post(data, URL.StowageServlet).then(
			function(res){
				if (res.code === 0) {
					alert("保存成功")
				}else{
					alert("保存出错："+ res)
				}
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}

}])
app.controller('TransLineCtrl', ["$scope", "http", function($scope,http){
	//查询线路分配
	$scope.queryAllCarLines = function(){
			http.post({
					'method': 'findAllGuaranteeRelationShipsBySupplyAgencyCode',
					'supplyAgencyCode':''
				}, URL.GuaranteeRelationShipServlet).then(
					function(respone) {
						// alert("查询线路分配");
						$scope.carLines = respone.guaranteeRelationShips;
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	}
	$scope.queryAllCarLines();

	$scope.edit = function(index){
		$scope.carLines[index].transportRouteEdit = !$scope.carLines[index].transportRouteEdit;

	};

	$scope.update = function(index){
		console.log("update item :"+index);
		http.post({
					'method': 'updateGuaranteeRelationShip',
					'guaranteeRelationShip':getUpdateInfo($scope.carLines[index])
				}, URL.GuaranteeRelationShipServlet).then(
					function(respone) {
						alert("线路已更新");
						$scope.edit(index);
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	};

	var getUpdateInfo = function(item){

		return JSON.stringify({
				'demandAgencyCode':item.demandAgencyCode,
				'supplyAgencyCode':item.supplyAgencyCode,
				'transportRoute':item.transportRoute
			})
	}

}])
app.controller('TransVehicleCtrl', ["$scope", "http", function($scope,http){
	
	$scope.stateFactory = {
		"query": true,
		"detail": false,
		"perform": false
	}
	
	var method;
	/**
	 * 切换页面状态
	 * @param  {[type]} option [description]
	 * @return {[type]}        [description]
	 */
	$scope.changeState = function(option,item){
	
		for(o in $scope.stateFactory){
			$scope.stateFactory[o] = false;
		}
		$scope.stateFactory[option] = true;
		
		if('detail' == option){
			if(isEmptyValue(item)){
				method = 'addCar';
			}else{
				method = 'updateCar';
			}
			$scope.car = item;
		}if('perform' == option){
			$scope.carRecords = item.carRecords;
		}
	}
	
	//查询车辆
	$scope.queryAllCars = function(){
			http.post({
					'method': 'queryAllCars',
					'numberOrCode':$scope.carNumber,
					'agencyCode':'B0004'
				}, URL.CarServlet).then(
					function(respone) {
						alert("车辆查询成功");
						$scope.cars = respone.cars;
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	}
	
	//添加车辆
	$scope.updateCar = function(){
		if(method == 'updateCar' && isEmptyValue($scope.car.id)){
			alert("更新车辆的id不能为空！");
			return;
		}
			http.post({
					'method': method,//'addCar','updateCar'
					'car':JSON.stringify($scope.car)
				}, URL.CarServlet).then(
					function(respone) {
						alert(method+" success!");
						$scope.changeState('query');
						if(method == 'addCar'){
							$scope.car.id = respone.id;
							if (isEmptyValue($scope.cars)) {
								$scope.cars = [];
							} 
							$scope.cars.push(angular.copy($scope.car));
							console.log($scope.cars);
						}
					},
					function(respone) {
						console.log(respone);
						alert(JSON.stringify(respone));
					});
	}
	
	//删除车辆
	$scope.deleteCar = function(id,index){
		if(isEmptyValue(id)){
			alert("被删除项id不能为空！");
			return;
		}
			http.post({
					'method': 'deleteCar',//'addCar','updateCar'
					'ids':id
				}, URL.CarServlet).then(
					function(respone) {
						alert("删除成功！");
						$scope.cars.splice(index, 1);
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	}
	
}])
app.controller('UserStudentCtrl', ["$scope", "http", function($scope,http){
    var id = 0;
    $scope.user = {
			    	'userCode':'测试用户',
				    'userName':'测试',
				    'userType':'学员',
				    'userPassword':'123322',
				    'studentId':'20131202',
				    'className':'药理2班',
				    'startTime':'2016-08-01',
				    'endTime':'2016-11-01'
				};
				
	$scope.userPassword = '';
				
	$scope.updateUser = function(){
		
		if($scope.userPassword != $scope.user.userPassword){
			alert("两次密码输入不一致！")
			return;
		}
		http.post({
				'method':'updateUser',
				'user':JSON.stringify({
					'id':id,
					'userPassword':$scope.userPassword
				})
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========密码修改成功！========="+JSON.stringify(respone));
					alert("密码修改成功！！")
				},
				function(respone) {
					console.log("updateUser failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
				
}])
app.controller('UserTeacherCtrl', ["$scope", "http", function($scope,http){
    $scope.users = [];
    var temp = [];
    $scope.queryInfo = {
			'userCode':'',
			'userName':'',
			'userType':'',
			'className':''
    }
    
    $scope.queryUser = function(){
		http.post({
				'method':'queryUser',
				'userCode':$scope.queryInfo.userCode,
				'userName':$scope.queryInfo.userName,
				'userType':$scope.queryInfo.userType,
				'className':$scope.queryInfo.className
			},URL.UserServlet).then(
				function(respone) {
					$scope.users = respone.order;	
					alert('queryUser success!')
				},
				function(respone) {
					console.log("queryUser failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}
    
    $scope.newAccount = {
//			    	'userCode':'',
//				    'userName':'',
//				    'userType':'1',
//				    'userPassword':'',
//				    'studentId':'',
//				    'className':'',
//				    'startTime':'',
//				    'endTime':'',
//				    'team':''
	};
	$scope.isCreateAccount = false;
	$scope.editable = false;
	$scope.label = '修改';
	$scope.createAccount = function(){
		$scope.isCreateAccount = true;
		temp = angular.copy($scope.users);
		$scope.users = [];
	}
	
	$scope.save = function(){
		if(isEmptyValue($scope.newAccount)){
			return;
		}
		
		http.post({
				'method':'addUser',
				'user':getUserInfoStr($scope.newAccount)
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========已保存========="+JSON.stringify(respone));
					alert("已保存！");
					$scope.isCreateAccount = false;
//					$scope.users.push(angular.copy($scope.newAccount));
					$scope.newAccount = {};
					$scope.queryInfo = {
						'userCode':'',
						'userName':'',
						'userType':'',
						'className':''
   					 }
					$scope.queryUser();
					
				},
				function(respone) {
					console.log("addUser failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});	
		
	}
	
	$scope.cancel = function(){
		$scope.isCreateAccount = false;
		$scope.newAccount = {};
		$scope.users = temp;
	}
	
	$scope.edit = function(index){
		if($scope.users[index].editable){
			$scope.label = '修改';
			updateUser($scope.users[index]);
			$scope.users[index].editable = !$scope.users[index].editable;
			return;
		}
		$scope.label = '保存';
		$scope.users[index].editable = !$scope.users[index].editable;
	}
	
	$scope.del = function(index){
		http.post({
				'method':'deleteUser',
				'id':$scope.users[index].id
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========已删除========="+JSON.stringify(respone));
					alert(JSON.stringify(respone))
				},
				function(respone) {
					console.log("deleteUser failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
		
		$scope.users.splice(index,1);
		
	}
	
	$scope.resetPassword = function(index){
		$scope.users[index].userPassword = '123456';
		http.post({
				'method':'resetPassword',
				'id':$scope.users[index].id
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========密码已重置========="+JSON.stringify(respone));
					alert(JSON.stringify(respone))
				},
				function(respone) {
					console.log("resetPassword failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
   var updateUser = function(item){
		http.post({
				'method':'updateUser',
				'user':getUserInfoStr(item)
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========updateUser========="+JSON.stringify(respone));
					alert("=========updateUser success!========="+JSON.stringify(respone))
				},
				function(respone) {
					console.log("updateUser failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
	var getUserInfoStr = function(obj){
		var temp = angular.copy(obj);
		if (temp.userType == '学员') {
			temp.userType = 1;
		} else{
			temp.userType = 2;
		} 
		
		return JSON.stringify(temp);
	}
	
	
	
}])
app.controller('WareEntryCtrl', ["$scope", "http", function($scope,http){
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
				'receiptItems':JSON.stringify($scope.items)
			},URL.RARS).then(
				function(respone) {
					alert("已确认！")
				},
				function(respone) {
					console.log("addReceiptAcceptanceRecord failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}

}])
app.controller('WareInventoryCtrl', ["$scope", "http", function($scope,http){

	var currentDepotCode;
	$scope.states = {
		// 进入状态详细信息隐藏
		basicState : false,
		// 编辑模式状态
		editMode : false,
		// 添加模式状态
		addNewMode : false,
		// 当前选中仓库
		currentWare : -1

	}

	/**
	 * 输入框编辑模式
	 * @type {Boolean}
	 */
	$scope.editWare = function(){
		if (!$scope.states.addNewMode) {
			$scope.states.editMode = !$scope.states.editMode;			
		}

	}
	/**
	 * 新增模式
	 * @type {Boolean}
	 */
	$scope.addWare = function(){
		$scope.toggleMode(true);
		$scope.states.basicState = true;
		$scope.hasSaveDepot = false;
//		$scope.newDepot = {};
		clearList();
	}
	/**
	 * 切换显示模式
	 * ｛新建/编辑｝
	 */
	$scope.toggleMode = function(bool){
		$scope.states.addNewMode = bool;
	}

	/**
	 * 仓库列表
	 */
	$scope.wareList = [{
	        "id": 1,
	        "depotCode": 12,
	        "depotName": "测试仓库",
	        "depotType": "品类",
	        "depotAddress": "东大街1号",
	        "principal": null,
	        "depotLength": 0,
	        "depotWidth": 0,
	        "depotHeigth": 0,
	        "depotVolume": 0,
	        "cargoAreas": null,
	        "depotNumber": 0,
	        "reservoirs": null,
	        "depotCount": 0
    	}];

	$scope.selectedList = {};
    $scope.updateSelection = function($event, item, index){
        var checkbox = $event.target;
        $scope.states.basicState = true;
		$scope.states.editMode = false;
		$scope.toggleMode(false);
        $scope.selectedList = {};
        $scope.selectedList = angular.copy(item);
		$scope.states.currentWare = index;
		catInfoByCode(item.depotCode);
		queryAllShelfsByDepotCode(item.depotCode);
		catCargoAreaCodesByDepotCode(item.depotCode);
    }
	$scope.selectWare = function(index){
		$scope.states.editMode = false;
		$scope.toggleMode(false);
		$scope.states.currentWare = index;
	}
	

	/**
	 * [addNewArea description]
	 */
	$scope.newAreaList = {};
	$scope.isNewArea = false;
	$scope.addNewArea = function(){
		$scope.isNewArea = !$scope.isNewArea;
	}
	$scope.saveNewArea = function(){
		// 
		$scope.isNewArea = false;
	}

	$scope.newShelveList = {};
	$scope.isNewShelve = false;
	$scope.addNewShelve = function(){
		$scope.isNewShelve = !$scope.isNewShelve;
	}
	$scope.saveNewShelve = function(){
		// 
		$scope.isNewShelve = false;
	}
	
	/**********************************************************************
	 *****************************查看仓库 **********************************
	 ***********************************************************************/
	
	http.post({
				'method':'queryAllDepots'
			},URL.DepotServlet).then(
				function(respone) {
					$scope.wareList = respone.depots;
					
				},
				function(respone) {
					console.log("queryAllDepots failed!" + JSON.stringify(respone));
//					alert(respone);
		});
		
	/**
	 * 根据仓库编号查询仓库详细信息
	 * @param {depotCode} -仓库编号
	 * @return {无返回}
	 */
	function catInfoByCode(depotCode){
		currentDepotCode = depotCode;
		http.post({
				'method':'findDepotByCode',
				'depotCode':depotCode
			},URL.DepotServlet).then(
				function(respone) {
					$scope.selectedList.cargoAreas = respone.depots.cargoAreas;
					createLocatorList($scope.selectedList.cargoAreas);//生成货位表
					alert("仓库查询完成！")
				},
				function(respone) {
					console.log("findDepotByCode failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}
	
	/**
	 * 根据仓库列表生成货位信息
	 * @param {cargoAreasList} -仓库列表
	 * @return {无返回}
	 */
	function createLocatorList(cargoAreasList){
		var temp = [];
		angular.forEach(cargoAreasList,function(item){
			temp = temp.concat(item.locators);
		});
		$scope.locators = temp;
		console.log("========create locators========"+JSON.stringify(temp));
	}
	
//	{
//  "code": 0,
//  "depots": {
//      "id": 1,
//      "depotCode": 12,
//      "depotName": "药品常温库",
//      "depotType": "1",
//      "depotAddress": "东大街1号",
//      "pricipal": "负者人",
//      "depotLength": 200,
//      "depotWidth": 60,
//      "depotHeigth": 200,
//      "depotVolume": 2400000,
//      "cargoAreas": [
//          {
//              "id": 1,
//              "depotCode": 12,
//              "cargoAreaCode": "A",
//              "cargoAreaName": "口服剂型区",
//              "cargoAreaDesc": "口服剂",
//              "shelfCount": 3,
//              "locatorCount": 13,
//              "boxCount": 0
//          },
//          {
//              "id": 2,
//              "depotCode": 12,
//              "cargoAreaCode": "B",
//              "cargoAreaName": "针剂输液去",
//              "cargoAreaDesc": "针剂",
//              "shelfCount": 1,
//              "locatorCount": 3,
//              "boxCount": 0
//          }
//      ],
//      "depotNumber": 0,
//      "reservoirs": null,
//      "depotCount": 0
//  }
//}
/***************************************************************************
*****************************新建仓库 start**********************************
****************************************************************************/      
	$scope.hasSaveDepot = false;
	$scope.newDepot = {
//						"id": null,
//				        "depotCode": null,
//				        "depotName": null,
//				        "depotType": null,
//				        "depotAddress": null,
//				        "principal": null,
//				        "depotLength": null,
//				        "depotWidth": null,
//				        "depotHeigth": null,
//				        "depotVolume": null,
//				        "cargoAreas": null,
//				        "depotNumber": null,
//				        "reservoirs": null,
//				        "depotCount": null
				};
	/**
	 * 新增仓库 保存
	 * @return {无返回}
	 */
	$scope.addNewDepot = function(){
		if(isEmptyValue($scope.newDepot)){
			alert("仓库信息不能为空！");
			return;
		}
		$scope.newDepot.id = $scope.wareList[$scope.wareList.length-1].id + 1;
		$scope.wareList.push(angular.copy($scope.newDepot));
		console.log($scope.wareList);
		$scope.hasSaveDepot = true;
		
		http.post({
				'method':'addDepot',
				'depot':JSON.stringify($scope.newDepot)
			},URL.DepotServlet).then(
				function(respone) {
					console.log("=========新建仓库========="+JSON.stringify(respone));
					alert(JSON.stringify(respone));
				},
				function(respone) {
					console.log("addDepot failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
	//新建货区
	$scope.selectCargoAreaList = [],//货区选择列表
	$scope.addCargoAreas = [
//	    {
//	        'depotCode': null,
//	        'cargoAreaName': null,
//	        'cargoAreaCode': null,
//	        'cargoAreaDesc': null
//	    }
	],
	
	$scope.newCargoArea = {
//		'depotCode': null,
//	    'cargoAreaName': null,
//	    'cargoAreaCode': null,
//	    'cargoAreaDesc': null
	},

	/**
	 * 新增货区 保存
	 * @return {无返回}
	 */
	$scope.addNewCargoArea = function(){
		if(isEmptyValue($scope.newDepot)){
			alert("请先输入仓库基本信息，并保存！");
			return;
		}
		$scope.newCargoArea.depotCode = angular.copy($scope.newDepot).depotCode;
		$scope.addCargoAreas.push(angular.copy($scope.newCargoArea));
		$scope.newCargoArea = {}; 
		
	}
	$scope.editNewCargoArea = true;
	$scope.cancelCargoArea = function(type,index){
		switch(type){
			case 0:
				$scope.isNewArea = !$scope.isNewArea;
				break;
			case 1:
				$scope.addCargoAreas.splice(index,1);
				break;
			case 2:
				break;
		}
	}
	$scope.editCargoArea = function(){
		$scope.editNewCargoArea = !$scope.editNewCargoArea;
	}
	
	$scope.saveNewCargoAreas = function(){
		if(isEmptyValue($scope.newDepot)){
			alert("请先输入仓库基本信息，并保存！");
			return;
		}
		$scope.isNewArea = false;
		if(isEmptyValue($scope.addCargoAreas)){
			alert('货区信息不能为空！');
			return;
		}
		
		http.post({
				'method':'addCargoArea',
				'cargoAreas':JSON.stringify($scope.addCargoAreas)
			},URL.CargoAreaServlet).then(
				function(respone) {
					console.log("=========新建货区========="+JSON.stringify(respone));
					alert(JSON.stringify(respone));
				//	$scope.selectCargoAreaList = angular.copy($scope.addCargoAreas);
					createSelectCargoAreaList(angular.copy($scope.addCargoAreas));
				},
				function(respone) {
					console.log("CargoAreaServlet add failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
	function createSelectCargoAreaList(objs){
		angular.forEach(objs, function(data,index,array){
			//data等价于array[index]
			if(!isInArray($scope.selectCargoAreaList,{'cargoCode':data.cargoAreaCode})){
				$scope.selectCargoAreaList.push({'cargoCode':data.cargoAreaCode})
			}
		});
		console.log("$scope.selectCargoAreaList:"+JSON.stringify($scope.selectCargoAreaList));
	}
	$scope.selectCargoArea = function(item,index){
		
		if ($scope.states.addNewMode) {	
			$scope.addShelfList[index].cargoAreaCode = item.cargoAreaCode.cargoCode;
			console.log("添加模式："+JSON.stringify($scope.addShelfList[index]));
		}else{
			//$scope.addAdjustShelfList[index].cargoAreaCode = item.cargoAreaCode.cargoCode;
			console.log("调整模式："+JSON.stringify($scope.addAdjustShelfList[index]));	
		}
		
	}
	
	/**
	 * 新增货架
	 */
	$scope.addShelfList = [
//	     {
//	        'shelfSpecification': 2,
//	        'shelfLayer': 2,
//	        'shelfCount': 2
//  	}
	],
	
	$scope.newShelft = {
//			'shelfSpecification': 2,
//	        'shelfLayer': 2,
//	        'shelfCount': 2
	}
	
	$scope.addNewShelft = function(){
		if(isEmptyValue($scope.newDepot)){
			alert("请先输入仓库基本信息，并保存！");
			return;
		}
		
		if(isEmptyValue($scope.newShelft)){
			alert("请填写货架信息！");
			return;
		}
		
		$scope.newShelft.depotCode = angular.copy($scope.newDepot).depotCode;
		$scope.newShelft.shelfCode = $scope.addShelfList.length + 1;
		$scope.addShelfList.push(angular.copy($scope.newShelft));
		$scope.newShelft = {}; 
		
		console.log("------$scope.addShelfList------"+JSON.stringify($scope.addShelfList))
		
	}
	$scope.editNewShelft = true;
	$scope.cancelShelft = function(type,index){
		switch(type){
			case 0:
				$scope.isNewShelve = !$scope.isNewShelve;
				break;
			case 1:
				$scope.addShelfList.splice(index,1);
				break;
			case 2:
				break;
		}
	}
	$scope.editShelft = function(){
		$scope.editNewShelft = !$scope.editNewShelft;
	}
	
	$scope.saveNewShelft = function(){
		if(isEmptyValue($scope.newDepot)){
			alert("请先输入仓库基本信息，并保存！");
			return;
		}
		$scope.isNewShelve= false;
		if(isEmptyValue($scope.addShelfList)){
			alert('货架信息为空！');
			return;
		}
		
		http.post({
				'method':'addShelf',
				'shelfs':JSON.stringify($scope.addShelfList)
			},URL.ShelfServlet).then(
				function(respone) {
					console.log("=========新建货架========="+JSON.stringify(respone));
					alert(JSON.stringify(respone));
					//货区调整 / 分配
					$scope.addNewShelfs = angular.copy($scope.addShelfList);
				},
				function(respone) {
					console.log("addShelf add failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
	/**
	 * 根据仓库编号查询货位   货位分配/调整  货位下拉列表
	 * @param {depotCode} -仓库编号
	 * @return {无返回}
	 */	
	function catCargoAreaCodesByDepotCode(depotCode){//货位查询
		http.post({
				'method':'findCargoAreaCodesByDepotCode',
				'depotCode':depotCode
			},URL.CargoAreaServlet).then(
				function(respone) {
					console.log("=========货区分配========="+JSON.stringify(respone));
					$scope.cargoAreaAssignArray = respone.cargoAreaCodes;
					/*angular.forEach(respone.cargoAreaCodes,function(item){
						$scope.cargoAreaAssignArray.push({
							'cargoCode':item
						});
					});
					*/
					console.log("=========$scope.cargoAreaAssignArray========="+JSON.stringify($scope.cargoAreaAssignArray));
					alert("findCargoAreaCodesByDepotCode success!")
				},
				function(respone) {
					console.log("CargoAreaServlet failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
		
	/*
	 * 根货位分配/调整  保存
	 */	
	$scope.updateCargoAreaCodes = function(){
		var shlfsStr = '';
		if ($scope.states.addNewMode) {		
			shlfsStr = JSON.stringify($scope.addShelfList)
		}else{
			shlfsStr = JSON.stringify($scope.addAdjustShelfList)
		}
		
		http.post({
				'method':'updateShelf',
				'shelfs':shlfsStr
			},URL.ShelfServlet).then(
				function(respone) {
					console.log("=========updateShelf========="+JSON.stringify(respone));
					alert("updateShelf success!"+JSON.stringify(respone));
				},
				function(respone) {
					console.log("updateShelf failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
		
//		"shelfs": [
//      {
//          "shelfCode": 1,
//          "shelfName": null,
//          "shelfSpecification": 0,
//          "shelfLayer": 4,
//          "cargoAreaCode": null,
//          "shelfStorageCategory": null,
//          "locators": null,
//          "shelfNumber": null,
//          "shelfCount": 0,
//          "locatorCount": 0,
//          "layers": null
//			"cargoAreaOptions":[]
//      },
		
	function clearList(){
		$scope.newDepot = {};
		
		$scope.addCargoAreas = [];
		$scope.newCargoArea = {};
		
		$scope.addShelfList = [];
		$scope.newShelft = {};
		
		$scope.addNewShelfs = [];
		
		$scope.isNewAdjustShelve = false;
			
	}
/**********************************************************************
*****************************调整仓库 **********************************
***********************************************************************/

	/**************************************调整货仓 start*********************************************/
	
	/**
	 * 仓库调整
	 */
	$scope.saveEditWare = function(){
		if ($scope.states.addNewMode) {
			return;	
		}
		
		$scope.states.editMode = !$scope.states.editMode;
		$scope.wareList[$scope.states.currentWare] = angular.copy($scope.selectedList);
		
		http.post({
				'method':'updateDepot',
				'depot':JSON.stringify($scope.selectedList)
			},URL.DepotServlet).then(
				function(respone) {
					console.log("=========调整仓库========="+JSON.stringify(respone));
					alert(JSON.stringify(respone));
				},
				function(respone) {
					console.log("调整货仓库failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	/**************************************调整货仓 end*********************************************/
	
	
	/**************************************调整货区  start*********************************************/
	/**
	 * 调整货区 
	 */
	$scope.newCargoAreaAdjust = {};
	$scope.isNewAreaAdjust = false;
	
	$scope.editAdjustCargoArea = true;
	
	$scope.addCargoArea = function(){
		$scope.isNewAreaAdjust = !$scope.isNewAreaAdjust;
	}

	$scope.addAdjustCargoArea = function(){
		$scope.newCargoAreaAdjust.depotCode = currentDepotCode;
		$scope.selectedList.cargoAreas.push(angular.copy($scope.newCargoAreaAdjust));
		$scope.newCargoAreaAdjust = {}; 
	}
	
	$scope.cancelAdjustCargoArea = function(type,index){
		switch(type){
			case 0:
				$scope.isNewAreaAdjust = !$scope.isNewAreaAdjust;
				$scope.newCargoAreaAdjust = {};
				break;
			case 1:
				$scope.selectedList.cargoAreas.splice(index,1);
				break;
			case 2:
				break;
		}
	}
	
	$scope.editAdjust = function(){
		$scope.editAdjustCargoArea = !$scope.editAdjustCargoArea;
	}
	
	$scope.saveAdjustCargoAreas = function(){
		
		$scope.isNewAreaAdjust = false;
		if(isEmptyValue($scope.selectedList.cargoAreas)){
			alert('货区信息不能为空！');
			return;
		}
		
		http.post({
				'method':'updateCargoArea',
				'cargoAreas':JSON.stringify($scope.selectedList.cargoAreas)
			},URL.CargoAreaServlet).then(
				function(respone) {
					console.log("=========调整货区========="+JSON.stringify(respone));
					alert(JSON.stringify(respone));
				},
				function(respone) {
					console.log("updateCargoArea failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	/**************************************调整货区  end*********************************************/
	

	
	
	/**
	 * 调整货架
	 */
	//新建货架
	
	$scope.addAdjustShelfList = [
//	     {
//	        'shelfSpecification': 2,
//	        'shelfLayer': 2,
//	        'shelfCount': 2
//  	}
	],
	
	$scope.newAdjustShelft = {
//			'shelfSpecification': 2,
//	        'shelfLayer': 2,
//	        'shelfCount': 2
	}
	
	$scope.addNewAdjustShelve = function(){
		$scope.isNewAdjustShelve = !$scope.isNewAdjustShelve;
	}
	
	$scope.addNewAdjustShelft = function(){
		if(isEmptyValue($scope.newAdjustShelft)){
			alert("请填写货架信息！");
			return;
		}
		$scope.newAdjustShelft.depotCode = currentDepotCode;
		$scope.newAdjustShelft.shelfCode = $scope.addAdjustShelfList.length+1;
		
		$scope.addAdjustShelfList.push(angular.copy($scope.newAdjustShelft));
		$scope.newAdjustShelft = {}; 
		
		
	}
	$scope.editNewAdjustShelft = true;
	$scope.cancelAdjustShelft = function(type,index){
		switch(type){
			case 0:
				$scope.isNewAdjustShelve = !$scope.isNewAdjustShelve;
				break;
			case 1:
				$scope.addAdjustShelfList.splice(index,1);
				break;
			case 2:
				break;
		}
	}
	$scope.editAdjustShelft = function(){
		$scope.editNewAdjustShelft = !$scope.editNewAdjustShelft;
	}
	
	$scope.saveNewAdjustShelft = function(){
		
		$scope.isNewAdjustShelve= false;
		if(isEmptyValue($scope.addAdjustShelfList)){
			alert('货架信息为空！');
			return;
		}
		
		http.post({
				'method':'updateShelf',
				'shelfs':JSON.stringify($scope.addAdjustShelfList)
			},URL.ShelfServlet).then(
				function(respone) {
					console.log("=========调整货架修改提交========="+JSON.stringify(respone));
					alert(JSON.stringify(respone));
				},
				function(respone) {
					console.log("addShelf add failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
	function queryAllShelfsByDepotCode(depotCode){
		http.post({//货架查询
				'method':'queryAllShelfs',
				'depotCode':depotCode
			},URL.ShelfServlet).then(
				function(respone) {
					console.log("=========查询货架调整========="+JSON.stringify(respone));
					$scope.addAdjustShelfList = respone.shelfs;
					alert("queryAllShelfsByDepotCode success!")
				},
				function(respone) {
					console.log("queryAllShelfs failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
	
}])
app.controller('wareMaintainCtrl', ["$scope", "http", function($scope,http){
    //
    $scope.maintainInfo = {
    	"storage":"1111",
    	"recordDate":secondsToData(new Date().getTime()),
    	"storeMan":"隔壁老张",
    	"storeRoom":[{
    					"time":"上午",
    					"recordTime":secondsToData(new Date().getTime()),
    					"temperature":"25",
    					"humidity":"12",
    					"adjustMeasures":"xxxx"
    			},{
    					"time":"下午",
    					"recordTime":secondsToData(new Date().getTime()),
    					"temperature":"29",
    					"humidity":"10",
    					"adjustMeasures":"xxxx"
    				}
    	],
    	"storeDevices":"运转正常",
    	"check":{
    		"maintainPlace":"货区",
    		"maintainPeople":"王小二",
    		"specNum":10,
    		"batchNum":20,
    		"quality":"良好",
    		"measures":"措施",
    		"result":"结果",
    		"remark":"备注1111"
    		
    	}
    	
    },
    
    //仓库 option
	$scope.storage1 = [
			{value : 0, name : "仓库1"},
	    	{value : 1, name : "仓库2"},
	    	{value : 2, name : "仓库3"},
	    	{value : 3, name : "仓库4"}
		];
	$scope.defaultSelect = $scope.storage1[0];//默认选中
	
	var storageRecord = {};
	//保存保管养护
	$scope.save = function(){
		
		storageRecord =  {
	        'storageRecordTime': $scope.maintainInfo.recordDate,
	        'depotCode': $scope.defaultSelect.value+'',
	        'storager': $scope.maintainInfo.storeMan,
	        'morningRecordTime': $scope.maintainInfo.storeRoom[0].recordTime,
	        'morningTemperature': $scope.maintainInfo.storeRoom[0].temperature,
	        'morningHumidity': $scope.maintainInfo.storeRoom[0].humidity,
	        'morningMeasure': $scope.maintainInfo.storeRoom[0].adjustMeasures,
	        'afternoonRecordTime': $scope.maintainInfo.storeRoom[1].recordTime,
	        'afternoonTemperature': $scope.maintainInfo.storeRoom[1].temperature,
	        'afternoonHumidity': $scope.maintainInfo.storeRoom[1].humidity,
	        'afternoonMeasure': $scope.maintainInfo.storeRoom[1].adjustMeasures,
	        'equipmentSituation': $scope.maintainInfo.storeDevices,
	        'conserveReservoir': $scope.maintainInfo.check.maintainPlace,
	        'conserver': $scope.maintainInfo.check.maintainPeople,
	        'conserveNumber': $scope.maintainInfo.check.specNum+'',
	        'conserveBatch': $scope.maintainInfo.check.batchNum+'',
	        'qualityStatus': $scope.maintainInfo.check.maintainPeople,
	        'conserveMeasure': $scope.maintainInfo.check.quality,
	        'handleResult': $scope.maintainInfo.check.result,
	        'memo': $scope.maintainInfo.check.remark
    	},
    	
    	submit1();
    
	}
	
	var submit1 = function(){
		
		http.post({'method':'addStorageRecord','storageRecord':JSON.stringify(storageRecord)},URL.storageRecordServlet).then(
				function(respone) {
					console.log("=========保管养护========="+JSON.stringify(respone));
					alert("已保存！")
				},
				function(respone) {
					console.log("saveStorage failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}
   
}])
app.controller('WareShelvesCtrl', ["$scope", "http", function($scope,http){

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
		
		http.post({'method':'queryAllReceiptAcceptanceRecords','receiptTimeStartStr':$scope.startTime,'receiptTimeEndStr':$scope.endTime},URL.RARS).then(
				function(respone) {
					$scope.items = respone.receiptAcceptanceRecords;
					console.log("=========queryAllReceiptAcceptanceRecords========="+JSON.stringify(respone));
				},
				function(respone) {
					console.log("queryAllReceiptAcceptanceRecords failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}
	
	//明细查询
	$scope.queryDetail = function(receiptCode){
		http.post({'method':'queryRecordAndItemByCode','receiptCode':receiptCode},URL.RARS).then(
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
					alert(respone);
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
					alert("已成功入库！");
				},
				function(respone) {
					console.log("=========入库失败============" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
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
}])
app.controller('WareStorageCtrl', ["$scope", "http", function($scope,http){
	// 浮层控制
	$scope.modalToggle = function(bool){
		$scope.modalState = bool;
	}
	// mapping
	$scope.mapping = {
        "productCode": '商品编号',
        "ordinaryName": "通用名",
        "productName": "商品名",
        "specifications": "规格型号",
        "manufactory": "生产厂家",
        "unit": "计量单位",
        "carLoad": "包装规格",
        "validity": "有效期",
        "driver": "生产日期",
        "stockNumber": "库存数量",
        "memo": "备注"		
	}

	// 需ajax请求订单列表
	$scope.vehicleList = {
		    "code": 0,
		    "vehicle": [{
	            "carCode": '车辆编号',
	            "carNumber": "车牌号",
	            "carName": "车名",
	            "carType": "车型",
	            "carUnit": "所属单位",
	            "carSize": "尺寸",
	            "carLoad": "载重",
	            "capacity": "容积",
	            "driver": "司机",
	            "status": "状态",
	            "memo": "备注"
	        },{
	            "carCode": 'C0001',
	            "carNumber": "沪C0001",
	            "carName": "1号车",
	            "carType": "车型",
	            "carUnit": "第1车队",
	            "carSize": "5000",
	            "carLoad": "50",
	            "capacity": "5000",
	            "driver": "王二",
	            "status": "运输中",
	            "memo": "备注"
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
		var origin = $scope.vehicleList.vehicle[i];
		cp(origin, $scope.tempItem);
		$scope.modalToggle(false);
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
		$scope.vehicleList.vehicle.push({
			"carCode": newItem.carCode,
			"carNumber": newItem.carNumber,
			"carName": newItem.carName,
			"carType": newItem.carType,
			"carUnit": newItem.carUnit,
			"carSize": newItem.carSize,
			"carLoad": newItem.carLoad,
			"capacity": newItem.capacity,
			"driver": newItem.driver,
			"memo": newItem.memo
		})
	};
	// 删除明细
	$scope.rmItem = function(index){
		$scope.vehicleList.vehicle.splice(index,1);
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
	
	//查询库存信息
	$scope.queryStorage = function(){
		http.post({'method':'queryAllStocks'},URL.stockQurey).then(
				function(respone) {
					console.log("=========查询库存信息========="+JSON.stringify(respone));
				},
				function(respone) {
					console.log("queryAllStocks failed!" + JSON.stringify(respone));
					alert(respone);
		});
	}
	$scope.queryStorage();
}])