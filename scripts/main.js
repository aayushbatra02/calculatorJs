const screen = document.querySelector(".screen");
const keys = document.querySelectorAll(".key");

let screenText = [];
const elementsArray = Array.from(keys);
screen.value = 0;

//on click functions on buttons and handle edge cases
let token = [];

for (let i = 0; i < elementsArray.length; i++) {
  elementsArray[i].addEventListener("click", () => {
    if (elementsArray[i].innerHTML === "=") {
      doCalculation();
    } else if (elementsArray[i].innerHTML === "C") {
      screenText = [];
      token = [];
      screen.value = "";
    } else {
      if (
        //for two consecutive operators
        "+,-,*,/".includes(elementsArray[i].innerHTML) &&
        "+,-,*,/".includes(screenText[screenText.length - 1])
      ) {
        console.log("Eat 5 star and do nothing");
      } else if (
        //operator should not be clicked in begining
        screenText.length === 0 &&
        "+,*,/,".includes(elementsArray[i].innerHTML)
      ) {
        console.log("Eat 5 star and do nothing");
      } else if (
        //In beginnig, if . clicked, convert it to 0.
        screenText.length === 0 &&
        elementsArray[i].innerHTML === "."
      ) {
        screenText.push("0", ".");
        screen.value = screenText.join("");
        token = ["0", "."];
      } else if (token.includes(".") && elementsArray[i].innerHTML === ".") {
        console.log("Eat 5 star and do nothing");
      } else {
        //will run normally
        if ("+,-,*,/".includes(elementsArray[i].innerHTML)) {
          token = [];
        }
        token.push(elementsArray[i].innerHTML);
        screenText.push(elementsArray[i].innerHTML);
        screen.value = screenText.join("");
      }
    }
  });
}

screen.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    doCalculation();
  }
});

const doCalculation = () => {
  const expString = screen.value;
  result = calculate(tokenize(expString));
  if (result?.toString().includes(".")) {
    //convert decimal result numbers upto two decimals
    result = result.toFixed(2);
    token = ["."];
  }
  screen.value = result;
  screenText = [result];
  if (!result && result !== 0) {
    screen.value = "NaN";
    screenText = [];
  }
  if (result === Infinity) {
    screen.value = "INFINITY";
    screenText = [];
  }
};

//create tokens form screenText or input

function tokenize(stringExp) {
  const result = [];
  let token = "";
  for (const character of stringExp) {
    if ("*/+-".includes(character)) {
      if (token === "" && character === "-") {
        token = "-";
      } else {
        result.push(parseFloat(token), character);
        token = "";
      }
    } else {
      token += character;
    }
  }
  if (token !== "") {
    result.push(parseFloat(token));
  }
  return result;
}

//Perform actual calculation

function calculate(tokens) {
  const operatorPrecedence = [
    {
      "/": (a, b) => a / b,
    },
    { "*": (a, b) => a * b },
    { "+": (a, b) => a + b, "-": (a, b) => a - b },
  ];
  let operator;
  for (const operators of operatorPrecedence) {
    const newTokens = [];
    for (const token of tokens) {
      if (token in operators) {
        operator = operators[token];
      } else if (operator) {
        newTokens[newTokens.length - 1] = operator(
          newTokens[newTokens.length - 1],
          token
        );
        operator = null;
      } else {
        newTokens.push(token);
      }
    }
    tokens = newTokens;
  }
  if (tokens.length > 1) {
    console.log("Error: unable to resolve calculation");
    return tokens;
  } else {
    return tokens[0];
  }
}
