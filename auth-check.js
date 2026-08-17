function requireAuth(role){
 const token = localStorage.getItem("token");
 const userRole = localStorage.getItem("role");

 if(!token){
   location.href = "login.html";
 }

 if(role && userRole !== role){
   location.href = "login.html";
 }
}
