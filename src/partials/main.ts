import { users } from "./users";
import usersMurkup from "./users.hbs";
import fetchApi from "./fetchCurencyApi";

const counter = document.querySelector(".count") as HTMLElement
const userList = document.querySelector(".users__list") as HTMLElement
const formAccounts: any = document.querySelector(".form__accounts") as HTMLElement
const totalCount = document.getElementById("total-count") as HTMLElement
const creditCount = document.getElementById("credit-count") as HTMLElement

document.addEventListener("DOMContentLoaded", (event) => {
  setUsersToLS(users)
  render(users, "allAccount")
});
formAccounts.addEventListener("submit", choiceAccounts);

const localUsers: any = localStorage.getItem("users");
const parseLocalUsers:any[] = JSON.parse(localUsers);

function choiceAccounts(event: Event) {
  event.preventDefault();
  const curAccounts = formAccounts.bankUsers.value;
  const arrayAccounts:{}[] = [];

  parseLocalUsers.map((user) => {
    if (curAccounts == "activeAccount" && user.isActive === true) {
       return arrayAccounts.push(user);
    }
    if (curAccounts == "disabledAccount" && user.isActive === false) {
       return arrayAccounts.push(user);
    }
    if (curAccounts == "allAccount") {
      arrayAccounts.push(user);
    }
  });
   render(arrayAccounts, curAccounts);
}

function render(users: {}[], curAccounts:string) {
  if (localUsers === null) {
    return addUsersToMarkup(parseLocalUsers);
  }
  addUsersToMarkup(users);
  onTotalAmountOdDebt(users, curAccounts);
}


function setUsersToLS(clients:{}[]) {
  if (parseLocalUsers !== undefined) {
    return;
  }
  localStorage.setItem("users", JSON.stringify(clients));
}


function addUsersToMarkup(users: {}[]) {
  userList.innerHTML = "";
  counter.classList.add("show");
  users.map((user) => {
    const userMurkUp = usersMurkup({ user });
    return userList.insertAdjacentHTML("beforeend", userMurkUp);
  });
}


async function onTotalAmountOdDebt(clients:any[], curAccounts:string) {
  let totalFounds = 0;
  let amountOfDebt = 0;

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
  if (curAccounts === "allAccount") {    
    totalCount.innerHTML = `Общая сумма денег в банке: ${totalFounds} USD`;
    creditCount.innerHTML = `Общая сумма долга перед банком всех клиентов: ${amountOfDebt} USD`;
    return;
  }
  if (curAccounts === "activeAccount") {
    creditCount.innerHTML = `Общая сумма долга перед банком активных клиентов: ${amountOfDebt} USD`;
    return;
  }
  if (curAccounts === "disabledAccount") {
    creditCount.innerHTML = `Общая сумма долга перед банком не активных клиентов: ${amountOfDebt} USD`;
    return;
  }
}