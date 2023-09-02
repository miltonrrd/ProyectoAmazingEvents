let events = data.events;
let fecha = data.currentDate;
let pastEvents = events.filter(evento => evento.date < fecha);
let upcomingEvents = events.filter(evento => evento.date > fecha);
let categorias = events.map(evento => evento.category);
let categoriasSinRepetidos = filtrarRepetidos(categorias);
let pagina = document.title;
let ubicacion;
switch (pagina) {
    case "Home":
        ubicacion = document.getElementById("cards");
        cargarElementos(events, ubicacion, "card");
        ubicacion = document.getElementById("checks");
        cargarElementos(categoriasSinRepetidos, ubicacion, "checkbox");
        escuchar();
        break;
    case "Upcoming Events":
        ubicacion = document.getElementById("cardsProximos");
        cargarElementos(upcomingEvents, ubicacion, "card");
        ubicacion = document.getElementById("checksProximos");
        cargarElementos(categoriasSinRepetidos, ubicacion, "checkbox");
        escuchar();
        break;
    case "Past Events":
        ubicacion = document.getElementById("cardsPasadas");
        cargarElementos(pastEvents, ubicacion, "card");
        ubicacion = document.getElementById("checksPasados");
        cargarElementos(categoriasSinRepetidos, ubicacion, "checkbox");
        escuchar();
        break;
    case "Details":
        let querySearch = location.search;
        let params = new URLSearchParams(querySearch);
        let id = params.get("id");
        generarDetailsCard(id);
        break;
}

//Logica Home-Upcoming-Past


function escuchar() {
    const checks = document.querySelector("form div.checks");
    checks.addEventListener("input", () => {
        let lugarDeLlamado = checks.ownerDocument.title;
        filtroController(lugarDeLlamado);
    });

    const form = document.forms[0];
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let lugarDeLlamado = form.ownerDocument.title;
        filtroController(lugarDeLlamado);
    })
}

function filtroController(ubicacion) { //Dependiendo desde que pagina se realizo el filtro, se envia como argumento el array correspondiente
    if (ubicacion === "Home") {
        filtroCruzado(events);
    } else if (ubicacion === "Upcoming Events") {
        filtroCruzado(upcomingEvents);
    } else {
        filtroCruzado(pastEvents)
    }
}

function filtroCruzado(eventos) {
    let eventosFiltradosPorCategoria = filtrarPorChecks(eventos);
    let eventosAMostrar = filtrarPorBuscador(eventosFiltradosPorCategoria);
    ubicacion = document.querySelector("main div.cards");
    if (eventosAMostrar.length == 0) {
        cargarElementos(eventosAMostrar, ubicacion, "card");
        cargarImagenSinResultados(ubicacion);
    } else {
        cargarElementos(eventosAMostrar, ubicacion, "card");
    }

}

function filtrarPorChecks(eventos) {
    let categoriasChecks = Array.from(checks.childNodes).filter(elemento => elemento.control.checked).map(inputCategoria => inputCategoria.innerText.toLowerCase());
    let eventosFiltrados = filtrarPorCategorias(eventos, categoriasChecks);
    if (eventosFiltrados.length === 0) {
        return eventos
    }
    return eventosFiltrados;
}

function filtrarPorBuscador(eventos) {
    const inputBuscador = document.querySelector("form div div input");
    let texto = inputBuscador.value.toLowerCase();
    if (texto === "") {
        return eventos;
    }
    let eventosFiltrados = [];
    for (evento of eventos) {
        let contenido = evento.name.toLowerCase().split(" ").some(palabra => palabra.includes(texto));
        if (contenido) {
            eventosFiltrados.push(evento);
        }
    }
    return eventosFiltrados;
}

function cargarElementos(array, ubi, tipo) {  // le envio por parametro el tipo para poder utilizar la misma funcion para cualquier elemento
    let elementoHtml = "";
    if (tipo === "card") {
        for (elemento of array) {
            elementoHtml += generarCard(elemento);
        }
    } else if (tipo === "checkbox") {
        for (elemento of array) {
            elementoHtml += generarCheckboxCategoria(elemento);
        }
    }
    ubi.innerHTML = elementoHtml;
}

function generarCard(evento) {
    let card = `<div class="card px-0 border-0" style="width: 18rem;">
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
                            <div class="col-5">
                                <h6>US$ ${evento.price}</h6>
                            </div>
                            <div class="col-3">
                                <a href= ./${document.title === "Home" ? "pages/" : ""}Details.html?id=${evento._id} class="btn btn-primary">Details</a>
                            </div>
                        </div>
                    </div> 
                </div>`
    return card;
}

function generarCheckboxCategoria(categoria) {
    let checkbox = `<label for="${categoria}" class="col-6 col-sm-4 col-lg-2 d-flex justify-content-start">
    <input type="checkbox" name="${categoria}" id="${categoria}" value="${categoria}">${categoria}</label>`
    return checkbox;
}

function cargarImagenSinResultados(ubicacion) {
    let contenedorImagen = document.createElement("figure");
    contenedorImagen.classList.add("d-flex");
    contenedorImagen.classList.add("justify-content-center");
    contenedorImagen.innerHTML = `<img src="${document.title === "Home" ? "./assets/images/nothing-found.png" : "../assets/images/nothing-found.png"}" class="card-img-top w-50 d-flex" alt="imagen no encontrado">`;
    ubicacion.appendChild(contenedorImagen);
}

function filtrarRepetidos(array) {
    let arraySinRepetidos = [];
    let indice = 0;
    for (elemento of array) {
        if (array.findIndex(elem => elem === elemento) === indice) {
            arraySinRepetidos.push(elemento);
        }
        indice++;
    }
    return arraySinRepetidos;
}

function filtrarPorCategorias(eventos, categorias) {
    let eventosFiltrados = [];
    for (evento of eventos) {
        let categoria = evento.category.toLowerCase();
        if (categorias.includes(categoria)) {
            eventosFiltrados.push(evento);
        }
    }
    return eventosFiltrados;
}


//Logica Details
function generarDetailsCard(id){
    let evento = events.find(evento => evento._id === id);
    let ubicacion = document.querySelector("main div");
    cardHtml=`<div class="card mb-3 col-10 px-0" style="max-width:600px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${evento.image}"
                            class="img-fluid rounded-start img-details w-100 h-100" alt="music_concert">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title text-center">${evento.name}</h5>
                            <ul>
                                <li>${evento.description}</li>
                                <li><span class="fw-bold">Date:</span> ${evento.date}</li>                          
                                <li><span class="fw-bold">Category:</span> ${evento.category}</li>
                                <li><span class="fw-bold">Place:</span> ${evento.place}</li>
                                <li><span class="fw-bold">Capacity:</span> ${evento.capacity}</li>
                                <li><span class="fw-bold">Assistance:</span> ${evento.assistance}</li>
                                <li><h6> Price: US$ ${evento.price}</h6></li>
                            </ul>
                        </div>
                    </div>
                </div>
              </div>`
    ubicacion.innerHTML = cardHtml;  
}

// let categorias = events.map(evento => evento.category).filter((categoria,index,self )=> {return self.indexOf(categoria) === index;});