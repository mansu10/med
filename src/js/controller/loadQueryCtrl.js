app.controller('LoadQueryCtrl', function($rootScope, $scope,http,$timeout){

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
					'orderCode':$scope.orderCode,
		            'agencyCode':$rootScope.user.agencyCode
				}, URL.StowageServlet).then(
					function(respone) {
						popAlert("配载查询成功");
						$scope.stowages = respone.stowages;
					},
					function(respone) {
						popAlert(JSON.stringify(respone));
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
				popAlert("请先选择删除项！！")
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
				popAlert("提交的删除项编号为空，请检查后重新提交！！")
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
		popAlert(ids)
		http.post({
				'method': 'deleteStowage',
				'ids': ids
			}, URL.StowageServlet).then(
				function(respone) {
					popAlert("删除成功");
				},
				function(respone) {
					console.log("delete stowages failed!" + JSON.stringify(respone));
					popAlert(JSON.stringify(respone));
				});
	}
		/************************选择删除  end*****************************/
})