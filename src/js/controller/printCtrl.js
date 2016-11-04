app.controller('PrintCtrl', function($scope, http, $location, printlist,$state, $stateParams) {
    function getUrlParams(name) {
        return $location.search()[name];
    }
    $scope.orderToPrint = [];
    var printList = printlist.get();
    var itemId = Number($stateParams.item);
    if (itemId == undefined) {
    	alert("something wrong");
        return;
    } else {
        if (itemId == -1) {
        	$scope.orderToPrint = printList;
        }else{
        	$scope.orderToPrint[0] = printList[itemId];
        }

    }

    $scope.print = function(){
    	window.print();
    }
})
