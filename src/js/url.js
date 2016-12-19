
var DEBUG = false;		//测试版本

var settings;

//====================================================
//调试时，选择一个服务器来调试，
//====================================================
if(DEBUG){
	settings = {
		host:"192.168.31.203",//本地服务器
		port:":8080"
	}			
}
else
{
	settings = {
		host: '121.42.182.179',//远程连接
		port: ":8080"
	};
}
//====================================================

var ident = "student"; 	//身份   student-学生  teacher-教师

var API_URI = "http://" + settings.host + settings.port + "/";

var URL = {
	login:API_URI+"MedicineManagement/LoginServlet?"+new Date().getTime(),
	orderAdd:API_URI+"MedicineManagement/OrderServlet?"+new Date().getTime(),
	orderQurey:API_URI+"MedicineManagement/OrderServlet?"+new Date().getTime(),
	orderAudit:API_URI+"MedicineManagement/OrderServlet?"+new Date().getTime(),
	productQurey:API_URI+"MedicineManagement/ProductServlet?"+new Date().getTime(),
	carQurey:API_URI+"MedicineManagement/CarServlet?"+new Date().getTime(),
	stockQurey:API_URI+"MedicineManagement/StockServlet?"+new Date().getTime(),
	raiseInventory:API_URI+"MedicineManagement/RaiseInventoryServlet?"+new Date().getTime(),
	storageRecordServlet:API_URI+"MedicineManagement/StorageRecordServlet?"+new Date().getTime(), //保管养护
	RARS:API_URI+"MedicineManagement/ReceiptAcceptanceRecordServlet?"+new Date().getTime(),     //收货验收
	DepotServlet:API_URI+"MedicineManagement/DepotServlet?"+new Date().getTime(),      //  仓库管理
	CargoAreaServlet:API_URI+"MedicineManagement/CargoAreaServlet?"+new Date().getTime(),//货区管理
	ShelfServlet:API_URI+"MedicineManagement/ShelfServlet?"+new Date().getTime(),//货架信息
	UserServlet:API_URI+"MedicineManagement/UserServlet?"+new Date().getTime(),//用户管理
	DemandAgencyServlet:API_URI+"MedicineManagement/DemandAgencyServlet?"+new Date().getTime(),//需求机构
	SupplyAgencyServlet:API_URI+"MedicineManagement/SupplyAgencyServlet?"+new Date().getTime(),//供应机构
	GuaranteeRelationShipServlet:API_URI+"MedicineManagement/GuaranteeRelationShipServlet?"+new Date().getTime(),//保障关系
	ProductServlet:API_URI+"MedicineManagement/ProductServlet?"+new Date().getTime(), //药材字典
	OrderServlet:API_URI+"MedicineManagement/OrderServlet?"+new Date().getTime(),
	PickListServlet:API_URI+"MedicineManagement/PickListServlet?"+new Date().getTime(),
	CarServlet:API_URI+"MedicineManagement/CarServlet?"+new Date().getTime(),
	InvoiceServlet:API_URI+"MedicineManagement/InvoiceServlet?"+new Date().getTime(),
	StowageServlet:API_URI+"MedicineManagement/StowageServlet?"+new Date().getTime(),
	CarServlet:API_URI+"MedicineManagement/CarServlet?"+new Date().getTime(),
	OperatorServlet: API_URI+"MedicineManagement/OperatorServlet?"+new Date().getTime()
}
