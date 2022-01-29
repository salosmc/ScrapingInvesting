
/*Codigo asincrono no bloqueante */
/*
(()=>{
    const puppeteer = require('puppeteer');
    console.log("Código Asíncrono");
    console.log("Inicio");
    
    function dos(){
        setTimeout(()=>{
            console.log("Dos");
        },1000);
    }
    function uno(){
        setTimeout(()=>{
            console.log("Uno");
        },0);
        dos();
        console.log("Tres");
    }
    uno();
    console.log("Fin");
})();
 */

async function cerrarNav(){
    await browser.close();
}

async function proceso1(browser, empresa){
    const start = new Date();
    try{
        const page = await browser.newPage();

        //Indicamos que pagina queremos abrir.
        await page.goto(empresa.src);
        await page.waitForSelector('nav.navbar_navbar__2yeca',{timeout:5000});
        //Proceso
        await page.screenshot({path: `${empresa.name}.jpg`});
    }
    catch(e){
        console.log(`${empresa.name}, error: ${e.name}`);
    }
    
    //Si la empresa termino
    const end = new Date();
    console.log(`el tiempo de ejecucion para la empresa ${empresa.name} es : ${end-start}`);
}

const puppeteer = require('puppeteer');

const empresas = [{name:'Apple',src:'https://es.investing.com/equities/apple-computer-inc'},
                {name:'Microsoft',src:'https://es.investing.com/equities/microsoft-corp'},
                {name:'Samsung',src:'https://es.investing.com/equities/samsung-electronics-co-ltd?cid=104387'},
                {name:'Amazon.com Inc',src:'https://es.investing.com/equities/amazon-com-inc'},
                {name:'Tesla Inc',src:'https://es.investing.com/equities/tesla-motors'},
                {name:'Meta Platforms Inc',src:'https://es.investing.com/equities/facebook-inc'},
                {name:'NVIDIA Corporation',src:'https://es.investing.com/equities/nvidia-corp'},
                {name:'Tencent Holdings',src:'https://es.investing.com/equities/tencent-holdings-hk?cid=53031'},
                {name:'Walmart Inc',src:'https://es.investing.com/equities/wal-mart-stores'},
                {name:'Nestle SA ADR',src:'https://es.investing.com/equities/nestle-sa-pk'}];

(async()=>{

    const browser = await puppeteer.launch(({ headless : true }));

    for(let i=0; i<(empresas.length-7); i++){
        //try{
            proceso1(browser, empresas[i]);
    
        //}catch(e){
        //    console.log(`${empresas[i].name}, error: ${e.name}`);
        //}
    }

    //cerramos
    //await browser.close();

})();