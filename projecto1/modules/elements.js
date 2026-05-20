export function validateFormElements(data) {
    const errors = {};
    const soloLetras = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/;

    if (!data.nombre_estudiante.trim()) {
        errors.nombre_estudiante = 'El nombre es requerido.';
    } else if (!soloLetras.test(data.nombre_estudiante.trim())) {
        errors.nombre_estudiante = 'Solo letras y espacios.';
    } else if (data.nombre_estudiante.trim().length < 2) {
        errors.nombre_estudiante = 'Mínimo 2 caracteres.';
    }

    if (!data.apellido_estudiante.trim()) {
        errors.apellido_estudiante = 'El apellido es requerido.';
    } else if (!soloLetras.test(data.apellido_estudiante.trim())) {
        errors.apellido_estudiante = 'Solo letras y espacios.';
    } else if (data.apellido_estudiante.trim().length < 2) {
        errors.apellido_estudiante = 'Mínimo 2 caracteres.';
    }

    if (!data.fecha_nacimiento) {
        errors.fecha_nacimiento = 'La fecha de nacimiento es requerida.';
    } else {
        const hoy = new Date();
        const nacimiento = new Date(data.fecha_nacimiento + 'T00:00:00');
        if (nacimiento >= hoy) {
            errors.fecha_nacimiento = 'La fecha no puede ser futura.';
        }
    }

    if (!data.curso) {
        errors.curso = 'Seleccioná un curso.';
    }

    if (!data.responsable.trim()) {
        errors.responsable = 'El nombre del responsable es requerido.';
    } else if (!soloLetras.test(data.responsable.trim())) {
        errors.responsable = 'Solo letras y espacios.';
    } else if (data.responsable.trim().length < 5) {
        errors.responsable = 'Ingresá nombre y apellido completos.';
    }

    if (!data.telefono.trim()) {
        errors.telefono = 'El teléfono de contacto es requerido.';
    } else if (!/^[\d\s\-\+\(\)]{7,15}$/.test(data.telefono.trim())) {
        errors.telefono = 'Ingresá un número de teléfono válido.';
    }

    if (!data.direccion.trim()) {
        errors.direccion = 'La dirección es requerida.';
    } else if (data.direccion.trim().length < 5) {
        errors.direccion = 'Mínimo 5 caracteres.';
    }

    if (!data.dni.trim()) {
        errors.dni = 'El DNI es requerido.';
    } else if (!/^\d{7,8}$/.test(data.dni.trim())) {
        errors.dni = 'Ingresá 7 u 8 dígitos numéricos.';
    }

    return errors;
}

export function mostrarTarjetaElements(data) {
    const card = document.getElementById('fd-card');

    const campos = {
        nombre_estudiante:   'Nombre',
        apellido_estudiante: 'Apellido',
        fecha_nacimiento:    'Fecha de nacimiento',
        curso:               'Curso / Año',
        responsable:         'Adulto responsable',
        telefono:            'Teléfono',
        direccion:           'Dirección',
        dni:                 'DNI',
    };

    const [anio, mes, dia] = data.fecha_nacimiento.split('-');
    data.fecha_nacimiento = `${dia}/${mes}/${anio}`;

    card.classList.remove('fd-card--empty');
    card.innerHTML = `
        <h3>${data.nombre_estudiante} ${data.apellido_estudiante}</h3>
        ${Object.entries(campos).map(([key, label]) => {
            return `<div class="fd-card-row">
                <span class="fd-card-label">${label}</span>
                <span class="fd-card-value">${data[key]}</span>
            </div>`;
        }).join('')}
    `;
}