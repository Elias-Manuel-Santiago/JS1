// Importa las funciones de validación y renderizado desde el módulo de formdata
import { validateFormdata, mostrarTarjeta } from "../modules/formdata.js";
import { validateFormDOM, mostrarTarjetaDOM } from "../modules/dom.js";
import { validateFormElements, mostrarTarjetaElements } from "../modules/elements.js";


//  CAMBIO DE TEMA ------------------------------------------------
// Almacena el tema del sistema
const temaSistema = window.matchMedia("(prefers-color-scheme: dark)");

// Si el tema del sistema es oscuro, cambia el tema del sitio a oscuro
if (temaSistema.matches) {
    document.body.classList.toggle('dark');
}

// Alterna la clase "dark" en el body para cambiar el tema visual
const toggleTema = document.getElementById('toggle-tema');
toggleTema.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Contenedor donde se inyecta el HTML de cada vista
const app = document.getElementById('app');

// Todos los botones del nav, cada uno tiene data-view con el nombre de su vista
const navButtons = document.querySelectorAll('.nav_button');

let vistaActual = localStorage.getItem('vistaActual');

// Carga la primera vista al iniciar la página
if (vistaActual == null) {
    loadView('formdata');
} else {
    loadView(vistaActual);
}

// ── Carga de vistas ───────────────────────────────────────────────
// Obtiene el HTML del fragmento, lo inyecta en #app y adjunta el handler correspondiente
async function loadView(viewName) {
    localStorage.setItem('vistaActual', viewName);
    const res = await fetch(`/views/${viewName}.html`);
    app.innerHTML = await res.text();
    formHandlers[viewName](app.querySelector('form'));

    // Marca el botón activo y deshabilita solo ese
    navButtons.forEach((btn) => {
        const isActive = btn.dataset.view === viewName;
        btn.classList.toggle('active', isActive);
        btn.disabled = isActive;
    });
}

// Al hacer click en un botón del nav, carga la vista indicada en data-view
navButtons.forEach((btn) => {
    btn.addEventListener('click', () => loadView(btn.dataset.view));
});



// ── Lógica compartida de submit ───────────────────────────────────
// Adjunta el evento submit al form; readData, validate y mostrar son propios de cada vista
function handleSubmit(form, readData, validate, mostrar) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        form.querySelectorAll('.fd-error').forEach((span) => {
            span.textContent = '';
            span.closest('.fd-field')?.classList.remove('fd-field--error');
        });

        const data = readData(form);
        const errors = validate(data);

        if (Object.keys(errors).length > 0) {
            for (const [campo, msg] of Object.entries(errors)) {
                const span = form.querySelector(`.fd-error[data-for="${campo}"]`);
                if (span) {
                    span.textContent = msg;
                    span.closest('.fd-field')?.classList.add('fd-field--error');
                }
            }
            return;
        }

        mostrar(data);
    });
}

// ── Handlers por vista ───────────────────────────────────────────
// Cada método recibe el <form> ya insertado en el DOM y le adjunta su lógica
const formHandlers = {

    // Vista 1: lee los datos usando new FormData(form)
    formdata(form) {
        const fechaInput = form.querySelector('#fd-fecha');
        if (fechaInput) fechaInput.max = new Date().toISOString().split('T')[0];
        handleSubmit(form, (f) => Object.fromEntries(new FormData(f)), validateFormdata, mostrarTarjeta);
    },

    // Vista 2: lee los valores accediendo directamente a los elementos por su id
    dom(form) {
        handleSubmit(form, () => ({
            nombre: document.getElementById('dom-nombre').value,
            apellido: document.getElementById('dom-apellido').value,
            dni: document.getElementById('dom-dni').value,
            correo: document.getElementById('dom-correo').value,
            ingreso: document.getElementById('dom-fecha_ingreso').value,
            salida: document.getElementById('dom-fecha_salida').value,
            habitacion: document.getElementById('dom-tipo_habitacion').value,
            huespedes: document.getElementById('dom-huespedes').value,
        }), validateFormDOM, mostrarTarjetaDOM);
    },

    // Vista 3: itera form.elements para leer todos los campos por su name
    elements(form) {
        handleSubmit(form, (f) => {
            const data = {};
            for (const el of f.elements) {
                if (el.name) data[el.name] = el.value;
            }
            return data;
        }, validateFormElements, mostrarTarjetaElements);
    },
};


