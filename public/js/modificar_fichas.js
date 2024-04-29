// Obtener la longitud de fichas para el bucle
const fichas_length = document.getElementById('fichas_length');

// Iterar sobre los elementos de la tabla
for (count = 1; count <= fichas_length.innerHTML; count++) {

    const placeholderDate = document.getElementById('fecha_lim' + count).getAttribute('placeholder');

    const startDate = new Date(placeholderDate);

    const calendars = bulmaCalendar.attach('[id=fecha_lim' + count + ']', {
        startDate: startDate,
        minDate: startDate,
        displayMode: 'dialog',
        dateFormat: 'dd/MM/yyyy',
        weekStart: 1,
        lang: 'es',
        showFooter: false
    });

    // Crear constantes para acceder a HTML
    const bt_Modificar = document.querySelector('#Boton_modificar' + count);
    const fecha_lim = document.querySelector('#fecha_lim' + count);
    const descuento = document.querySelector('#descuento' + count);
    const nota = document.querySelector('#nota' + count);
    const ayuda_descuento_vacio = document.querySelector('#ayuda_descuento_vacio' + count);
    const ayuda_descuento_negativo = document.querySelector('#ayuda_descuento_negativo' + count);
    const ayuda_descuento_exponente = document.querySelector('#ayuda_descuento_exponente' + count);
    const ayuda_nota = document.querySelector('#ayuda_nota' + count);
    const ayuda_fecha = document.querySelector('#ayuda_fecha_vacia' + count);

    // Checar si hay contenido dentro del input, para desactivar el boton
    function checar_contenido() {
        bt_Modificar.disabled = descuento.value.length === 0 || nota.value.length === 0;
    }

    // Activar mensaje si el motivo no tiene input
    function mensaje_fecha_lim() {
        if (fecha_lim.value.length === 0) {
            ayuda_fecha_lim.classList.remove('is-hidden');
        } else {
            ayuda_fecha_lim.classList.add('is-hidden');
        }
    }

    function mensaje_descuento() {
        if (descuento.value.length === 0) {
            ayuda_descuento_vacio.classList.remove('is-hidden');
        } else {
            ayuda_descuento_vacio.classList.add('is-hidden');
        }

        if (descuento.value < 0 || descuento.value === '-0') {
            bt_Modificar.disabled = true;
            ayuda_descuento_negativo.classList.remove('is-hidden');
        } else {
            ayuda_descuento_negativo.classList.add('is-hidden');
        }

        if (descuento.value.trim().toLowerCase().includes('e')) {
            bt_Modificar.disabled = true;
            ayuda_descuento_exponente.classList.remove('is-hidden');
        } else {
            ayuda_descuento_exponente.classList.add('is-hidden');
        }
    }

    function mensaje_nota() {
        if (nota.value.length === 0) {
            ayuda_nota.classList.remove('is-hidden');
        } else {
            ayuda_nota.classList.add('is-hidden');
        }
    }

    // Detectar si el usuario maneja input y llamar las funciones anteriores
    descuento.addEventListener('input', checar_contenido);
    nota.addEventListener('input', checar_contenido);
    descuento.addEventListener('input', mensaje_descuento);
    nota.addEventListener('input', mensaje_nota);

    function clear_button() {
        ayuda_fecha.classList.remove('is-hidden');
        bt_Modificar.disabled = true;
    }

    function activate_clear_button() {
        ayuda_fecha.classList.add('is-hidden');
        bt_Modificar.disabled = false;
    }

    const clear_fecha_lim = document.querySelectorAll('.datetimepicker-clear-button');
    clear_fecha_lim[count - 1].addEventListener('click', clear_button);

    calendars.forEach((calendar) => { 
        calendar.on('select', activate_clear_button);
    })
}

function modificar(descuento, fecha_lim, nota, id, count) {
    const csrf = document.getElementById('_csrf').value;
    const alumno = document.getElementById('alumno').value;
    
    // Obtener dato de la ficha específica
    const descuentoNum = document.getElementById('descuento' + count).value;
    const fechaNum = document.getElementById('fecha_lim' + count).value; 
    const notaNum = document.getElementById('nota' + count).value;

    console.log('Iniciando modificación con los siguientes datos: ', descuentoNum, fechaNum, notaNum, id);

    // formato de fecha de DD/MM/YYYY -> YYYY-MM-DD para SQL
    const parts = fechaNum.split('/');
    const fechaFormat = `${parts[2]}-${parts[1]}-${parts[0]}`;

    console.log('Data to be sent:', { descuentoNum, fechaFormat, notaNum, id });

    // Desactivar el botón después de hacer clic en él para evitar múltiples envíos
    document.getElementById('Boton_modificar' + count).setAttribute('disabled', 'disabled');

    // Mostrar la notificación de modificación
    const notificacion = document.getElementById('modificacion_ficha');
    notificacion.classList.remove('is-hidden');

    // Desplazar la página hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch('/alumnos/fichas/modify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            descuentoNum : descuentoNum,
            fechaFormat : fechaFormat,
            notaNum : notaNum,
            id : id
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data);
        if(data.success){
            console.log('Modificación exitosa: ', data);
            // Recargar la página después de mostrar la notificación durante unos segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 3000 milisegundos = 3 segundos
        } else {
            console.error('Error en la modificación: ', data.message);
            // Reactivar el botón en caso de error para permitir nuevos intentos
            document.getElementById('Boton_modificar' + count).removeAttribute('disabled');
        }
    })
    .catch(error => {
        console.log('Error en la petición fetch: ', error);
        // Reactivar el botón en caso de error para permitir nuevos intentos
        document.getElementById('Boton_modificar' + count).removeAttribute('disabled');
    });
}
