const puppeteer = require('puppeteer');
//const url = 'https://es.investing.com/equities/jp-morgan-chase';

let errReadPag = [];

(async()=>{

    const browser2 = await puppeteer.launch(({ headless : true }));
    const page2 = await browser2.newPage();

    try{
        //Indicamos que pagina queremos abrir.
        await page2.goto(`https://es.investing.com/equities/jp-morgan-chase-income-statement`);
        //Esperamos que se cargue la pagina
        await page2.waitForSelector('tr#parentTr.openTr.pointer');
        //Captura
        await page2.screenshot({path: 'PaginaAccionesPrimeraEmpresa.jpg'});

        //Analizamos los datos de la pagina y seleccionamos las empresas que cumplen
        //con la primera regla de oro.
        let ingresosTotales = await page2.evaluate(()=>{
            let elements = document.querySelectorAll('tr#parentTr.openTr.pointer td');
            let dates = document.querySelectorAll('#header_row.alignBottom th');
            let array = [];
            let flag = false;
            //ya esta funcionando, solo le indico el primer elemento.
            for(let i=0; i<elements.length;i++){
                if(elements[i].innerText == 'Ingresos totales'){
                    flag = true;
                }
                if(isNaN(parseFloat(elements[i].innerText)) && array.length!=0){
                    flag = false;
                }
                if(!isNaN(parseFloat(elements[i].innerText)) && flag){
                    array.push({date: dates[i].innerText.replace(/[\n \/]/,'/'),
                                value:parseFloat(elements[i].innerText.replace(',','.'))});
                }
            }
            return array;
        });

        console.log(ingresosTotales);

        await page2.goto(`https://es.investing.com/equities/jp-morgan-chase-ratios`);
        //Esperamos que se cargue la pagina
        await page2.waitForSelector('tr.child.startGroup');

        let rentabilidad = await page2.evaluate(()=>{
            let elements = document.querySelectorAll('tr.child td');
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
                    array.push(parseFloat(e.innerText.replace(',','.')));
                }
            }
            return array;
            //return selectData(elements,'Rentabilidad sobre fondos propios TTM','Rentabilidad sobre fondos propios 5YA');
        });
        
        console.log(rentabilidad);

        let precioVenta = await page2.evaluate(()=>{
            let elements = document.querySelectorAll('tr.child td');
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
                    array.push( parseFloat(e.innerText.replace(',','.')));
                }
            }
            return array;

        });

        console.log(precioVenta);

        /*ACA EMPIEZA EL ANALISIS DE LOS RESULTADOS */

        //aca tambien se puede arreglar mas. por el momento lo dejamos asi
        let cant =0;
        for(let i=0; i<ingresosTotales.length-1; i++){       
            if(ingresosTotales[i].value>ingresosTotales[i+1].value){
                cant ++;
            }  
        }
        console.log(cant);
        //si la cantidad es mayor o igual a 3 trimestres consecutivos
        if(cant >= 3 ){
            console.log("cumple la primer regla de oro");
        }else{
            console.log("no cumple la primer regla de oro");
        }
        //la rentabilidad de la industria es mayor a la del mercado?
        if(rentabilidad[0]>rentabilidad[1]){
            console.log("cumple la segunda regla de oro (es rentable)");
        }

        if(precioVenta[0] <= precioVenta[1] * 0.5){
            console.log('Cumple la tercera regla de oro (esta barata)');
        }

        if(precioVenta[0] >= precioVenta[1] * 1.5){
            console.log('Se recomienda vender');
        }
    }catch(e){
        console.log(e);
    }
    

    await browser2.close();

})();
