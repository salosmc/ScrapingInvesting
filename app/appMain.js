const puppeteer = require('puppeteer');
const fs = require('fs');

const v = require('./module_utiles/variables');
const buscar = require('./module_utiles/funciones-buscar');
const analizar = require('./module_utiles/funciones-analisis');

const empresas = JSON.parse(fs.readFileSync('./empresas.json',"UTF-8"));

//Encabezado del informe completo
fs.writeFileSync(v.informe.completoArchivo, v.informe.completoEncabezado);

//Encabezado del informe resumido
fs.writeFileSync(v.informe.resumidoArchivo, v.informe.resumidoEncabezado);

//Encabezado de informe de errores
fs.writeFileSync(v.informe.erroresArchivo, v.informe.erroresEncabezado);

(async()=>{

    const startAll = new Date();
    let sumaTime = 0;

    //obtenemos el navegador con el que vamos a trabajar
    const browser = await puppeteer.launch(({ headless : true }));

    //Abrimos las pestañas con la que vamos a trabajar.
    const page2 = await browser.newPage();

    let contador = 0;

    for(let posEmpresa = 0; posEmpresa < empresas.length; posEmpresa++){
        
        /*Da inicio al proceso por empresa */
        const start = new Date();

        let resEmpresa = {
            name : empresas[posEmpresa].name,
            ref : empresas[posEmpresa].ref,
            ingresosTotales : [],
            rentabilidad : '-',
            precioVenta: [],
            recomendacion: '-',
            href: empresas[posEmpresa].src
        };

        /*Aca empezamos a trabajar con Cuenta de Resultados(Ingresos) */
        try{
            //Abrimos la pagina de la empresa
            await page2.goto(`${empresas[posEmpresa].src}`);
            await page2.waitForSelector('nav.navbar_navbar__2yeca',{timeout:5000});

            //Aca buscamos las paginas con las que vamos a trabajar Cuenta resultados y Ratios
            let pagEmpresa = await buscar.pagUtiles(page2);

            //Abrimos la pagina CuentaResultados de la empresa.
            await page2.goto(pagEmpresa.cuentaResultados);
            await page2.waitForSelector('tr#parentTr.openTr.pointer',{timeout:5000});

            //Aca buscamos los ingresos totales de la empresa.
            resEmpresa.ingresosTotales = await buscar.ingresos(page2);

            /*-----------Aca trabajamos empezamos con los ratios ---------- */
    
            //Abrimos la pagina Ratios de la empresa.
            await page2.goto(pagEmpresa.ratios);
            await page2.waitForSelector('tr.child td',{timeout:5000});

            //Aca buscamos la rentabilidad en la pagina de la empresa.
            resEmpresa.rentabilidad = await buscar.rentabilidad(page2);

            //Aca buscamos precio/venta en la pagina de la empresa
            resEmpresa.precioVenta = await buscar.precioVenta(page2);

            /*EMPIEZO A ANALIZAR LOS RESUTLADOS */

            /*Aca filtramos analisis para comprar */
            if(analizar.comprar(resEmpresa)){
                resEmpresa.recomendacion='Comprar';
                let contenido = `${resEmpresa.name};${resEmpresa.ref};${resEmpresa.recomendacion};${resEmpresa.href}\n`
                fs.appendFileSync(v.informe.resumidoArchivo,contenido);
            }

            /*Segundo es recomendable vender??? */
            if(analizar.vender(resEmpresa)){
                //console.log('Se recomienda vender')
                resEmpresa.recomendacion='Vender';
                let contenido = `${resEmpresa.name};${resEmpresa.ref};${resEmpresa.recomendacion};${resEmpresa.href}\n`
                fs.appendFileSync(v.informe.resumidoArchivo,contenido);
            }

            //console.log(resEmpresa); 
            let contenido = `${resEmpresa.name};${resEmpresa.ref};${resEmpresa.ingresosTotales[0].date};${resEmpresa.ingresosTotales[0].value};${resEmpresa.ingresosTotales[1].date};${resEmpresa.ingresosTotales[1].value};${resEmpresa.ingresosTotales[2].date};${resEmpresa.ingresosTotales[2].value};${resEmpresa.ingresosTotales[3].date};${resEmpresa.ingresosTotales[3].value};${resEmpresa.rentabilidad[0]};${resEmpresa.rentabilidad[1]};${resEmpresa.precioVenta[0]};${resEmpresa.precioVenta[1]};${resEmpresa.recomendacion};${resEmpresa.href}\n`;
            fs.appendFileSync(v.informe.completoArchivo, contenido);
                    
        }catch(e){
            //console.error(empresas[posEmpresa],e);
            //cantidad de veces que intenta refrecar la pagina si tiene algun error.
            if(e.name == 'TimeoutError'){
                if(contador<2){
                    posEmpresa --;
                    contador ++;
                }else{
                    let contenido = `${resEmpresa.name} ;${resEmpresa.ref} ;${resEmpresa.href} ;Error al cargar la pagina\n`;
                    fs.appendFileSync(v.informe.erroresArchivo,contenido);
                    contador = 0;
                }
            }else{
                let contenido = `${resEmpresa.name} ;${resEmpresa.ref} ;${resEmpresa.href} ;${e}\n`;
                fs.appendFileSync(v.informe.erroresArchivo,contenido);
            }
        }

        //Finaliza el proceso por empresa
        const end = new Date();
        sumaTime = sumaTime + (end-start)/1000;
        console.log(`el tiempo de ejecucion para la empresa ${resEmpresa.name} es : ${(end-start)/1000}`);
    }

    //Cerramos la pagina
    await browser.close();

    console.log(`la suma de todos los tiempos de ejecucion es : ${sumaTime}`);

    //Damos por finalizado todo el proceso.
    const endAll = new Date()
    console.log(`el tiempo de ejecucion total es : ${(endAll-startAll)/1000}`);

})();
