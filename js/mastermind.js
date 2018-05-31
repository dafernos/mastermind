{
	let colores=["black","white","blue","red","yellow","green","purple","brown"];
	const NUM_BOLAS = 4;
	var mastermind=(function(){
		let combinacion=[];
		let init = function(){
			generaCombinacion();
			mostrar();
		};
		//muestra la combinación objetivo por consola.
		let mostrar=function(){
			console.log(combinacion);		
		};
		//genera una combinación de negros (número de bolas que están en su sitio) y blancos (número de bolas que estám, pero no en su sitio).
		let comprobarIntento=function(intento){
			let salir;
			let copiacombinacion=combinacion.slice();
			//negros(en su sitio)
			let blancas=0;
			let negras=0; 
			for (let i = 0; i < intento.length; i++) {
				if(intento[i]===copiacombinacion[i]){
					negras++; 
					copiacombinacion[i]=undefined;
					intento[i]=null;
				}
			}
			//blancos(estan en otra posicion)
			for(let i=0; i < intento.length;i++){
				salir = false;
				for (let  j= 0; j < copiacombinacion.length; j++) {
					if(copiacombinacion[j]===intento[i] && salir===false){
						blancas++;
						copiacombinacion[j]=undefined;
						break;
					}
				}
			}
			return {
				negras: negras,
				blancas: blancas
			}
		};
		//genera una combinación.
		let generaCombinacion = function(){
			blancas=negras=0;
			if(combinacion) combinacion=[];
			for (let i = 0; i < NUM_BOLAS; i++) {
				combinacion.push(colores[parseInt(Math.random()*8)]);
			}
		}
		return {
			init:init,
			comprobarIntento:comprobarIntento,
			mostrar:mostrar,
		}
	})();

	//Poner colores a las bolas que se selecionan para insertarse
	let bolasColores=function () {
		var coloresElegir = document.getElementsByClassName('color');
		for (let i = 0; i <= coloresElegir.length-1; i++) {
			coloresElegir[i].setAttribute('style','background: '+colores[i]);
			coloresElegir[i].addEventListener('click',comportamiento.ponerBola);
		}
	};

	var comportamiento = (function() {
		//fila a insertar
		let fila;
		//numero de bola puesta en la fila
		let conBola=0;
		//numero de fila
		let conFila=0;
		let colorSeleccionado;
		let bolAcierto;
		let crearFila =function () {
			//cogemos las bolas de la fila
			fila=document.getElementsByClassName("bola"+conFila);
			let filaNueva = document.createElement('div');
			filaNueva.setAttribute('class', 'fila'+conFila);
			let bolasVacias = document.createElement('div');
			bolasVacias.setAttribute('class','wrapper linea');
			let aciertosVacios = document.createElement('div')
			aciertosVacios.setAttribute('class',' wrapper cuatro');
			//creamos las bolas para colocar y los aciertos
			for (let i = 0; i < NUM_BOLAS; i++) {
				bola = document.createElement("div");
				bola.setAttribute('class',"circle bola"+conFila);
				bolasVacias.appendChild(bola);
				acierto = document.createElement("div");
				acierto.setAttribute('class',"circle acierto"+conFila);
				aciertosVacios.appendChild(acierto);
			};
			conFila++;
			filaNueva.appendChild(bolasVacias);
			filaNueva.appendChild(aciertosVacios);
			document.getElementById('filas').appendChild(filaNueva);
		};
		//Quitar bola de la fila
		let quitarBola =function (event) {
			event.target.setAttribute('style','background:""');
			event.target.removeEventListener("click", quitarBola);
			conBola--;
		};
		//Poner bola en la fila
		let ponerBola=function (event) {
			let btncomprobar = document.getElementById('comprobar')
			colorSeleccionado = event.target.style.backgroundColor;
			/*if (conBola==4) {
				btncomprobar.removeAttr('disabled');
			}else{
				btncomprobar.setAttribute('disabled',true);
			}*/
			for (let i = 0; i <= fila.length-1 ; i++) {
				if (fila[i].style.background === ""){
					fila[i].style.background =colorSeleccionado;
					fila[i].addEventListener("click", quitarBola);
					conBola++;
					break;
				}
			}
			
		}
		let comprobarFila=function () {
			let combinacion=[];
			bolAcierto = document.getElementsByClassName('acierto'+(conFila-1));
			let aciertos;
			for (let i = 0; i <= fila.length - 1; i++) {
				combinacion.push(fila[i].style.backgroundColor);
			}
			if (conBola==4) {
				aciertos = mastermind.comprobarIntento(combinacion);
				//Poner aciertos (bolas negras)
				if (aciertos.negras > 0 ){
					for (let i = 0; i < aciertos.negras; i++) {
						bolAcierto[i].style.background = "black";
					};
				};
				//Poner aciertos (bolas blancas)
				if (aciertos.blancas > 0){
					for (let i = 0; i < aciertos.blancas; i++) {
						bolAcierto[aciertos.negras+i].style.background= 'white';
					};
				}; 
				//si hay 4 aciertos o llega a 7 intentos se finaliza el juego
				if(aciertos.negras === NUM_BOLAS){
					document.getElementById('ganado').setAttribute('style','display:block');
					document.getElementById('finTexto').innerHTML='<h1>Has Ganado</h1>';
					quitarEvento();
				}else{
					quitarEvento();
					crearFila();
				}
				conBola=0;
			}
		}
		let quitarEvento = function(){
			for (let i = 0; i <= fila.length-1 ; i++) {
				fila[i].removeEventListener("click", quitarBola);
			};
		}
		return{
			crearFila:crearFila,
			quitarBola:quitarBola,
			ponerBola:ponerBola,
			comprobarFila:comprobarFila,
		}
	})();
	//Iniciar Juego
	var init=function(){
		mastermind.init();
		comportamiento.crearFila();
		bolasColores();
	}

	var reiniciar= function(){ 
		document.getElementById('filas').innerHTML="";
		document.getElementById('ganado').style.display='none';
		init();
	}

	window.addEventListener('load',init);
	document.getElementById('fin').addEventListener('click',reiniciar);
	document.getElementById('comprobar').addEventListener('click',comportamiento.comprobarFila);
}