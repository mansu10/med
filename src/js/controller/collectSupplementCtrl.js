app.controller('CollectSupplementCtrl', function($scope,http){
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
	            "maxInvent": 3,
	            "inventLevel": 3/4,
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
	            "maxInvent": 30000,
	            "inventLevel": 1/2,
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
	            "inventory": 30,
	            "inventValue": 0,
	            "minInvent": 130,
	            "maxInvent": 300,
	            "inventLevel": 1/3,
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
})