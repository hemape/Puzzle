let posicionSeleccionada = -1
let medidasImagen = [];
let numPiezas;
let puntuacion;

principal()
function principal() {

    numPiezas = getNumberPiecesFromUser()
    puntuacion = getMaxScore(numPiezas);
    updateScore(puntuacion);
    let img = new Image()
    img.src = "http://cdn.atomix.vg/wp-content/uploads/2017/11/goku-fusion.jpg"

    img.addEventListener('load', function () {


        createPuzzleLayout(numPiezas, this.width, this.height, img.src)

        medidasImagen[0] = this.height;
        medidasImagen[1] = this.width;

        checkIfSolution(createReferenceSolution(medidasImagen[1], medidasImagen[0], numPiezas), createReferenceSolution(this.width, this.height, numPiezas))

        drawContentPuzzle(shuffle(createReferenceSolution(medidasImagen[1], medidasImagen[0], numPiezas)))


        let celdas = document.getElementsByTagName('td')

        for (let celda of celdas) {
            celda.addEventListener("click", SeleccionarPieza)

        }

    })

}

function SeleccionarPieza() {

    console.log(this.id)
    console.log(posicionSeleccionada)

    let remplazado = this.id.replace("piece", "")

    if (posicionSeleccionada == -1) {


        posicionSeleccionada = remplazado
        this.style.borderColor = "Green"

    } else {

        if (remplazado == posicionSeleccionada) {
            this.style.borderColor = "Black"
            posicionSeleccionada = -1
        } else {
            console.log("CAMBIO")
            this.style.borderColor = "Green"

            let posicionA = document.getElementById('piece' + posicionSeleccionada)
            let posicionB = document.getElementById('piece' + remplazado)

            let pA = posicionA.style.backgroundPosition
            let pB = posicionB.style.backgroundPosition

            posicionA.style.backgroundPosition = pB;
            posicionA.style.borderColor = "Black"
            posicionB.style.backgroundPosition = pA;
            posicionB.style.borderColor = "Black"

            posicionSeleccionada = -1
            decreaseScore(1);
        }

    }

    let piezasActuales = [];
    let celdas = document.getElementsByTagName('td')
    let solucion = createReferenceSolution(medidasImagen[1], medidasImagen[0], numPiezas);

    // Cargamos cada piezza 
    for (let celda of celdas) {
        // Obtiene posición y convierte a número y lo hace positivo
        let offsetX = parseInt(celda.style.backgroundPositionX) * -1;
        let offsetY = parseInt(celda.style.backgroundPositionY) * -1;

        let medida = [offsetY, offsetX];
        piezasActuales.push(medida);
    }

    //Comprobar que está acabado el puzzle
    console.log(solucion)
    console.log(piezasActuales)

    if (checkIfSolution(solucion, piezasActuales)) {
        document.getElementById("score").innerHTML = "<b>Completado</b>";
        for(celda of celdas){
            celda.removeEventListener("click",SeleccionarPieza);
        }
    }

}

function getNumberPiecesFromUser() {
    let numeroPiezas = 0;
    let numValido = false;

    while (!numValido) {
        let numeroUser = prompt("Introduce el numero de piezas");

        // Comprobar númer de Raiz Cuadrada perfecta
        if (Number.isInteger(Math.sqrt(numeroUser)) && Math.sqrt(numeroUser) > 1) {
            numValido = true;
            numeroPiezas = numeroUser;
        } else {
            alert('Introduce un numero valido.');
        }
    }

    return numeroPiezas;
}

function getMaxScore(numeroPiezas) {

    return (numeroPiezas * numeroPiezas)
}

function getScore() {

    return puntuacionInicial
}

function updateScore(nuevaPuntuacion) {

    document.getElementById("score").innerHTML = "Score: " + nuevaPuntuacion;

}

function decreaseScore(penalizacion) {

    puntuacion = puntuacion - penalizacion;

    updateScore(puntuacion)
}

function getNewSizes(anchura, altura) {

    let nuevaAnchura, nuevaAltura

    if (anchura > altura) {

        nuevaAnchura = 200

        nuevaAltura = ((200 * altura) / anchura)

        dimension[0] = nuevaAltura
        dimension[1] = nuevaAnchura

    } else {
        nuevaAltura = 200

        nuevaAnchura = ((200 * anchura) / altura)

        dimension[0] = nuevaAltura
        dimension[1] = nuevaAnchura
    }

    return dimension
}

