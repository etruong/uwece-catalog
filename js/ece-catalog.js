'use strict';

// Hard-Coded Data
let capacitors = ["Ceramic Disc", "Electrolytic", "Monolithic Ceramic", "Polyester",
"Polystyrene", "Tantalum Bead", "Variable"];
let logicIC = ["CMOS", "ECL", "PLD", "TTL"];
let resistor = ["1%, 1/4W", "5%, 1/4W", "5%, 1/2W", "5%, 1W", "5%, 2W", "5%, 5W"];

let ECECategories = ["Capacitors", "Chokes and Inductors",
    "Crystals and Oscillators", "Diodes", "Diodes Zener", 
    "Lab Kits and Multimeters", "LED's", "Linear IC's",
    "Logic IC's", "Office Supplies", "Opto-electronics",
    "Prototyping Supplies, Batteries, Tools, ect", "Resistors",
    "Resistors DIP & SIP", "Resistors Trim Potentiometers",
    "SCR's, Triac's, Diac's, & Bridge Rectifiers", "Switches",
    "Test Leads", "Transistors (Bipolar, FETS, JFETS, MOSFETS, ect",
    "Voltage Regulators"];

function makeCategory (category) {
    let option = document.createElement ("li");
    option.textContent = category;
    option.classList.add ("list-group-item");
    
    option.addEventListener ("click", function () {
        fetchInfo (category);
    });

    option.addEventListener ("mouseover", function () {
        option.classList.add ("active");
    });
    option.addEventListener ("mouseleave", function () {
        option.classList.remove ("active");
    });
    document.querySelector ("#category-list").append (option);
}

ECECategories.forEach (makeCategory);

function fetchInfo (category) {
    document.querySelector ("#category-list").innerHTML = "";
    let data = Papa.parse("data/ece-catalog.csv", {
        download: true, 
        header: false,
        complete: (function (data) {
            document.querySelector ("#current-category").textContent = category;
            data.data.forEach (function (item) {
                let subcategory = false;
                if (item [1] == category) {
                    if (item [2] !== "") {
                        subcategory = true;
                        document.querySelector ("#subcategory").classList.remove ("d-none");
                    }
                    generateInfoList (item, subcategory);
                }
            });
        })
    });
}

function generateInfoList (itemInfo, subcategory) {
    let row = document.createElement ("tr");
    if (subcategory) {
        let cate = document.createElement ("td");
        cate.textContent = itemInfo [2];
        row.append (cate);
    }
    let part = document.createElement ("th");
    part.textContent = itemInfo[3];
    row.append (part);
    for (let i = 4; i <= 6; i++) {
        let info = document.createElement ("td");
        info.textContent = itemInfo[i];
        row.append (info);
    }
    let buy = document.createElement ("i");
    buy.classList.add ("fas");
    buy.classList.add ("fa-plus-square");
    row.append (buy);
    document.querySelector ("#item-content").append (row);
}

fetchInfo ("Capacitor");

