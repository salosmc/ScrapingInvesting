const puppeteer = require('puppeteer');
const fs = require('fs');

async function buscarEmpresas(page){
    let empresas = [];
    empresas = await page.evaluate(()=>{
        let array = [];
        let elements = null;
        let simbolos = null;
        let nEmpresa = 0;
        do{
            if(!elements && !simbolos){
                elements = document.querySelectorAll('td.symbol.left.bold.elp a');
                simbolos = document.querySelectorAll('tr td[class="left"]');
            }else{   
                array.push({name:elements[nEmpresa].title, src:elements[nEmpresa].href, ref: simbolos[nEmpresa].innerText });
                nEmpresa++;
            }

        }while(nEmpresa<elements.length);

        return array;
    });
    return empresas;
        
}


(async()=>{
    const browser = await puppeteer.launch(({ headless : true }));
    //let pagPrincipal = await abrirPaginaPrincipal(browser);
    const page = await browser.newPage();

    await page.goto(`https://es.investing.com/stock-screener/?sp=country::5|sector::a|industry::a|equityType::a|exchange::a%3Ceq_market_cap;1`);
    await page.waitForSelector('td.symbol.left.bold.elp',{timeout:5000});

    let cantSubPag = await page.evaluate(()=>document.querySelectorAll('a.pagination').length);
    
    for (let i=1; i<= cantSubPag; i++){

        let array = await buscarEmpresas(page);
        console.log(array);

        //Indicamos que pagina queremos abrir.
        await page.goto(`https://es.investing.com/stock-screener/?sp=country::5|sector::a|industry::a|equityType::a|exchange::a%3Ceq_market_cap;${i+1}`);
        await page.waitForSelector('td.symbol.left.bold.elp',{timeout:5000});

    }

    await browser.close();
})();
