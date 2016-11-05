app.controller('PrintCtrl', function($scope, http, $location, printlist,$state, $stateParams) {
    function getUrlParams(name) {
        return $location.search()[name];
    }
    $scope.orderToPrint = [];
    // var printList = printlist.get();
    // var itemId = Number($stateParams.item);
    // if (itemId == undefined) {
    // 	alert("something wrong");
    //     return;
    // } else {
    //     if (itemId == -1) {
    //     	$scope.orderToPrint = printList;
    //     }else{
    //     	$scope.orderToPrint[0] = printList[itemId];
    //     }

    // }
    // 
    var items = JSON.parse(getUrlParams('items'));
    if (items instanceof Array) {
    	$scope.orderToPrint = items;
    }else{
    	$scope.orderToPrint[0] = items;
    }
    // $scope.orderToPrint = JSON.parse(items)
    $scope.print = function(){
    	window.print();
    }
})
