// ── Regex ────────────────────────────────────────────────────────
const reNombre    = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ][a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,}$/;
const reDireccion = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9][a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s\.\,\-\°\#]{3,}$/;
const reEmail     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reTel       = /^[\d\s\+\-\(\)]{7,15}$/;

// ── Validación ───────────────────────────────────────────────────
export function validate(data) {
    const errors = {};

    if (!reNombre.test(data.nombre.trim()))
        errors.nombre = 'Ingresá un nombre válido (mínimo 2 letras)';

    if (!reNombre.test(data.apellido.trim()))
        errors.apellido = 'Ingresá un apellido válido (mínimo 2 letras)';

    if (!/^\d{7,8}$/.test(data.dni.trim()))
        errors.dni = 'El DNI debe tener 7 u 8 dígitos';

    const edad = Number(data.edad.trim());
    if (!Number.isFinite(edad) || edad < 3 || edad > 20)
        errors.edad = 'La edad debe estar entre 3 y 20 años';

    if (!data.fechaNacimiento) {
        errors.fechaNacimiento = 'Ingresá la fecha de nacimiento';
    } else if (new Date(data.fechaNacimiento) > new Date()) {
        errors.fechaNacimiento = 'La fecha no puede ser futura';
    } else if (!isAgeValid(data.edad, data.fechaNacimiento)) {
        errors.fechaNacimiento = 'La fecha de nacimiento y la edad no concuerdan.';
        errors.edad = '';
    }




    if (!reDireccion.test(data.direccion.trim()))
        errors.direccion = 'Ingresá una dirección válida';

    if (!reNombre.test(data.ciudad.trim()))
        errors.ciudad = 'Ingresá el nombre de la ciudad (solo letras)';

    if (!data.curso)
        errors.curso = 'Ingresá el curso o año';

    if (!data.turno)
        errors.turno = 'Seleccioná un turno';

    if (data.tutor.trim().length < 5)
        errors.tutor = 'Ingresá el nombre completo del adulto responsable';
    else if (!reNombre.test(data.tutor.trim()))
        errors.tutor = 'Ingresá un nombre completo válido (solo letras y espacios)';

    if (!reTel.test(data.telefono.trim()))
        errors.telefono = 'Ingresá un teléfono válido (7 a 15 caracteres)';

    if (!reEmail.test(data.email.trim()))
        errors.email = 'Ingresá un correo electrónico válido';

    return errors;
}

// ── Lectura de datos ─────────────────────────────────────────────
export function readData() {
    return {
        nombre:          document.getElementById('nombre').value.trim(),
        apellido:        document.getElementById('apellido').value.trim(),
        dni:             document.getElementById('dni').value.trim(),
        edad:            document.getElementById('edad').value.trim(),
        fechaNacimiento: document.getElementById('fecha-nacimiento').value,
        direccion:       document.getElementById('direccion').value.trim(),
        ciudad:          document.getElementById('ciudad').value.trim(),
        curso:           document.getElementById('curso').value.trim(),
        turno:           document.getElementById('turno').value,
        tutor:           document.getElementById('tutor').value.trim(),
        telefono:        document.getElementById('telefono').value.trim(),
        email:           document.getElementById('email').value.trim(),
    };
}


// ── Render ───────────────────────────────────────────────────────
export function mostrarTarjetas(inscripciones, container) {
    if (inscripciones.length === 0) {
        container.innerHTML = '<p class="results-empty">Completá el formulario para registrar una inscripción</p>';
        return;
    }

    container.innerHTML = inscripciones.map((ins) => `
        <article class="ins-card">
            <h3 class="ins-card-name">${ins.nombre} ${ins.apellido}</h3>
            <div class="ins-card-row">
                <span class="ins-card-label">DNI</span>
                <span class="ins-card-value">${ins.dni}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Edad</span>
                <span class="ins-card-value">${ins.edad} años</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Fecha de nac.</span>
                <span class="ins-card-value">${formatDate(ins.fechaNacimiento)}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Domicilio</span>
                <span class="ins-card-value">${ins.direccion}, ${ins.ciudad}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Inscripción</span>
                <span class="ins-card-value">${ins.curso} — ${ins.turno === 'manana' ? 'Mañana' : 'Tarde'}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Responsable</span>
                <span class="ins-card-value">${ins.tutor}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Teléfono</span>
                <span class="ins-card-value">${ins.telefono}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Email</span>
                <span class="ins-card-value">${ins.email}</span>
            </div>
        </article>
    `).join('');
}


//Verifica que la edad y la fecha de nacimiento concuerden
function isAgeValid(edad, nacimiento) {
    const hoy = new Date();
    const nacimiento_parsed = new Date(nacimiento + 'T00:00:00');
    const mes1 = hoy.getMonth();
    const mes2 = nacimiento_parsed.getMonth();
    const dia1 = hoy.getDate();
    const dia2 = nacimiento_parsed.getDate();
    let anios = hoy.getFullYear() - nacimiento_parsed.getFullYear();
    if (mes2 > mes1 || (mes2 == mes1 && dia2 > dia1)) {
        anios--;
    }
    if (anios == edad) {
        return true;
    }
    return false;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}
