'use strict';

// Hard-Coded Data
let capacitors = ["Ceramic Disc", "Electrolytic", "Monolithic Ceramic", "Polyester",
"Polystyrene", "Tantalum Bead", "Variable"];
let logicIC = ["CMOS", "ECL", "PLD", "TTL"];
let resistor = ["1%, 1/4W", "5%, 1/4W", "5%, 1/2W", "5%, 1W", "5%, 2W", "5%, 5W"];

let ECECategories = ["Capacitor", "Chokes and Inductors",
    "Crystals and Oscillators", "Diodes", "Diodes Zener", 
    "Lab Kits and Multimeters", "LED's", "Linear IC's",
    "Logic IC's", "Office Supplies", "Opto-electronics",
    "Prototyping Supplies, Batteries, Tools, ect", "Resistors",
    "Resistors DIP & SIP", "Resistors Trim Potentiometers",
    "SCR's, Triac's, Diac's, & Bridge Rectifiers", "Switches",
    "Test Leads", "Transistors (Bipolar, FETS, JFETS, MOSFETS, ect",
    "Voltage Regulators"];

let cartContent = [];
let cartContentAmount = 0;

// Set up
ECECategories.forEach (makeCategory);
document.querySelector ("#show").addEventListener ("click", function () {
    document.querySelector ("#category-list").innerHTML = "";
    ECECategories.forEach (makeCategory);
});

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

function fetchInfo (category) {
    document.querySelector ("#category-list").innerHTML = "";
    let data = Papa.parse("data/ece-catalog.csv", {
        download: true, 
        header: false,
        complete: (function (data) {
            document.querySelector ("#locator").classList.remove ("d-none");
            let currentCategory = document.querySelectorAll (".current-category");
            for (let i = 0; i < currentCategory.length; i++) {
                currentCategory.textContent = category;
            }
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
    for (let i = 4; i <= 5; i++) {
        let info = document.createElement ("td");
        info.textContent = itemInfo[i];
        row.append (info);
    }
    let buyContainer = document.createElement ("td");
    let buy = document.createElement ("i");
    buy.classList.add ("fas");
    buy.classList.add ("fa-plus-square");
    buy.addEventListener ("click", function () {
        let boughtItem = {id:itemInfo[3], description:itemInfo[4], cost:itemInfo[5]};
        cartContent.push (boughtItem);
        cartContentAmount++;
        document.querySelector ("#cart-amount").textContent = " (" + cartContentAmount + ")";
    });
    buyContainer.append (buy);
    row.append (buyContainer);
    document.querySelector ("#item-content").append (row);
}



