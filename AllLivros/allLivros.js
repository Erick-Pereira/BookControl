document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const loginButton = document.getElementById("buttonLogin");

    if (loggedInUser) {
        updateLoginButtonToLogout();
        loadHomePageBooks();
    } else {
        loadHomePageBooks();
        loginButton.textContent = "login";
        loginButton.setAttribute("href", "../Login/login.html");
    }
});
function updateLoginButtonToLogout() {
    const loginButton = document.getElementById("buttonLogin");
    loginButton.textContent = "user";
    loginButton.href = "../Perfil/perfil.html";
}
function loadHomePageBooks() {
    const books = getBooksFromLocalStorage();
    const gridBooks = document.querySelector(".gridBooks");

    books.forEach((book, index) => {
        createBookElement(book, index, gridBooks);
    });
}
function searchBooks() {
    const searchValue = document.getElementById("searchBook").value.toLowerCase();
    const books = getBooksFromLocalStorage();

    const filteredBooks = books.filter((book) =>
        book.titulo.toLowerCase().includes(searchValue) ||
        book.autor.toLowerCase().includes(searchValue)
    );

    const gridBooks = document.querySelector(".gridBooks");
    gridBooks.innerHTML = "";
    filteredBooks.forEach((book) => createBookElement(book));
}
function getBooksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("books")) || [];
}
// Funções de manipulação da interface
function createBookElement(book, index) {
    const gridBooks = document.querySelector(".gridBooks");
    const bookItem = document.createElement("div");

    const currentPage = window.location.pathname.split("/").pop();
    const hoverMessage = currentPage === "meusLivros.html"
        ? `<div class="hover-message">Clique na imagem para editar ou excluir</div>`
        : '';

    bookItem.innerHTML = `
    <div id="containerBook">
      <div class="image-container">
        <img class="imageLivro" href="../CadastroLivros/cadastroLivro.html" onclick="viewBookDetails(${book.id})" src="${book.imagem}" alt="${book.titulo}">
        ${hoverMessage}
      </div>
      <div class="tituloAutor">
        <h3>${book.titulo}</h3>
        <p>${book.autor}</p>
      </div>
    </div>
  `;

    bookItem.querySelector(".imageLivro").addEventListener("click", () => {
        handleBookClick(book.id);
    });

    gridBooks.appendChild(bookItem);

    // Adiciona os eventos de hover para mostrar a mensagem, apenas na página 'meusLivros'
    if (currentPage === "../MeusLivros/meusLivros.html") {
        const imageContainer = bookItem.querySelector('.image-container');
        imageContainer.addEventListener('mouseenter', () => {
            const hoverMsg = imageContainer.querySelector('.hover-message');
            if (hoverMsg) hoverMsg.style.display = 'block';
        });
        imageContainer.addEventListener('mouseleave', () => {
            const hoverMsg = imageContainer.querySelector('.hover-message');
            if (hoverMsg) hoverMsg.style.display = 'none';
        });
    }
}
function handleBookClick(bookId) {
    const currentPage = window.location.pathname;

    if (currentPage.includes("./AllLivros/allLivros.html")) {
        viewBookDetails(bookId);
    } else if (currentPage.includes("./MeusLivros/meusLivros.html")) {
        editBookDetails(bookId);
    }
}
function viewBookDetails(bookId) {
    localStorage.setItem("selectedBookId", bookId);
    window.location.href = "../DetalheLivro/detalheLivro.html";
}