//called immediately on creation
(async () => {
    let authenticated = false;
    const username = localStorage.getItem('username');
    if(username){
        const nameEl = document.querySelector('#username');
        nameEl.value = username;
        const auth = await getUser(nameEl.value);
        authenticated = auth?.authenticated;
    }

    if(authenticated) {
        document.querySelector('#playerName').textContent = username;
        setDisplay('loginControls', 'none');
        setDisplay('enterControls', 'block');
    } else {
        setDisplay('loginControls', 'block');
        setDisplay('enterControls', 'none');
    }
})(); //what does this parenthesis mean?

async function loginUser() {
    loginOrCreate(`/api/auth/login`);
}

async function createUser() {
    loginOrCreate(`/api/auth/create`);
}

async function loginOrCreate(endpoint){
    const username = document.querySelector('#username')?.value;
    const password = document.querySelector('#pass')?.value;
    const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({email: username, password: password}),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    const body = await response.json();

    if(response?.status === 200){
        localStorage.setItem('username', username);
        window.location.href = 'garden.html';
    } else {
        const modalEl = document.querySelector('#msgModal');
        modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
        const msgModal = new bootstrap.Modal(modalEl, {});
        msgModal.show()
    }
}

function enter(){
    window.location.href = 'garden.html';
}

function logOutUser(){
    fetch(`/api/auth/logout`, {
        method: 'delete',
    }).then(() => (window.location.href = '/'));
}

async function getUser(email){
    const response = await fetch(`/api/user/${email}`);
    if(response.status === 200) {
        return response.json();
    }

    return null;
}

function setDisplay(controlId, display){
    const enterEl = document.querySelector(`#${controlId}`);
    if(enterEl) {
        enterEl.style.display = display;
    }
}

function displayQuote(data) {
    const containerEl = document.querySelector("#quote");
  
    const quoteEl = document.createElement("p");
    quoteEl.classList.add("quote");
    const authorEl = document.createElement("p");
    authorEl.classList.add("author");
  
    quoteEl.textContent = data.content;
    authorEl.textContent = data.author;
  
    containerEl.appendChild(quoteEl);
    containerEl.appendChild(authorEl);
}
  
function callService(url, displayCallback) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        displayCallback(data);
      });
}

callService("https://api.quotable.io/random", displayQuote);