app.controller('WareEntryCtrl', function($scope,http){
    //入库管理表
    $scope.entryInfo = {
    	"recevierTime":secondsToData(new Date().getTime()),
    	"goodsDes":"11111",
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
    	"checkMan":"张益达",
    	"conclusion":"结论",
    	"remark":"备注"    	
    },
    
    //验收结论 option
		$scope.conclusion = [
			{value : 0, name : "不足"},
	    	{value : 1, name : "超量"},
	    	{value : 2, name : "正常"},
	    	{value : 3, name : "全部"}
		];
		$scope.defaultSelect = $scope.conclusion[3];//默认选中
    //明细列表
    $scope.items = [{
	            "name": "健胃消食片",	
	            "code":"000001",
	            "size": "规格1",
	            "type": "型号1",
	            "unit": "24粒/盒",
	            "factory":"厂家1",
	            "serial":"001",
	            "price": 1.00,
	            "amount": 100        
	        },{
	            "name": "感冒通灵",	    
	            "code":"000002",
	            "size": "规格2",
	            "type": "型号2",
	            "unit": "12粒/盒",
	            "factory": "厂家2",	
	            "serial":"002",
	            "price": 1.00,
	            "amount": 200     	            
	        }	     
	    ];
	$scope.newItem = {};
	$scope.addItem = function(newItem){
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

})