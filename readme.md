# App Scraping Web

### Desarrollado en JavaScript con la librería [puppeteer](https://developers.google.com/web/tools/puppeteer) de google

</br>

Hola👋, en este directorio van a encontrar mi primer proyecto de Scraping Web. Lo hice para aprender más sobre este mundo tan interesante de la lectura y análisis de datos, y también para practicar con JavaScript.

En este proyecto se extraen y analizan datos de empresas que cotizan en la bolsa de EEUU desde la página de [Investing](https://es.investing.com/stock-screener/?sp=country::5|sector::a|industry::a|equityType::a|exchange::a%3Ceq_market_cap;1), y se generan tres informes con datos específicos, recomendaciones para la toma de decisiones y errores.

La lógica utilizada es la siguiente:

</br>

## Empresas

Primero, obtenemos un [Json](Pruebas/empresas.json) con todas las páginas de las empresas que queremos extraer datos y analizar.

El código está en [Pruebas/appBuscarEmpresas.js](Pruebas/appBuscarEmpresas.js).

</br>

## Funciones útiles

### Buscar

En [app/module_utiles/funciones-buscar.js](app/module_utiles/funciones-buscar.js), encontraran las funciones que se utilizaron para extraer datos específicos de la página.

### Analizar

En [app/module_utiles/funciones-analisis.js](app/module_utiles/funciones-analisis.js), encontraran las funciones que se utilizaron para analizar los datos y determinar si es recomendable comprar o vender. 

Para este campo se usaron las condiciones que sugiere el inversor [Gaston Lentini](https://www.linkedin.com/in/gastonlentini/) en su curso.

</br>

## App

Una vez que tenemos las páginas de las empresas a analizar en un Json, con [appMain.js](app/appMain.js) navegamos por cada página de manera sincrónica y en serie, utilizando las funciones de búsqueda y análisis de datos, y reportamos tres informes.
</br>
Un [informe resumido](app/informeResumido), donde figuran todas las empresas que según el análisis es recomendable tomar acción de compra o venta.
</br>
El segundo [informe es completo](app/informeCompleto), muestra todos los datos y las empresas que pudieron ser analizadas.
</br>
Y por último el [informe de errores](app/informeErrores1), debido a la inestabilidad de internet, estructura de la página analizada, entre otros motivos. Se generan errores con mucha frecuencia y son reportados.

</br>

## Ejecución

Para su ejecución tienen que tener instalada la librería [puppeteers de google](https://developers.google.com/web/tools/puppeteer) y Node. Por otro lado, el [Json](Pruebas/empresas.json) es el que menos cambios percibe, pero si es la primera vez o paso mucho tiempo, les recomiendo que vuelvan a ejecutar [appBuscarEmpresas.js](Pruebas/appBuscarEmpresas.js).

Luego solo queda ejecutar [appMain.js](app/appMain.js), si ven el Json se van a dar cuenta que son al rededor de 10000 páginas ademas que cada proceso es sincrónico y en serie. Por lo tanto, puede tardar aproximadamente 60 hs ejecutándose.

</br>

## Observaciones

Me queda pendiente mejorar aun :

- Control de errores.
- Validaciones de funciones.
- Refactorización.
- Asincronismo.