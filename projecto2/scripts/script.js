import { validate, mostrarTarjetas, readData } from '../modules/inscripcion.js';

// ── Tema ─────────────────────────────────────────────────────────
const temaSistema = window.matchMedia("(prefers-color-scheme: dark)");
if (temaSistema.matches) document.body.classList.add('dark');

const toggleTema = document.getElementById('toggle-tema');
toggleTema.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('tema', document.body.classList.contains('dark') ? 'dark' : 'light');
});
if (localStorage.getItem('tema') === 'dark') document.body.classList.add('dark');
if (localStorage.getItem('tema') === 'light') document.body.classList.remove('dark');

// ── Array de inscripciones ───────────────────────────────────────
const inscripciones = [];


// ── Referencias ──────────────────────────────────────────────────
const form             = document.querySelector('form');
const resultsContainer = document.getElementById('results-container');





// ── Submit ───────────────────────────────────────────────────────
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpia errores anteriores
    form.querySelectorAll('.input-error').forEach(span => (span.textContent = ''));
    form.querySelectorAll('.input-container.has-error').forEach(c => c.classList.remove('has-error'));

    const data   = readData();
    const errors = validate(data);


    //Muestra todos los errores
    if (Object.keys(errors).length > 0) {
        for (const [campo, msg] of Object.entries(errors)) {
            const span = form.querySelector(`.input-error[data-for="${campo}"]`);
            if (span) {
                span.textContent = msg;
                span.closest('.input-container')?.classList.add('has-error');
            }
        }
        return;
    }

    //Carga los datos al array, guarda en localStorage y muestra las tarjetas
    inscripciones.unshift(data);
    mostrarTarjetas(inscripciones, resultsContainer);
    form.reset();
});
