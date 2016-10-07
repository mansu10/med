angular.module('customFilter',[])
.filter('shelfFilter',function(){
	return function(input){
		var out = "";
		switch(parseInt(input)){
			case 0:
				out = '1.2*0.4*2';
				break;
			case 1:
				out = '1.5*0.5*2';
				break;
			case 2:
				out = '2*0.6*2';
				break;
			default:
				out = input;
				break;
		}
		return out;
	}
		
});