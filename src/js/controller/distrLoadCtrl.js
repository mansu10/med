app.controller('DistrLoadCtrl', function($rootScope, $scope,http){

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
	http.post({'method':'queryAllCars','numberOrType':'','agencyCode':$rootScope.user.agencyCode},URL.carQurey).then(
			function(respone) {
				// console.log(JSON.stringify(respone));
				$scope.vehicleList = respone;
				$scope.carDetail = $scope.vehicleList.cars[0]; 

				construct($scope.vehicleList);
			},
			function(respone) {
				console.log("Order qurey failed!" + JSON.stringify(respone));
				popAlert(respone);
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




})