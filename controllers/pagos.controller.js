const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const pagoDiplomado = require('../models/pagadiplomado.model');
const Cursa = require('../models/cursa.model');

const csvParser = require('csv-parser');
const fs = require('fs');

exports.get_pago = (request,response,next) => {
    response.render('pago/pago');
};

exports.get_registro_transferencias = (request,response,next) => {
    response.render('pago/registro_transferencia',{
        subir:true,
        revisar:false,
        resultado:false,
    });
};

exports.post_subir_archivo = (request, response,next) => {
    const filas = [];
    fs.createReadStream(request.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            const { Fecha, Hora, Importe, Concepto } = data;
            const Referencia = Concepto.substring(0, 7); 
            const Matricula = Concepto.substring(0,6);
            const inicioRef = Concepto.substring(0,1);
            const dia = Fecha.substring(1,3);
            const mes = Fecha.substring(3,5);
            const anio = Fecha.substring(5,9);
            fechaFormato = anio+'-'+mes+'-'+dia;
            filas.push({ fechaFormato, Hora, Importe,Referencia,Matricula,inicioRef});
        })
        .on('end', async () => {
            const resultados = [];
            for (const fila of filas) {
                let tipoPago = ''; 
                if (fila.inicioRef =='1') 
                {
                    const deuda = await Deuda.fetchDeuda(fila.Matricula);
                    const montoAPagar = Number(deuda[0][0].montoAPagar.toFixed(2));
                    if(fila.Importe == montoAPagar){
                        tipoPago = 'Pago de Colegiatura';
                        deudaEstudiante = montoAPagar;
                    }
                    else
                    {
                        tipoPago = 'Pago a Registrar';
                        deudaEstudiante = montoAPagar;
                    }
                } 
                else if (fila.inicioRef=='8') 
                {
                    tipoPago = 'Pago de Diplomado';
                }
                else if (fila.inicioRef='A')
                {
                    tipoPago = 'Pago a Ignorar';
                }
                resultados.push({ ...fila, tipoPago,deudaEstudiante });
            }
            response.render('pago/registro_transferencia', { 
                subir: false,
                revisar:true,
                resultado:false,
                datos: resultados,
            });
        });
};

exports.post_registrar_transferencia = async (request, response, next) => {
    const pagosRegistrar = [];
    for (const pago of request.body) {
        const matricula = pago.matricula;
        const referencia = pago.referencia;
        const importe = pago.importe;
        const deuda = pago.deuda;
        const tipoPago = pago.tipoPago;
        const fecha = pago.fecha;
        if(tipoPago === 'Pago de Colegiatura'){
             const idDeuda = await Deuda.fetchIDDeuda(matricula);
             console.log(idDeuda[0][0].IDDeuda);
             Pago.save_transferencia(idDeuda[0][0].IDDeuda,importe,fecha);
        }
        else if(tipoPago === 'Pago de Diplomado'){
             const idDiplomado = await Cursa.fetchDiplomado(matricula);
             console.log(idDiplomado[0][0].IDDiplomado);
             pagoDiplomado.save_transferencia(matricula,idDiplomado[0][0].IDDiplomado,fecha,importe);
        }
        else if(tipoPago === 'Pago a Registrar'){
            console.log('Estoy aqui')
            pagosRegistrar.push({matricula,referencia,importe,deuda,tipoPago,fecha})
            console.log(pagosRegistrar)
        }
    }
    response.render('pago/resultado_transferencia',{
        pagos:pagosRegistrar
    });
      
}


