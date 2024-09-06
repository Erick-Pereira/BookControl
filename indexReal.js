document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const loginButton = document.getElementById("buttonLogin");

  if (loggedInUser) {
    updateLoginButtonToLogout();
  } else {
    loginButton.textContent = "login";
    loginButton.href = "./Login/login.html";
  }

  loadHomePageBooks();
});

function loadHomePageBooks() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const books = getBooksFromLocalStorage();
  const currentPage = window.location.pathname.split("/").pop();

  const booksToDisplay = (currentPage === "meusLivros.html" && loggedInUser)
    ? books.filter((book) => book.userId === loggedInUser.id)
    : books;

  booksToDisplay.forEach((book) => createBookElement(book));
}




function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "./index.html";
}

function updateLoginButtonToLogout() {
  const loginButton = document.getElementById("buttonLogin");
  loginButton.textContent = "user";
  loginButton.href = "./Perfil/perfil.html";
}

function addBook() {
  const fields = ["titulo", "autor", "imagem", "idioma", "isbn", "editora", "contato"];
  const bookData = fields.reduce((data, field) => {
    data[field] = document.getElementById(field).value.trim();
    return data;
  }, {});

  if (!bookData.titulo || !bookData.autor || !bookData.imagem) return;

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const books = getBooksFromLocalStorage();
  const selectedBookId = localStorage.getItem("selectedBookId");

  if (selectedBookId) {
    const bookIndex = books.findIndex((b) => b.id === parseInt(selectedBookId));
    if (bookIndex !== -1) {
      books[bookIndex] = { ...books[bookIndex], ...bookData, userId: loggedInUser.id };
    }
  } else {
    const newBook = { id: books.length + 1, userId: loggedInUser.id, ...bookData };
    books.push(newBook);
  }

  saveBooksToLocalStorage(books);
  clearInputs();
  localStorage.removeItem("selectedBookId");
  window.location.href = "./Meus%20Livros/meusLivros.html";
}

function createBookElement(book) {
  const gridBooks = document.querySelector(".gridBooks");
  const currentPage = window.location.pathname.split("/").pop();

  const bookItem = document.createElement("div");
  bookItem.innerHTML = `
    <div id="containerBook">
      <div class="image-container">
        <img class="imageLivro" src="${book.imagem}" alt="${book.titulo}" />
        ${currentPage === "meusLivros.html" ? `<div class="hover-message">Clique na imagem para editar ou excluir</div>` : ''}
      </div>
      <div class="tituloAutor">
        <h3>${book.titulo}</h3>
        <p>${book.autor}</p>
      </div>
    </div>
  `;

  bookItem.querySelector(".imageLivro").addEventListener("click", () => handleBookClick(book.id));
  gridBooks.appendChild(bookItem);

  if (currentPage === "meusLivros.html") {
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
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "allLivros.html") {
    viewBookDetails(bookId);
  } else if (currentPage === "meusLivros.html") {
    editBookDetails(bookId);
  }
}

function viewBookDetails(bookId) {
  localStorage.setItem("selectedBookId", bookId);
  window.location.href = "./DetalheLivro/detalheLivro.html";
}

function editBookDetails(bookId) {
  localStorage.setItem("selectedBookId", bookId);
  window.location.href = "./Cadastro%20Livros/cadastroLivro.html";
}

function deleteBook(bookId) {
  if (!bookId) {
    alert("Nenhum livro selecionado para exclusão.");
    return;
  }

  const books = getBooksFromLocalStorage();
  const updatedBooks = books.filter((book) => book.id !== bookId);
  saveBooksToLocalStorage(updatedBooks);

  alert("Livro excluído com sucesso.");
  window.location.href = "./AllLivros/allLivros.html";
}

function clearInputs() {
  const fields = ["titulo", "autor", "imagem", "idioma", "isbn", "editora", "contato"];
  fields.forEach(field => document.getElementById(field).value = "");
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

function loadBookForEdit() {
  const selectedBookId = localStorage.getItem("selectedBookId");
  if (selectedBookId) {
    const books = getBooksFromLocalStorage();
    const book = books.find((b) => b.id === parseInt(selectedBookId));

    if (book) {
      Object.keys(book).forEach(key => {
        const input = document.getElementById(key);
        if (input) input.value = book[key];
      });
    }
  }
}




function getBooksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("books")) || [];
}

function saveBooksToLocalStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}


