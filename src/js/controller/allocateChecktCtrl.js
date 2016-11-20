app.controller('AllocateCheckCtrl', function($scope, http, $timeout) {

    $scope.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    function setAlertClose(){
    	var timer = setTimeout(function(){
    		$scope.closeAlert(-1);
    	},5000)
    }

    $scope.stateBox = {
        "query": true,
        "print": false,
        "record": false
    }

    /**
     * 切换页面状态
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    $scope.changeState = function(option, orderCode) {

        for (o in $scope.stateBox) {
            $scope.stateBox[o] = false;
        }
        $scope.stateBox[option] = true;

        if (option == 'print') {
            printOrder(orderCode);
        } else if (option == 'record') {
            checkNote(orderCode);
        }
    }

    /*查询*/
    $scope.queryItem = {
        'orderCode': "",
        'demandAgencyName': '',
        'orderTimeStart': '',
        'orderTimeEnd': ''
    }
    $scope.queryAllOrdersWithDemandAgency = function() {
        http.post({
            'method': 'queryAllOrdersWithDemandAgency',
            'orderCode': $scope.queryItem.orderCode,
            'demandAgencyName': $scope.queryItem.demandAgencyName,
            'orderTimeStart': $scope.queryItem.orderTimeStart,
            'orderTimeEnd': $scope.queryItem.orderTimeEnd
        }, URL.OrderServlet).then(
            function(respone) {
                alert("查询成功");
                $scope.goods = respone.orders;
            },
            function(respone) {
                alert(JSON.stringify(respone));
            });
    };

    //打印拣货单
    var printOrder = function(orderCode) {
        http.post({
            'method': 'findOrderWithCheckByOrderCode',
            'orderCode': orderCode
        }, URL.OrderServlet).then(
            function(respone) {
                alert("打印拣货单查询成功");
                $scope.printOrder = respone.order;
                $timeout(function() {
                    $('#' + $scope.printOrder.orderCode).empty().barcode("" + $scope.printOrder.orderCode, "code128", { barWidth: 2, barHeight: 30, showHRI: false });
                }, 1000);
            },
            function(respone) {
                alert(JSON.stringify(respone));
            });
    };

    //复核记录
    $scope.checkVerify = function(orderCode) {
        http.post({
            'method': 'checkOrder',
            'orderCode': orderCode
        }, URL.PickListServlet).then(
            function(respone) {
                alert("复核确认成功！");
                $scope.checkNote = respone.pickLists;

            },
            function(respone) {
                alert(JSON.stringify(respone));
            });
    };

    //拣货记录
    var checkNote = function(orderCode) {

        http.post({
            'method': 'findPickListByOrderCode',
            'orderCode': orderCode
        }, URL.PickListServlet).then(
            function(respone) {
                alert("复核记录查询成功！");
                $scope.OrderNote = respone.pickLists;

            },
            function(respone) {
                alert(JSON.stringify(respone));
            });
    };

    $scope.updateOrderNote = function() {
        var temp = [];

        angular.forEach($scope.OrderNote.pickListItems, function(item) {
            temp.push({
                'productCode': item.productCode,
                'pickListRecord': item.pickListRecord,
                'checkRecord': item.checkRecord
            })
        });

        http.post({
            'method': 'updatePickListItem',
            'orderCode': $scope.OrderNote.orderCode,
            'pickListItems': JSON.stringify(temp)
        }, URL.PickListServlet).then(
            function(respone) {
                alert("复核记录保存成功！");

            },
            function(respone) {
                alert(JSON.stringify(respone));
            });
    }

    $scope.stringItemList = function(obj) {
        return JSON.stringify(obj[index]);

    }
})
