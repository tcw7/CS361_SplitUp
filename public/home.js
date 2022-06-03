let user_name_num = 0;
let user_names_fields = {};
let qty_users = 0;
let users = {};
let expense_num = 0;
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
    // KRW: null,
    SEK: null,
};
let total_payments = {};
let total_balances = {};

/**
 * represents a user to be included in expenses
 */
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
 * event handler for name adding button.
 * renders new html element for name field.
 * adds each input element if to user_names_fields global array.
 * @returns
 */
let add_fields = () => {
    console.log('Received request to add new name...');
    user_name_num++;
    let objTo = document.getElementById('additional-fields');
    let divtest = document.createElement('div');
    divtest.innerHTML = render_user_input_html();
    objTo.appendChild(divtest);
    user_names_fields[user_name_num] = `userNameInput${user_name_num}`;
    console.log('Added new username input field ' + user_name_num);
    return;
};

/**
 * event handler for remove name button.
 * checks with user before removing name element.
 * @param {*} element
 * @param {*} name
 * @returns
 */
let remove_name = (element, name) => {
    console.log('Remove element: ' + element.id);
    console.log('Remove User if exists: ' + name);
    if (confirm('Are you sure you want to delete this name?')) {
        if (users[name]) {
            delete users[name];
            console.log('User Removed: ' + name);
            qty_users--;
            console.log('Qty Users: ', qty_users);
        }
        element.remove();
        return;
    } else {
        console.log('User cancelled name removal request.');
        return;
    }
};

/**
 * event handler for submit button
 */
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

/**
 * checks name input for valid string, then creates a new
 * User object global
 * @param {*} names
 * @returns
 */
let create_users = (names) => {
    for (let name of names) {
        if (typeof users[name] == 'undefined' && name != '') {
            let newUser = new User(name);
            users[name] = newUser;
            console.log('New User: ' + users[name].name);
            qty_users++;
            console.log('Qty Users: ', qty_users);
        }
    }
    return;
};

/**
 * scans through all input name elements through user_names_fields.
 * adds user input value to names array.
 * @param {*} names
 * @returns
 */
