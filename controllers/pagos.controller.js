const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const Pago_Extra = require('../models/pago_extra.model');
const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Cursa = require('../models/cursa.model');
const Colegiatura = require('../models/colegiatura.model');

const csvParser = require('csv-parser');
const fs = require('fs');
const stream = require('stream');

exports.get_pago = (request, response, next) => {
    response.render('pago/pago', {
        csrfToken: request.csrfToken(),
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.get_registro_transferencias = (request, response, next) => {
    response.render('pago/registro_transferencia', {
        subir: true,
        error: false,
        revisar: false,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.post_subir_archivo = (request, response, next) => {
    if (!request.file) {
        return response.status(400).send('No se subió ningún archivo.');
    }

    const fileBuffer = request.file.buffer;
    const filas = [];

    // Crear un stream de lectura a partir del buffer del archivo
    const fileStream = new stream.Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null); // Finalizar el stream

    // Configurar el parser de CSV
    const parser = fileStream.pipe(csvParser());

    parser.on('data', (data) => {
        const { Fecha, Hora, Importe, Concepto } = data;
        const Referencia = Concepto.substring(0, 7);
        const Matricula = Concepto.substring(0, 6);
        const inicioRef = Concepto.substring(0, 1);
        const dia = Fecha.substring(1, 3);
        const mes = Fecha.substring(3, 5);
        const anio = Fecha.substring(5, 9);
        const fechaFormato = `${anio}-${mes}-${dia} ${Hora}`;
        filas.push({ fechaFormato, Hora, Importe, Referencia, Matricula, inicioRef });
    });

    parser.on('end', async () => {
        const resultados = [];

        for (const fila of filas) {
            let nombre = '';
            let apellidos = '';
            let deudaEstudiante = 0;
            let tipoPago = '';
            let montoAPagar = 0;

            if (fila.inicioRef === '1' || fila.inicioRef === '8') {
                const nombreCompleto = await Alumno.fetchNombre(fila.Matricula);
                if (nombreCompleto && nombreCompleto[0] && nombreCompleto[0][0] && nombreCompleto[0][0].Nombre !== undefined) {
                    nombre = String(nombreCompleto[0][0].Nombre);
                    apellidos = String(nombreCompleto[0][0].Apellidos);
                }
                else {
                    tipoPago = "Pago no Reconocido"
                }
            }

            if (fila.inicioRef === '1') {
                const deuda = await Deuda.fetchDeuda(fila.Matricula);
                const deudaPagada = await Deuda.fetchDeudaPagada(fila.Matricula);
                const idLiquida = await Liquida.fetchIDPagado(fila.Matricula, fila.fechaFormato);
                const pagoCompleto = await Pago.fetch_fecha_pago(fila.fechaFormato);

                if (deuda && deuda[0] && deuda[0].length === 0) {
                    tipoPago = "Pago no Reconocido"
                }

                else {
                    montoAPagar = deuda && deuda[0] && deuda[0][0] && deuda[0][0].montoAPagar !== undefined ?
                        Number(deuda[0][0].montoAPagar.toFixed(2)) :
                        Number(deudaPagada[0][0].montoAPagar.toFixed(2));
                }

                if (pagoCompleto && pagoCompleto[0] && pagoCompleto[0][0] && pagoCompleto[0][0].fechaPago !== undefined) {
                    const fechaParseada = new Date(pagoCompleto[0][0].fechaPago);
                    const fechaFormateada = `${fechaParseada.getFullYear()}-${(fechaParseada.getMonth() + 1).toString().padStart(2, '0')}-${fechaParseada.getDate().toString().padStart(2, '0')} ${fechaParseada.getHours()}:${fechaParseada.getMinutes().toString().padStart(2, '0')}`;

                    const montoRedondeado = Math.round(pagoCompleto[0][0].montoPagado * 100) / 100;
                    const importeRedondeado = Math.round(fila.Importe * 100) / 100;

                    if (montoRedondeado === importeRedondeado && fechaFormateada === fila.fechaFormato) {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                    }
                }

                if (idLiquida[0] && idLiquida[0][0] && idLiquida[0][0].IDLiquida !== undefined) {
                    tipoPago = 'Pago Completo';
                    deudaEstudiante = 0;
                }

                if (fila.Importe == montoAPagar) {
                    if (tipoPago === 'Pago Completo') {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                    } else {
                        tipoPago = 'Pago de Colegiatura';
                        deudaEstudiante = montoAPagar;
                    }
                } else {
                    if (tipoPago === 'Pago Completo') {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                    }
                    if (tipoPago === 'Pago no Reconocido') {
                        tipoPago = 'Pago no Reconocido';
                    }
                    else {
                        tipoPago = 'Pago a Registrar'; // Si el importe no coincide con el monto a pagar
                        deudaEstudiante = montoAPagar;
                    }
                }
            } else if (fila.inicioRef === '8') {
                const idLiquidaPagada = await Liquida.fetchIDPagado(fila.Matricula, fila.fechaFormato);
                const pagoDiplomadoCompleto = await PagoDiplomado.fetch_fecha_pago(fila.fechaFormato);

                if (pagoDiplomadoCompleto && pagoDiplomadoCompleto[0] && pagoDiplomadoCompleto[0][0] && pagoDiplomadoCompleto[0][0].fechaPago !== undefined) {
                    const fechaParseada = new Date(pagoDiplomadoCompleto[0][0].fechaPago);
                    const anio = fechaParseada.getFullYear();
                    const mes = (fechaParseada.getMonth() + 1).toString().padStart(2, '0');
                    const dia = fechaParseada.getDate().toString().padStart(2, '0');
                    let horas = fechaParseada.getHours();
                    const minutos = fechaParseada.getMinutes().toString().padStart(2, '0');

                    if (horas < 10) {
                        horas = `0${horas}`;
                    }

                    const fechaFormateada = `${anio}-${mes}-${dia} ${horas}:${minutos}`;

                    const montoRedondeado = Math.round(pagoDiplomadoCompleto[0][0].montoPagado * 100) / 100;
                    const importeRedondeado = Math.round(fila.Importe * 100) / 100;

                    if (montoRedondeado === importeRedondeado && fechaFormateada === fila.fechaFormato) {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                    }
                }

                if (idLiquidaPagada[0] && idLiquidaPagada[0][0] && idLiquidaPagada[0][0].IDLiquida !== undefined) {
                    tipoPago = 'Pago Completo';
                    deudaEstudiante = 0;
                } else {
                    if (tipoPago === 'Pago Completo') {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 'N/A';
                    }
                    if (tipoPago === 'Pago no Reconocido') {
                        tipoPago = 'Pago no Reconocido';
                    } else {
                        tipoPago = 'Pago de Diplomado'; // Si el importe no coincide con el monto a pagar
                    }
                }
            } else {
                tipoPago = 'Pago a Ignorar';
            }

            resultados.push({ ...fila, tipoPago, deudaEstudiante, nombre, apellidos });
        }

        // Renderizar la vista con los resultados
        response.render('pago/registro_transferencia', {
            subir: false,
            error: false,
            revisar: true,
            datos: resultados,
            csrfToken: request.csrfToken(),
            permisos: request.session.permisos || [],
            rol: request.session.rol || '',
        });
    });
};

exports.post_registrar_transferencia = async (request, response, next) => {
    let success = true;
    const pagosRegistrar = [];
    const nombre = request.body.nombre;
    const matricula = request.body.matricula;
    const referencia = request.body.referencia;
    const importe = request.body.importe;
    const deuda = request.body.deuda;
    const tipoPago = request.body.tipoPago;
    const fecha = request.body.fecha;
    const nota = request.body.nota;

    if (tipoPago === 'Pago de Colegiatura') {
        let diferencia = 0;
        let montoAPagar = 0;

        const deuda = await Deuda.fetchDeuda(matricula);
        const idDeuda = await Deuda.fetchIDDeuda(matricula);

        if (deuda[0] && deuda[0][0] && typeof deuda[0][0].montoAPagar !== 'undefined') {
            montoAPagar = Number(deuda[0][0].montoAPagar.toFixed(2));
        }

        else {
            success = false;
            response.json({ success: success, message: 'No existe deuda actual para ese pago' });
            return;
        }

        const colegiatura = await Deuda.fetchColegiatura(idDeuda[0][0].IDDeuda);
        const idColegiatura = colegiatura[0][0].IDColegiatura;

        if (importe > montoAPagar) {
            diferencia = importe - montoAPagar;
        }

        let importe_trans = importe - diferencia;
        await Pago.save_transferencia(idDeuda[0][0].IDDeuda, importe, nota, fecha);
        await Colegiatura.update_transferencia(importe, idColegiatura)
        await Deuda.update_transferencia(importe_trans, idDeuda[0][0].IDDeuda)
        const deudaNext = await Deuda.fetchIDDeuda(matricula)

        if (diferencia > 0) {

            if (deudaNext[0] && deudaNext[0][0] && typeof deudaNext[0][0].IDDeuda !== 'undefined') {
                await Deuda.update_transferencia(diferencia, deudaNext[0][0].IDDeuda);
            }

            else {
                await Alumno.update_credito(matricula, diferencia);
            }

        }
    }
    else if (tipoPago === 'Pago de Diplomado') {
        const idDiplomado = await Cursa.fetchDiplomadosCursando(matricula);
        PagoDiplomado.save_transferencia(matricula, idDiplomado[0][0].IDDiplomado, fecha, importe, nota);
    }
    else if (tipoPago === 'Pago a Registrar') {
        pagosRegistrar.push({ nombre, matricula, referencia, importe, deuda, tipoPago, fecha });
    }
    else if (tipoPago === 'Pago Extra') {
        const idLiquida = await Liquida.fetchID(matricula);

        if (idLiquida[0] && idLiquida[0][0] && typeof idLiquida[0][0].IDLiquida !== 'undefined') {
            const idPagoExtra = await Pago_Extra.fetchID(importe);
            if (idPagoExtra[0] && idPagoExtra[0][0] && typeof idPagoExtra[0][0].IDPagosExtras !== 'undefined') {
                Liquida.update_transferencia(nota, fecha, idLiquida[0][0].IDLiquida)
            }
            else {
                success = false;
            }
        }
        else {
            const idPagoExtra = await Pago_Extra.fetchID(importe);
            if (idPagoExtra[0] && idPagoExtra[0][0] && typeof idPagoExtra[0][0].IDPagosExtras !== 'undefined') {
                Liquida.save_transferencia(matricula, idPagoExtra[0][0].IDPagosExtras, fecha, nota);
            }
            else {
                success = false;
            }
        }
    }

    response.json({ success: success });
}