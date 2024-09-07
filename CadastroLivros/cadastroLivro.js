document.addEventListener("DOMContentLoaded", () => {
  loadBookForEdit();
});
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
function deleteBook(bookId) {
  if (!bookId) {
    alert("Nenhum livro selecionado para exclusão.");
    return;
  }

  const books = getBooksFromLocalStorage();
  const updatedBooks = books.filter((book) => book.id !== bookId);

  saveBooksToLocalStorage(updatedBooks);
  alert("Livro excluído com sucesso.");
  window.location.href = "../MeusLivros/meusLivros.html";
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

  localStorage.removeItem("selectedBookId");
  window.location.href = "../MeusLivros/meusLivros.html";
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
function getBooksFromLocalStorage() {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
}

function saveBooksToLocalStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}
