app.controller('LoadQueryCtrl', function($scope,http,$timeout){

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
	
	
})