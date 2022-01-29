
//Creemos nuestra excepcion propia

class LaLiaoParda extends Error{
    message = 'Pues nah, que la liao parda';
}

let arrayErr = [false, false, true, false, true];


for(let i=0; i<arrayErr.length; i++){
    let a = [];

    //suponemos que paso por alguna funcion y quedo con el valor null
    a = null; 

    try{
        //Tiramos error personalizado
        if(arrayErr[i]){
            throw new LaLiaoParda();
        }

        //Tiremos otro error para mostrar que deja de ejecutar el codigo
        //ya que no es un error controlado.
        //throw new Error('Me lo invento');

        //supongamos que sin saber lo que sucedio tratamos de acceder al dato del array.
        let b = a[0];
    }catch(err){
        //es buena practica siempre consologuear los errores.
        //console.error(err);

        //Tambien puede pasar que me interesa controlar solo algun tipo de error
        //Y en caso que sea otro, que me cancele la ejecucion.
        if( err instanceof TypeError){
            console.error(err);
        }else{
            //throw err; //si es otro tipo de error, queremos que se salga del proceso
            console.error(err);
        }

    }

    //node --> TypeError:Cannor read property '0' of null

    console.log('Hola');//Esto asi como esta no lo ejecuta.

}

