const { createApp } = Vue

const paginaActual = document.title;


const app = createApp({
    data() {
        return {
            events: [],
            eventsBackup: [],
            pastEvents: [],
            upcomingEvents: [],
            categoriasSinRepetidos: [],
            fecha: "",
            eventoDetails: "",
            categoriasSeleccionadas: [],
            categoriasBackup: [],
            texto: [],
            highestAttendance: "",
            lowestAttendance: "",
            largerCapacity: "",
            pastStatsCategories: [],
            upcomingStatsCategories: []
        }
    },
    mounted() {

    },
    created() {
        this.traerData()
    },
    methods: {
        traerData() {
            fetch("https://mindhub-xj03.onrender.com/api/amazing").then(response => response.json())
                .then(data => {
                    this.cargarDatos(data);
                    // actualizarPagina();
                })
                .catch(error => {
                    console.log(error)
                })
        },

        cargarDatos(data) {
            this.fecha = data.currentDate;
            let categorias = this.eventsBackup.map(evento => evento.category);
            this.categoriasSinRepetidos = this.filtrarRepetidos(categorias);
            if (paginaActual === "Upcoming Events") {
                this.events = data.events.filter(evento => evento.date > this.fecha);
                this.eventsBackup = data.events.filter(evento => evento.date > this.fecha);
            } else if (paginaActual === "Past Events") {
                this.events = data.events.filter(evento => evento.date < this.fecha);
                this.eventsBackup = data.events.filter(evento => evento.date < this.fecha);
            } else if (paginaActual === "Details") {
                this.events = data.events;
                this.cargarSeachParams();
            } else if (paginaActual === "Stats") {
                this.events = data.events;
                this.pastEvents = data.events.filter(evento => evento.date < this.fecha);
                this.upcomingEvents = data.events.filter(evento => evento.date > this.fecha);
                let categorias = this.events.map(evento => evento.category);
                this.categoriasSinRepetidos = this.filtrarRepetidos(categorias);
                this.generarTablasStats();
            } else {
                this.events = data.events;
                this.eventsBackup = data.events;
            }
            let categ = this.eventsBackup.map(evento => evento.category);
            this.categoriasSinRepetidos = this.filtrarRepetidos(categ);
        },

        filtrarRepetidos(array) {
            let arraySinRepetidos = [];
            let indice = 0;
            for (elemento of array) {
                if (array.findIndex(elem => elem === elemento) === indice) {
                    arraySinRepetidos.push(elemento);
                }
                indice++;
            }
            return arraySinRepetidos;
        },

        cargarSeachParams() {
            let querySearch = location.search;
            let params = new URLSearchParams(querySearch);
            let id = params.get("id");
            this.eventoDetails = this.events.find(evento => evento._id == id);
        },

        generarTablasStats() {
            this.calcularGananciaYPorcentajeAsistencia();
            this.pastStatsCategories = this.calcularEstadisticasPorCategoria(this.pastEvents);
            this.upcomingStatsCategories = this.calcularEstadisticasPorCategoria(this.upcomingEvents);
            this.buscarHighestAttendance();
            this.buscarLowestAttendance();
            this.buscarLargerCapacity();
        },

        calcularGananciaYPorcentajeAsistencia() { //le coloco un nueva propiedad a cada evento, que almacene el porcentaje de asistencia
            this.events.forEach(evento => {
                let porcentajeAsistencia = evento.date >= this.fecha ? (evento.estimate * 100) / evento.capacity : (evento.assistance * 100) / evento.capacity;
                let ganancia = evento.date >= this.fecha ? evento.estimate * evento.price : evento.assistance * evento.price;
                evento.percentageAttendance = porcentajeAsistencia;
                evento.revenue = ganancia;
            });
        },

        buscarHighestAttendance() {
            let eventoBuscado = this.pastEvents[0];
            this.pastEvents.forEach(evento => { evento.percentageAttendance > eventoBuscado.percentageAttendance ? eventoBuscado = evento : eventoBuscado; });
            this.highestAttendance = eventoBuscado;
        },

        buscarLowestAttendance() {
            let eventoBuscado = this.pastEvents[0];
            this.pastEvents.forEach(evento => { evento.percentageAttendance < eventoBuscado.percentageAttendance ? eventoBuscado = evento : eventoBuscado; });
            this.lowestAttendance = eventoBuscado;
        },

        buscarLargerCapacity() {
            let eventoBuscado = this.events[0];
            this.events.forEach(evento => { evento.capacity > eventoBuscado.capacity ? eventoBuscado = evento : eventoBuscado; });
            this.largerCapacity = eventoBuscado;
        },

        calcularEstadisticasPorCategoria(array) {
            let estadisiticasPorCategoria = [];
            this.categoriasSinRepetidos.forEach(categoria => {
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
        },

        mostrarAlerta(event) {
            event.preventDefault();
            swal("Sent succesfully!", "We will contact you shortly!", "success");
            let inputs = Array.from(document.querySelectorAll("form div div input"));
            inputs.forEach(elemento => { elemento.value = "" });
        }
    },

    computed: {

        filtroDoble() {
            let aux = this.eventsBackup.filter(elemento => elemento.name.toLowerCase().includes(this.texto));
            if (this.categoriasSeleccionadas.length === 0) {
                this.events = aux;
            } else {
                this.events = aux.filter(elemento => this.categoriasSeleccionadas.includes(elemento.category));
            }
        }
    }

});

switch (paginaActual) {
    case 'Home':
        app.mount('#appHome');
        break;
    case 'Upcoming Events':
        app.mount('#appUpcoming');
        break;
    case 'Past Events':
        app.mount('#appPast');
        break;
    case 'Contact':
        app.mount('#appContact');
        break;
    case 'Stats':
        app.mount('#appStats');
        break;
    case 'Details':
        app.mount('#appDetails');
        break;
}


