import { default as UI } from "./Modules/UI.js";
const ui = new UI();
const url = "https://restcountries.com/v3.1/";

ui.searchBtn.addEventListener("click", async () => {
    let countryName = ui.takeCountryName();

    if (countryName !== "") {
        const response = await fetch(`${url}name/${countryName}`);

        if (!response.ok) {
            notFoundCountry();
            return;
        }

        let country = await response.json();
        okCountry(country);

        if (!country[0].hasOwnProperty("borders")) {
            ui.neighborsContent.innerHTML = `
                        <p>The country has not neighbor</p>
                    `
        }
        else {
            let response = await fetch(`${url}alpha?codes=${country[0].borders.toString()}`);
            let neighbors = await response.json();
            console.log(neighbors);
            okNeighbors(neighbors);
        }
    }
});

const okCountry = function (countryInfo) {

    if (ui.countryDetailsWrapper.classList.contains("invisible"))
        ui.countryDetailsWrapper.classList.remove("invisible");

    ui.countryDetailsContent.innerHTML = ui.renderCountryDetails(countryInfo[0])
}

const notFoundCountry = function () {
    alert("Not found country")

    if (!ui.countryDetailsWrapper.classList.contains("invisible"))
        ui.countryDetailsWrapper.classList.add("invisible");

    ui.countryDetailsContent.innerHTML = "";
    ui.neighborsContent.innerHTML = "";
}

const okNeighbors = function (neighborsInfo) {
    ui.neighborsContent.innerHTML = ui.renderNeighbors(neighborsInfo);
}