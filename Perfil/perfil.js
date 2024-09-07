function logoutUser(logout) {
    localStorage.removeItem("loggedInUser");
    logout.href = "../index.html";
  }
  document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const loginButton = document.getElementById("buttonLogin");
  
    if (loggedInUser) {
      updateLoginButtonToLogout();
    } else {
      loginButton.textContent = "login";
      loginButton.setAttribute("href", "../Login/login.html");
    }
  });
  function updateLoginButtonToLogout() {
    const loginButton = document.getElementById("buttonLogin");
    const logout = document.getElementById("logout");
    loginButton.textContent = "user";
    loginButton.href = "../Perfil/perfil.html";
  }