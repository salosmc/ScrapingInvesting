const puppeteer = require('puppeteer');
/*
function selectData(elements, first, ultim){
    let array = [];
    let flag = false;
    for (let e of elements){
        if(e.innerText == first){
            flag = true;
        }
        if(e.innerText == ultim){
            flag = false;
        }
        if(flag){
            array.push(isNaN(parseFloat(e.innerText))? e.innerText : parseFloat(e.innerText.replace(',','.')));
        }
    }
    return array;
}
*/
(async()=>{
    const browser3 = await puppeteer.launch(({ headless : true }));
    const page3 = await browser3.newPage();
    //Indicamos que pagina queremos abrir.
    await page3.goto('https://es.investing.com/equities/apple-computer-inc-ratios');
    //Esperamos que se cargue la pagina
    await page3.waitForSelector('tr.child.startGroup');
    //Captura
    await page3.screenshot({path: 'PaginaAccionesRatios.jpg'});

    let rentabilidad = await page3.evaluate(()=>{
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
            if(flag){
                array.push(isNaN(parseFloat(e.innerText))? e.innerText : parseFloat(e.innerText.replace(',','.')));
            }
        }
        return array;
        //return selectData(elements,'Rentabilidad sobre fondos propios TTM','Rentabilidad sobre fondos propios 5YA');
    });

    console.log(rentabilidad);

    //la rentabilidad de la industria es mayor a la del mercado?
    if(rentabilidad[1]>rentabilidad[2]){
        console.log("cumple la segunda regla de oro (es rentable)");
    }

    let precioVenta = await page3.evaluate(()=>{
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
            if(flag){
                array.push(isNaN(parseFloat(e.innerText))? e.innerText : parseFloat(e.innerText.replace(',','.')));
            }
        }
        return array;

    });

    console.log(precioVenta);

    if(precioVenta[1] <= precioVenta[2] * 0.5){
        console.log('Se recomienda comprar');
    }
    if(precioVenta[1] >= precioVenta[2] * 1.5){
        console.log('Se recomienda vender');
    }

    await browser3.close();

})();
