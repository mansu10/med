
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
	StockQurey:API_URI+"MedicineManagement/StockServlet"
}
