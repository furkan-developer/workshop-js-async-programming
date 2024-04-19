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
            if (this.status == 200) {
                if(ui.countryDetailsWrapper.classList.contains("invisible"))
                    ui.countryDetailsWrapper.classList.remove("invisible");

                let countryInfo = JSON.parse(this.responseText);
                
                ui.countryDetailsContent.innerHTML = ui.renderCountryDetails(countryInfo[0])
                
                console.log(countryInfo[0]);

                if(!countryInfo[0].hasOwnProperty("borders")) {
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
                    if (this.status == 200) {
                        let neighborsInfo = JSON.parse(this.responseText);

                        ui.neighborsContent.innerHTML = ui.renderNeighbors(neighborsInfo);
                    }
                    else throw "Request is not success";
                }
            }
            else if (this.status == 404) {
                alert("Not found country")
                
                if(!ui.countryDetailsWrapper.classList.contains("invisible"))
                    ui.countryDetailsWrapper.classList.add("invisible");

                ui.countryDetailsContent.innerHTML = "";
                ui.neighborsContent.innerHTML = "";
            }
            else {
                throw "Request is not success";
            }
        }
    }
});