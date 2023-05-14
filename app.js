





// Book class; It represent a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// LocalStorage setup
class Store {
    static getBooks() {
        let books;
        if(!localStorage.getItem('books')) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// UI Class: Handles UI tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        // looping through the books
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML= `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href ="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Disappear in 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields() {
        document.querySelector('#title').value = '',
        document.querySelector('#author').value = '',
        document.querySelector('#isbn').value = ''
    }
}




// Event ; Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event ; Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // prevent submit going oof to quick
    e.preventDefault();
    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;


    //Validatation 
    if (!title || !author || !isbn) {
        UI.showAlert('Please Fill your details', 'danger');
    } else {
        //Instantiate book
        const book = new Book(title, author, isbn);

        //Add Book to UI (adding the form after filling)
        UI.addBookToList(book);

        //Add book to localstorage(Store)
        Store.addBook(book);

        // Show success message
        UI.showAlert('Added Book Successfully', 'success');

        //clearing fields after submitting
        UI.clearFields();
    }

});


//Event ; Remove a book(delete)
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Delete book from UI
    UI.deleteBook(e.target);

    // Remove book from localstorage(Store)
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show delete message
    UI.showAlert('Deleted Book', 'success');
});
