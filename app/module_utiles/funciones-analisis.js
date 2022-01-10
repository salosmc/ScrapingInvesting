
function comprar(resEmpresa){
    
    let cant =0;
    for(let i=0; i<resEmpresa.ingresosTotales.length-1; i++){       
        if(resEmpresa.ingresosTotales[i].value>resEmpresa.ingresosTotales[i+1].value){
            cant ++;
        }  
    }
    //si la cantidad es mayor o igual a 3 trimestres consecutivos

    let firstGoldenRule = false;
    if(cant >= 3 ){
        firstGoldenRule = true;
    }

    //la resEmpresa.rentabilidad de la industria es mayor a la del mercado?
    let secondGoldenRule=false;
    if(resEmpresa.rentabilidad[0]>resEmpresa.rentabilidad[1]){
        secondGoldenRule=true;
    }

    /*Analizamos la tercera regla de oro y sistema tictac*/
    let thirdGoldenRule=false;
    if(resEmpresa.precioVenta[0] <= resEmpresa.precioVenta[1] * 0.5){
        thirdGoldenRule=true;
    }

    if(firstGoldenRule && secondGoldenRule && thirdGoldenRule){
        return true;
    }
    else{
        return false;
    }
}

function vender(resEmpresa){
    if(resEmpresa.precioVenta[0] >= resEmpresa.precioVenta[1] * 1.5){
        return true;
    }else{
        return false;
    }
}

module.exports.comprar = comprar;
module.exports.vender = vender;