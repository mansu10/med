app.controller('wareMaintainCtrl', function($scope,http){
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
   
})