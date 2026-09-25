import { ApiClient } from "./client.js";

function timeAgo(rawDate){
    const date = new Date(rawDate);

    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000; 

    const diffInMiliseconds = date.getTime() - new Date().getTime();
    const hours = Math.round(Math.abs(diffInMiliseconds / oneHour));
    const days = Math.round(Math.abs(diffInMiliseconds / oneDay));

    if (days > 0){
        return days == 1 ? `${days} dia` : `${days} dias`;
    }

    return hours == 1 ? `${hours} hora` : `${hours} horas`;

}

const alertSection = document.querySelector("#incidencias");
const estados = ["Sin Resolver", "En Proceso", "Resuelto"];

let template = document.querySelector("#card");

try{
    
    const incidencias = await ApiClient.obtenerAlertas();
    incidencias.forEach((item) => {
        let t = document.importNode(template.content, true);

        let estadoIndex = parseInt(item.idEstado-1);

        t.querySelector(".idCard").textContent = `#INC-${item.id}`;
        t.querySelector(".titulo").textContent = item.titulo;

        let estado = t.querySelector(".estado");
        estado.textContent = estados[estadoIndex];

        switch(estadoIndex){
            case 0: estado.classList.add("bg-primary-container", "animate-pulse"); break;
            case 1: estado.classList.add("bg-secondary"); break;
            case 2: estado.classList.add("bg-emerald-700"); break;
        }

        t.querySelector(".categoria").textContent = item.categoria.nombre;
        t.querySelector(".direccion").textContent = item.direccion;
        t.querySelector(".tiempoRegistrado").textContent = `Registrado hace ${timeAgo(item.fechaCreacion)}`;

        alertSection.appendChild(t);
    }
    )
}
catch(err){
    alert("Error: " + err);
}