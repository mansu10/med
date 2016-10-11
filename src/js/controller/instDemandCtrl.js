app.controller('InstDemandCtrl', function($scope,http){
	
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
		}
		
	}
	
	//查询模块
	$scope.type = [
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
		alert('查询');
//		http.post({
//				'method':'queryDemandAgency',
//				'demandAgencyType':$scope.selectedName,
//				'demandAgencyName':$scope.demandAgencyName
//			},URL.UserServlet).then(
//				function(respone) {
//					console.log("========= queryDemandAgency success！========="+JSON.stringify(respone));
//				},
//				function(respone) {
//					console.log("queryDemandAgency failed!" + JSON.stringify(respone));
//					alert(JSON.stringify(respone));
//		});
	}
	
	
	$scope.demandAgencyList = [
		{
			'demandAgencyCode': 'B00001',
	        'demandAgencyName': '1军1师1团团救护所',
	        'demandAgencyType': '团救护所',
	        'demandAgencyLevel': '级别',
	        'demandAgencyAddress1': '浙江省湖州市吴兴区',
	        'demandAgencyAddress2': '车站路9号',
	        'demandAgencyCoordinate': '120.104566,30.861911',
	        'demandAgencyNumber': 30,
	        'demandAgencyProtect': '20',
	        'contacts': '王建国',
	        'tel': '13902102101'
		}
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
		$scope.demandAgencyList.push(angular.copy($scope.demandAgency));
		http.post({
				'method':'addDemandAgency',
				'demandAgency':JSON.stringify($scope.demandAgency)
			},URL.DemandAgencyServlet).then(
				function(respone) {
					console.log("========= demandAgency success！========="+JSON.stringify(respone));	
				},
				function(respone) {
					console.log("demandAgency failed!" + JSON.stringify(respone));
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
		
		angular.forEach($scope.selected,function(item){//根据坐标批量删除选择的机构 
			console.log("========= del =========="+item);
			$scope.demandAgencyList.splice(item,1);
		});
		
		$scope.selected = [];
	}
   /************************选择删除  end*****************************/
    

})