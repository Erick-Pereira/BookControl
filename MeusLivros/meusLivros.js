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
  
  function loadHomePageBooks() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const books = getBooksFromLocalStorage();
  
    // Verifica se a página atual é 'meusLivros.html'
    const currentPage = window.location.pathname.split("/").pop();
  
    let booksToDisplay = books;
  
    if (currentPage === "meusLivros.html" && loggedInUser) {
      // Filtra os livros para exibir apenas os do usuário logado
      booksToDisplay = books.filter((book) => book.userId === loggedInUser.id);
    }
  
    booksToDisplay.forEach((book, index) => {
      createBookElement(book, index);
    });
  }
  
  // Funções principais de gerenciamento de usuários e livros
  function registerUser() {
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
  
    if (username === "" || password === "") return;
  
    let users = getUsersFromLocalStorage();
  
    if (users.find((user) => user.username === username)) {
      alert("Username já existe. Por favor, escolha outro.");
      return;
    }
  
    const newUser = {
      id: users.length + 1,
      username: username,
      password: password,
    };
  
    users.push(newUser);
    saveUsersToLocalStorage(users);
  
    alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
    clearLoginInputs();
  }
  
  function loginUser() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
  
    let users = getUsersFromLocalStorage();
  
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
  
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = "../AllLivros/allLivros.html";
    } else {
      alert("Usuário ou senha incorretos.");
    }
  }
  
  function logoutUser(logout) {
    localStorage.removeItem("loggedInUser");
    logout.href = "../index.html";
  }
  
  function updateLoginButtonToLogout() {
    const loginButton = document.getElementById("buttonLogin");
    const logout = document.getElementById("logout");
    loginButton.textContent = "user";
    loginButton.href = "../Perfil/perfil.html";
  }
  
  function addBook() {
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const imagem = document.getElementById("imagem").value.trim();
    const idioma = document.getElementById("idioma").value.trim();
    const isbn = document.getElementById("isbn").value.trim();
    const editora = document.getElementById("editora").value.trim();
    const contato = document.getElementById("contato").value.trim();
  
    if (titulo === "" || autor === "" || imagem === "") return;
  
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const books = getBooksFromLocalStorage();
  
    const selectedBookId = localStorage.getItem("selectedBookId");
    if (selectedBookId) {
      // Editar livro existente
      const bookIndex = books.findIndex((b) => b.id === parseInt(selectedBookId));
      if (bookIndex !== -1) {
        books[bookIndex] = {
          id: books[bookIndex].id,
          userId: loggedInUser.id,
          imagem: imagem,
          titulo: titulo,
          autor: autor,
          idioma: idioma,
          isbn: isbn,
          editora: editora,
          contato: contato,
        };
      }
    } else {
      // Adicionar novo livro
      const newBook = {
        id: books.length + 1,
        userId: loggedInUser.id,
        imagem: imagem,
        titulo: titulo,
        autor: autor,
        idioma: idioma,
        isbn: isbn,
        editora: editora,
        contato: contato,
      };
      books.push(newBook);
    }
  
    saveBooksToLocalStorage(books);
    clearInputs();
  
    // Limpa o selectedBookId do localStorage após a edição ou adição
    localStorage.removeItem("selectedBookId");
    window.location.href = "../MeusLivros/meusLivros.html";
  }
  
  // Funções de manipulação de dados
  function getUsersFromLocalStorage() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  }
  
  function saveUsersToLocalStorage(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }
  
  function getBooksFromLocalStorage() {
    const books = localStorage.getItem("books");
    return books ? JSON.parse(books) : [];
  }
  
  function saveBooksToLocalStorage(books) {
    localStorage.setItem("books", JSON.stringify(books));
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
    if (currentPage === "Book_Control/Meus%20Livros/meusLivros.html") {
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
      editBookDetails(bookId);
  }
  
  function editBookDetails(bookId) {
    localStorage.setItem("selectedBookId", bookId);
    window.location.href = "../CadastroLivros/cadastroLivro.html";
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
    window.location.href = "../AllLivros/allLivros.html";
  }
  
  function clearInputs() {
    document.getElementById("titulo").value = "";
    document.getElementById("autor").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("idioma").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("editora").value = "";
    document.getElementById("contato").value = "";
  }
  
  function searchBooks() {
    const searchValue = document.getElementById("searchBook").value.toLowerCase();
    console.log(searchValue);
    const books = getBooksFromLocalStorage();
  
    const filteredBooks = books.filter(
      (book) =>
        book.titulo.toLowerCase().includes(searchValue) ||
        book.autor.toLowerCase().includes(searchValue)
    );
  
    const gridBooks = document.querySelector(".gridBooks");
    gridBooks.innerHTML = "";
  
    filteredBooks.forEach((book, index) => {
      createBookElement(book, index);
    });
  }
  
  function loadBookForEdit() {
    const selectedBookId = localStorage.getItem("selectedBookId");
  
    if (selectedBookId) {
      const books = getBooksFromLocalStorage();
      const book = books.find((b) => b.id === parseInt(selectedBookId));
  
      if (book) {
        // Preenche os campos do formulário com as informações do livro
        document.getElementById("imagem").value = book.imagem;
        document.getElementById("titulo").value = book.titulo;
        document.getElementById("autor").value = book.autor;
        document.getElementById("idioma").value = book.idioma;
        document.getElementById("isbn").value = book.isbn;
        document.getElementById("editora").value = book.editora;
        document.getElementById("contato").value = book.contato;
  
        localStorage.setItem("selectedBookId", book.id);
      }
    }
  }
  
  function getBookIdForDeletion() {
    const selectedBookId = localStorage.getItem("selectedBookId");
    return selectedBookId ? parseInt(selectedBookId) : null;
  }
  // Código que deve ser executado após o carregamento da página