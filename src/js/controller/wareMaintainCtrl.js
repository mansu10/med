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
		
		http.post({'method':'addStorageRecord','storageRecord':JSON.stringify(storageRecord),
		        'agencyCode':$rootScope.user.agencyCode},URL.storageRecordServlet).then(
				function(respone) {
					console.log("=========保管养护========="+JSON.stringify(respone));
					popAlert("已保存！")
				},
				function(respone) {
					console.log("saveStorage failed!" + JSON.stringify(respone));
					popAlert(respone);
		});
	}
   
})