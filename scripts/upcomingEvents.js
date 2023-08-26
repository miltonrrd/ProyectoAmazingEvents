
function filtrarProximosEventos(array,fecha, ubi){
    cardsProximos ="";
    for(evento of array){
        if (evento.date > fecha){
            cardsProximos += `<div class="card px-0 border-0" style="width: 18rem;">
                                <img src="${evento.image}" class="card-img-top w-100" alt="imagen ${evento.name}">
                                <div class="card-body row m-0">
                                    <h5 class="card-title">${evento.name}</h5>
                                    <p class="card-text">${evento.description}</p>
                                    <div class="row justify-content-evenly align-items-center">
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
                                        <div class="col-4">
                                            <h6>${evento.price}</h6>
                                        </div>
                                        <div class="col-3">
                                            <a href="./Details.html" class="btn btn-primary">Details</a>
                                        </div>
                                    </div>
                                </div>
                              </div> `
        } 
    } 
    ubi.innerHTML =cardsProximos;
}

let fechaActual = data.currentDate;
let eventos = data.events;
let ubicacion = document.getElementById("cardsProximos");
filtrarProximosEventos(eventos,fechaActual,ubicacion);
