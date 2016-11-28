/**
 * 判断数据是否为空
 * @param 
 * 在这里定义如下的数据值为“空值”：
 *	•undefined
 *	•null
 *	•空字符串及纯空白字符串：''、'    ' 等。
 *	•空数组：[]
 *	•空对象：{}
 */
var isEmptyValue = function(value) {
    var type;
    if(value == null) { // 等同于 value === undefined || value === null
        return true;
    }
    type = Object.prototype.toString.call(value).slice(8, -1);
    switch(type) {
    case 'String':
        return !$.trim(value);
    case 'Array':
        return !value.length;
    case 'Object':
        return $.isEmptyObject(value); // 普通对象使用 for...in 判断，有 key 即为 false
    default:
        return false; // 其他对象均视作非空
    }
};	

/**
 * 判断数组中是否存在某元素
 * @param 数组、元素
 */
var inArray=function(param, value) {
	var len = param.length;
	for (var i = 0; i < len; i++) {
		if (param[i] == value)
			return true;
	}
	return false;
}

/**
 * 判断数组中是否存在某元素
 * @param 数组、元素
 */
var isInArray=function(arr, value) {
	
	if(JSON.stringify(arr).indexOf(JSON.stringify(value)) > -1) 
   		return true;//存在
 	else
    	return false; //不存在
}

	//根据下标删除数组元素
	Array.prototype.removeItem = function(dx) {

		if (isNaN(dx) || dx >= this.length) {
			return false;
		}
		this.splice(dx, 1);
	}

	//数组添加item
	Array.prototype.addItemToArry = function(item) {
		this.push(item);
	}
	
	function secondsToData (strTime) {
    	var date = new Date(strTime);
    	console.log("===============================2"+strTime+date);
    	return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getMilliseconds();
	}



/**
 * 临时使用alert，后续更改
 * 
 */

function popAlert(msg){
	var tpl = ['<div id="alert" class="">',
		    '    <div class="modal fade in" style="display: block;">',
		    '        <div class="modal-dialog modal-sm">',
		    '            <div class="modal-content">',
		    '                <div class="modal-header">',
		    '                    <button type="button" class="close J_close" data-dismiss="modal" aria-hidden="true">×</button>',
		    '                    <h4 class="modal-title">提示</h4>',
		    '                </div>',
		    '                <div class="modal-body row">',
		    '                    <p class="J_msg">'+msg+'</p>',
		    '                </div>',
		    '            </div>',
		    '        </div>',
		    '    </div>',
		    '    <div class="modal-backdrop fade in"></div>',
		    '</div>'].join('');
	var $alert = $(tpl);
	$alert.find('.J_close').on('click', function(event) {
		$alert.remove()
	});
	$('body').append($alert);
}

window.popAlert = popAlert;


