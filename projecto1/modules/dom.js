export function validateFormDOM(data) {
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

    // ── Correo electrónico ───────────────────────────────────────────
    if (!data.correo.trim()) {
        errors.correo = 'El correo electrónico es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo.trim())) {
        errors.correo = 'Ingresá un correo electrónico válido.';
    }



    // ── Fecha de ingreso y salida ──────────────────────────────────────────
    // Se agrega T00:00:00 para evitar desfases de zona horaria al parsear
    if (!data.ingreso) {
        errors.ingreso = 'La fecha de ingreso es requerida.';
    }
    if (!data.salida) {
        errors.salida = 'La fecha de salida es requerida.';
    }
    if (data.ingreso && data.salida && data.ingreso >= data.salida) {
        errors.ingreso = 'La fecha de ingreso debe ser antes de la salida';
    }

    // ── Tipo de habitacion ────────────────────────────────────────────────────
    if (!data.habitacion) {
        errors.habitacion = 'El tipo de habitacion es requerido.';
    }

    // ── Cantidad de huespedes ────────────────────────────────────────────────────
    if (!data.huespedes.trim()) {
        errors.huespedes = 'La cantidad de huéspedes es requerida.';
    } else if (!/^\d+$/.test(data.huespedes.trim())) {
        errors.huespedes = 'Ingresá un dígito numérico.';
    }else {
        if (data.huespedes <= 0) {
            errors.huespedes = 'La cantidad de huespedes debe ser mayor a 0.';
        } else if (data.huespedes > 4) {
            errors.huespedes = 'La cantidad de huespedes no puede ser mayor a 4.';
        }
    }
    return errors;
}


export function mostrarTarjetaDOM(data) {
    const card = document.getElementById('fd-card');

    // Mapeo de claves del objeto a etiquetas legibles para mostrar en la tarjeta
    const campos = {
        nombre: 'Nombre',
        apellido: 'Apellido',
        dni: 'DNI',
        correo: 'Correo',
        ingreso: 'Fecha de ingreso',
        salida: 'Fecha de salida',
        habitacion: 'Tipo de habitación',
        huespedes: 'Cantidad de huéspedes'
    };

    // Convierte la fecha de YYYY-MM-DD a DD/MM/YYYY para mostrarla en formato local
    let [anio, mes, dia] = data.ingreso.split('-');
    let fechaFormateada = `${dia}/${mes}/${anio}`;
    data.ingreso = fechaFormateada;
    [anio, mes, dia] = data.salida.split('-');
    fechaFormateada = `${dia}/${mes}/${anio}`;
    data.salida = fechaFormateada;

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