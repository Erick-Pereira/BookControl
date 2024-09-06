function loginUser() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const users = getUsersFromLocalStorage();
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "../AllLivros/allLivros.html";
    } else {
        alert("Usuário ou senha incorretos.");
    }
}

function getUsersFromLocalStorage() {
    return JSON.parse(localStorage.getItem("users")) || [];
}
function registerUser() {
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!username || !password) return;

    const users = getUsersFromLocalStorage();
    if (users.some((user) => user.username === username)) {
        alert("Username já existe. Por favor, escolha outro.");
        return;
    }

    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    saveUsersToLocalStorage(users);

    alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
    clearLoginInputs();
}

function clearLoginInputs() {
    document.getElementById("registerUsername").value = "";
    document.getElementById("registerPassword").value = "";
}

function saveUsersToLocalStorage(users) {
    localStorage.setItem("users", JSON.stringify(users));
}