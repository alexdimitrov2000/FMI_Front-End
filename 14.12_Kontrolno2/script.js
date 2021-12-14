const calculatorWrapper = document.getElementsByClassName("wrapper")[0];
const calculationList = document.getElementsByClassName("calculation-list")[0];
const clearCalcHistoryBtn = document.getElementsByClassName("clear")[0];
const actionGrid = document.getElementsByClassName("action-grid")[0];
const buttons = actionGrid.querySelectorAll("button");
const operationButtons = actionGrid.querySelectorAll("button.orange");
const inputField = document.getElementsByClassName("input")[0];
const maximizeBtn = document.querySelector("header nav .max");
const minimizeBtn = document.querySelector("header nav .min");

const digitsArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operationsArr = ["+", "−", "×", "÷", "√", "n2", "="];

let result = 0;
let clickedOperator = null;
let expression = "";

const getOperation = (event) => {
    let btnVal = event.target.innerText;
    if (btnVal === "−") {
        return "-";
    }
    else if (btnVal === "×") {
        return "*";
    }
    else if (btnVal === "÷") {
        return "/";
    }
    else if (btnVal === "√") {
        return "sqrt";
    }
    else if (btnVal === "n2") {
        return "power";
    }
    else if (btnVal === "=") {
        return "=";
    }

    return "+";
}

const displayCalcInHistory = (key) => {
    let li = `<li>${key}=${localStorage.getItem(key)}</li>`;
    calculationList.insertAdjacentHTML("beforeend", li);
}

const updateCalcHistory = (newCalculation = null) => {
    if (newCalculation) {
        displayCalcInHistory(newCalculation);
        return;
    }

    for (let key of Object.keys(localStorage)) {
        displayCalcInHistory(key);
    }
}

updateCalcHistory();

clearCalcHistoryBtn.addEventListener("click", event => {
    localStorage.clear();
    calculationList.innerHTML = "";
});

maximizeBtn.addEventListener("click", event => {
    calculatorWrapper.style.width = calculatorWrapper.offsetWidth * 2 + "px";
    calculatorWrapper.style.height = calculatorWrapper.offsetHeight * 2 + "px";

    alert("Заслужавам си шестицата!");
});

minimizeBtn.addEventListener("click", event => {
    calculatorWrapper.style.width = calculatorWrapper.offsetWidth / 2 + "px";
    calculatorWrapper.style.height = calculatorWrapper.offsetHeight / 2 + "px";
});

buttons.forEach(button => {
    button.addEventListener("click", event => {
        const btnVal = event.target.innerText;

        if (clickedOperator) {
            clickedOperator.style.border = "none";
            clickedOperator = null;
            inputField.value = "";
        }

        if (btnVal === "C") {
            inputField.value = "0";
            expression = "";
            result = 0;
        }
        else if (btnVal === "." && !inputField.value.includes(".")) {
            inputField.value += btnVal;
        }
        else if (digitsArr.includes(btnVal)) {
            if (inputField.value === "0") {
                inputField.value = "";
            }

            inputField.value += btnVal;
        }
        else if (operationsArr.includes(btnVal)) {
            const twoOperandOperations = operationsArr.slice(0, 4);
            const operation = getOperation(event);
            const inputVal = inputField.value;
            
            if (operation === "=") {
                expression += inputVal;
                result = eval(result + inputVal);
                inputField.value = result;
                localStorage.setItem(expression, result);
                updateCalcHistory(expression);
                expression = "";
            }
            else if (twoOperandOperations.includes(btnVal)) {
                event.target.style.border = "1px solid black";
                clickedOperator = event.target;
                
                if (expression !== "") {
                    inputField.value = eval(expression + inputVal);
                }
                
                expression += inputVal + operation;
                result = inputField.value + operation;
            }
            else {
                let calcKey = "";
                if (operation === "sqrt") {
                    result = Math.sqrt(inputVal);
                    calcKey = `√${inputVal}`;
                }
                else if (operation === "power") {
                    result = Math.pow(inputField.value, 2);
                    calcKey = `${inputVal}²`;
                }

                localStorage.setItem(calcKey, result);
                inputField.value = result;
                updateCalcHistory(calcKey);
            }
        }
    });
});