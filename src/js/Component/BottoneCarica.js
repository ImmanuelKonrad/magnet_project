import React from 'react'
import posCar from '../../img/positive.png'
import negCar from '../../img/negative.png'

const BottoneCarica = (props) =>{
        var bg

        if(props.isPositive)
            bg = posCar
        else
            bg = negCar
        const style = {
            width: "50px",
            height: "50px",
            margin: "5px",
            padding: "0px"

        }


        return(
            <button style={style} onClick={props.onClick} className="creaCarica">
                <img src = {bg} width="100%" height="100%" alt="crea carica"></img>
            </button>
        )
        
}
export default BottoneCarica