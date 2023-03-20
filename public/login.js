function login(){
    const element = document.querySelector("#user");
    localStorage.setItem('username', element.value);
    const ele = document.querySelector('#pass');
    localStorage.setItem('password', ele.value);
    window.location.href = "garden.html";
}