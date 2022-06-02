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
let total_payments = {};
let total_balances = {};

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
    divtest.innerHTML = render_user_input_html();
    objTo.appendChild(divtest);
    userNamesFields[userNameNum] = `userNameInput${userNameNum}`;
    console.log('Added new username input field ' + userNameNum);
    return;
};

// removes a name from the website
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
    let names = [];
    gather_names(names); // get names from input form
    console.log('Names: ' + names);
    create_users(names);
    if (user_qty_invalid()) return;
    disable_input_fields();

    // show expenses forms
    document.getElementById('unhide-me').hidden = false;

    return;
};

let create_users = (names) => {
    for (let name of names) {
        if (typeof users[name] == 'undefined' && name != '') {
            let newUser = new User(name);
            users[name] = newUser;
            console.log('New User: ' + users[name].name);
            qtyUsers++;
            console.log('Qty Users: ', qtyUsers);
        }
    }
    return;
};

let gather_names = (names) => {
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
    return;
};

let user_qty_invalid = () => {
    // case if no valid names have been entered
    if (Object.keys(users).length == 0) {
        alert(
            `You haven't entered any names yet. Please enter at least two names to SplitUp your expense(s).`
        );
        return true;
    }

    // case if only one valid name has been entered
    if (Object.keys(users).length == 1) {
        alert(
            `Only one name has been entered. Please enter at least one more name to SplitUp your expense(s).`
        );
        return true;
    }

    return false;
};

let disable_input_fields = () => {
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
    return;
};

// ************************************
// ********* EXPENSE GENERATION **********
// ************************************

let renderExpense = () => {
    expenseNum++;
    let newExpenseForm = document.createElement('div');
    newExpenseForm.id = `expense${expenseNum}`;
    newExpenseForm.innerHTML = render_expense_html(expenseNum);
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
    newUserExpense.innerHTML = render_user_expense_html(userObj, expenseNum);
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

    removeAllChildNodes(document.getElementById('results_root'));
    render_static_balance_html();
    render_balances();
    return;
};

let removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

let render_static_balance_html = () => {
    for (let username of Object.keys(users)) {
        let user = users[username];
        let result = document.createElement('div');
        let resultsRoot = document.getElementById('results_root');
        console.log(`Rendering HTML Balance for: ${user.name}...`);
        result.innerHTML = `<h5>${username}'s Balances:</h5>
        <div class="container" id="parent_${username}_balances">
        </div>`;
        resultsRoot.appendChild(result);
        for (let name of Object.keys(users)) {
            console.log(`Checking balance with: ${name}`);
            if (name != username) {
                console.log(
                    `Creating balance between: ${user.name} and ${name}`
                );
                createUserBalance(
                    user,
                    users[name],
                    `parent_${username}_balances`
                );
            }
        }
    }
    return;
};

let createUserBalance = (userOwner, userOther, parentElementID) => {
    let parentElement = document.getElementById(parentElementID);
    let userBalance = document.createElement('div');
    userBalance.innerHTML = render_tab_html(userOwner, userOther);
    parentElement.appendChild(userBalance);
};

let render_balances = async () => {
    let value = await calculate_master_balance();
    for (let usr_a of Object.keys(users)) {
        for (let usr_b of Object.keys(users)) {
            if (usr_b == usr_a) {
                continue;
            }
            document.getElementById(`${usr_a}${usr_b}`).innerHTML =
                Math.round(users[usr_a].balances[usr_b] * 1000) / 1000;
        }
    }
    return;
};

let calculate_master_balance = async () => {
    // zero out balances for all users
    for (let a of Object.keys(users)) {
        for (let b of Object.keys(users)) {
            if (a != b) users[a].balances[b] = 0;
        }
    }
    await calculate_expenses();
    return;
};

let calculate_expenses = async () => {
    // loop over each expense
    for (let i = 1; i <= expenseNum; i++) {
        let qty_payers = 0;
        let total_payment = 0;
        // check if expense exists
        if (!document.getElementById(`expense${i}`)) continue;
        zero_out_payments(qty_payers, total_payment);
        let split;
        await tabulate_split_cost_per_expense(
            i,
            qty_payers,
            total_payment
        ).then((value) => {
            split = value;
        });
        console.log('split: ' + split);
        for (let usr of Object.keys(total_payments)) {
            if (total_payments[usr] != null) {
                total_balances[usr] = split - total_payments[usr];
                console.log(total_balances[usr]);
            }
        }
        calculate_balances_between_users();
        console.log(`balances: ${total_balances}`);
    }
    return;
};

let zero_out_payments = (qty_payers, total_payment) => {
    for (let name of Object.keys(users)) {
        total_payments[name] = null;
        total_balances[name] = null;
    }
    return;
};

