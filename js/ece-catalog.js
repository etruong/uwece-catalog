'use strict';

// Hard-Coded Data
let ECECategories = ["Capacitor", "Chokes and Inductors",
    "Crystals and Oscillators", "Diodes", "Diodes Zener", 
    "Lab Kits and Multimeters", "LED's", "Linear IC's",
    "Logic IC's", "Office Supplies", "Opto-electronics",
    "Prototyping Supplies, Batteries, Tools, ect", "Resistors",
    "Resistors, DIP, & SIP", "Resistors, Trim Potentiometers",
    "SCR's, Triac's, Diac's, & Bridge Rectifiers", "Switches",
    "Test Leads", "Transistors (Bipolar, FETS, JFETS, MOSFETS, ect)",
    "Voltage Regulators"];

let cartContent = {};
let cartContentAmount = 0;
let currentCat = "";

// Set up
ECECategories.forEach (makeCategory);
document.querySelector ("#back-btn").addEventListener ("click", function () {
    document.querySelector ("#category-list").innerHTML = "";
    ECECategories.forEach (makeCategory);
    document.querySelector ("#back-btn").classList.add ("d-none");
    document.querySelector ("#main-items").classList.add ("d-none");
    document.querySelector ("tbody").innerHTML = "";
});
document.querySelector ("#cart-btn").addEventListener ("click", function () {
    document.querySelector ("#catalog").classList.add ("col-md-8");
    document.querySelector ("#cart-container tbody").innerHTML = "";
    populateCart ();
    document.querySelector ("#cart-container").classList.remove ("d-none");
});

document.querySelector ("#cart-container btn").addEventListener ("click", function () {
    document.querySelector ("#catalog").classList.remove ("col-md-8");
});

// functions
function populateCart () {
    
}

function makeCategory (category) {
    let option = document.createElement ("li");
    option.textContent = category;
    option.classList.add ("list-group-item");
    
    option.addEventListener ("click", function () {
        document.querySelector ("#main-items img").classList.remove ("d-none");
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
    currentCat = category;
    document.querySelector ("#category-list").innerHTML = "";
    let data = Papa.parse("data/ece-catalog.csv", {
        download: true, 
        header: false,
        complete: (function (data) {
            document.querySelector ("#back-btn").classList.remove ("d-none");
            document.querySelector ("#main-items").classList.remove ("d-none");
            let currentCategory = document.querySelectorAll (".current-category");
            for (let i = 0; i < currentCategory.length; i++) {
                currentCategory[i].textContent = category;
            }
            data.data.forEach (function (item) {
                let subcategory = false;
                if (item [1].toLowerCase() == category.toLowerCase()) {
                    if (item [2] !== "") {
                        subcategory = true;
                        document.querySelector ("#subcategory").classList.remove ("d-none");
                    }
                    generateInfoList (item, subcategory);
                }
            });
            document.querySelector ("#main-items img").classList.add ("d-none");
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
    buy.addEventListener ("click", addToCart);
    buyContainer.append (buy);
    row.append (buyContainer);
    document.querySelector ("#item-content").append (row);
}

function addToCart () {
    let boughtItem = {category:currentCat, subcat:itemInfo[2], id:itemInfo[3], description:itemInfo[4], cost:itemInfo[5], amount:1};
    if (!checkCart(boughtItem)) {
        cartContent[currentCat].push (boughtItem);
    }
    cartContentAmount++;
    document.querySelector ("#cart-amount").textContent = " (" + cartContentAmount + ")";
}

function checkCart (boughtItem) {
    for (let i = 0; i < cartContent[boughtItem.category].length; i++) {
        if (cartContent[i].id == boughtItem.id) {
            cartContent[i].amount = cartContent[i].amount++;
            return (true);
        }
    }
    return (false);
}