function shuffle(arrayInicial) {
    let arrayMezclado = []

    while (arrayInicial.length > 0) {

        let aleatorio = Math.floor((Math.random() * arrayInicial.length));

        arrayMezclado.push(arrayInicial[aleatorio]);     // Crea copia
        arrayInicial.splice(aleatorio, 1);      // Elimina del array

    }

    return arrayMezclado;
}

// pieceNumberToRowColumns(7, 9);

//console.log(posicionPiezas);

function pieceNumberToRowColumns(piezaPuzzle, numeroPiezasTotal) {

    let columnas = (Math.sqrt(numeroPiezasTotal))
    let filas = (Math.sqrt(numeroPiezasTotal))

    let filaPieza = parseInt(piezaPuzzle / columnas)
    let columnaPieza = parseInt(piezaPuzzle % filas)

    let posicionPiezas = []
    let posicionPieza = [];

    posicionPieza[0] = filaPieza;
    posicionPieza[1] = columnaPieza;

    posicionPiezas.push(posicionPieza);

    return posicionPieza
}


function createPuzzleLayout(numeroPiezasTotal, anchuraPuzzle, alturaPuzzle, imagen) {

    let cuadrado = Math.sqrt(numeroPiezasTotal)
    let elemento = document.getElementsByTagName('body')[0]

    //Crea el elemento tabla y cuerpo de la tabla

    var tabla = document.createElement("table")
    var tBody = document.createElement("tbody")

    //crear las celdas
    let numeroPieza = 0

    for (let i = 0; i < cuadrado; i++) {

        var fila = document.createElement("tr")

        for (let x = 0; x < cuadrado; x++) {

            var celda = document.createElement("td")

            celda.id = "piece" + numeroPieza
            celda.style = "border: 3px solid black; background-image: imagen"
            celda.style.backgroundImage = "url(\"" + imagen + "\")";
            var texto = document.createTextNode(numeroPieza)
            //celda.appendChild(texto)
            fila.appendChild(celda)
            numeroPieza++
        }

        tBody.appendChild(fila)
    }

    tabla.style = "width:" + anchuraPuzzle + "px; height:" + alturaPuzzle + "px;";

    tabla.appendChild(tBody)
    elemento.appendChild(tabla)
}

function pieceToOffset(numeroPieza, anchuraPuzzle, alturaPuzzle, numeroPiezasTotal) {

    let cuadrado = Math.sqrt(numeroPiezasTotal)

    let alturaPieza = parseInt(anchuraPuzzle / cuadrado)
    let anchuraPieza = parseInt(alturaPuzzle / cuadrado)

    let posicion = pieceNumberToRowColumns(numeroPieza, numeroPiezasTotal);

    let resultado = []

    resultado[0] = posicion[0] * anchuraPieza
    resultado[1] = posicion[1] * alturaPieza

    return resultado
}

function createReferenceSolution(anchuraPuzzle, alturaPuzzle, numeroPiezasTotal) {

    let resultado = []

    for (let x = 0; x < numeroPiezasTotal; x++) {


        resultado[x] = pieceToOffset(x, anchuraPuzzle, alturaPuzzle, numeroPiezasTotal)

    }
    return resultado

}

function drawContentPuzzle(ArrayDesplazamientos) {

    for (let x = 0; x < ArrayDesplazamientos.length; x++) {

        let cel = document.getElementById("piece" + x)

        cel.style.backgroundPosition = "-" + ArrayDesplazamientos[x][1] + "px " + "-" + ArrayDesplazamientos[x][0] + "px"

    }
}

function checkIfSolution(solucionPuzzle, estadoActual) {

    for (let i = 0; i < solucionPuzzle.length; i++) {

        // Analizamos su alto y ancho
        if (solucionPuzzle[i][0] != estadoActual[i][0]) {
            console.log('Alto no coincide');
            return false;
        }

        if (solucionPuzzle[i][1] != estadoActual[i][1]) {
            console.log('Ancho no coincide');
            return false;
        }

    }

    console.log('El puzzle esta en su lugar');
    return true;
}

function initGame(imageURL, numberOfPieces) {

    let img = new Image();

    img.addEventListener('load', function () {

        gameLogic(img, numberOfPieces);
    });
    img.src = imageURL;

}

function gameLogic(imagen, numeroPiezasTotal) {



}