let tabulate_split_cost_per_expense = async (i, qty_payers, total_payment) => {
    // loop through each user's expense
    for (let name of Object.keys(users)) {
        let payer_checkbox = document.getElementById(`checkbox_${name}_${i}`);
        let payer_cost = Number(
            document.getElementById(`cost_${name}_${i}`).value
        );
        let payer_currency = document.getElementById(
            `currency_${name}_${i}`
        ).value;
        if (payer_checkbox.checked == false) continue;
        if (payer_cost == '') payer_cost = 0;
        if (payer_currency != 'USD') {
            if (currencies[payer_currency] == null) {
                let rate = await get_currency_per_dollar(payer_currency);
                currencies[payer_currency] = rate;
                payer_cost = payer_cost / rate;
            } else {
                payer_cost = payer_cost / currencies[payer_currency];
            }
        }
        qty_payers += 1;
        total_payment += payer_cost;
        total_payments[name] = payer_cost;
    }
    console.log('split: ' + total_payment / qty_payers);
    return total_payment / qty_payers;
};

let calculate_balances_between_users = (qty_payers, total_payment) => {
    for (let usr_a of Object.keys(total_payments)) {
        for (let usr_b of Object.keys(total_payments)) {
            if (usr_b == usr_a) continue;
            if (total_payments[usr_a] == null) continue;
            if (total_payments[usr_b] == null) continue;
            if (total_balances[usr_a] > 0 && total_balances[usr_b] < 0) {
                execute_balance_adjustment(usr_a, usr_b);
            }
        }
    }
    return;
};

let execute_balance_adjustment = (usr_a, usr_b) => {
    console.log(`Calculating balance between ${usr_a} and ${usr_b}`);
    let single_payment;
    if (Math.abs(total_balances[usr_a]) < Math.abs(total_balances[usr_b])) {
        single_payment = total_balances[usr_a];
    } else {
        single_payment = Math.abs(total_balances[usr_b]);
    }
    console.log(`Single payment: ${single_payment} from ${usr_a} to ${usr_b}`);

    total_balances[usr_a] -= single_payment;
    users[usr_a].balances[usr_b] += single_payment;
    console.log(`${usr_a}'s balance: ${total_balances[usr_a]}`);

    total_balances[usr_b] += single_payment;
    users[usr_b].balances[usr_a] += single_payment * -1;
    console.log(`${usr_b}'s balance: ${total_balances[usr_b]}`);
    return;
};

// get currency rates using max's microservice
let get_currency_per_dollar = async (currency) => {
    let rate = null;
    rate = await get_rate(rate, currency);
    console.log('Rate after await: ', rate);
    return rate;
};

let get_rate = (rate, currency) => {
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

let convert_balance_currency = async (element) => {
    console.log('convert_balance_currency() engaged');
    let select_id = element.id;
    let select_val = element.value;
    let bal_id = select_id.substring(0, select_id.length - 6);
    let bal_element = document.getElementById(`${bal_id}`);
    let bal_value = Number(bal_element.innerHTML);
    let base_cur_id = bal_id + 'cur';
    let base_cur_element = document.getElementById(`${base_cur_id}`);
    let base_cur = base_cur_element.innerHTML;
    console.log(bal_value, select_val, base_cur);
    let base_conversion_rate = await get_currency_per_dollar(base_cur);
    if (base_cur == 'USD') {
        base_conversion_rate = 1;
    }
    let next_conversion_rate = await get_currency_per_dollar(select_val);
    if (select_val == 'USD') {
        next_conversion_rate = 1;
    }
    bal_value = (bal_value * next_conversion_rate) / base_conversion_rate;
    bal_value = Math.round(bal_value * 1000) / 1000;
    bal_element.innerHTML = bal_value;
    base_cur_element.innerHTML = select_val;
    return;
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

// HTML renderers

let render_user_input_html = () => {
    let html_content =
        '<div class="form-group mb-3 row" id="userName' +
        userNameNum +
        '"><div class="col-6"><input type="text" class="form-control" id="userNameInput' +
        userNameNum +
        '" placeholder="Name"/></div><div class ="col-6"><input type="button" class="btn btn-danger" value="remove name" onclick="remove_name(userName' +
        userNameNum +
        ', userNameInput' +
        userNameNum +
        '.value)" /></div></div>';
    return html_content;
};

let render_expense_html = (expenseNum) => {
    let html_content =
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
    return html_content;
};

let render_user_expense_html = (userObj, expenseNum) => {
    let html_content =
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
    return html_content;
};

let render_tab_html = (userOwner, userOther) => {
    let html_text = `<div class="form-group row"><h6 class="col-6">${userOther.name}:</h6>
    <h6 class="col-3" id='${userOwner.name}${userOther.name}'></h6>
    <p hidden id="${userOwner.name}${userOther.name}cur">USD</p>
    <select name="select_currency_conversion" id="${userOwner.name}${userOther.name}select" class="form-control col" onchange="convert_balance_currency(this)">
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
    return html_text;
};
