const inputSlider = document.querySelector("[data-slider]");
const passlength = document.querySelector("[data-lengthNumber]");

const passDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-strengthIndicator]");
const generateBtn = document.querySelector("[data-generatePass]");
const allCheck = document.querySelectorAll("input[type=checkbox]");
let symbols = '!@`~#$%^&*()-_+=[]{}:;<,>.?/|';

let password = "";
let passwordLen = 10;
let checkCount = 0;
handleSlider();

// set the color of the strength to grey 
setIndicator(" #ccc");

function handleSlider() {
    inputSlider.value = passwordLen;
    passlength.innerText = passwordLen;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLen - min) * 100 / (max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 6px 1px ${color}`;
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function getUpperCaseLetter() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function getLowerCaseLetter() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function getSymbol() {
    let randomNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}

function handleChangeOfCheckBox() {
    checkCount = 0;
    allCheck.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    })

    // corner or special condition
    if (passwordLen < checkCount) {
        passwordLen = checkCount;
        handleSlider(); // this function is called here to update the UI
    }
}

allCheck.forEach((checkbox) => {
    checkbox.addEventListener('change', handleChangeOfCheckBox);
})

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => {
        str += el;
    });

    return str;
}

function calcStrength() {
    let checkUpperCase = false;
    let checkLowerCase = false;
    let checkNumbers = false;
    let checkSymbols = false;

    if (upperCaseCheck.checked) checkUpperCase = true;
    if (lowerCaseCheck.checked) checkLowerCase = true;
    if (numbersCheck.checked) checkNumbers = true;
    if (symbolCheck.checked) checkSymbols = true;

    if (checkUpperCase && checkLowerCase && (checkNumbers || checkSymbols) && passlength >= 8) {
        setIndicator("#ff0000");
    } else if ((checkUpperCase || checkLowerCase) &&
        (checkNumbers || checkSymbols) && passlength >= 5) {
        setIndicator("#00ff00");
    }
    else {
        setIndicator("#ffff00");
    }
}

async function copyCotent() {

    try {
        await navigator.clipboard.writeText(passDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed!";
    }
    // and to make copy wala span visible 
    copyMsg.classList = "active";

    setTimeout(() => {
        copyMsg.classList.remove = "active";
    }, 2000);

}

inputSlider.addEventListener('input', (e) => {
    passwordLen = e.target.value;
    handleSlider();
})

copybtn.addEventListener('click', () => {
    if (passDisplay.value) {
        copyCotent();
    }
})

generateBtn.addEventListener('click', () => {
    // none of the checkboxes are checked
    if (checkCount == 0) return;  // bhag jao yha se

    if (passwordLen < checkCount) {
        passwordLen = checkCount;
        handleSlider();
    }

    // lets start the journey to find new password
    console.log("Jorney started");

    //remove old password
    password = "";

    // lets put the stuffs mentioned by the checkboxes
    // if(upperCaseCheck.checked){
    //     password += getUpperCaseLetter();
    // }

    // if(lowerCaseCheck.checked){
    //     password += getLowerCaseLetter();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolCheck.checked){
    //     password += getSymbol();
    // }

    let funArr = [];

    if (upperCaseCheck.checked) {
        funArr.push(getUpperCaseLetter);
    }

    if (lowerCaseCheck.checked) {
        funArr.push(getLowerCaseLetter);
    }

    if (numbersCheck.checked) {
        funArr.push(generateRandomNumber);
    }

    if (symbolCheck.checked) {
        funArr.push(getSymbol);
    }

    console.log("Array");

    // compulsory addition
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }
    console.log("Array created");
    // Remaining Addition
    for (let i = 0; i < (passwordLen - funArr.length); i++) {
        let randIndx = getRndInteger(0, funArr.length);
        console.log("random " + randIndx);
        password += funArr[randIndx]();
    }


    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffled");

    // displaying the password
    passDisplay.value = password;

    // calculate the strength 
    calcStrength();


})