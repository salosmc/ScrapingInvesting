/*ALGUNAS FUNCIONES UTILES*/

async function buscarEmpresas(page){
    let empresas = await page.evaluate(()=>{
        let array = [];
        let elements = document.querySelectorAll('td.symbol.left.bold.elp a');
        let simbolos = document.querySelectorAll('tr td[class="left"]');

        for(let i = 0; i<elements.length;i++){
            /*
            Aca me gustaria acceder a la empresa y sacar la informacion que me interesa.
            Pero por no me esta dejando trabajar con iwait dentro de page.evaluate()
            */
            array.push({name:elements[i].title, src:elements[i].href, ref: simbolos[i].innerText });
        }
        return array;
    });
    return empresas;
}

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
    return pagUtiles;
}

async function buscarIngresos(page){
    if(!page){
        return null;
    }

    let ingresos = await page.evaluate(()=>{

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
                array.push({date: dates[i].innerText.replace(/[\n \/]/,'- '),
                            value:parseFloat(elements[i].innerText.replaceAll('.','').replace(',','.'))});
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

module.exports.precioVenta = buscarPrecioVenta;
module.exports.rentabilidad = buscarRentabilidad;
module.exports.ingresos = buscarIngresos;
module.exports.empresas = buscarEmpresas;
module.exports.pagUtiles = buscarPagUtiles;

