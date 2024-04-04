const input = document.querySelector(".input");
const keys = document.querySelectorAll(".key");

let inputText = [];
const keysArray = Array.from(keys);
input.value = 0;

//on click functions on buttons and handle edge cases

let number = [];

for (let i = 0; i < keysArray.length; i++) {
  keysArray[i].addEventListener("click", () => {
    switch (keysArray[i].innerHTML) {
      case "=": {
        handleCalculations();
        break;
      }
      case "C": {
        inputText = [];
        number = [];
        input.value = "";
        break;
      }
      default: {
        if (
          //In beginnig, if . clicked, convert it to 0.
          inputText.length === 0 &&
          keysArray[i].innerHTML === "."
        ) {
          inputText.push("0", ".");
          input.value = inputText.join("");
          number = ["0", "."];
        } else if (
          //for two consecutive operators
          !(
            "+,-,*,/".includes(keysArray[i].innerHTML) &&
            "+,-,*,/".includes(inputText[inputText.length - 1])
          ) &&
          //operator should not be clicked in begining
          !(
            inputText.length === 0 &&
            "+,*,/,".includes(keysArray[i].innerHTML)
          ) &&
          //two dots in one number
          !(number.includes(".") && keysArray[i].innerHTML === ".")
        ) {
          if ("+,-,*,/".includes(keysArray[i].innerHTML)) {
            //clear number on operator click
            number = [];
          }
          number.push(keysArray[i].innerHTML);
          inputText.push(keysArray[i].innerHTML);
          input.value = inputText.join("");
        }
      }
    }
  });
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleCalculations();
  }
});

const handleCalculations = () => {
  const inputString = input.value;
  result = calculate(convertStringToArray(inputString));
  if (result?.toString().includes(".")) {
    //convert decimal result numbers upto two decimals
    result = result.toFixed(2);
    number = ["."];
  }
  input.value = result;
  inputText = [result];
  if (!result && result !== 0) {
    input.value = "NaN";
    inputText = [];
  }
  if (result === Infinity) {
    input.value = "INFINITY";
    inputText = [];
  }
};

//create array of numbers and operators form inputText or input

function convertStringToArray(inputString) {
  const result = [];
  let number = "";
  for (const character of inputString) {
    if ("*/+-".includes(character)) {
      if (number === "" && character === "-") {
        number = "-";
      } else {
        result.push(parseFloat(number), character);
        number = "";
      }
    } else {
      number += character;
    }
  }
  if (number !== "") {
    result.push(parseFloat(number));
  }
  return result;
}

//Perform actual calculation

function calculate(array) {
  const operatorPrecedence = [
    {
      "/": (a, b) => a / b,
    },
    { "*": (a, b) => a * b },
    { "+": (a, b) => a + b, "-": (a, b) => a - b },
  ];
  let operator;
  for (const operators of operatorPrecedence) {
    const newarray = [];
    for (const element of array) {
      if (element in operators) {
        operator = operators[element];
      } else if (operator) {
        newarray[newarray.length - 1] = operator(
          newarray[newarray.length - 1],
          element
        );
        operator = null;
      } else {
        newarray.push(element);
      }
    }
    array = newarray;
  }
  return array[0]
}
