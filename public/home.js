let userNameNum = 0;
let userNamesFields = {};
let qtyUsers = 0;
let users = {};
let expenseNum = 0;
let resultCounter = 0;
let currencies = {
    USD: null,
    EUR: null,
    JPY: null,
    GBP: null,
    CHF: null,
    CAD: null,
    AUD: null,
    CNY: null,
    HKD: null,
    NZD: null,
    MXN: null,
    NOK: null,
    SGD: null,
    KRW: null,
    SEK: null,
};

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
        createUserExpense(
            `addUserExpenseHere${expenseNum}`,
            users[user],
            expenseNum
        );
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

let createUserExpense = (parentElementID, userObj, expenseNum) => {
    let parentElement = document.getElementById(parentElementID);
    let newUserExpense = document.createElement('div');
    newUserExpense.innerHTML =
        `
    <div class="form-group row">
        <div class='col-1'>
            <input
                class='form-check-input position-static'
                type='checkbox'
                id='checkbox_${userObj.name}_${expenseNum}'
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
                id='cost_${userObj.name}_${expenseNum}'
            />
        </div>
        <div class='col-3'>
            <select class='form-control' id='currency_${userObj.name}_${expenseNum}'>
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
    /*
     * id's of fields:
     * checkbox_username_expensenum
     * cost_username_expensenum
     * currency_username_expensenum
     */

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
        let render_balances = async () => {
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
                    let value = await calculate_balance(user, users[name]);
                    document.getElementById(`${user.name}${name}`).innerHTML =
                        value;
                }
            }
        };
        render_balances();
    }
    return;
};

let createUserBalance = (userOwner, userOther, parentElementID) => {
    let parentElement = document.getElementById(parentElementID);
    let userBalance = document.createElement('div');
    userBalance.innerHTML = `<div class="form-group row"><h6 class="col-6">${userOther.name}:</h6>
    <h6 class="col-3" id='${userOwner.name}${userOther.name}'></h6>
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

let calculate_balance = async (userOwner, userOther) => {
    let balance = 0;
    for (let i = 1; i <= expenseNum; i++) {
        console.log(
            `Calculating balance between ${userOwner.name} and ${userOther.name}`
        );
        let owner_checkbox = document.getElementById(
            `checkbox_${userOwner.name}_${i}`
        );
        let other_checkbox = document.getElementById(
            `checkbox_${userOther.name}_${i}`
        );
        if (!owner_checkbox) {
            continue;
        }
        if (
            owner_checkbox.checked == 'false' ||
            other_checkbox.checked == 'false'
        ) {
            continue;
        }

        // tally up values per expense
        let owner_payment;
        let other_payment;
        let total_payment = 0;
        let qty_payers = 0;
        for (let name of Object.keys(users)) {
            let payer_checkbox = document.getElementById(
                `checkbox_${name}_${i}`
            );
            let payer_cost = Number(
                document.getElementById(`cost_${name}_${i}`).value
            );
            let payer_currency = document.getElementById(
                `currency_${name}_${i}`
            ).value;
            if (payer_checkbox.checked == 'false') {
                continue;
            }
            qty_payers += 1;
            if (payer_cost == '') {
                payer_cost = 0;
            }
            if (payer_currency != 'USD') {
                if (currencies[payer_currency] == null) {
                    let rate = await get_currency_per_dollar(payer_currency);
                    currencies[payer_currency] = rate;
                    payer_cost = payer_cost / rate;
                } else {
                    payer_cost = payer_cost / currencies[payer_currency];
                }
            }
            total_payment += payer_cost;
            if (payer_checkbox == other_checkbox) {
                other_payment = payer_cost;
            }
            if (owner_checkbox == payer_checkbox) {
                owner_payment = payer_cost;
            }
        }
        let split = total_payment / qty_payers;
        console.log(
            `expense 1: \nowner: ${owner_payment}\nother: ${other_payment}\ntotal: ${total_payment}\nsplit: ${split}`
        );
        if (owner_payment < split && other_payment > split) {
            balance += other_payment - split;
        }
        console.log(`Balance for expense ${i}: ${other_payment - split}`);
    }
    return Math.round(balance * 100) / 100;
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

// get currency rates using max's microservice

let get_currency_per_dollar = async (currency) => {
    let rate = null;
    let get_rate = (rate) => {
        return new Promise((resolve, reject) => {
            console.log(`Getting rate for ${currency}:USD`);
            let request = new XMLHttpRequest();
            request.open('GET', `/rate?currency=${currency}`, true);
            request.addEventListener('load', function (event) {
                if (event.target.status !== 200) {
                    let message = JSON.parse(event.target.response);
                    alert('Error getting rate: ' + message.message);
                    reject(message.message);
                } else {
                    console.log('Rate acquired: ', this.responseText);
                    rate = this.responseText;
                    resolve(rate);
                }
            });
            request.send();
        });
    };
    rate = await get_rate(rate);
    console.log('Rate after await: ', rate);
    return rate;
};
