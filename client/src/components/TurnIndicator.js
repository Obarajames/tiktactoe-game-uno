import React from "react";

function TurnIndicator(props) {
  const styles ={
    backgroundColor:props.turn &&!props.gameOver&&"#FF2E63"
  }
  const styles1 ={
    backgroundColor:!props.turn && !props.gameOver &&"#FF2E63"
  }
  const styleBold = {
    fontWeight: "bolder"
  }

  return (
    < div className="turnIndicator">
     
      <div className="turnContainer">
        <div id="X" className="turnBox" style={styles}>X</div>
        <div id="O" className="turnBox" style={styles1}>O</div>
      </div>
    </div>
  );
}

export default TurnIndicator;
