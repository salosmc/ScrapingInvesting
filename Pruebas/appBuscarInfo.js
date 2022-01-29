const puppeteer = require('puppeteer');

/*ALGUNAS FUNCIONES UTILES*/

async function buscarPagUtiles(page){
    if(!page){
        return null;
    }
    let pagUtiles = await page.evaluate(()=>{
        //buscamos la pagina de Cuenta de resultados.
        let cuentaResultados = document.querySelector('a[data-test="Cuenta-de-resultados"]');
        let ratios = document.querySelector('a[data-test="Ratios"]');
        return {cuentaResultados: cuentaResultados.href, ratios: ratios.href};
    });
    if(!pagUtiles){
        return null;
    }
    return pagUtiles;
}

async function buscarIngresos(page){

    let ingresos = await page.evaluate(()=>{

        let elements = document.querySelectorAll('tr#parentTr.openTr.pointer td');
        let dates = document.querySelectorAll('#header_row.alignBottom th');
        let array = [];
        let flag = false;
        let j = 1;
        //ya esta funcionando, solo le indico el primer elemento.
        for(let i=0; i < elements.length; i++){
        
            //incio 
            if(elements[i].innerText == 'Ingresos totales'){
                flag = true;
            }
            //fin
            if(isNaN(parseFloat(elements[i].innerText)) && array.length!=0){
                flag = false;
            }

            if(!isNaN(parseFloat(elements[i].innerText)) && flag){
                array.push({date: dates[j].innerText.replace(/[\n \/]/,'- '),
                            value:parseFloat(elements[i].innerText.replace(/,/,'.'))});
                j++;
            }
        }
        return array;
    });

    return ingresos;
}

async function buscarRentabilidad(page){
    if(!page){
        return null;
    }
    //aca validamos que los elementos que vamos a analizar se hayan cargado bien
    //3 es la posicion del nodo donde se encuentra la informacion que me interesa
    // if(!(await page.waitForFunction(()=> document.querySelectorAll('tr#childTr.noHover')[3]))){
    //     return null;
    // }

    let rentabilidad = await page.evaluate(()=>{
        let elements = document.querySelectorAll('tr#childTr.noHover')[3].querySelectorAll('tr.child.startGroup td');
        let array = [];
        let flag = false;
        for (let e of elements){
            if(e.innerText == 'Rentabilidad sobre fondos propios TTM'){
                flag = true;
            }
            if(isNaN(parseFloat(e.innerText)) && array.length!=0){
                flag = false;
            }
            if(!isNaN(parseFloat(e.innerText)) && flag){
                let data = e.innerText.replaceAll('.','').replace(',','.');
                //let data2 = data.replace(',','.');
                array.push(parseFloat(data));
            }
        }
        return array;
        //return selectData(elements,'Rentabilidad sobre fondos propios TTM','Rentabilidad sobre fondos propios 5YA');
    });
    return rentabilidad;
}


async function buscarPrecioVenta(page){
    if(!page){
        return null;
    }
    // validamos que el bloque donde vamos a extraer los datos se haya cargado bien
    //3 es la posicion del nodo donde se encuentra la informacion que me interesa
    // if(!(await page.waitForFunction(()=> document.querySelectorAll('tr#childTr.noHover')[0]))){
    //     return null;
    // }

    let precioVenta = await page.evaluate(()=>{
        let elements = document.querySelectorAll('tr#childTr.noHover')[0].querySelectorAll('tr.child td');
        let array = [];
        let flag = false;
        //ya esta funcionando, solo le indico el primer elemento.
        for (let e of elements){
            if(e.innerText == 'Precio/Ventas TTM'){
                flag = true;
            }
            if(isNaN(parseFloat(e.innerText)) && array.length!=0){
                flag = false;
            }
            if(!isNaN(parseFloat(e.innerText)) && flag){
                let data = e.innerText.replaceAll('.','').replace(',','.');
                array.push(parseFloat(data));
            }
        }
        return array;
    });

    return precioVenta;
}

(async()=>{
    //obtenemos el navegador con el que vamos a trabajar
    const browser = await puppeteer.launch(({ headless : true }));

    //Abrimos las pestañas con la que vamos a trabajar.
    const page2 = await browser.newPage();

    /*Aca empezamos a trabajar con Cuenta de Resultados(Ingresos) */
    try{
        /*
        //Abrimos la pagina de la empresa
        await page2.goto('https://es.investing.com/equities/daimler-adr');
        await page2.waitForSelector('nav.navbar_navbar__2yeca',{timeout:5000});

        //Aca buscamos las paginas con las que vamos a trabajar Cuenta resultados y Ratios
        let pagEmpresa = await buscarPagUtiles(page2);

        //Abrimos la pagina CuentaResultados de la empresa.
        await page2.goto(pagEmpresa.cuentaResultados);
        await page2.waitForSelector('tr#parentTr.openTr.pointer',{timeout:5000});

        //Aca buscamos los ingresos totales de la empresa.
        let ingresosTotales = await buscarIngresos(page2);
        console.log(ingresosTotales);
        */
        /*-----------Aca trabajamos empezamos con los ratios ---------- */

        //Abrimos la pagina Ratios de la empresa.
        await page2.goto('https://es.investing.com/equities/tokyo-electron-ltd.-ratios?cid=53017');
        await page2.waitForSelector('tr.child td',{timeout:5000});


        //Aca buscamos la rentabilidad en la pagina de la empresa.
        let rentabilidad = await buscarRentabilidad(page2);
        console.log(rentabilidad);

        //Aca buscamos precio/venta en la pagina de la empresa
        let precioVenta = await buscarPrecioVenta(page2);
        console.log(precioVenta);

    }catch(e){
        console.log(e);
    }

    await browser.close();
})();
