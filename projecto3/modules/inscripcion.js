// ── Regex ────────────────────────────────────────────────────────
const reNombre    = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ][a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,}$/;
const reDireccion = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9][a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s\.\,\-\°\#]{3,}$/;
const reEmail     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reTel       = /^[\d\s\+\-\(\)]{7,15}$/;
const reCuil      = /^\d{2}-\d{7,8}-\d$|^\d{10,11}$/;

// ── Validación ───────────────────────────────────────────────────
export function validate(data) {
    const errors = {};

    if (!reNombre.test(data.nombre.trim()))
        errors.nombre = 'Ingresá un nombre válido (mínimo 2 letras)';

    if (!reNombre.test(data.apellido.trim()))
        errors.apellido = 'Ingresá un apellido válido (mínimo 2 letras)';

    if (!/^\d{7,8}$/.test(data.dni.trim()))
        errors.dni = 'El documento debe tener 7 u 8 dígitos';

    if (!reCuil.test(data.cuil.trim()))
        errors.cuil = 'Ingresá un CUIL válido (Ej: 20-12345678-9)';

    const edad = Number(data.edad.trim());
    
    if (!Number.isFinite(edad) || edad < 0 || edad > 150 || !data.edad)
        errors.edad = 'Ingresá una edad válida (entre 0 y 110 años)';

    if (!data.fechaNacimiento) {
        errors.fechaNacimiento = 'Ingresá la fecha de nacimiento';
    } else if (new Date(data.fechaNacimiento) > new Date()) {
        errors.fechaNacimiento = 'La fecha no puede ser futura';
    } else if (!isAgeValid(data.edad, data.fechaNacimiento)) {
        errors.fechaNacimiento = 'La fecha de nacimiento y la edad no concuerdan.';
        errors.edad = '';
    }

    if (!data.sexo)
        errors.sexo = 'Seleccioná un sexo';

    if (!data.estadoCivil)
        errors.estadoCivil = 'Seleccioná el estado civil';

    if (!reNombre.test(data.nacionalidad.trim()))
        errors.nacionalidad = 'Ingresá una nacionalidad válida (solo letras)';

    if (!reDireccion.test(data.direccion.trim()))
        errors.direccion = 'Ingresá una dirección válida';

    if (!reNombre.test(data.localidad.trim()))
        errors.localidad = 'Ingresá el nombre de la localidad (solo letras)';

    if (!data.tieneHijos)
        errors.tieneHijos = 'Indicá si tiene hijos';

    if (data.tieneHijos === 'si') {
        const cantidad = Number(data.cantidadHijos);
        if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 20)
            errors.cantidadHijos = 'Ingresá una cantidad válida (1 a 20)';
    }

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
        cuil:            document.getElementById('cuil').value.trim(),
        edad:            document.getElementById('edad').value.trim(),
        fechaNacimiento: document.getElementById('fecha-nacimiento').value,
        sexo:            document.getElementById('sexo').value,
        estadoCivil:     document.getElementById('estado-civil').value,
        nacionalidad:    document.getElementById('nacionalidad').value.trim(),
        direccion:       document.getElementById('direccion').value.trim(),
        localidad:       document.getElementById('localidad').value.trim(),
        tieneHijos:      document.getElementById('tiene-hijos').value,
        cantidadHijos:   document.getElementById('cantidad-hijos').value.trim(),
        telefono:        document.getElementById('telefono').value.trim(),
        email:           document.getElementById('email').value.trim(),
    };
}


// ── Muestra las tarjetas ───────────────────────────────────────────────────────
export function mostrarTarjetas(inscripciones, container) {
    if (inscripciones.length === 0) {
        container.innerHTML = '<p class="results-empty">Completá el formulario para registrar a una persona</p>';
        return;
    }

    container.innerHTML = inscripciones.map((ins) => `
        <article class="ins-card">
            <h3 class="ins-card-name">${ins.nombre} ${ins.apellido}</h3>
            <div class="ins-card-row">
                <span class="ins-card-label">Documento</span>
                <span class="ins-card-value">${ins.dni}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">CUIL</span>
                <span class="ins-card-value">${ins.cuil}</span>
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
                <span class="ins-card-label">Sexo</span>
                <span class="ins-card-value">${ins.sexo === 'masculino' ? 'Masculino' : 'Femenino'}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Estado civil</span>
                <span class="ins-card-value">${formatEstadoCivil(ins.estadoCivil)}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Nacionalidad</span>
                <span class="ins-card-value">${ins.nacionalidad}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Domicilio</span>
                <span class="ins-card-value">${ins.direccion}, ${ins.localidad}</span>
            </div>
            <div class="ins-card-row">
                <span class="ins-card-label">Hijos</span>
                <span class="ins-card-value">${ins.tieneHijos === 'si' ? `Sí (${ins.cantidadHijos})` : 'No'}</span>
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
    return anios == edad;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

function formatEstadoCivil(val) {
    const map = {
        soltero:    'Soltero/a',
        casado:     'Casado/a',
        divorciado: 'Divorciado/a',
        viudo:      'Viudo/a',
        union:      'Unión convivencial',
    };
    return map[val] ?? val;
}
