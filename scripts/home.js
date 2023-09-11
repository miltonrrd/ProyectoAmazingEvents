let events = [];
let fecha;
let pastEvents;
let upcomingEvents;
let categorias;
let categoriasSinRepetidos;
const pagina = document.title;
let url = "https://mindhub-xj03.onrender.com/api/amazing";
let ubicacion;

fetch(url).then(response => response.json())
    .then(data => {
        cargarDatos(data);
        actualizarPagina();
    })
    .catch(error => {
        console.log(error)
    })

function actualizarPagina() {
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
        case "Stats":
            generarTablasStats();
            break;
        case "Contact":
            mostrarAlerta();
            break;

    }
}

function cargarDatos(data) {
    events = data.events;
    fecha = data.currentDate;
    pastEvents = events.filter(evento => evento.date < fecha);
    upcomingEvents = events.filter(evento => evento.date > fecha);
    categorias = events.map(evento => evento.category);
    categoriasSinRepetidos = filtrarRepetidos(categorias);
}

//Logica Home-Upcoming-Past

function escuchar() {
    const checks = document.querySelector("form div.checks");
    checks.addEventListener("input", () => {
        filtroController(pagina);
    })
    const form = document.forms[0];
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        filtroController(pagina);
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
    let checks = document.querySelector("form div.checks");
    let categoriasChecks = Array.from(checks.childNodes).filter(elemento => elemento.control.checked).map(inputCategoria => inputCategoria.innerText.toLowerCase());
    let eventosFiltrados = filtrarPorCategorias(eventos, categoriasChecks);
    if ((eventosFiltrados.length === 0) && (categoriasChecks.length===0)) {
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
    contenedorImagen.classList.add("flex-column");
    contenedorImagen.classList.add("align-items-center")
    contenedorImagen.classList.add("justify-content-center");
    contenedorImagen.innerHTML = `<h2 class="text-body-secondary text-center">Search not found.</h2>
                                  <img src="${document.title === "Home" ? "./assets/images/nothing-found.png" : "../assets/images/nothing-found.png"}" class="card-img-top w-50 d-flex" alt="imagen no encontrado">`;
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
function generarDetailsCard(id) {
    let evento = events.find(evento => evento._id == id);
    let ubicacion = document.querySelector("main div");
    cardHtml = `<div class="card col-10 px-0 style-card" style="max-width:100vw">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${evento.image}"
                            class="img-fluid rounded-start img-details w-100 h-100" alt="music_concert">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title text-center titulo-card ">${evento.name}</h5>
                            <ul>
                                <li>${evento.description}</li>
                                <li><span class="fw-bold">Date:</span> ${evento.date}</li>                          
                                <li><span class="fw-bold">Category:</span> ${evento.category}</li>
                                <li><span class="fw-bold">Place:</span> ${evento.place}</li>
                                <li><span class="fw-bold">Capacity:</span> ${evento.capacity}</li>
                                <li><span class="fw-bold">${evento.date >= fecha ? `Estimate:</span> ${evento.estimate}` : `Assistance:</span> ${evento.assistance}`}</li>
                                <li><h6> Price: US$ ${evento.price}</h6></li>
                            </ul>
                        </div>
                    </div>
                </div>
              </div>`
    ubicacion.innerHTML = cardHtml;
}

// Logica stats

function calcularGananciaYPorcentajeAsistencia(array) { //le coloco un nueva propiedad a cada evento, que almacene el porcentaje de asistencia
    array.forEach(evento => {
        let porcentajeAsistencia = evento.date >= fecha ? (evento.estimate * 100) / evento.capacity : (evento.assistance * 100) / evento.capacity;
        let ganancia = evento.date >= fecha ? evento.estimate * evento.price : evento.assistance * evento.price;
        evento.percentageAttendance = porcentajeAsistencia;
        evento.revenue = ganancia;
    });
}

function calcularEstadisticasPorCategoria(array) {
    let estadisiticasPorCategoria = [];
    categoriasSinRepetidos.forEach(categoria => {
        let sumatoriaPorcentajeAsistencia = 0;
        let cantidad = 0;
        let sumatoriaGanancia = 0;
        array.filter(evento => evento.category === categoria).forEach(evento => {
            sumatoriaPorcentajeAsistencia += evento.percentageAttendance;
            cantidad++;
            sumatoriaGanancia += evento.revenue;
        })
        let cat = {
            name: categoria,
            revenue: sumatoriaGanancia,
            percentageAttendance: sumatoriaPorcentajeAsistencia / cantidad
        }
        estadisiticasPorCategoria.push(cat);
    })
    return estadisiticasPorCategoria;
}

function cargarEstadisticas(array, ubicacion) {
    let filasHtml = "";
    array.forEach(categoria => { filasHtml += generarFila(categoria) });
    ubicacion.innerHTML = filasHtml;
}

function generarFila(categoria) {
    if (categoria.revenue === 0) {
        return "";
    }
    let fila = `<tr>
                    <td>${categoria.name}</td>
                    <td>$${categoria.revenue.toLocaleString()}</td>
                    <td>${categoria.percentageAttendance.toFixed(2)}%</td>
               </tr>`;
    return fila
}

function buscarHighestAttendance(array) {
    let eventoBuscado = array[0];
    array.forEach(evento => { evento.percentageAttendance > eventoBuscado.percentageAttendance ? eventoBuscado = evento : eventoBuscado; });
    return eventoBuscado;
}
function buscarLowestAttendance(array) {
    let eventoBuscado = array[0];
    array.forEach(evento => { evento.percentageAttendance < eventoBuscado.percentageAttendance ? eventoBuscado = evento : eventoBuscado; });
    return eventoBuscado;
}
function buscarLargerCapacity(array) {
    let eventoBuscado = array[0];
    array.forEach(evento => { evento.capacity > eventoBuscado.capacity ? eventoBuscado = evento : eventoBuscado; });
    return eventoBuscado;
}
function generarBotonAEventoDestacado(evento) {
    return `<a class="text-decoration-none"href="./Details.html?id=${evento._id}"><span class="bg-black text-white border border-danger rounded ">${evento.name}</span></a>`;
}

function cargarEventosDestacados(mayorAsistencia, menorAsistencia, mayorCapacidad) {
    let ubicacion = document.getElementById("HighestAttendance");
    ubicacion.innerHTML = generarBotonAEventoDestacado(mayorAsistencia);
    ubicacion = document.getElementById("LowerAttendance");
    ubicacion.innerHTML = generarBotonAEventoDestacado(menorAsistencia);
    ubicacion = document.getElementById("LargerCapacity");
    ubicacion.innerHTML = generarBotonAEventoDestacado(mayorCapacidad);
}

function generarTablasStats() {
    calcularGananciaYPorcentajeAsistencia(events);
    let pastStatsCategories = calcularEstadisticasPorCategoria(pastEvents);
    let upcomingStatsCategories = calcularEstadisticasPorCategoria(upcomingEvents);
    let ubicacion = document.getElementById("tablaUpcoming");
    let highestAttendance = buscarHighestAttendance(pastEvents);
    let lowestAttendance = buscarLowestAttendance(pastEvents);
    let largerCapacity = buscarLargerCapacity(events);
    cargarEventosDestacados(highestAttendance, lowestAttendance, largerCapacity);
    cargarEstadisticas(upcomingStatsCategories, ubicacion);
    ubicacion = document.getElementById("tablaPast");
    cargarEstadisticas(pastStatsCategories, ubicacion);
}

//Logica Contact

function mostrarAlerta() {
    const submit = document.forms[0];
    submit.addEventListener("submit", (e) => {
        e.preventDefault();
        swal("Sent succesfully!", "We will contact you shortly!", "success");
        let inputs = Array.from(document.querySelectorAll("form div div input"));
        inputs.forEach(elemento => {elemento.value = "" });
    })

}