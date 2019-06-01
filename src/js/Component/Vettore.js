import React from 'react';
import vectImg from '../../img/vettore.png'

const vettore = (props) => {
    const style = {
        width: "90%",
        height: "90%",
        opacity: props.opacity,
        margin: 0
    };
    return (
        <div style={style} className="vettore" id={props.id}>
            <img src = {vectImg} width="80%" height = "80%" alt="vettore"></img>
        </div>
    );
};
//
export default vettore;