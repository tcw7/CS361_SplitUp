let userNameNum = 0;
let userNamesFields = {};
let qtyUsers = 0;
let users = {};
let expenseNum = 0;
let resultCounter = 0;

class User {
    constructor(name) {
        this.name = name;
        this.balances = {};
    }
}
// ************************************
// ********* USER GENERATION **********
// ************************************

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
    if (confirm('Are you sure you want to delete this name?')) {
        if (users[name]) {
            delete users[name];
            console.log('User Removed: ' + name);
            qtyUsers--;
            console.log('Qty Users: ', qtyUsers);
        }
        element.remove();
        return;
    } else {
        console.log('User cancelled name removal request.');
        return;
    }
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

    // check if at least two users have been created
    if (Object.keys(users).length == 0) {
        alert(
            `You haven't entered any names yet. Please enter at least two names to SplitUp your expense(s).`
        );
        return;
    }
    if (Object.keys(users).length == 1) {
        alert(
            `Only one name has been entered. Please enter at least one more name to SplitUp your expense(s).`
        );
        return;
    }

    // disable parent divs
    let nodes = document
        .getElementById('add_names_parent')
        .getElementsByTagName('*');
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].onclick = null;
    }
    nodes = document
        .getElementById('additional-fields')
        .getElementsByTagName('*');
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].onclick = null;
    }

    // show expenses forms
    let hiddenElement = document.getElementById('unhide-me');
    hiddenElement.hidden = false;

    return;
};

// ************************************
// ********* EXPENSE GENERATION **********
// ************************************

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
    if (confirm('Are you sure you want to remove this expense?')) {
        element.remove();
        console.log(`Expense removed.`);
    } else {
        console.log('User cancelled request to remove expense.');
    }
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

// ************************************
// ********* RESULTS GENERATION **********
// ************************************

let renderResults = () => {
    // remove all child nodes
    let removeAllChildNodes = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    };
    let parent = document.getElementById('results_root');
    removeAllChildNodes(parent);

    for (let username of Object.keys(users)) {
        resultCounter++;
        let user = users[username];
        let result = document.createElement('div');
        let resultsRoot = document.getElementById('results_root');
        console.log(`Rendering Balance for: ${user.name}...`);
        result.innerHTML = `<h5>${username}'s Balances:</h5>
        <div class="container" id="other_user_balance${resultCounter}">
        </div>`;
        resultsRoot.appendChild(result);

        // TODO: logic for tabulation of balance
        for (let name of Object.keys(users)) {
            console.log(`Checking balance with: ${name}`);
            if (name != username) {
                console.log(
                    `Creating balance between: ${user.name} and ${name}`
                );
                createUserBalance(
                    user,
                    users[name],
                    `other_user_balance${resultCounter}`
                );
            }
        }
    }
    return;
};

let createUserBalance = (userOwner, userOther, parentElementID) => {
    let parentElement = document.getElementById(parentElementID);
    let userBalance = document.createElement('div');
    userBalance.innerHTML = `<div class="form-group row"><h6 class="col-6">${userOther.name}:</h6>
    <h6 class="col-3">$XXX.XX</h6>
    <select name="select_currency_conversion" id="resultCurrency" class="form-control col">
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="JPY">JPY</option>
        <option value="GBP">GBP</option>
        <option value="CHF">CHF</option>
        <option value="CAD">CAD</option>
        <option value="AUD">AUD</option>
        <option value="CNY">CNY</option>
        <option value="HKD">HKD</option>
        <option value="NZD">NZD</option>
        <option value="MXN">MXN</option>
        <option value="NOK">NOK</option>
        <option value="SGD">SGD</option>
        <option value="KRW">KRW</option>
        <option value="SEK">SEK</option>
    </select></div>`;
    parentElement.appendChild(userBalance);
};

let startOver = () => {
    if (
        confirm(
            'Are you sure you want to start over? You will lose all of your current progress.'
        )
    ) {
        location.reload();
    } else {
        return;
    }
};
