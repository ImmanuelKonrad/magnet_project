import React from 'react';
import posCar from '../../img/positive.png'
import negCar from '../../img/negative.png'

const Carica = (props) => {

    const style = {
        height: "7%",
        width: "7%",
        position: "absolute",
        top: "125%",
        right: "45%",
        zIndex: "100"
    };
    
    if(props.isPositive){
        return (
            <div style={style} className="carica pos" id={props.id}>
                <img src={posCar} height="100%" width="auto" alt="carica positiva"></img>
            </div>
        );
    }
    else{
        return (
            <div style={style} className="carica neg" id= {props.id}>
                <img src={negCar} height="100%" width="auto" alt="carica negativa"></img>
            </div>
        );
    }

};


export default Carica;