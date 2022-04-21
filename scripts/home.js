// let heading = document.getElementById('heading');

// heading.addEventListener('click', () => {
//     store.get('members').push('new thing');
//     console.log(store.get('members'));
// });

let info = 2;
let add_fields = () => {
    info++;
    let objTo = document.getElementById('additional-fields');
    let divtest = document.createElement('div');
    divtest.innerHTML =
        '<div class="form-floating mb-3"><input type="text" class="form-control" id="exampleFormControlInput' +
        info +
        '" placeholder="name"/><label for="exampleFormControlInput' +
        info +
        '">Enter your name here:</label></div>';
    objTo.appendChild(divtest);
};
