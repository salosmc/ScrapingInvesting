const puppeteer = require('puppeteer');

(async()=>{

    //obtenemos el navegador con el que vamos a trabajar
    const browser = await puppeteer.launch(({ headless : true }));

    //Abrimos la pagina con la que vamos a trabajar, es como abrir una pestaña.
    const page = await browser.newPage();

    //Indicamos que pagina queremos abrir.
    await page.goto('https://es.investing.com');

    //Tomamos una captura de la pagina inicio
    await page.screenshot({path: 'investing1.jpg'});

    //Hacemos click en la barra de busqueda de algun input
    await page.click('.js-search-input.inputDropDown');
    await page.click('#countriesUL [data-value = "5"]');

    //Escribimos en la barra de busqueda de algun input
    //await page.type('.js-search-input.inputDropDown', 'Estados Unidos');
    await page.waitForTimeout(3000);
    await page.screenshot({path: 'investing2.jpg'});

    //Hacemos click en el boton de buscar
    await page.click('.newBtn.Orange2.noIcon.js-stockscreener-hp');

    /*Aca hay que tener cuidado por que nos va a dirigir a otra pagina
    y como es el caso de await, tenemos que esperar a que suceda las cosas
    en este caso podemos determinar un tiempo o indicar que elemento deberia renderizar */

    //usamos waitForSelector para esperar que cierto elemento o atributo aparezca renderizada en la pagina.
    await page.waitForSelector('.symbol.left.bold.elp');
    await page.waitForTimeout(3000);
    await page.screenshot({path: 'investing3.jpg'});

    /*Para poder ver la ejecucion en el buscador agregamos
     puppeteer.launch({ headless : false });*/

    //Cerramos la pagina
    await browser.close();

})();

