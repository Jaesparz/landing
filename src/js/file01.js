"use strict";

(() => {
    alert("¡Bienvenido a la página!");
    console.log("Mensaje de bienvenida mostrado.");
})();

/**
 * Muestra el toast agregando la clase "md:block" al elemento con id "toast-interactive".
 */

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};


/**
 * Agrega un listener al elemento con id "demo" que al hacer clic abre un video de YouTube en una nueva pestaña.
 */

const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

(() => {
    showToast();
    showVideo();
})();