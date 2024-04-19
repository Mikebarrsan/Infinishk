$(document).ready(function () {
    // Inicializar el botón desactivado
    actualizarBotonYMensaje();

    // Evento para cada vez que se modifica un campo
    $('input').on('input', function () {
        actualizarBotonYMensaje();
    });

    function actualizarBotonYMensaje() {
        var duracion = $('#Duracion').val().trim();
        var precio = $('#precioDiplomado').val().trim();
        var nombre = $('#nombreDiplomado').val().trim();
        var mensaje = '';
        var camposCompletos = duracion && precio && nombre;
        var valor = document.getElementById('precioDiplomado').value;

        if (!camposCompletos) {
            mensaje = 'Por favor completa todos los campos.';
            $('#alerta').text(mensaje).show();
            $('button[type="submit"]').prop('disabled', true).addClass('is-light');
        } else if (parseFloat(precio) <= 0) {
            mensaje = 'El precio debe ser mayor a 0.';
            $('#alerta').text(mensaje).show();
            $('button[type="submit"]').prop('disabled', true).addClass('is-light');
        } else if (valor.includes('e') || valor.includes('E')) {
            mensaje = 'El precio no puede tener exponentes';
            $('#alerta').text(mensaje).show();
            $('button[type="submit"]').prop('disabled', true).addClass('is-light');
        } else {
            $('#alerta').hide();
            $('button[type="submit"]').prop('disabled', false).removeClass('is-light');
        }
    }
});

$(function () {
    var nombresValidos = []; // Aquí debes insertar los nombres de diplomados válidos

    $("#nombre").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/diplomado/autocomplete",
                dataType: "json",
                data: {
                    q: request.term
                },
                success: function (data) {
                    nombresValidos = data.map(function (diplomado) {
                        return diplomado.nombreDiplomado;
                    });
                    response(nombresValidos);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            // Restablecer el mensaje de validación
            $("#mensajeValidacion").text('');
            // Cambiar el estilo del botón si el nombre es válido
            var esValido = nombresValidos.includes(ui.item.value);
            $("#buscarBtn").prop('disabled', !esValido)
                .css('background-color', esValido ? '#910106' : '#ffcccc') // Color normal: azul, Color cuando es inválido: rojo ligero
                .toggleClass('is-light', !esValido); // Agrega o quita la clase 'is-light' según la validez
        }
    });

    // Inicializar el botón con el estilo de deshabilitado y color rojo ligero
    $("#buscarBtn").prop('disabled', true)
        .css('background-color', '#ffcccc')
        .addClass('is-light');

    $("#nombre").on("blur", function () {
        var mensaje = '';
        if (!this.value.trim()) {
            mensaje = 'Por favor ingresa un nombre';
        } else if (!nombresValidos.includes(this.value)) {
            mensaje = 'Por favor ingresa un nombre válido';
        }
        $("#mensajeValidacion").text(mensaje);
        var esValido = nombresValidos.includes(this.value);
        $("#buscarBtn").prop('disabled', !esValido)
            .css('background-color', esValido ? '#910106' : '#ffcccc')
            .toggleClass('is-light', !esValido); // Agrega o quita la clase 'is-light' según la validez
    });

});

document.getElementById('statusDiplomado').addEventListener('change', function () {
    var hiddenInput = document.getElementById('statusDiplomadoHidden');
    hiddenInput.value = this.checked ? 'on' : 'off';
});

function toggleInputs() {
    var checkbox = document.getElementById('statusDiplomado');
    var inputs = document.querySelectorAll('#Duracion, #precioDiplomado, #nombreDiplomado');
    inputs.forEach(function (input) {
        input.disabled = !checkbox.checked;
    });
}

document.querySelector('form').addEventListener('submit', function () {
    var inputs = document.querySelectorAll('#Duracion, #precioDiplomado, #nombreDiplomado');
    inputs.forEach(function (input) {
        input.disabled = false;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    toggleInputs(); // Llamar a la función al cargar la página para establecer el estado inicial correcto
});
