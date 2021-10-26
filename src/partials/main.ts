import { users } from "./users";
import usersMurkup from "./users.hbs";
import fetchApi from "./fetchCurencyApi";

const counter = document.querySelector(".count") as HTMLElement
const userList = document.querySelector(".users__list") as HTMLElement
const formAccounts:any = document.querySelector(".form__accounts") as HTMLElement
const totalCount = document.getElementById("total-count") as HTMLElement
const creditCount = document.getElementById("credit-count") as HTMLElement

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
});


document.addEventListener("DOMContentLoaded", (event)=> setUsersToLS(users))
document.addEventListener("DOMContentLoaded", (event) => render(users, "allAccount"));
formAccounts.addEventListener("submit", choiceAccounts);

const localUsers: any = localStorage.getItem("users");
const parseLocalUsers:any[] = JSON.parse(localUsers);

function choiceAccounts(event:any) {
  event.preventDefault();
  const curAccounts = formAccounts.bankUsers.value;
  const arrayAccounts:any[] = [];

  parseLocalUsers.map((user:any) => {
    if (curAccounts == "activeAccount") {
      if (user.isActive === true) {
        arrayAccounts.push(user);
      }
    }
    if (curAccounts == "disabledAccount") {
      if (user.isActive === false) {
        arrayAccounts.push(user);
      }
    }
    if (curAccounts == "allAccount") {
      arrayAccounts.push(user);
    }
  });
  render(arrayAccounts, curAccounts);
}
// Рендер
function render(users:any[], curAccounts:any) {
  if (localUsers === null) {
    return addUsersToMarkup(parseLocalUsers);
  }
  addUsersToMarkup(users);
  onTotalAmountOdDebt(users, curAccounts);
}

// Добавление юзеров в localStorage
function setUsersToLS(clients:any) {
  if (parseLocalUsers !== undefined) {
    console.log(parseLocalUsers);
    return;
  }
  localStorage.setItem("users", JSON.stringify(clients));
}

// Создание разметки по шаблону
function addUsersToMarkup(users:any[]) {
  userList.innerHTML = "";
  counter.classList.add("show");
  users.map((user) => {
    const userMurkUp = usersMurkup({ user });
    return userList.insertAdjacentHTML("beforeend", userMurkUp);
  });
}

// Подсчет общего количества денег в банке
async function onTotalAmountOdDebt(clients:any[], curAccounts:string) {
  let totalFounds = 0;
  let amountOfDebt = 0;
  if (curAccounts === "allAccount") {
    for (let client of clients) {
      const fetches = await fetchApi(client.currency);
      totalFounds += Math.floor(
        (client.account.debitAccount +
          client.account.creditAccount.personalFound +
          (client.account.creditAccount.creditFounds.limit -
            client.account.creditAccount.creditFounds.founds)) /
          fetches
      );
      amountOfDebt += Math.floor(
        (client.account.creditAccount.creditFounds.limit -
          client.account.creditAccount.creditFounds.founds) /
          fetches
      );
    }
    totalCount.innerHTML = `Общая сумма денег в банке: ${totalFounds} USD`;
    creditCount.innerHTML = `Общая сумма долга перед банком всех клиентов: ${amountOfDebt} USD`;
    return;
  }
  if (curAccounts === "activeAccount") {
    for (let client of clients) {
      const fetches = await fetchApi(client.currency);
      amountOfDebt += Math.floor(
        (client.account.creditAccount.creditFounds.limit -
          client.account.creditAccount.creditFounds.founds) /
          fetches
      );
    }
    creditCount.innerHTML = `Общая сумма долга перед банком активных клиентов: ${amountOfDebt} USD`;
    return;
  }
  if (curAccounts === "disabledAccount") {
    for (let client of clients) {
      const fetches = await fetchApi(client.currency);
      amountOfDebt += Math.floor(
        (client.account.creditAccount.creditFounds.limit -
          client.account.creditAccount.creditFounds.founds) /
          fetches
      );
    }
    creditCount.innerHTML = `Общая сумма долга перед банком не активных клиентов: ${amountOfDebt} USD`;
  }
}