let gather_names = (names) => {
    for (elementID in user_names_fields) {
        console.log(
            'Submitting name for new User: ' + user_names_fields[elementID]
        );
        let element = document.getElementById(user_names_fields[elementID]);
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

/**
 * returns true if at least two names have not been entered.
 * else returns false.
 * @returns
 */
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

/**
 * disbales all user interaction with the name input
 * forms.
 * @returns
 */
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

/**
 * event handler for add expense button.
 * increments the expense counter, renders new html for the expense header,
 * and appends the new html to the document.
 * iterates over each user to generate an input form for personalized expense
 * values.
 */
let render_expense = () => {
    expense_num++;
    let newExpenseForm = document.createElement('div');
    newExpenseForm.id = `expense${expense_num}`;
    newExpenseForm.innerHTML = render_expense_html(expense_num);
    document.getElementById(`new-expenses-here`).appendChild(newExpenseForm);
    for (user of Object.keys(users)) {
        console.log('Users key: ', user);
        create_user_expense(
            `addUserExpenseHere${expense_num}`,
            users[user],
            expense_num
        );
    }
};

/**
 * removes an entire expense element from the document after confirming
 * with the user.
 * @param {*} element
 */
let remove_expense = (element) => {
    console.log(`Received request to remove expense...`);
    if (confirm('Are you sure you want to remove this expense?')) {
        element.remove();
        console.log(`Expense removed.`);
    } else {
        console.log('User cancelled request to remove expense.');
    }
};

/**
 * creates personalized html for each user to be used as an input form
 * in the expense section.
 * @param {*} parentElementID
 * @param {*} userObj
 * @param {*} expense_num
 */
let create_user_expense = (parentElementID, userObj, expense_num) => {
    let parentElement = document.getElementById(parentElementID);
    let newUserExpense = document.createElement('div');
    newUserExpense.innerHTML = render_user_expense_html(userObj, expense_num);
    parentElement.appendChild(newUserExpense);
};

// ************************************
// ********* RESULTS GENERATION **********
// ************************************

/**
 * event handler for SplitUp button. removes all previous html elements
 * that may be already generated for results. renders new html for
 * each user that includes the balances for every other user respectively.
 * calls render_balances to execute balance calculation.
 * @returns
 */
let render_results = () => {
    remove_all_child_nodes(document.getElementById('results_root'));
    render_static_balance_html();
    render_balances();
    return;
};

/**
 * removes all the child nodes within parent.
 * @param {*} parent
 */
let remove_all_child_nodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

/**
 * renders the static html elements for the results section before any
 * calculations.
 * @returns
 */
let render_static_balance_html = () => {
    for (let username of Object.keys(users)) {
        let user = users[username];
        let result = document.createElement('div');
        let results_root = document.getElementById('results_root');
        console.log(`Rendering HTML Balance for: ${user.name}...`);
        result.innerHTML = `<h5>${user.name}'s Balances:</h5>
        <div class="container" id="parent_${user.name}_balances">
        </div>`;
        results_root.appendChild(result);
        render_static_user_balances(user);
    }
    return;
};

/**
 * loops through all possible users to qualify each new rendered
 * user to user balance. renders a new balance if tests pass.
 * @param {*} user
 * @returns
 */
let render_static_user_balances = (user) => {
    for (let name of Object.keys(users)) {
        console.log(`Checking balance with: ${name}`);
        if (name != user.name) {
            console.log(`Creating balance between: ${user.name} and ${name}`);
            create_user_balance(
                user,
                users[name],
                `parent_${user.name}_balances`
            );
        }
    }
    return;
};

/**
 * renders new html for each user to user balance results.
 * @param {*} userOwner
 * @param {*} userOther
 * @param {*} parentElementID
 */
let create_user_balance = (userOwner, userOther, parentElementID) => {
    let parentElement = document.getElementById(parentElementID);
    let userBalance = document.createElement('div');
    userBalance.innerHTML = render_tab_html(userOwner, userOther);
    parentElement.appendChild(userBalance);
};

/**
 * async master function to calculate and render all
 * user balances.
 * @returns
 */
let render_balances = async () => {
    zero_out_balances();
    await calculate_expenses();
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

/**
 * resets all user balances.
 * @returns
 */
let zero_out_balances = () => {
    for (let a of Object.keys(users)) {
        for (let b of Object.keys(users)) {
            if (a != b) users[a].balances[b] = 0;
        }
    }
    return;
};

/**
 * loops through every valid expense in the document.
 * if a valid expense is detected, the global payments
 * counter is reset to null for each user. then the
 * split cost for each expense is calculated. each user's
 * balance is then determined from the amount paid by each
 * user against the split cost for each expense. this
 * balance is the added to each user object. finally,
 * each individual user-to-user balance is adjusted using the
 * balances calculated previously.
 * @returns
 */
let calculate_expenses = async () => {
    let split_cost;
    for (let i = 1; i <= expense_num; i++) {
        if (!document.getElementById(`expense${i}`)) continue;
        null_out_payments();
        await tabulate_split_cost_per_expense(i).then((value) => {
            split_cost = value;
        });
        console.log('split_cost: ' + split_cost);
        for (let usr of Object.keys(total_payments)) {
            if (total_payments[usr] != null) {
                total_balances[usr] = split_cost - total_payments[usr];
                console.log(total_balances[usr]);
            }
        }
        calculate_balances_between_users();
        console.log(`balances: ${total_balances}`);
    }
    return;
};

/**
 * resets the global payments counter to null for each user.
 * @returns
 */
let null_out_payments = () => {
    for (let name of Object.keys(users)) {
        total_payments[name] = null;
        total_balances[name] = null;
    }
    return;
};

/**
 * checks each user's payment per expense, converting
 * currency values if necessary. adds up all users' payments
 * in terms of USD, then splits the cost by the total qty of
 * payments.
 * @param {*} iter
 * @returns
 */
let tabulate_split_cost_per_expense = async (iter) => {
    let qty_payers = 0;
    let total_payment = 0;
    for (let name of Object.keys(users)) {
        let payer_checkbox = document.getElementById(
            `checkbox_${name}_${iter}`
        );
        if (payer_checkbox.checked == false) continue;
        let payer_cost = Number(
            document.getElementById(`cost_${name}_${iter}`).value
        );
        let payer_currency = document.getElementById(
            `currency_${name}_${iter}`
        ).value;
        await convert_payer_cost(payer_cost, payer_currency).then((value) => {
            payer_cost = value;
        });
        qty_payers += 1;
        total_payment += payer_cost;
        total_payments[name] = payer_cost;
    }
    console.log('split: ' + total_payment / qty_payers);
    return total_payment / qty_payers;
};

/**
 * recalculates the payer cost if the currency is not USD. returns
 * the value of the payer cost in terms of USD.
 * @param {*} payer_cost
 * @param {*} payer_currency
 * @returns
 */
let convert_payer_cost = async (payer_cost, payer_currency) => {
    if (payer_cost == '') return 0;
    if (payer_currency != 'USD') {
        if (currencies[payer_currency] == null) {
            let rate = await get_currency_per_dollar(payer_currency);
            currencies[payer_currency] = rate;
            payer_cost = payer_cost / rate;
        } else {
            payer_cost = payer_cost / currencies[payer_currency];
        }
    }
    return payer_cost;
};

/**
 * checks compatibility of balances between users in O(n^2) time. if two
 * users have compatible outstanding balances, the function will
 * execute necessary virtual payments to equalize any possible outstanding
 * debts.
 * @param {*} qty_payers
 * @param {*} total_payment
 * @returns
 */
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

/**
 * calculates required payments between users to settle outstanding
 * balances. adds these payments to a user divided ledger object per user.
 * @param {*} usr_a
 * @param {*} usr_b
 * @returns
 */
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

/**
 * function wrapper for Max's exchange rate API.
 * @param {*} currency
 * @returns
 */
let get_currency_per_dollar = async (currency) => {
    let rate = null;
    rate = await get_rate(rate, currency);
    console.log('Rate after await: ', rate);
    return rate;
};

/**
 * Uses AJAX to query the server for an exchange rate using
 * Max Belyaev's exchange rate API.
 * @param {*} rate
 * @param {*} currency
 * @returns
 */
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

/**
 * event handler for currency selctor in results section. converts
 * balance value from the base currency value to the requested
 * currency value.
 * @param {*} element
 * @returns
 */
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
    if (base_cur == 'USD') base_conversion_rate = 1;
    let next_conversion_rate = await get_currency_per_dollar(select_val);
    if (select_val == 'USD') next_conversion_rate = 1;
    bal_value = (bal_value * next_conversion_rate) / base_conversion_rate;
    bal_value = Math.round(bal_value * 1000) / 1000;
    bal_element.innerHTML = bal_value;
    base_cur_element.innerHTML = select_val;
    return;
};

/**
 * reloads the webpage.
 * @returns
 */
let start_over = () => {
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

/**
 *
 * @returns static html for user input
 */
let render_user_input_html = () => {
    let html_content =
        '<div class="form-group mb-3 row" id="userName' +
        user_name_num +
        '"><div class="col-6"><input type="text" class="form-control" id="userNameInput' +
        user_name_num +
        '" placeholder="Name"/></div><div class ="col-6"><input type="button" class="btn btn-danger" value="remove name" onclick="remove_name(userName' +
        user_name_num +
        ', userNameInput' +
        user_name_num +
        '.value)" /></div></div>';
    return html_content;
};

/**
 *
 * @param {*} expense_num
 * @returns static html for each expense header
 */
let render_expense_html = (expense_num) => {
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
        `addUserExpenseHere${expense_num}` +
        `>
            <p>How much did each person pay for this? Check the box next
                to each person that should be included in the SplitUp for this expense.</p>
        </div>
    </form>
    <div>
        <input
            type='button'
            value='remove expense'
            onclick='remove_expense(` +
        `expense${expense_num}` +
        `)'
            class='btn btn-danger'
        />
    </div>
    <br />
    <br />
    <br />`;
    return html_content;
};

/**
 *
 * @param {*} userObj
 * @param {*} expense_num
 * @returns static html for each user expense
 */
let render_user_expense_html = (userObj, expense_num) => {
    let html_content =
        `
    <div class="form-group row">
        <div class='col-1'>
            <input
                class='form-check-input position-static'
                type='checkbox'
                id='checkbox_${userObj.name}_${expense_num}'
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
                id='cost_${userObj.name}_${expense_num}'
            />
        </div>
        <div class='col-3'>
            <select class='form-control' id='currency_${userObj.name}_${expense_num}'>
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
                <!--<option value='KRW'>KRW</option>-->
                <option value='SEK'>SEK</option>
            </select>
            <br />
        </div>
    </div>`;
    return html_content;
};

/**
 *
 * @param {*} userOwner
 * @param {*} userOther
 * @returns static html for each user balance result
 */
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
        <!--<option value="KRW">KRW</option>-->
        <option value="SEK">SEK</option>
    </select></div>`;
    return html_text;
};
