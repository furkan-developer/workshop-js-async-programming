import { default as UI } from "./Modules/UI.js";
const ui = new UI();
const url = "https://restcountries.com/v3.1/";

ui.searchBtn.addEventListener("click", () => {
    let countryName = ui.takeCountryName();

    if (countryName !== "") {
        let request = makeRequest(`name/${countryName}`, "GET");

        request
            .then((xhr) => okCountry(xhr))
            .catch(err => console.log(err));
    }
});

function makeRequest(uri, method) {
    // Create the XHR request
    const xhr = new XMLHttpRequest();

    // Return it as a Promise
    return new Promise(function (resolve, reject) {
        // Setup our listener to process compeleted requests
        xhr.onreadystatechange = function () {

            // Only run if the request is complete
            if (xhr.readyState !== 4) return;

            // Process the response
            if (xhr.status >= 200 && xhr.status < 500) {
                // If successful
                resolve(xhr);
            } else {
                // If failed
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };

        // Setup our HTTP request
        xhr.open(method || 'GET', url + uri, true);

        // Send the request
        xhr.send();
    });
};

const okCountry = function (xhr) {

    if (xhr.status == 200) {
        if (ui.countryDetailsWrapper.classList.contains("invisible"))
            ui.countryDetailsWrapper.classList.remove("invisible");

        let countryInfo = JSON.parse(xhr.responseText);

        ui.countryDetailsContent.innerHTML = ui.renderCountryDetails(countryInfo[0])

        if (!countryInfo[0].hasOwnProperty("borders")) {
            ui.neighborsContent.innerHTML = `
                    <p>The country has not neighbor</p>
                `
        }

        else {
            // Perform request for corrosponding country's neighbors
            let request = makeRequest(`alpha?codes=${countryInfo[0].borders.toString()}`,"GET");

            request
                .then(xhr => {
                    if(xhr.status == 200) okNeighbors(xhr);
                })
                .catch(err => console.log(err));
        }
    }
    else if (xhr.status == 404)
        notFoundCountry();
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