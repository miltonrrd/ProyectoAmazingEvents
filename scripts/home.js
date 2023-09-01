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
        break;
    case "Upcoming Events":
        ubicacion = document.getElementById("cardsProximos");
        cargarElementos(upcomingEvents, ubicacion, "card");
        ubicacion = document.getElementById("checksProximos");
        cargarElementos(categoriasSinRepetidos, ubicacion, "checkbox");
        break;
    case "Past Events":
        ubicacion = document.getElementById("cardsPasadas");
        cargarElementos(pastEvents, ubicacion, "card");
        ubicacion = document.getElementById("checksPasados");
        cargarElementos(categoriasSinRepetidos, ubicacion, "checkbox");
        break;
}

const checks = document.querySelector("form div.checks");
checks.addEventListener("input", () => {
    console.log([checks]);
    let lugarDeLlamado = checks.ownerDocument.title;
    filtroController(lugarDeLlamado); 
});

const form = document.forms[0];
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let lugarDeLlamado = form.ownerDocument.title;
    filtroController(lugarDeLlamado);
})

function filtroController(ubicacion){ //Dependiendo desde que pagina se realizo el filtro, se envia como argumento el array correspondiente
    if (ubicacion === "Home"){
        filtroCruzado(events);
    }else if(ubicacion === "Upcoming Events"){
        filtroCruzado(upcomingEvents);
    }else{
        filtroCruzado(pastEvents)
    }
}

function filtroCruzado(eventos){
    let eventosFiltradosPorCategoria = filtrarPorChecks(eventos);
    let eventosAMostrar = filtrarPorBuscador(eventosFiltradosPorCategoria);
    ubicacion = document.querySelector("main div.cards")
    cargarElementos(eventosAMostrar, ubicacion, "card"); 
}

function filtrarPorChecks(eventos) {
    let categoriasChecks = Array.from(checks.childNodes).filter(elemento => elemento.control.checked).map(inputCategoria => inputCategoria.innerText.toLowerCase());
    let eventosFiltrados = filtrarPorCategorias(eventos, categoriasChecks);
    if (eventosFiltrados.length === 0){
        return eventos
    }
    return eventosFiltrados;
}

function filtrarPorBuscador(eventos) {
    const inputBuscador = document.querySelector("form div div input");
    let texto = inputBuscador.value.toLowerCase();
    if (texto === ""){
        return eventos;
    }
    let eventosFiltrados = [];
    for (evento of eventos) {
        let contenido= evento.name.toLowerCase().split(" ").some(palabra => palabra.includes(texto));
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
                            <div class="col-4">
                                <h6>${evento.price}</h6>
                            </div>
                            <div class="col-3">
                                <a href="./pages/Details.html" class="btn btn-primary">Details</a>
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




// let categorias = events.map(evento => evento.category).filter((categoria,index,self )=> {return self.indexOf(categoria) === index;});