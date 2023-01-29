//срабатывает функция loadlist() при полной загрузки всех елементов страницы.
document.addEventListener("DOMContentLoaded", (event) => loadlist());
let months = [
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

//Функция удаления всех li из ul
function removelist() {
    let ulArr = document.querySelectorAll("#lista-dati li");
    ulArr.forEach((item) => item.remove());
}

//Функция загрузки всех select опций.
function loadSelectOpt(years, selectedY) {
    let select = document.querySelector("#years");
    let optAll = document.createElement("option");
    optAll.value = "all";
    let optTextAll = document.createTextNode("ALL");
    optAll.appendChild(optTextAll);
    select.appendChild(optAll);
    years = years || [];
    years.forEach((item) => {
        if (item != selectedY || selectedY == undefined) {
            let opt = document.createElement("option");
            opt.value = item;
            let optText = document.createTextNode(item);
            opt.appendChild(optText);
            select.appendChild(opt);
        }
    });
}
//Функция выбора опции из select.
function selectedYear() {
    let ind = document.querySelector("#years").selectedIndex;
    let selectedY = document.querySelector("#years")[ind].innerText;
    removelist();
    removeSelecOpt(selectedY);
    loadlist(selectedY);
}
//Функция удаления опции из select.
function removeSelecOpt(selectedY) {
    let optArr = document.querySelectorAll("option");
    optArr.forEach((item) => {
        if (item.value != selectedY) {
            item.remove();
        }
    });
}
//Функция загрузки списка из localStorage
function loadlist(selectedY) {
    let budgetObj = {};
    let years;
    let months;
    let arrOfData = [];
    let yearcount;
    let year;
    let stringToLi;

    if (localStorage.getItem("budget")) {
        let budgetJSON = localStorage.getItem("budget");
        budgetObj = budgetJSON ? JSON.parse(budgetJSON) : {};

        years = Object.keys(budgetObj);
        yearcount = years.length;

        if (selectedY && selectedY != "ALL") {
            yearcount = 1;
        } else {
            selectedY = undefined;
        }
        for (let i = 0; i < yearcount; i++) {
            year = selectedY || years[i];
            months = Object.keys(budgetObj[year]);
            for (let i = 0; i < months.length; i++) {
                let month = months[i];
                let datas = Object.keys(budgetObj[year][month]);
                let values = Object.values(budgetObj[year][month]);
                stringToLi = `${year} ${month} ${datas[0]} ${values[0]} ${datas[1]} ${values[1]} ${datas[2]} ${values[2]}`;
                arrOfData.push(values);
                let txt = document.createTextNode(`${stringToLi}`);
                let li = document.createElement("li");
                li.appendChild(txt);
                ul.appendChild(li);
            }
        }
    } else {
        localStorage.setItem("budget", "");
    }
    loadSelectOpt(years, selectedY);
    loadchart(arrOfData, yearcount, selectedY);
}

//Функция сохранения данных в localStorage
function onSave() {
    //Input ANNO
    let annoInp = document.querySelector("#anno-i-d").value,
        //Input MESE
        meseInp = document.querySelector("#mese-i-d").value;
    //Input dati
    let datiMeseObj = {
        saldo: document.querySelector("#sald-i-d").value,
        stipendio: document.querySelector("#stip-i-d").value,
        spese: document.querySelector("#spz-i-d").value,
    };
    //Creazione del object dell'mese dall'input
    let mesiObj = {
        [meseInp]: datiMeseObj,
    };
    //Creazione dell object dell'anno  dall'input
    let anniObj = {
        [annoInp]: mesiObj,
    };
    //Get "BUDGET" from storage
    let budgetJSON = localStorage.getItem("budget");
    //Se non c'e, stringify object dell'anno dall'input
    if (budgetJSON == "") {
        localStorage.setItem("budget", JSON.stringify(anniObj));
    } else {
        //Se c'e, allora parse object from storage
        let budgetObj = JSON.parse(budgetJSON);
        //Se non c'e anno ,inserisci anno dall'input e dati del input
        if (budgetObj[annoInp] == undefined) {
            budgetObj[annoInp] = mesiObj;
            //Altrimenti inserisci dati nell'anno dal input
        } else {
            budgetObj[annoInp][meseInp] = datiMeseObj;
        }
        //Set ITEM to storage
        localStorage.setItem("budget", JSON.stringify(budgetObj));
    }

    removelist();
    loadlist();
}
function onDel() {
    let anno = document.querySelector("#anno-i-d").value;
    localStorage.removeItem(anno);

    removelist();
    loadlist();
}

function loadchart(arrOfData, yearcount, selectedY) {
    let namesMonths = months;
    if (selectedY == undefined) {
        for (let i = 1; i < yearcount; i++) {
            namesMonths = namesMonths.concat(months);
        }
    }

    let saldoData = [];
    let stipData = [];
    let speseData = [];

    arrOfData.forEach((item) => {
        saldoData.push(item[0]);
        stipData.push(item[1]);
        speseData.push(item[2]);
    });
    
    var ctx = document.getElementById("myChart").getContext("2d");
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: "line",

        // The data for our dataset
        data: {
            labels: namesMonths,
            datasets: [
                {
                    label: "saldo",
                    borderColor: "rgb(255, 99, 132)",
                    data: saldoData,
                },
                {
                    label: "stipendio",
                    borderColor: "rgb(255, 99, 255)",
                    data: stipData,
                },
                {
                    label: "spesa",
                    borderColor: "rgb(0, 255, 255)",
                    data: speseData,
                },
            ],
        },

        // Configuration options go here
        options: {},
    });
}
