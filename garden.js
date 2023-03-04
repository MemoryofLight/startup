const plant = [];


const elements = document.querySelectorAll('.plant');
for(const el of elements){
    el.addEventListener('click', () => {
        window.location.href = "build.html";
    });
}

const garbageButtons = document.querySelectorAll('.remove');
garbageButtons.forEach(); //edit this

