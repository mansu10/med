
var DEBUG = true;		//测试版本

var settings;

//====================================================
//调试时，选择一个服务器来调试，
//====================================================
if(DEBUG){
	settings = {
		host:"localhost",//本地服务器
		port:":8080"
	}			
}
else
{
	settings = {
		host: '121.42.182.179',//远程连接
		port: ""
	};
}
//====================================================

var ident = "student"; 	//身份   student-学生  teacher-教师

var API_URI = "http://" + settings.host + settings.port + "/";
