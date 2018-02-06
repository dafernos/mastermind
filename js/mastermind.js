{
	let colores=["black","white","blue","red","yellow","green","purple","brown"];
	let numBolas = 4;
	var mastermind=(function(){
		let combinacion=[];
		let negras,blancas;
		let posicionbn=[];

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
			posicionbn.length=0;
			let copiacombinacion=combinacion.slice();
			//negros(en su sitio)
			negras=0; 
			for (let i = 0; i <= intento.length-1; i++) {
				if(intento[i]===copiacombinacion[i]){
					negras++; 
					copiacombinacion[i]=undefined;
					intento[i]=null;
					posicionbn[i]="n";
				}
			}
			//blancos(estan en otra posicion)
			blancas=0;
			for(let i=0; i <= intento.length-1;i++){
				salir = false;
				for (let  j= 0; j <= copiacombinacion.length-1; j++) {
					if(copiacombinacion[j]===intento[i] && salir===false){
						blancas++;
						copiacombinacion[j]=undefined;
						
						posicionbn[j]="b";
						salir=true;
					}
				}
			}
			return {
				negras: negras,
				blancas: blancas,
				copiacombinacion:copiacombinacion,
			}
		};
		//genera una combinación.
		let generaCombinacion = function(){
			negras=0;
			blancas=0;
			if(combinacion) combinacion=[];
			for (let i = 0; i < numBolas; i++) {
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
			for (let i = 0; i < numBolas; i++) {
				bola = document.createElement("div");
				bola.setAttribute('class',"circle bola"+conFila);
				bolasVacias.appendChild(bola);
				acierto = document.createElement("div");
				acierto.setAttribute('class',"circle acierto"+conFila);
				aciertosVacios.appendChild(acierto);
			}
			conFila++;
			filaNueva.appendChild(bolasVacias);
			filaNueva.appendChild(aciertosVacios);
			document.getElementById('filas').appendChild(filaNueva);
		}
		//Quitar bola de la fila
		let quitarBola =function (event) {
			event.target.setAttribute('style','background:""');
			event.target.removeEventListener("click", quitarBola);
			conBola--;
		}
		//Poner bola en la fila
		let ponerBola=function (event) {
			colorSeleccionado = event.target.style.backgroundColor;
			for (let i = 0; i <= fila.length-1 ; i++) {
				if (fila[i].style.background === ""){
					fila[i].setAttribute('style','background:'+colorSeleccionado);
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
			if (conBola ==4) {
				aciertos = mastermind.comprobarIntento(combinacion);
				//Poner aciertos (bolas negras)
				if (aciertos.negras > 0 ){
					console.log(aciertos.negras);
					for (let i = 0; i < aciertos.negras; i++) {
						bolAcierto[i].style.background = "black";
					};
				};
				//Poner aciertos (bolas blancas)
				if (aciertos.blancas > 0){
					console.log(aciertos.blancas);
					for (let i = 0; i < aciertos.blancas; i++) {
						sumBlanc=aciertos.negras+i;
						bolAcierto[sumBlanc].setAttribute('style','background: white');
					};
				}; 
				//si hay 4 aciertos o llega a 7 intentos se finaliza el juego
				if(aciertos.negras === numBolas || conFila===7){
					document.getElementById('ganado').setAttribute('style','display:block');
					let adivinar = document.getElementById('conad');
					if (conFila===7) {
						
						bola =document.getElementsByClassName('boladi');
						for (let i = 0; i < numBolas; i++) {
							bola[i].setAttribute('style','background:'+aciertos.copiacombinacion[i]);
						}
						document.getElementById('finTexto').innerHTML='<h1>Has Perdido</h1>';
					}else{
						document.getElementById('finTexto').innerHTML='<h1>Has Ganado</h1>';
					}
					adivinar.setAttribute('style','display:block');
					quitarEvento();
				}else{
					quitarEvento();
					crearFila();
				}
			}
			conBola=0;
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
		document.forms[0].elements[0].removeEventListener('click',init);
	}
	var reiniciar= function(){
		document.forms[0].elements[0].addEventListener('click',init);
		document.getElementById('filas').innerHTML="";
		document.getElementById('ganado').setAttribute('style','display:none');
	}
	window.addEventListener('load',bolasColores);
	document.forms[0].elements[0].addEventListener('click',init);
	document.forms[0].elements[1].addEventListener('click',reiniciar);
	document.getElementById('fin').addEventListener('click',reiniciar);
	document.getElementById('comprobar').addEventListener('click',comportamiento.comprobarFila);
}