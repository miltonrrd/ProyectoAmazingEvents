let eventos = data.events;

let ubicacion = document.getElementById("cards");


generarCardsYMostrarlas(eventos, ubicacion);


function generarCardsYMostrarlas(data, ubi) {
    let cardsHtml = "";
    for (evento of data) {
        cardsHtml += `<div class="card px-0 border-0" style="width: 18rem;">
                        <img src="${evento.image}" class="card-img-top w-100" alt="imagen ${evento.name}">
                        <div class="card-body row m-0">
                            <h5 class="card-title">${evento.name}</h5>
                            <p class="card-text">${evento.description}</p>
                            <ul>
                                <li>
                                    <p><span class="fw-bold">Date: </span>${evento.date}</p>
                                </li>
                                <li>
                                    <p><span class="fw-bold">Category: </span>${evento.category}</p>
                                </li>
                                <li>
                                    <p><span class="fw-bold">Place: </span>${evento.place}</p>
                                </li>
                            </ul>
                            <div class="row justify-content-evenly align-items-center">
                                <div class="col-4">
                                    <h6>${evento.price}</h6>
                                </div>
                                <div class="col-3">
                                    <a href="./pages/Details.html" class="btn btn-primary">Details</a>
                                </div>
                            </div>
                        </div> 
                      </div>`
    }
    ubi.innerHTML = cardsHtml;
}