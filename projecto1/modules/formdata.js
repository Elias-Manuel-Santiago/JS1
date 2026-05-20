// Recibe el objeto de datos del formulario y devuelve un objeto con los errores encontrados.
// Si el objeto devuelto está vacío, todos los campos son válidos.
export function validateFormdata(data) {
    const errors = {};

    // Solo acepta letras del alfabeto español, espacios, apóstrofes y guiones
    const soloLetras = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/;

    // ── Nombre ──────────────────────────────────────────────────────
    if (!data.nombre.trim()) {
        errors.nombre = 'El nombre es requerido.';
    } else if (!soloLetras.test(data.nombre.trim())) {
        errors.nombre = 'Solo letras y espacios.';
    } else if (data.nombre.trim().length < 2) {
        errors.nombre = 'Mínimo 2 caracteres.';
    }

    // ── Apellido ─────────────────────────────────────────────────────
    if (!data.apellido.trim()) {
        errors.apellido = 'El apellido es requerido.';
    } else if (!soloLetras.test(data.apellido.trim())) {
        errors.apellido = 'Solo letras y espacios.';
    } else if (data.apellido.trim().length < 2) {
        errors.apellido = 'Mínimo 2 caracteres.';
    }

    // ── DNI ──────────────────────────────────────────────────────────
    // DNI argentino: 7 u 8 dígitos numéricos
    if (!data.dni.trim()) {
        errors.dni = 'El DNI es requerido.';
    } else if (!/^\d{7,8}$/.test(data.dni.trim())) {
        errors.dni = 'Ingresá 7 u 8 dígitos numéricos.';
    }

    // ── CUIL ─────────────────────────────────────────────────────────
    // Formato: XX-XXXXXXXX-X donde el prefijo puede ser 20, 23, 24, 27 o 30
    if (!data.cuil.trim()) {
        errors.cuil = 'El CUIL es requerido.';
    } else if (!/^(20|23|24|27|30)-\d{7,8}-\d$/.test(data.cuil.trim())) {
        errors.cuil = 'Formato inválido. Ej: 20-30234567-9';
    }

    // ── Estado civil ─────────────────────────────────────────────────
    if (!data.estado_civil) {
        errors.estado_civil = 'Seleccioná un estado civil.';
    }

    // ── Fecha de nacimiento ──────────────────────────────────────────
    if (!data.fecha_nacimiento) {
        errors.fecha_nacimiento = 'La fecha de nacimiento es requerida.';
    } else {
        const hoy = new Date();
        // Se agrega T00:00:00 para evitar desfases de zona horaria al parsear
        const nacimiento = new Date(data.fecha_nacimiento + 'T00:00:00');

        if (nacimiento >= hoy) {
            errors.fecha_nacimiento = 'La fecha no puede ser futura.';
        }
    }

    // ── Domicilio ────────────────────────────────────────────────────
    if (!data.domicilio.trim()) {
        errors.domicilio = 'El domicilio es requerido.';
    } else if (data.domicilio.trim().length < 5) {
        errors.domicilio = 'Mínimo 5 caracteres.';
    }

    return errors;
}

// Recibe los datos validados y los renderiza dentro de la tarjeta de vista previa (#fd-card).
// Reemplaza el estado vacío inicial con el detalle del formulario enviado.
export function mostrarTarjeta(data) {
    const card = document.getElementById('fd-card');

    // Mapeo de claves del objeto a etiquetas legibles para mostrar en la tarjeta
    const campos = {
        nombre:           'Nombre',
        apellido:         'Apellido',
        dni:              'DNI',
        cuil:             'CUIL',
        estado_civil:     'Estado Civil',
        fecha_nacimiento: 'Fecha de nacimiento',
        domicilio:        'Domicilio',
    };

    // Convierte la fecha de YYYY-MM-DD a DD/MM/YYYY para mostrarla en formato local
    const [anio, mes, dia] = data.fecha_nacimiento.split('-');
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    data.fecha_nacimiento = fechaFormateada;

    // Quita la clase de estado vacío y genera una fila por cada campo
    card.classList.remove('fd-card--empty');
    card.innerHTML = `
        <h3>${data.nombre} ${data.apellido}</h3>
        ${Object.entries(campos).map(([key, label]) => {
            return `<div class="fd-card-row">
                <span class="fd-card-label">${label}</span>
                <span class="fd-card-value">${data[key]}</span>
            </div>`;
        }).join('')}
    `;
}
