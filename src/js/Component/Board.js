import React from 'react'
import '../../css/style.css'
import Vettore from './Vettore'

const Board = (props) => {
      let w = ((document.body.clientWidth - 200) / (props.nCol))
      let style={
        width: w + "px",
        heigth: w + "px",
        padding: w/5 +"px 0 " + w/5 +"px 0"
      }
      let style2 = {
        marginLeft: "auto",
        marginRight: "auto",
        content: "",
        padding: "0px",
        display: "table"
      }
      let righe = []
      let id = 0
      for (let i = 0; i <props.nRighe; i++) {
        let quadrati = []
        for (let j = 0; j < props.nCol; j++) {
          quadrati.push(
          <div className="square" style={style}>
              <Vettore opacity="0" id={id}></Vettore>
          </div>)
          id++
        }
        righe.push(<div style={style2} id={"row"+i}>{quadrati}</div>)
      
      }

      return (
        <div className="board">
          {righe}
        </div>
      )
    
  }

    export default Board