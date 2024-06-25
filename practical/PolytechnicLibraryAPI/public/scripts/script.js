fetchBooks(); // Call the function to fetch and display book data

async function fetchBooks() {
  const response = await fetch("/books"); // Replace with your API endpoint
  const data = await response.json();

  const bookList = document.getElementById("book-list");
  bookList.innerHTML = ""; // Clear existing books

  data.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book");

    const titleElement = document.createElement("h2");
    titleElement.textContent = book.title;

    const idElement = document.createElement("p");
    idElement.textContent = `BookID: ${book.id}`;

    const authorElement = document.createElement("p");
    authorElement.textContent = `By: ${book.author}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", async () => {
      const deleteResponse = await fetch(`/books/${book.id}`, {
        method: "DELETE",
      });
      if (deleteResponse.ok) {
        fetchBooks();
      } else {
        console.error("Failed to delete book");
      }
    });

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.classList.add("update-button");
    updateButton.addEventListener("click", () => {
      const updateForm = document.getElementById(`update-form-${book.id}`);
      updateForm.classList.toggle("hidden");
    });

    const updateForm = document.createElement("form");
    updateForm.id = `update-form-${book.id}`;
    updateForm.classList.add("hidden"); // Initially hidden
    updateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const newTitle = updateForm.querySelector("#new-title").value;
      const newAuthor = updateForm.querySelector("#new-author").value;
      const response = await fetch(`/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, author: newAuthor }),
      });
      if (response.ok) {
        fetchBooks();
      } else {
        console.error("Failed to update book");
      }
    });

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "New Title:";
    const titleInput = document.createElement("input");
    titleInput.id = "new-title";
    titleInput.type = "text";
    titleInput.required = true;

    const authorLabel = document.createElement("label");
    authorLabel.textContent = "New Author:";
    const authorInput = document.createElement("input");
    authorInput.id = "new-author";
    authorInput.type = "text";
    authorInput.required = true;

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";

    const authorContainer = document.createElement("div");
    authorContainer.appendChild(authorLabel);
    authorContainer.appendChild(authorInput);

    updateForm.appendChild(titleLabel);
    updateForm.appendChild(titleInput);
    updateForm.appendChild(authorContainer);
    updateForm.appendChild(submitButton);

    bookItem.appendChild(titleElement);
    bookItem.appendChild(idElement);
    bookItem.appendChild(authorElement);
    bookItem.appendChild(deleteButton);
    bookItem.appendChild(updateButton);
    bookItem.appendChild(updateForm);

    bookList.appendChild(bookItem);
  });
}

bookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;

  try {
    const response = await fetch("/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author }),
    });

    if (!response.ok) {
      throw new Error("Failed to add book");
    }

    // Reset form fields after successful submission
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";

    // Fetch and display updated book list
    fetchBooks();
  } catch (error) {
    console.error("Error adding book:", error);
  }
});

updateButton.addEventListener("click", () => {
  const updateForm = document.getElementById(`update-form-${book.id}`);
  console.log(updateForm.classList); // Log the classList
  updateForm.classList.toggle("hidden");
});
