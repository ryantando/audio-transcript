import React from "react";
import { Forward10, Replay10 } from "@material-ui/icons";

export default function ForwardRewind(props) {
  const { handleClick, type = 'rewind' } = props;

  return (
    <button className="player_button" onClick={() => handleClick()}>
      {type === 'rewind' ? (
        <Replay10 style={{ color: "#63768F"}} />
      ) : (
        <Forward10 style={{ color: "#63768F"}} />
      )}
    </button>
  );
}
