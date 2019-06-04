import React from 'react'
import Board from './js/Component/Board'
import BottoneCarica from './js/Component/BottoneCarica';
import Carica from './js/Component/Carica'

class Game extends React.Component {

  constructor() {
    super()
    this.state = {
      cariche: [],
      nRighe: 15,
      nCol: 20
    }
    //serve per visulizzare o no la griglia
    this.grigliaCheck = true
    //serve per visualizzare o no le sfumature
    this.sfunBot = true
  }

  //funzione sleep per attendere tot millisecondi
  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  //--------------------------------------------------------------------------------//
  //---------------------- FUNZIONI FISICHE ROTAZIONE VETTORI ----------------------//
  //--------------------------------------------------------------------------------//

  async calolaRotazione() {
    var Victor = require("victor")

    //funzione per eseguire proporzione
    let remap = (number, from, to, min, max) => {
      return (number - from) / (to - from) * (max - min) + min;
    }

    //array di tutti i vettori
    let vettori = document.getElementsByClassName("vettore")
    //array di tutte le cariche positive
    let positive = document.getElementsByClassName("carica pos")
    //array di tutte le cariche negative
    let negative = document.getElementsByClassName("carica neg")

    //se sono state posizionate delle cariche allora eseguo tutti i calcoli
    if (positive.length !== 0 || negative.length !== 0) {
      let posP = []                 //array posizioni cariche positive
      let posN = []                 //array posizioni cariche negative
      let k = 9 * Math.pow(10, 9)   //costante di Coulomb

      //per ogni carica positiva prendo le sue coordinate x e y
      //creo un nuovo vettore e lo inserisco nell'array posP
      for (let i = 0; i < positive.length; i++) {
        let centerX = positive[i].offsetLeft + positive[i].offsetWidth / 2;
        let centerY = positive[i].offsetTop + positive[i].offsetHeight / 2;
        posP.push(new Victor(centerX, centerY))
      }

      //per ogni carica negativa prendo le sue coordinate x e y
      //creo un nuovo vettore e lo inserisco nell'array posN
      for (let i = 0; i < negative.length; i++) {
        let centerX = negative[i].offsetLeft + negative[i].offsetWidth / 2;
        let centerY = negative[i].offsetTop + negative[i].offsetHeight / 2;
        posN.push(new Victor(centerX, centerY))
      }

      //per ogni vettore
      for (let i = 0; i < document.getElementsByClassName("vettore").length; i++) {
        let forces = new Victor(0, 0)   //vettore della risultante di tutte le forze applicate
        let centerX = vettori[i].offsetLeft + vettori[i].offsetWidth / 2;
        let centerY = vettori[i].offsetTop + vettori[i].offsetHeight / 2;
        let pos = new Victor(centerX, centerY)  //posizione del vettore nella pagina

        //per ogni carica positiva
        for (let j = 0; j < posP.length; j++) {
          //calcolo la distanza tra carica e vettore
          let raggio = pos.distance(posP[j])

          //calcolo il modulo ipotizzando Q1=Q2=1Q con la legge di Coulomb
          let eModule = k / raggio / raggio

          //mi creo un nuovo vettore che rappresentera la forza attrativa
          let vetRaggio = new Victor(0, 0)
          vetRaggio = posP[j].clone()
          vetRaggio.subtract(pos)
          vetRaggio.normalize()
          vetRaggio.multiply(new Victor(eModule, eModule))
          //inverto il verso perché cariche positive hanno forza repulsiva
          vetRaggio.invert()
          //aggiungo la forza alla risultante
          forces.add(vetRaggio)
        }

        //per ogni carica negativa
        for (let j = 0; j < posN.length; j++) {
          //calcolo la distanza tra carica e vettore
          let raggio = pos.distance(posN[j])

          //calcolo il modulo della forza con la legge di Coulomb
          let eModule = k / raggio / raggio

          //creo un nuovo vettore = vettore della forza attrattiva
          let vetRaggio = new Victor(0, 0)
          vetRaggio = posN[j].clone()
          vetRaggio.subtract(pos)
          vetRaggio.normalize()
          vetRaggio.multiply(new Victor(eModule, eModule))
          //aggiungo tale vettore alla risultante
          forces.add(vetRaggio)
        }
        //ricavo l'angolo alfa della risultante
        let alfa = forces.horizontalAngleDeg()
        //lo applico al vettore considerato
        document.getElementById(i).style.transform = "rotate(" + alfa + "deg)"
        
        //se attivo il bottone sfumature
        if(this.sfunBot){
          //calcolo l'opacita proporzionalmente al modulo
          let op = remap(forces.magnitude(), 0, k / 10000, 0, 1)
          document.getElementById(i).style.opacity = op
        }
        else
          document.getElementById(i).style.opacity = 1
      }
    }
    return await new Promise((res, rej) => {
      setTimeout(res, 10)
    });
  }

