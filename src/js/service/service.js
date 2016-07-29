//本地存储数据===================================                                                                                                                                                                                                                                                                                                
app.factory('$localstorage', ['$window', function($window) {
	return {
		//存储单个属性
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		//读取单个属性
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		//存储对象，以JSON格式存储
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		//读取对象
		getObject: function(key) {
			return JSON.parse($window.localStorage[key] || '{}');
		},
		//更新
		update: function(key, value) {
			if (value) {
				$window.localStorage.setItem(key, angular.toJson(value));
			}
		},
		//删除某一存储对象
		clear: function(key) {
			$window.localStorage.removeItem(key);
		},
		//读取数组
		getArray: function(key) {
			return JSON.parse($window.localStorage[key] || '[]');
		},
		//判断缓存中是否存在该元素
		has: function(key) {
			return !!$window.localStorage[key]
		},
		//清除缓存
		clearAll: function() { 
			$window.localStorage.clear();
		}
	}
}]);


//==============http 请求接口=================
app.factory('http', ['$http', '$window', '$localstorage', '$q', function($http, $window, $localstorage, $q) {
	var http = {};

	//GET 请求
	var get = function(requestUrl) {
		
		console.log("get请求url:" + requestUrl);
		
		var def = $q.defer();
		$http({
			url: requestUrl,
			method: 'GET'
		}).success(function(data, status, header, config) {
			//响应成功
			console.log('get请求返回：\n' + 'data:' + JSON.stringify(data) + '\nstatus:' + status)
			if (data.code == 0) {
				def.resolve(data);
			} else {
				def.reject("Failed to get ");
			}

		}).error(function(data, status, header, config) {
			//处理响应失败
			def.reject("Failed to get");
			console.log('get请求失败：\n' + 'date:' + data + '\nheader:' + header + '\nconfig:' + config + '\nstatus:' + status)
		});
		return def.promise;
	};
	
	//POST请求
	var post = function(obj,requestUrl) {
		
		console.log("post请求url:" + requestUrl);
		console.log("post请求参数:" + JSON.stringify(obj));
		
		var def = $q.defer();
		$http({
			url: requestUrl,
			method: 'POST',
			data: obj,
			headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
			
		}).success(function(data, status, header, config) {
			//响应成功
			console.log('post请求成功：\n' + 'date:' + JSON.stringify(data) + '\nstatus:' + status);
			if (data.code == 0) {
				def.resolve(data);
			} else {
				def.reject("Failed to post");
			}

		}).error(function(data, status, header, config) {
			//处理响应失败
			def.reject("Failed to post");
			console.log('post请求失败：\n' + 'date:' + data + '\nheader:' + header + '\nconfig:' + config + '\nstatus:' + status)
		});
		return def.promise;
	};

	//PUT 请求
	var put = function(obj, requestUrl) {
		
		var def = $q.defer();
		
		console.log("put请求url:" +requestUrl);
		console.log("put请求参数:" + JSON.stringify(obj));

		$http({
			url: requestUrl,
			method: 'PUT',
			data: obj,
			header: 'Content-Type:application/json'
		}).success(function(data, status, header, config) {
			//响应成功
			console.log('put请求成功：\n' + 'date:' + JSON.stringify(data) + '\nstatus:' + status);
			if (data.code == 0) {
				def.resolve(data);
				
			} else {
				def.reject("Failed to put");
			}

		}).error(function(data, status, header, config) {
			//处理响应失败 
			def.reject("Failed to put");
			console.log('put请求失败：\n' + 'date:' + data + '\nheader:' + header + '\nconfig:' + config + '\nstatus:' + status)
		});
		return def.promise;
	};

	//DELETE 请求
	var del = function(requestUrl) {
		
		console.log("delete请求url:" + requestUrl);
		
		var def = $q.defer();
		$http({
			url: requestUrl,
			method: 'DELETE',
			header: 'Content-Type:application/json'
		}).success(function(data, status, header, config) {
			//响应成功
			console.log('delete请求成功：\n' + 'date:' + JSON.stringify(data) + '\nstatus:' + status);
			if (data.code == 0) {
				def.resolve(data);
	
			} else {
				def.reject("Failed to delete");
			}

		}).error(function(data, status, header, config) {
			//处理响应失败
			def.reject("Failed to delete");
			console.log('delete请求失败：\n' + 'date:' + data + '\nheader:' + header + '\nconfig:' + config + '\nstatus:' + status)
		});
		return def.promise;
	};

	
	http.get = get;
	http.post = post;
	http.put = put;
	http.del = del;

	return http;
}]);
