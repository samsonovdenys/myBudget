
//срабатывает функция loadlist() при полной загрузки всех елементов страницы.
document.addEventListener("DOMContentLoaded", (event) => onLoad());
let mesi = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
];
let ul = document.querySelector("#lista-dati");

//Функция загрузки списка из localStorage
function onLoad() {
    let budgetObject = getValuesFromStorage();
    let allYears = Object.keys(budgetObject);
    appendToList(allYears);
    loadYearsOpt(allYears);
    mediaYearValues(allYears);
    loadchart(allYears);
}
//Создание Option Select years
function loadYearsOpt(allYears) {
    allYears = allYears || [];
    let select = document.querySelector("#years");
    allYears.forEach((item) => {
        let opt = document.createElement("option");
        let optText = document.createTextNode(item);
        opt.appendChild(optText);
        select.appendChild(opt);
    });
}
//Функция выбора опции из select.
function selectedYear() {
    let selectedY = [];
    let ind = document.querySelector("#years").selectedIndex;
    selectedY.push(document.querySelector("#years")[ind].innerText);
    removelist();
    appendToList(selectedY);
    mediaYearValues(selectedY);
    loadchart(selectedY);
}
//Функция удаления опции из select.
function removeYearOpt() {
    let optArr = document.querySelectorAll("option");
    optArr.forEach((item) => {
        item.remove();
    });
}
//Функция сохранения данных в localStorage
function onSave() {
    let budget = getValuesFromStorage();
    let arrOfInputs = getValuesFromInput(); //anno,mese,values
    let anno = arrOfInputs[0];
    let mese = arrOfInputs[1];
    let values = arrOfInputs[2];
    let months = budget[anno] || [];
    months[mese - 1] = values; //months[mese]=values
    budget[anno] = months; //budget = {anno:months[mese]=values}
    //Set ITEM to storage
    localStorage.setItem("budget", JSON.stringify(budget));
    removeYearOpt();
    onLoad();
}
//Функция загрузки данных из localStorage
function getValuesFromStorage() {
    let budgetJSON = localStorage.getItem("budget")
        ? localStorage.getItem("budget")
        : "{}";
    let budgetObj = JSON.parse(budgetJSON);
    return budgetObj;
}
//Данные из инпутов
function getValuesFromInput() {
    let inputAnno = document.querySelector("#anno-i-d").value;
    let inputMese = document.querySelector("#mese-i-d").value;
    let inputSaldo = document.querySelector("#sald-i-d").value;
    let inputStip = document.querySelector("#stip-i-d").value;
    let inputSpese = document.querySelector("#spz-i-d").value;
    let inputValues = new MonthValues(inputSaldo, inputStip, inputSpese);
    let arrOfInputs = [inputAnno, inputMese, inputValues];
    return arrOfInputs;
}
//Создание конструктора объекта MonthValues
function MonthValues(saldo, stipendio, spese) {
    this.saldo = saldo;
    this.stipendio = stipendio;
    this.spese = spese;
}
//Создание списка Ul из stringToLi
function makeUl(selectedYearArr) {
    let yearsArr = selectedYearArr;
    let arrToReturn = [];
    let budgetObject = getValuesFromStorage();
    yearsArr.forEach(function (item) {
        arrToReturn.push(item);
        let allMonths = budgetObject[item];
        allMonths.forEach(function (item, index, arr) {
            if (item) {
                let { saldo = 0, stipendio = 0, spese = 0 } = item;
                let stringToLi = `${mesi[index]} saldo:${saldo} stipendio:${stipendio} spese:${spese}`;
                arrToReturn.push(stringToLi);
            }
        });
    });
    return arrToReturn;
}
//Вывод данных в UL
function appendToList(selectedYearArr) {
    removelist();
    let arrOfLi = makeUl(selectedYearArr) || [];
    arrOfLi.forEach((item) => {
        let liText = document.createTextNode(item);
        let liEl = document.createElement("li");
        liEl.appendChild(liText);
        ul.appendChild(liEl);
    });
}
//Функция удаления всех li из ul
function removelist() {
    let ulArr = document.querySelectorAll("#lista-dati li");
    ulArr.forEach((item) => item.remove());
}
function mediaYearValues(selectedYearArr) {
    let saldoSum = 0;
    let stipSum = 0;
    let speseSum = 0;
    let yearLength = 0;
    let budgetObject = getValuesFromStorage();
    selectedYearArr.forEach(function (item) {
        let allMonths = budgetObject[item];
        yearLength += allMonths.length;
        allMonths.forEach(function (item) {
            if (item) {
                let { saldo = 0, stipendio = 0, spese = 0 } = item;
                saldoSum += +saldo;
                stipSum += +stipendio;
                speseSum += +spese;
            }
        });
    });
    let saldoMedio = saldoSum / yearLength;
    let stipMedio = stipSum / yearLength;
    let speseMedio = speseSum / yearLength;
    insertMediumValues(saldoMedio, stipMedio, speseMedio);
}
function insertMediumValues(a, b, c) {
    document.querySelector("#sald-v-m").value = Math.round(a);
    document.querySelector("#stip-v-m").value = Math.round(b);
    document.querySelector("#spz-v-m").value = Math.round(c);
}
function uploadInputs() {
    let budgetObject = getValuesFromStorage();
    let inputAnno = document.querySelector("#anno-i-d").value;
    let inputMese = document.querySelector("#mese-i-d").value - 1;
    if (budgetObject[inputAnno][inputMese]) {
        document.querySelector("#sald-i-d").value =
            budgetObject[inputAnno][inputMese].saldo;
        document.querySelector("#stip-i-d").value =
            budgetObject[inputAnno][inputMese].stipendio;
        document.querySelector("#spz-i-d").value =
            budgetObject[inputAnno][inputMese].spese;
    } else {
        document.querySelector("#sald-i-d").value = 0;
        document.querySelector("#stip-i-d").value = 0;
        document.querySelector("#spz-i-d").value = 0;
    }
}
function loadchart(allYears) {
    let budgetObject = getValuesFromStorage();
    let months = mesi;
    let allMonths = [];

    for (let i = 0; i < allYears.length; i++) {
        months.splice(0, 1, ["gennaio", allYears[i]]);
        allMonths = allMonths.concat(months);
    }

    let saldoData = [];
    let stipData = [];
    let speseData = [];

    if (allYears.length == 1) {
        budgetObject[allYears[0]].forEach((item) => {
            saldoData.push(item.saldo);
            stipData.push(item.stipendio);
            speseData.push(item.spese);
        });
    } else {
        for (let key in budgetObject) {
            budgetObject[key].forEach((item) => {
                saldoData.push(item.saldo);
                console.log(item);
                stipData.push(item.stipendio);
                speseData.push(item.spese);
            });
        }
    }

    var ctx = document.getElementById("myChart").getContext("2d");
    if (window.bar != undefined) {
        window.bar.destroy();
    }

    window.bar = new Chart(ctx, {
        // The type of chart we want to create
        type: "line",

        // The data for our dataset
        data: {
            labels: allMonths,
            datasets: [
                {
                    label: "saldo",
                    borderColor: "rgb(121, 143, 224)",
                    data: saldoData,
                },
                {
                    label: "stipendio",
                    borderColor: "rgb(84, 191, 96)",
                    data: stipData,
                },
                {
                    label: "spesa",
                    borderColor: "rgb(226, 122, 122)",
                    data: speseData,
                },
            ],
        },

        // Configuration options go here
        options: {},
        
    }
    );

    var ctxx = document.getElementById("myChart2").getContext("2d");
    var a = new Chart(ctxx, {
        // The type of chart we want to create
        type: "bar",

        // The data for our dataset
        data: {
            labels: [2016,2017,2018,2019,2020,2021],
            datasets: [
                {
                    label: "saldo",
                    data: [7109,5643,7378,5017,977],
                    backgroundColor: "rgb(121, 143, 224)",
                },
                {
                    label: "stipendio",
                    data: [1334,1549,1570,1358,1765],
                    backgroundColor: "rgb(84, 191, 96)",
                },
                {
                    label: "spesa",
                    data: [1083,1510,1664,1426,1352],
                    backgroundColor: "rgb(226, 122, 122)",
                },
            ],
        },

        // Configuration options go here
        options: {},
    });
}
