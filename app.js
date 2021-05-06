// Get main show and preview input
const output = document.querySelector('#output');
const preview = document.querySelector('#preview');
// Get all buttons
const keyBtn = document.querySelector('.buttons');
const historyBtn = document.querySelector('button.history');
const clearHistoryBtn = document.querySelector('button.clearHistory');
const histLayout = document.querySelector('.history_layout');
const histList = document.querySelector('.history_list');
// Get scroll
document.querySelector('.output').scrollLeft = document.querySelector('.output').scrollWidth;
// Get variables
let previewResult, currentResult, strNum = '', newValue = '', toggle = true, history = [];

// ---------- Event listeners ----------

// Event to open and close the history
historyBtn.addEventListener('click', (e) => {

    // Set history scroll
    document.querySelector('.history_list').scrollTop = document.querySelector('.history_list').scrollHeight;

    if (toggle === true) {
        historyBtn.innerHTML = `<i class="fas fa-calculator"></i>`;
        keyBtn.style.display = 'none';
        histLayout.style.display = 'flex';
        toggle = false;
    } else if (toggle === false) {
        historyBtn.innerHTML = `<i class="far fa-clock"></i>`;
        keyBtn.style.display = 'inline-block';
        histLayout.style.display = 'none';
        toggle = true;
    }
});

// Event to clear the history
clearHistoryBtn.addEventListener('click', (e) => {
    history = '';
    histList.innerHTML = '';
});

// Event checking if a button was clicked
keyBtn.addEventListener('click', (e) => {

    // Get value of clicked buttons
    if (e.target.classList[0] === 'common' || e.target.classList[0] === 'operator' || e.target.classList[0] === 'operatorEsp' || e.target.classList[0] === 'dot') {
        print(e.target.innerHTML);
    }

    // Getting clear options
    if (e.target.classList[1] === 'backspace') {
        previewResult = output.value;
        output.value = previewResult.substr(0, previewResult.length - 1);
        preview.value = maskedValues();
        newValue = output.value;
    }
    if (e.target.classList[1] === 'clear') {
        output.value = '';
        strNum = '';
        newValue = '';
    }

    if (e.target.classList[0] === 'change') {
        if (!['-'].includes(output.value.charAt(0))) {
            output.value = '-' + output.value;
            newValue = output.value;
        } else if (['-'].includes(output.value.charAt(0))) {
            output.value = output.value.substr(1);
            newValue = output.value;
        }
    }

    // Save preview value
    if (output.value !== '') {
        preview.value = maskedValues();
    }
    if(output.value === ''){
        preview.value = '';
    }

    // Check if equals was clicked
    if (e.target.classList[1] === 'equals' && output.value !== '') {
        history.push(output.value);
        output.value = maskedValues();
        history.push('=' + output.value);
        preview.value = '';
        strNum = output.value;

        histList.innerHTML = '';
        history.forEach(element => {
            if (history.indexOf(element) % 2 === 0) {
                histList.innerHTML += `<li>${element}</li>`;
            } else {
                histList.innerHTML += `<li id="res">${element}</li>`;
            }
        });
    }

    //---------- Functions ----------

    // Print and check values
    function print(val) {
        let filteredValue = e.target.classList[1] === 'multi' ? 'x' : e.target.classList[1] === 'divided' ? '/' : e.target.classList[1] === 'percent' ? '%' : val;
        if (e.target.classList[1] !== 'equals') {

            if (!['+', '-', 'x', '/', '%', '.'].includes(filteredValue) && output.value == '') {
                output.value = filteredValue;
                newValue += filteredValue;
                strNum += filteredValue;

            } else if (['+', '-', 'x', '/', '%', '.'].includes(filteredValue) && !['+', '-', 'x', '/', '%', '.', ''].includes(output.value.charAt(output.value.length - 1))) {
                if (filteredValue === '%') {
                    strNum = output.value;
                    strNum = maskedValues();
                    strNum = strNum / 100;
                    newValue = '';
                    newValue += strNum;
                } else {
                    newValue += filteredValue;
                }

                output.value += filteredValue;
                strNum = '';

            } else if (filteredValue === '-' && ['+', 'x', '/', '%'].includes(output.value.charAt(output.value.length - 1))) {
                strNum += filteredValue;
                newValue += filteredValue;
                output.value += filteredValue;

            } else if (e.target.classList[0] === 'common') {
                if (['%'].includes(output.value.charAt(output.value.length - 1))) {
                    filteredValue = 'x' + filteredValue;
                }

                strNum += filteredValue;
                newValue += filteredValue;
                output.value += filteredValue;
            }
        }
    }

    // Preventing values from going wrong
    function maskedValues() {
        let previewNum;
        currentResult = output.value;
        try {
            if (['+', '-'].includes(currentResult.charAt(currentResult.length - 1))) {
                previewNum = '0';
                return calc(previewNum);
            } else if (['/', 'x'].includes(currentResult.charAt(currentResult.length - 1))) {
                previewNum = '1';
                return calc(previewNum);
            } else {
                return calc(previewNum);
            }
        } catch {
            return 'NaN';
        }
    }

    // Main calculation function
    function calc(previewNum) {
        currentResult = newValue;
        currentResult = currentResult.replaceAll('x', '*');
        if (previewNum === undefined) {
            previewNum = '';
        }
        return eval(currentResult + previewNum);
    }
});