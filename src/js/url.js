
var DEBUG = false;		//测试版本

var settings;

//====================================================
//调试时，选择一个服务器来调试，
//====================================================
if(DEBUG){
	settings = {
		host:"192.168.100.106",//本地服务器
		port:":8090"
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
	login:API_URI+"MedicineManagement/LoginServlet",
	orderAdd:API_URI+"MedicineManagement/OrderServlet",
	orderQurey:API_URI+"MedicineManagement/OrderServlet",
	orderAudit:API_URI+"MedicineManagement/OrderServlet",
	productQurey:API_URI+"MedicineManagement/ProductServlet",
	carQurey:API_URI+"MedicineManagement/CarServlet",
	stockQurey:API_URI+"MedicineManagement/StockServlet",
	raiseInventory:API_URI+"MedicineManagement/RaiseInventoryServlet",
	storageRecordServlet:API_URI+"MedicineManagement/StorageRecordServlet", //保管养护
	RARS:API_URI+"MedicineManagement/ReceiptAcceptanceRecordServlet",     //收货验收
	DepotServlet:API_URI+"MedicineManagement/DepotServlet" ,      //  仓库管理
	CargoAreaServlet:API_URI+"MedicineManagement/CargoAreaServlet" ,//货区管理
	ShelfServlet:API_URI+"MedicineManagement/ShelfServlet" ,//货架信息
	UserServlet:API_URI+"MedicineManagement/UserServlet",//用户管理
	DemandAgencyServlet:API_URI+"MedicineManagement/DemandAgencyServlet",//需求机构
	SupplyAgencyServlet:API_URI+"MedicineManagement/SupplyAgencyServlet",//供应机构
	GuaranteeRelationShipServlet:API_URI+"MedicineManagement/GuaranteeRelationShipServlet",//保障关系
	ProductServlet:API_URI+"MedicineManagement/ProductServlet" //药材字典
}
