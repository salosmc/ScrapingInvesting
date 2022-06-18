

const informeCompleto = './outFiles/informeCompleto.csv';
const informeResumido = './outFiles/informeResumido.csv';
const informeErrores = './outFiles/informeErrores.csv';

const fecha = new Date();

let rotuloInfCompleto = `Informe Completo;;;;;;;;;;;;;;;\nTipo : Acciones;;;;;;;;;;;;;;;\nPais: EEUU;;;;;;;;;;;;;;;\nFecha de creación : ${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()};;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;\n`
let encabezadoInfCompleto = `${rotuloInfCompleto}Nombre;Ref.;Ingresos Totales;;;;;;;;Rentabilidad sobre fondos propios TTM;;Precio/Venta TTM;;Recomendación;URL\n;;fecha;monto;fecha;monto;fecha;monto;fecha;monto;Empresa;Industria;Empresa;Industria;;\n`;

let rotuloInfResumido =`Informe Resumido;;;\nTipo : Acciones;;;\nPais: EEUU;;;\nFecha de creación : ${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()};;;\n;;;\n`
let encabezadoInfResumido = `${rotuloInfResumido}Nombre;Ref.;Recomendación;URL\n`;

let rotuloInfErrores = `Informe de Errores;;;;\nTipo : Acciones;;;;\nPais : EEUU;;;;\nFecha de creación: ${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()};;;;\n;;;;\n`
let encabezadoInfErrores = `${rotuloInfErrores}Nombre;Ref.;URL;Mensaje\n`;

// module.exports.completoArchivo = informeCompleto;
// module.exports.completoEncabezado = encabezadoInfCompleto;

// module.exports.resumidoArchivo = informeResumido;
// module.exports.resumidoEncabezado = encabezadoInfResumido;

// module.exports.erroresArchivo = informeErrores;
// module.exports.erroresEncabezado = encabezadoInfErrores;

const informe = {
    completoArchivo : informeCompleto,
    completoEncabezado : encabezadoInfCompleto,
    resumidoArchivo : informeResumido,
    resumidoEncabezado : encabezadoInfResumido,
    erroresArchivo : informeErrores,
    erroresEncabezado : encabezadoInfErrores
};

module.exports.informe = informe;
