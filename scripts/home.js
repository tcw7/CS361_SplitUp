// let heading = document.getElementById('heading');

// heading.addEventListener('click', () => {
//     store.get('members').push('new thing');
//     console.log(store.get('members'));
// });

let userNameNum = 0;
let userNamesFields = {};
let qtyUsers = 0;
let users = {};
let expenseNum = 0;

class User {
    constructor(name) {
        this.name = name;
        this.expenses = [];
        this.owed = 0;
    }
}

/**
 * adds a new name entry field
 */
let add_fields = () => {
    console.log('Received request to add new name...');
    userNameNum++;
    let objTo = document.getElementById('additional-fields');
    let divtest = document.createElement('div');
    divtest.innerHTML =
        '<div class="form-group mb-3 row" id="userName' +
        userNameNum +
        '"><div class="col-6"><input type="text" class="form-control" id="userNameInput' +
        userNameNum +
        '" placeholder="Name"/></div><div class ="col-6"><input type="button" class="btn btn-danger" value="remove name" onclick="remove_name(userName' +
        userNameNum +
        ', userNameInput' +
        userNameNum +
        '.value)" /></div></div>';
    objTo.appendChild(divtest);
    userNamesFields[userNameNum] = `userNameInput${userNameNum}`;
    console.log('Added new username input field ' + userNameNum);
    return;
};

/**
 * removes a name from the website
 * @param {element} element
 * @param {*}
 */
let remove_name = (element, name) => {
    console.log('Remove element: ' + element.id);
    console.log('Remove User if exists: ' + name);
    if (users[name]) {
        delete users[name];
        console.log('User Removed: ' + name);
        qtyUsers--;
        console.log('Qty Users: ', qtyUsers);
    }
    element.remove();
    return;
};

let submit_names = () => {
    // get names from input form
    let names = [];
    for (elementID in userNamesFields) {
        console.log(
            'Submitting name for new User: ' + userNamesFields[elementID]
        );
        let element = document.getElementById(userNamesFields[elementID]);
        if (element) {
            let name = element.value;
            element.readOnly = true;
            if (name != null) {
                names.push(name);
            }
        }
    }
    console.log('Names: ' + names);

    // create Users
    for (let name of names) {
        // create new user
        if (typeof users[name] == 'undefined' && name != '') {
            let newUser = new User(name);
            users[name] = newUser;
            console.log('New User: ' + users[name].name);
            qtyUsers++;
            console.log('Qty Users: ', qtyUsers);
        }
    }

    // show expenses forms
    let hiddenElement = document.getElementById('unhide-me');
    hiddenElement.hidden = false;
    renderExpense();

    return;
};

let renderExpense = () => {
    expenseNum++;
    let newExpenseForm = document.createElement('div');
    newExpenseForm.id = `expense${expenseNum}`;
    newExpenseForm.innerHTML =
        `<form>
        <div class='form-group row'>
            <div class='col-12'>
                <input
                    type='text'
                    class='form-control'
                    placeholder='Expense name'
                />
            </div>
            <br />
            <br />
        </div>
        <div id=` +
        `addUserExpenseHere${expenseNum}` +
        `>
            <p>How much did each person pay for this? Check the box next
                to each person that should be included in the SplitUp for this expense.</p>
        </div>
    </form>
    <div>
        <input
            type='button'
            value='remove expense'
            onclick='removeExpense(` +
        `expense${expenseNum}` +
        `)'
            class='btn btn-danger'
        />
    </div>
    <br />
    <br />
    <br />`;
    document.getElementById(`new-expenses-here`).appendChild(newExpenseForm);
    for (user of Object.keys(users)) {
        console.log('Users key: ', user);
        createUserExpense(`addUserExpenseHere${expenseNum}`, users[user]);
    }
};

let removeExpense = (element) => {
    console.log(`Received request to remove expense...`);
    element.remove();
    console.log(`Expense removed.`);
};

let createUserExpense = (parentElementID, userObj) => {
    let parentElement = document.getElementById(parentElementID);
    let newUserExpense = document.createElement('div');
    newUserExpense.innerHTML =
        `
    <div class="form-group row">
        <div class='col-1'>
            <input
                class='form-check-input position-static'
                type='checkbox'
                id='blankCheckbox'
                value='option1'
                aria-label='...'
            />
        </div>
        <div class='col-5'>
            <h5>` +
        `${userObj.name}` +
        `</h5>
            <input
                hidden='true'
                type='text'
                class='form-control'
                placeholder='Expense name'
            />
        </div>
        <div class='col-3'>
            <input
                type='number'
                class='form-control'
                id='expense'
            />
        </div>
        <div class='col-3'>
            <select class='form-control'>
                <option value='USD'>USD</option>
                <option value='EUR'>EUR</option>
                <option value='JPY'>JPY</option>
                <option value='GBP'>GBP</option>
                <option value='CHF'>CHF</option>
                <option value='CAD'>CAD</option>
                <option value='AUD'>AUD</option>
                <option value='CNY'>CNY</option>
                <option value='HKD'>HKD</option>
                <option value='NZD'>NZD</option>
                <option value='MXN'>MXN</option>
                <option value='NOK'>NOK</option>
                <option value='SGD'>SGD</option>
                <option value='KRW'>KRW</option>
                <option value='SEK'>SEK</option>
            </select>
            <br />
        </div>
    </div>`;
    parentElement.appendChild(newUserExpense);
};