  async visualizzaCampoMagnetico() {
    while (true) {
      await this.calolaRotazione();
    }
  }

  componentDidMount() {
    this.visualizzaCampoMagnetico();
  }

  //-------------------------------------------------------------------------------//
  //-------------------------------------------------------------------------------//

  //funzione per creare una nuova carica
  creaCarica = (pos) => {
    //alla pressione dei bottoni di creazioni li disabilito per evitare bug
    //ora li riabilito
    document.getElementsByClassName("creaCarica")[0].disabled = true
    document.getElementsByClassName("creaCarica")[1].disabled = true
    
    //aggiungo pos alla lista delle cariche presente nello stato.
    //pos puo valere true (carica positiva) o false (carica negativad)
    let newList = this.state.cariche
    newList.push(pos)
    this.setState({
      cariche: newList
    })
  }

  //funzione per abilitare o disabilitare la griglia
  visGriglia = () => {
    let press = this.grigliaCheck
    let squares = document.getElementsByClassName("square")
    
    if(press){
      this.grigliaCheck= false
      for (let i = 0; i < squares.length; i++) {
        squares[i].style.border = "1px dotted black";
      }
    }

    else {
      this.grigliaCheck= true
      for (let i = 0; i < squares.length; i++) {
        squares[i].style.border = "1px dotted #999"
      }
    }

  }

  visSfum = () => {
    this.sfunBot = !this.sfunBot
  }

  sliderIn = () => {
    this.setState({ 
      nRighe: document.getElementById("slideRighe").value,
      nCol: document.getElementById("slideColonne").value})
    
    this.sleep(75).then(()=>{
      this.visGriglia()
      this.visGriglia()
    })
    
  }
  
  
  render() {
    let codiceCariche = []
    for (let i = 0; i < this.state.cariche.length; i++) {
      let pos = this.state.cariche[i]
      codiceCariche.push( <Carica isPositive = {pos} id = {"car" + i}> </Carica>) 
    }
      return ( 
      <div className = "sims" id = "contenitore" > {codiceCariche}
        <h1 className="deepshadow">MAGNETIC FIELD</h1>
        <div className="slidecontainer">
          <p>Cambia numero di righe({this.state.nRighe}) e di colonne([{this.state.nCol})</p>
          Righe:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="range" min="10" max="20" className="slider" id="slideRighe" onChange={this.sliderIn}/><br/>
          Colonne:<input type="range" min="10" max="50" className="slider" id="slideColonne" onChange={this.sliderIn}/>
        </div><br></br>
        <div className = "containerBottoni" >
        <BottoneCarica isPositive = "true" onClick = {() => this.creaCarica(true)}> </BottoneCarica> 
        <BottoneCarica onClick = {() => this.creaCarica(false)} > </BottoneCarica> <br></br>
        <button id="grigliaButton" onClick={this.visGriglia} color="white">Visualizza/nascondi griglia</button>
        <button id="sfumButton" onClick={this.visSfum} color="white">Attiva/disattiva sfumature</button>
        </div> 
        <br></br>
        <Board nRighe={this.state.nRighe} nCol={this.state.nCol}></Board> 
        </div>
      )
    }

}
export default Game
