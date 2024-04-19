import { default as UI } from "./Modules/UI.js";
const ui = new UI();

ui.searchBtn.addEventListener("click", () => {
    let countryName = ui.takeCountryName();

    if (countryName !== "") {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", `https://restcountries.com/v3.1/name/${countryName}`);
        xhttp.send();

        // the callback function that will execute when response is ready.
        xhttp.onload = function () {
            operateBehavior(this, { "200": okCountry, "404": notFoundCountry });
        }
    }
});

const okCountry = function (xhr) {
    if (ui.countryDetailsWrapper.classList.contains("invisible"))
        ui.countryDetailsWrapper.classList.remove("invisible");

    let countryInfo = JSON.parse(xhr.responseText);

    ui.countryDetailsContent.innerHTML = ui.renderCountryDetails(countryInfo[0])

    if (!countryInfo[0].hasOwnProperty("borders")) {
        ui.neighborsContent.innerHTML = `
                    <p>The country has not neighbor</p>
                `
        return
    }

    // Perform request for corrosponding country's neighbors
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `https://restcountries.com/v3.1/alpha?codes=${countryInfo[0].borders.toString()}`);
    xhttp.send();

    // the callback function that will execute when response is ready.
    xhttp.onload = function () {
        operateBehavior(this, { "200": okNeighbors, "404": notFoundCountry })
    }
}

const notFoundCountry = function () {
    alert("Not found country")

    if (!ui.countryDetailsWrapper.classList.contains("invisible"))
        ui.countryDetailsWrapper.classList.add("invisible");

    ui.countryDetailsContent.innerHTML = "";
    ui.neighborsContent.innerHTML = "";
}

const okNeighbors = function (xhr) {
    let neighborsInfo = JSON.parse(xhr.responseText);

    ui.neighborsContent.innerHTML = ui.renderNeighbors(neighborsInfo);
}

function operateBehavior(xhr, statusBehaviors) {
    switch (xhr.status) {
        case 200:
            if (hasStatusBehavior(statusBehaviors, 200))
                statusBehaviors["200"](xhr);
            break;
        case 404:
            if (hasStatusBehavior(statusBehaviors, 400))
                statusBehaviors["404"]();
            break;
        default:
            throw "Not implemented exception for status code specified";
    }
}

function hasStatusBehavior(object, propertyName) {
    return object.hasOwnProperty(propertyName) ? true : () => { throw `Not implemented exception for ${propertyName} status code`; }
}