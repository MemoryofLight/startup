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
    const password = document.querySelector('#userPassword')?.value;
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

function logOut(){
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