function UI() {
    this.searchBtn = document.getElementById("search-btn");
    this.searchTxt = document.getElementById("search-txt");
    this.countryDetailsContent = document.querySelector("#country-details .card-body .row");
    this.neighborsContent = document.querySelector("#neighbors .row");
    this.countryDetailsWrapper = document.querySelector(".country-details__wrapper");
}

UI.prototype.takeCountryName = function () {
    return this.searchTxt.value.trim();
}

UI.prototype.renderCountryDetails = function ({ languages, flags, name, area, population, capital, currencies }) {
    currencies = Object.values(currencies)[0];
    return `
            <div class="col-4">
                <img src="${flags.png}" alt="" class="img-fluid">
            </div>
            <div class="col-8">
                <p class="h3">${name.common}</p>
                <hr>
                <div class="row">
                    <div class="col-3">Language:</div>
                    <div class="col-8">${Object.values(languages).toString()}</div>
                </div>
                <div class="row">
                    <div class="col-3">area:</div>
                    <div class="col-8">${area}</div>
                </div>
                <div class="row">
                    <div class="col-3">population:</div>
                    <div class="col-8">${(population / 1000000).toFixed(1)}M</div>
                </div>
                <div class="row">
                    <div class="col-3">capital:</div>
                    <div class="col-8">${capital.toString()}</div>
                </div>
                 <div class="row">
                    <div class="col-3">currencies:</div>
                    <div class="col-8">${currencies.name}<b> (${currencies.symbol})<b></div>
                </div>
            </div>`
}

UI.prototype.renderNeighbors = function (neighbors) {
    let content = "";
    neighbors.forEach(element => {
        content += createNeighbor(element);
    });
    return content;
}

function createNeighbor({ flags, name}) {
    return `
            <div class="col-2">
                <div class="card">
                    <img src="${flags.png}" alt="" class="card-img-top">
                    <div class="card-body">
                        <p class="h5">${name.common}</p>
                    </div>
                </div>
            </div>`
}


export default UI;