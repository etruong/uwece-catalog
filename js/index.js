'use strict';

let testData = [
{Bin: "", Category: "Resistors, Trim Potentiometers", Subcategory:"", Part:"yep", Cost:"$1.00", Description:"huh"},
    {Bin: "", Category: "Trim Potentiometers", Subcategory: ""},
    {Bin: "", Category: "Resistors", Subcategory: "hello"},
    {Bin: "", Category: "Resistors, Trim Potentiometers", Subcategory: ""},
    {Bin: "", Category: "Trim Potentiometers", Subcategory: ""}
];
let globalData = {data:[], query:"", categorySelected:"", mode:"query"};

// Start up page set-up
document.querySelector ('#search-btn').addEventListener ('click', clickedSearch);
window.addEventListener ('keypress', function (e) {
    if (e.keyCode == 13) {
        clickedSearch ();
    }
});
document.querySelector ('#chooseCategory').addEventListener ('change', function () {
    if (document.querySelector ('#chooseCategory').value != "none") {
        document.querySelector ('#search-home input').disabled = true;
        globalData.mode = "category";
    } else {
        document.querySelector ('#search-home input').disabled = false;
        globalData.mode = "query";
    }
});
document.querySelector ('#back-btn').addEventListener ('click', switchHomeView);
document.querySelector ('#search-home input').addEventListener ('input', function () {
    if (document.querySelector ('#search-home input').value != "") {
        document.querySelector ('#chooseCategory').disabled = true;
        globalData.mode = "query";
    } else {
        document.querySelector ('#chooseCategory').disabled = false;
        globalData.mode = "category";
    }
});

d3.csv("data/ece-catalog.csv")
    .then(function(data) {
        console.log (data);
        generateCategory (data);
        globalData.data = data;
    })
    .catch (function (error) {
        console.log (error);
    });

// generateCategory (testData);

function clickedSearch () {
    globalData.query = document.querySelector ('#search-home input').value;
    globalData.categorySelected = document.querySelector ('#chooseCategory').value;
    if (globalData.query == '' && globalData.categorySelected == 'none') {
        document.querySelector ('#alert').classList.remove ('d-none');
    } else if (globalData.mode == "category" && globalData.categorySelected == 'Resistors') {
        document.querySelector ('#alert').classList.add ('d-none');
        window.open('data/view-resistors.docx');
    } else {
        document.querySelector ('#alert').classList.add ('d-none');
        search();
    }
}

function generateCategory (data) {
    let categories = ["Resistors"];
    data.forEach ((item) => {
        if (categories.indexOf (item.Category) == -1) {
            categories.push (item.Category);
        }
    });
    categories.forEach ((category) => {
        let option = document.createElement ("option");
        option.textContent = category;
        option.value = category;
        document.querySelector ('#chooseCategory').append (option);
    });
}

function switchHomeView () {
    document.querySelector ('#search-home').classList.remove ('d-none');
    document.querySelector ('#search-results').classList.add ('d-none');
}

function switchView () {
    document.querySelector ('#search-home').classList.add ('d-none');
    document.querySelector ('#search-results').classList.remove ('d-none');
    document.querySelector ('#search-home input').value = "";
    document.querySelector ('#chooseCategory').value = "none";
    document.querySelector ('#search-home input').disabled = false;
    document.querySelector ('#chooseCategory').disabled = false;
    if (globalData.mode == "query") {
        document.querySelector ('#search-results h2').textContent = "Search Results for: " + globalData.query;
    } else {
        document.querySelector ('#search-results h2').textContent = globalData.categorySelected;
    }
}

function search () {
    switchView ();
    let filteredData = globalData.data;
    if (globalData.mode == "query") {
        filteredData = globalData.data.filter ((item) => {
            let check = Object.keys(item).map ( (key) => {
                return (item [key].toLowerCase().indexOf (globalData.query.toLowerCase()) >= 0);
            });

            return (check.indexOf (true) >= 0);
        });
    } else {
        filteredData = globalData.data.filter ((item) => {
            return (item.Category == globalData.categorySelected);
        });
    }
    document.querySelector ('#search-results table').innerHTML = "";
    if (filteredData.length != 0) {
        generateResults (filteredData);
    } else {
        generateError ();
    }
}

function generateError () {
    let error = document.createElement ('p');
    error.textContent = 'No Results Found!';
    error.classList.add ('alert', 'alert-danger');
    document.querySelector ('#search-results table').append (error);
}

function generateResults (data) {
    generateHeader ();
    let tableBody = document.createElement ('tbody');
    data.forEach ((item) => {
        tableBody.append (generateRow (item));
    });
    document.querySelector ('#search-results table').append (tableBody);
}

function generateHeader () {
    let headerContainer = document.createElement ('tr');
    let header = ['Part # / ID', 'Description', 'Cost'];
    if (globalData.mode == "query") {
        header.unshift ("Category");
    }
    header.forEach ((head) => {
        let heading = document.createElement ('th');
        heading.textContent = head;
        headerContainer.append (heading);
    });
    document.querySelector ('#search-results table').append (headerContainer);
}

function generateRow (data) {
    let row = document.createElement ('tr');

    if (globalData.mode == "query") {
        let category = document.createElement ('td');
        category.textContent = data.Category;
        row.append (category);
    }

    let id = document.createElement ('td');
    id.textContent = data.Part;
    row.append (id);

    let description = document.createElement ('td');
    description.textContent = data.Description;
    row.append (description);

    let cost = document.createElement ('td');
    cost.textContent = data.Cost;
    row.append (cost);
    
    return (row);
}


