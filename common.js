document.getElementById("header").innerHTML = `
<header>
  <h2>Test Series Platform</h2>
  <nav id="menu"></nav>
</header>
`;

document.getElementById("footer").innerHTML = `
<footer>
  <p>© 2026 Test Series</p>
</footer>
`;

const session = JSON.parse(localStorage.getItem("session"));
const menu = document.getElementById("menu");

if (!session) {
  menu.innerHTML = `
    <a href="login.html">Login</a>
    <a href="register.html">Register</a>
  `;
} else if (session.role === "student") {
  menu.innerHTML = `
    <a href="student-dashboard.html">Dashboard</a>
    <a href="#" onclick="logout()">Logout</a>
  `;
} else if (session.role === "institute") {
  menu.innerHTML = `
    <a href="institute-dashboard.html">Dashboard</a>
    <a href="#" onclick="logout()">Logout</a>
  `;
}

function logout() {
  localStorage.removeItem("session");
  location.href = "login.html";
}
