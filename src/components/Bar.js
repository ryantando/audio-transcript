import React from "react";

export default function Bar(props) {
  const { duration, curTime, onTimeUpdate, waveArea = [[],[]], youPercent, prospectPercent } = props;

  const curPercentage = (curTime / duration) * 100;

  function calcClickedTime(e) {
    const clickPositionInPage = e.pageX;
    const bar = document.querySelector(".bar_progress");
    const barStart = bar.getBoundingClientRect().left + window.scrollX;
    const barWidth = bar.offsetWidth;
    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = duration / barWidth;
    return timePerPixel * clickPositionInBar;
  }

  function handleTimeDrag(e) {
    onTimeUpdate(calcClickedTime(e));

    const updateTimeOnMove = eMove => {
      onTimeUpdate(calcClickedTime(eMove));
    };

    document.addEventListener("mousemove", updateTimeOnMove);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTimeOnMove);
    });
  }

  const hundreds = [...Array(100).keys()];

  const getPercentage = (value) => {
    return parseInt((value / duration) * 100);
  }

  const isSpeaking = (number, index) => {
    if(!waveArea[index]){
      return 'transparent';
    } else {
      const speakingLine = waveArea[index].some(a => getPercentage(a.start) <= number && number <= getPercentage(a.end));
      if(!speakingLine){
        return 'transparent';
      } else if (speakingLine && curPercentage > number) {
        return '#BEC5D2';
      } else if (index === 1){
        return '#8569E3';
      }
      return '#41A8F1';
    }
  };

  return (
    <div className="text_bar_container">
      <div style={{ width: 200 }}>
        <div className="text_bar you_text">
          {getPercentage(youPercent)}% You
        </div>
        <div className="text_bar prospect_text">
          {getPercentage(prospectPercent)}% Prospect
        </div>
      </div>
      <div className="bar">
        <div style={{ width: '95%' }}>
          <div
            className="bar_progress_2"
            style={{
              width: '100%'
            }}
            onMouseDown={e => handleTimeDrag(e)}
          >
            { Array.isArray(waveArea) && (
              hundreds.map(a => {
                return <div style={{ width: '0.5%', margin: '0 0.25%', backgroundColor:  isSpeaking(a, 0), height: 50 }} key={a}></div>
              })
            )}
          </div>
          <div
            className="bar_progress"
            style={{
              background: `linear-gradient(to right, grey ${curPercentage}%, #47A0EE 0)`,
              width: '100%'
            }}
            onMouseDown={e => handleTimeDrag(e)}
          >
            <span
              className="bar_progress_knob"
              style={{ left: `${curPercentage}%` }}
            />
          </div>
          <div
            className="bar_progress_2"
            style={{
              width: '100%'
            }}
            onMouseDown={e => handleTimeDrag(e)}
          >
            { Array.isArray(waveArea) && (
              hundreds.map(a => {
                return <div style={{ width: '0.5%', margin: '0 0.25%', backgroundColor:  isSpeaking(a, 1), height: 50 }} key={a}></div>
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
