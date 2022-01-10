const puppeteer = require('puppeteer');
const fs = require('fs');

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


(async()=>{
    const browser = await puppeteer.launch(({ headless : true }));
    //let pagPrincipal = await abrirPaginaPrincipal(browser);
    const page = await browser.newPage();

    await page.goto(`https://es.investing.com/stock-screener/?sp=country::5|sector::a|industry::a|equityType::a|exchange::a%3Ceq_market_cap;1`);
    await page.waitForSelector('td.symbol.left.bold.elp',{timeout:5000});

    //let cantSubPag = await page.evaluate(()=>document.querySelectorAll('a.pagination').length);
    /*por experiencia navegando sé que es tiene 200 paginas de 50 empresas cada una */
    const cantSubPag = 10;
    let array = []

    for (let i=1; i<= cantSubPag; i++){

        array = array.concat(await buscarEmpresas(page));

        //Indicamos que pagina queremos abrir.
        await page.goto(`https://es.investing.com/stock-screener/?sp=country::5|sector::a|industry::a|equityType::a|exchange::a%3Ceq_market_cap;${i+1}`);
        await page.waitForSelector('td.symbol.left.bold.elp',{timeout:5000});

    }
    //console.log(array);
    fs.writeFileSync('empresas.json',JSON.stringify(array));

    await browser.close();
})();
