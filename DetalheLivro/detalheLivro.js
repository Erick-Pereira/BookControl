document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    // Redireciona para a página de login se o usuário não estiver logado
    window.location.href = "/Login/login.html";
  } else {
    // Se o usuário estiver logado, carrega os detalhes do livro
    loadBookDetails();
  }
});

function getBooksFromLocalStorage() {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
}

function loadBookDetails() {
  // Obtém o ID do livro armazenado no localStorage
  const bookId = localStorage.getItem("selectedBookId");

  // Recupera os dados dos livros
  const books = getBooksFromLocalStorage();

  // Encontra o livro com o ID correspondente
  const book = books.find((b) => b.id == bookId);

  if (book) {
    // Preenche os detalhes do livro na página de detalhes
    document.getElementById("titulo").textContent = book.titulo;
    document.getElementById("autor").textContent = "Autor: " + book.autor;
    document.getElementById("idioma").textContent = "Idioma: " + book.idioma;
    document.getElementById("isbn").textContent = "ISBN: " + book.isbn;
    document.getElementById("editora").textContent =
      "Principal editora: " + book.editora;

    // Preenche o contato do dono no link
    const contatoLink = document.querySelector("#contatoDono a");
    contatoLink.href = "tel:" + book.contato;
    contatoLink.textContent = "CONTATO PARA VENDA";

    // Atualiza a imagem do livro
    const imgLivro = document.querySelector("#imgLivro img");
    imgLivro.src = book.imagem;
    imgLivro.alt = book.titulo;
  }
}
