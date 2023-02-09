
let myLibrary;
const table = document.querySelector('table');
const newBook = document.querySelector('.new-book')
const newBookForm = document.querySelector('form')
const formClose = document.querySelector('.material-symbols-outlined')

window.addEventListener('load', () => {
        myLibrary = JSON.parse(localStorage.getItem('myLib')) || [];
        makeTableEntries(myLibrary)
})

class Books {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read
    }

    info() {
        return (`The ${this.title} by ${this.author}, ${this.pages}, ${this.read}`);
    }

    addBookToLibrary(myLibrary) {
        myLibrary.push(this);
    }
}

function makeTableEntries (library) {
    library.forEach(book => {
       bookEntry(book)
    });
}

newBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const read = document.querySelector('#yes').checked ? 'yes' : 'no' ;
    let isBook = myLibrary.find(book => book.title === title)
    if (!isBook) {
        const myBook = new Books(title, author, pages, read);
        myBook.addBookToLibrary(myLibrary)
        bookEntry(myBook);
        localStorage.setItem('myLib', JSON.stringify(myLibrary))
    }
    newBookForm.reset();
    newBookForm.classList.add('nonvisible');
})

function bookEntry(book) {
    const tr = createElement('tr', book.title)
    const deleteButton = createButton(book.title, 'Delete', removeBook);
    const readButton = createButton(book.title, 'Read', readBook)

    const {title, author, pages, read} = book;
    [title, author, pages, read].forEach((prop) => {
        const td = createElement('td', findObjKey(book, prop));
        td.textContent = prop;
        tr.appendChild(td)
    })
    tr.appendChild(readButton)
    tr.appendChild(deleteButton)
    table.appendChild(tr)
}

function findObjKey (obj, value) {
    return Object.entries(obj).find(([key, val]) => val === value)[0];
}

function createButton(buttonClass, value, handler) {
    const button = createElement('button', buttonClass);
    button.textContent = value;
    button.addEventListener('click', handler)
    return (button)
}

function createElement(element, myclass) {
    const myElement = document.createElement(element)
    myElement.classList.add(myclass)
    return myElement
}

function removeBook(e) {
    const trclass = document.querySelector(`tr.${e.target.className}`)
    table.removeChild(trclass)
    myLibrary = myLibrary.filter(book => {
        return book.title !== e.target.className;
    })
    localStorage.setItem('myLib', JSON.stringify(myLibrary))
}

function readBook(e) {
    myLibrary.forEach(book => {
      if (book.title === e.target.className && book.read === 'yes') {
        book.read = 'no';
        const tdRead = document.querySelector(`tr.${e.target.className} td.read`)
        tdRead.textContent = 'no'
      } 
      else if (book.title === e.target.className && book.read === 'no') {
        book.read = 'yes';
        const tdRead = document.querySelector(`tr.${e.target.className} td.read`)
        tdRead.textContent = 'yes'
      } 
    })
    localStorage.setItem('myLib', JSON.stringify(myLibrary))
}

newBook.addEventListener('click', () => {
    newBookForm.classList.remove('nonvisible');
})

formClose.addEventListener('click', () => {
    newBookForm.classList.add('nonvisible');
})


