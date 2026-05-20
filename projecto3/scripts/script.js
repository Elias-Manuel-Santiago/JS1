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
let inscripciones = JSON.parse(localStorage.getItem('inscripciones') ?? '[]');

// ── Referencias ──────────────────────────────────────────────────
const form = document.querySelector('form');
const resultsContainer = document.getElementById('results-container');

mostrarTarjetas(inscripciones, resultsContainer);


// ── Boton scroll ───────────────────────────────────────────────────────
const botonScroll = document.getElementById('scroll-top');

botonScroll.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
function actualizarBotonScroll() {
    botonScroll.style.display = scrollY === 0 ? 'none' : 'flex';
}

window.addEventListener('scroll', actualizarBotonScroll);
actualizarBotonScroll();



// ── Vaciar Array ───────────────────────────────────────────────────────
const botonVaciar = document.querySelector('.vaciar-lista');

botonVaciar.addEventListener('click', () => {
    localStorage.removeItem('inscripciones');
    inscripciones.length = 0;
    mostrarTarjetas(inscripciones, resultsContainer);
});

// ── Toggle cantidad de hijos ─────────────────────────────────────
const tieneHijosSelect = document.getElementById('tiene-hijos');
const containerCantidadHijos = document.getElementById('container-cantidad-hijos');

cantidadHijos();

tieneHijosSelect.addEventListener('change', () => {
    cantidadHijos()
});

function cantidadHijos(){
    const mostrar = tieneHijosSelect.value === 'si';
    containerCantidadHijos.style.display = mostrar ? 'block' : 'none';
    if (!mostrar) document.getElementById('cantidad-hijos').value = '';
}

// ── Submit ───────────────────────────────────────────────────────
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpia errores anteriores
    form.querySelectorAll('.input-error').forEach(span => (span.textContent = ''));
    form.querySelectorAll('.input-container.has-error').forEach(c => c.classList.remove('has-error'));

    const data = readData();
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

    //Carga los datos al array, y muestra las tarjetas
    inscripciones.unshift(data);
    localStorage.setItem('inscripciones', JSON.stringify(inscripciones));
    mostrarTarjetas(inscripciones, resultsContainer);
    form.reset();
    containerCantidadHijos.style.display = 'none';
});
