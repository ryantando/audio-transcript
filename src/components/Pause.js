import React from "react";
import { PauseCircleFilled } from "@material-ui/icons";

export default function Play(props) {
  const { handleClick } = props;
  
  return (
    <button className="player_button" onClick={() => handleClick()}>
      <PauseCircleFilled />
    </button>
  );
}
