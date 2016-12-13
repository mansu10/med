app.controller('InstSupplyCtrl', function($rootScope, $scope, http) {
	$scope.userType = $rootScope.user.userType;

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
			popAlert("请填写内容后再进行保存！！")
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
			'supplyAgencyType': $scope.selectedName,
            'agencyCode':$rootScope.user.agencyCode
		}, URL.SupplyAgencyServlet).then(
			function(respone) {
				$scope.supplyAgencies = respone.supplyAgencies;
				if (respone.code != 0) {
					popAlert("操作失败："+JSON.stringify(respone));
				}else{
					popAlert("查询完成");
				}
				
			},
			function(respone) {
				console.log("findAllSupplyAgencys failed!" + JSON.stringify(respone));
				popAlert("操作失败："+JSON.stringify(respone));
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
			'supplyAgencyJobs':JSON.stringify($scope.supplyAgency.supplyAgencyJobs),
            'agencyCode':$rootScope.user.agencyCode
		}, URL.SupplyAgencyServlet).then(
			function(respone) {
				if (respone.code != 0) {
					popAlert("操作失败："+JSON.stringify(respone));
				}
				$scope.supplyAgency.id = respone.id;
				$scope.supplyAgencies.push(angular.copy($scope.supplyAgency));
			},
			function(respone) {
				console.log("addSupplyAgency failed!" + JSON.stringify(respone));
				popAlert("操作失败："+JSON.stringify(respone));
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
				popAlert("updateSupplyAgency success!")
			},
			function(respone) {
				console.log("updateSupplyAgency failed!" + JSON.stringify(respone));
				popAlert("操作失败："+JSON.stringify(respone));
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
				popAlert("请先选择删除项！！")
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
				popAlert("提交的删除项编号为空，请检查后重新提交！！")
				return;
			}
			http.post({
				'method': 'deleteSupplyAgency',
				'ids': deleteID.substring(0, deleteID.length - 1)
			}, URL.DemandAgencyServlet).then(
				function(respone) {
					popAlert("删除成功");
				},
				function(respone) {
					console.log("deleteSupplyAgency failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
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
				popAlert("请输入岗位信息后再保存！")
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
				popAlert("请先选择删除项！！")
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
})