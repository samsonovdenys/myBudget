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

//Функция загрузки списка из localStorage
function loadlist() {
    let budgetObj = {};
    if (localStorage.getItem("budget")) {
        let budgetJSON = localStorage.getItem("budget");
        budgetObj = budgetJSON ? JSON.parse(budgetJSON) : {};

        let years = Object.keys(budgetObj);

        let stringToLi;
        for (let i = 0; i < years.length; i++) {
            let year = years[i];
            let months = Object.keys(budgetObj[year]);
            for (let i = 0; i < months.length; i++) {
                let month = months[i];
                let datas = Object.keys(budgetObj[year][month]);
                let values = Object.values(budgetObj[year][month]);
                stringToLi = `${year} ${month} ${datas[0]} ${values[0]} ${datas[1]} ${values[1]} ${datas[2]} ${values[2]}`;
                let txt = document.createTextNode(`${stringToLi}`);
                let li = document.createElement("li");
                li.appendChild(txt);
                ul.appendChild(li);
            }
        }

        //Интеграция данных в DOM
    } else {
        localStorage.setItem("budget", "");
    }
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
