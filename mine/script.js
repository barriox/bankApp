'use strict';

// const e = require('express');

/// //////////////////////////////////////////////
/// //////////////////////////////////////////////
// BANKIST APP
const cargasPagina = window.localStorage.getItem('cargasPagina') || 0;
window.localStorage.setItem('cargasPagina', Number(cargasPagina));

// bbdd
// db.getCollection('cuentas').find({});

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    // containerMovements.innerHTML += html;
    containerMovements.insertAdjacentHTML(sort, html);
  });
};
let sort = 'afterbegin';
btnSort.addEventListener('click', e => {
  e.preventDefault();
  sort = sort === 'afterbegin' ? 'beforeend' : 'afterbegin';
  displayMovements(currentAccount.movements, sort);
});
// Función que inserta un campo nuevo
const createUserNames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase() // a minusculas
      .split(' ') // separar en array de palabras
      .map(palabra => palabra[0]) // recorrer el array de palabras y quedarme con array de sus primeras letras
      .join(''); // unir las letras del array en string
  });
};
createUserNames(accounts);
console.log(accounts);

// const totalDeposits = [2, 4, 6].reduce((acc, curVal) => acc + curVal, 0);
// console.log(totalDeposits);

function displayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, curval) => acc + curval, 0);
  labelBalance.textContent = `${acc.balance}€`;
}
function displaySummary(acc) {
  const { movements, interestRate } = acc;
  // calcular y mostrar depositos+
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = incomes + '€';
  // calcular y mostrar retiradas de dinero
  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = Math.abs(outcomes) + '€';
  // calcular y mostrar intereses
  // const interest = acc.interestRate > 1 ? (incomes * acc.interestRate) / 100 : incomes / 100;
  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = interest.toFixed(2) + '€';
}
let currentAccount, timer;
const updateUI = function () {
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
  displayMovements(currentAccount.movements);
  displayBalance(currentAccount);
  displaySummary(currentAccount);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  console.log(username, pin);
  currentAccount = accounts.find(acc => acc.username === username);
  if (currentAccount?.pin === pin) {
    labelWelcome.textContent = `Bienvenido ${currentAccount.owner}`;
    updateUI();
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // quitar foco
  } else {
    console.log('Usuario o pin incorrectos');
  }
});
const logout = function () {
  labelWelcome.textContent = `Log in to get started`;
  containerApp.style.opacity = 0;
  clearInterval(timer);
};

btnTransfer.addEventListener('click', function (e) {
  console.log('hacer tansferencia');
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferUsername = inputTransferTo.value;
  const transferAccount = accounts.find(
    acc => acc.username === transferUsername
  );
  if (
    // la cantidad es positiva, la cuenta existe, hay dinero en la cuenta y la cuenta es distinta de la propia
    amount > 0 &&
    transferAccount &&
    currentAccount.balance >= amount &&
    transferAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    transferAccount.movements.push(amount);
    updateUI();
    accounts.forEach(acc => {
      console.log(acc.movements);
    });
  } else {
    console.log('error en la transferencia');
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(
    `cerrar cuenta de ${currentAccount.username} con pin ${currentAccount.pin}`
  );
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (username === currentAccount.username && pin === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === username);
    console.log(
      `Elemento a eliminar ${index}`,
      JSON.stringify(accounts[index])
    );
    // slice es no muta el array pero splice si
    accounts.splice(index, 1);
    inputClosePin.value = inputCloseUsername.value = '';
    containerApp.style.opacity = 0;
    console.log(accounts);
  } else {
    console.log('No se puede eliminar la cuenta');
  }
  updateUI();
});

// metodo some y metodo every
const movimientos = [-300, 200, 400];
const isDeposit = mov => mov > 0;
const anyDeposit = movimientos.some(isDeposit);
console.log(anyDeposit);
const allDeposits = movimientos.every(isDeposit);
console.log(allDeposits);

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const minDeposit = amount * 0.1;
  if (amount > 0 && currentAccount.movements.some(mov => mov > minDeposit)) {
    currentAccount.movements.push(amount);
    console.log(`Se ha hecho el deposito de ${amount}`);
    updateUI();
  } else {
    console.log('No se ha podido hacer el prestamo');
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

const arr = [1, 3, [5, 7], [9, 10], 3];
console.log(arr.flat(2));
const totalBalance = accounts
  .map(acc => acc.movements)
  .flat(2)
  .reduce((acc, cur) => acc + cur, 0);
console.log(totalBalance);

const totalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => acc + cur, 0);
console.log(totalBalance2);

function startLogOutTimer() {
  let time = 300;
  const printTime = time => {
    // min,sec -> darle un padding: si tengo 2m 5sec --->2:05 en vez de 2:5
    const min = Math.trunc(time / 60);
    // const sec = time % 60;
    // const sec = time % 60 < 10 ? '0' + (time % 60) : time % 60;
    // const sec = time % 60.toString().padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
  };
  const tick = () => {
    time -= 1;
    if (time === 0) logout();
    printTime(time);
  };
  const timer = setInterval(tick, 1000);
  printTime(time);
  return timer;
}
// const startLogOutTimer2 = function () {
//   let time = 301;
//   const printTime = sec => {};
//   const tick = () => {
//     time -= 1;
//     if (time === 0) {
//       clearInterval(timer);
//     }
//     const min = Math.trunc(time / 60);
//     const sec = time % 60;
//     labelTimer.textContent = `${min}:${sec}`;
//   };
//   tick();
//   const timer = setInterval(tick, 1000);
// };
// sort
