app.controller('LoadSelectCtrl', function($scope,http){

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
	
})