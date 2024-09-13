document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('button');
    let currentExpression = '';
    let currentValue = '0';
    let waitingForSecondOperand = false;

    function updateDisplay() {
        display.textContent = currentExpression || currentValue;
    }

    function handleNumber(num) {
        if (waitingForSecondOperand) {
            currentValue = num;
            currentExpression += num;
            waitingForSecondOperand = false;
        } else {
            currentValue = currentValue === '0' ? num : currentValue + num;
            currentExpression = currentExpression === '0' ? num : currentExpression + num;
        }
        updateDisplay();
    }

    function handleDecimal() {
        if (waitingForSecondOperand) {
            currentValue = '0.';
            currentExpression += '0.';
            waitingForSecondOperand = false;
        } else if (!currentValue.includes('.')) {
            currentValue += '.';
            currentExpression += '.';
        }
        updateDisplay();
    }

    function handleOperator(nextOperator) {
        if (waitingForSecondOperand) {
            currentExpression = currentExpression.slice(0, -1) + nextOperator;
        } else {
            currentExpression += nextOperator;
        }
        waitingForSecondOperand = true;
        updateDisplay();
    }

    function handleEquals() {
        try {
            let result = eval(currentExpression.replace(/x/g, '*'));
            result = parseFloat(result.toFixed(7));
            currentValue = result.toString();
            currentExpression = result.toString();
            waitingForSecondOperand = true;
            updateDisplay();
        } catch (error) {
            currentValue = 'Error';
            currentExpression = '';
            updateDisplay();
        }
    }

    function handleDelete() {
        if (currentExpression.length > 1) {
            currentExpression = currentExpression.slice(0, -1);
            currentValue = currentExpression;
        } else {
            currentExpression = '0';
            currentValue = '0';
        }
        updateDisplay();
    }

    function handleReset() {
        currentExpression = '';
        currentValue = '0';
        waitingForSecondOperand = false;
        updateDisplay();
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('number')) {
                handleNumber(button.textContent);
            } else if (button.classList.contains('decimal')) {
                handleDecimal();
            } else if (button.classList.contains('operator')) {
                handleOperator(button.textContent);
            } else if (button.classList.contains('equals')) {
                handleEquals();
            } else if (button.classList.contains('del')) {
                handleDelete();
            } else if (button.classList.contains('reset')) {
                handleReset();
            }
        });
    }); 
    document.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9') {
            handleNumber(event.key);
        } else if (event.key === '.') {
            handleDecimal();
        } else if (['+', '-', '*', '/'].includes(event.key)) {
            handleOperator(event.key === '*' ? 'x' : event.key);
        } else if (event.key === 'Enter' || event.key === '=') {
            handleEquals();
        } else if (event.key === 'Backspace') {
            handleDelete();
        } else if (event.key === 'Escape') {
            handleReset();
        }
    });
});