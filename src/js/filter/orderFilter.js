app.filter('orderFilter',function(){
	var tempArray = [];
	return function(input,obj){
		
		if(obj.key == 'all'){
			return input;
		}
		
		angular.forEach(input,function(item){
			
			if(item[obj.key] == obj.value){
				tempArray.push(item);
			}
		});
		console.log("=tempArray="+JSON.stringify(tempArray))
		return unique(tempArray,'customerCode');//$$hashKey
	};
	
	//去除重复的元素
	function unique(arr, key){
	    var tempArr = arr;
	    for(var i = 0;i < tempArr.length;i++){
	        for(var j = 0;j< tempArr.length;j++){
	            if(tempArr[i][key] == tempArr[j][key]){
	                arr.splice(j,1);
	            }
	        }
	    }
	    return arr; 
 	}
	
});