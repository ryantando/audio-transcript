import React, { useState, useEffect } from "react";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Play from "./Play";
import Pause from "./Pause";
import Bar from "./Bar";
import ForwardRewind from "./ForwardRewind";
import useAudioPlayer from '../audioPlayer';
import transcriptData from '../assets/transcript.json';
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { setAudioSpeed, setForward, setRewind, clearForwardRewind } from "../redux/action/audioAction";
import { connect } from 'react-redux'
import { Select, MenuItem, FormControl } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    icon: {
        fill: 'transparent',
    },
}));

function Audio(props) {
    const classes = useStyles();
    const { audioSpeed, forward, rewind } = props;
    const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer();
    const [blockActive, setBlockActive] = useState(null);
    const [waveArea, setWaveArea] = useState([]);
    const [youPercent, setYouPercent] = useState(null);
    const [prospectPercent, setProspectPercent] = useState(null);
    const [selectSpeed, setSelectSpeed] = useState(false);

    useEffect(() => {
        const audio = document.getElementById("audio");
        if(audio.playbackRate !== audioSpeed){
            audio.playbackRate = audioSpeed;
        }
        if(forward){
            setClickedTime(curTime + 10);
            props.clearForwardRewind();
        }
        if(rewind){
            setClickedTime(curTime - 10);
            props.clearForwardRewind();
        }
    }, [audioSpeed, forward, rewind])

    useEffect(() => {
        if(duration){
            let me = [];
            transcriptData.word_timings.map((a, i) => {
                return a.map(b => {
                    const start = Number(b.startTime.slice(0, -1));
                    const end = Number(b.endTime.slice(0, -1));
                    if(!me[i]){
                    me[i] = new Array({
                        start,
                        end
                        }
                    );
                    } else {
                    const lastEnd = me[i][me[i].length - 1].end;
                        if(lastEnd === start){
                            me[i][me[i].length - 1].end = end;
                        } else {
                            me[i].push({
                            start,
                            end
                            })
                        }
                    }
                })
            })
            setWaveArea(me);
            let totalYou = 0;
            me[0].map(a => {
                return totalYou += a.end - a.start;
            })
            setYouPercent(totalYou);
            let totalProspect = 0;
            me[1].map(a => {
                return totalProspect += a.end - a.start;
            })
            setProspectPercent(totalProspect);
        }
    }, [duration])

    function formatDuration(duration) {
        return moment
          .duration(duration, "seconds")
          .format("mm:ss", { trim: false });
    }

    return (
        <div className={classes.root}>
            <div className="player">
                <audio id="audio">
                    <source src="audio.wav" type="audio/wav"/>
                    Your browser does not support the <code>audio</code> element.
                </audio>
                <div className="controls" style={{ flexDirection: 'row' }}>
                    <ForwardRewind handleClick={() => props.setRewind()} />
                    {playing ? 
                        <Pause handleClick={() => setPlaying(false)} /> :
                        <Play handleClick={() => setPlaying(true)} />
                    }
                    <ForwardRewind handleClick={() => props.setForward()} type="forward" />
                    <FormControl>
                        <p className="audiospeed" onClick={() => setSelectSpeed(true)}>{audioSpeed} x</p>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={''}
                            onChange={(a) => props.setAudioSpeed(a.target.value)}
                            open={selectSpeed}
                            onClose={() => setSelectSpeed(false)}
                            onOpen={() => setSelectSpeed(true)}
                            disableUnderline
                            inputProps={{
                                classes: {
                                    icon: classes.icon,
                                },
                            }}
                        >
                            <MenuItem value={0.5}>0.5x</MenuItem>
                            <MenuItem value={0.75}>0.75x</MenuItem>
                            <MenuItem value={1}>1x</MenuItem>
                            <MenuItem value={1.5}>1.5x</MenuItem>
                            <MenuItem value={2}>2x</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div style={{ backgroundColor: '#fff', width: '100%' }}>
                    <div className="duration_container">
                        <span className="bar_time">{formatDuration(curTime)} / </span>
                        <span className="bar_time" style={{ color: '#95A2B4' }}>{formatDuration(duration)}</span>
                    </div>
                </div>
                <Bar curTime={curTime} duration={duration} onTimeUpdate={(time) => setClickedTime(time)} waveArea={waveArea} youPercent={youPercent} prospectPercent={prospectPercent} />
            </div>  
            <div style={{ marginTop: 30 }}>
                {
                    transcriptData.transcript_text.map((text, index) => (
                        <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row', padding: 20, backgroundColor: blockActive === index ? '#F6FBFE' : '#fff' }} id={`t-${index}`}>
                            <Grid item xs={12} md={2}> 
                                <p style={{ width: 100, marginRight: 50, color: '#45A1F0', fontWeight: 'bold' }}>
                                    {index === 0 ? formatDuration(youPercent) : formatDuration(prospectPercent)}
                                </p>
                            </Grid>
                            <Grid item xs={12} md={10} style={{ flexWrap: 'wrap' }}> 
                                <p style={{ textAlign: 'left', borderLeftColor: '#D6E5F2', borderLeftWidth: 3, paddingLeft: 15, borderLeft: '2px solid #D6E5F2', color: index % 2 === 0 ? '#708196' : '#3E3E5F'  }}>
                                    {transcriptData.word_timings[index].map((a, i) =>  {
                                        const start = a.startTime.slice(0, -1);
                                        const end = a.endTime.slice(0, -1);
                                        const isActive = (curTime >= start && curTime <= end);
                                        if(isActive && blockActive !== index){
                                            setBlockActive(index)
                                        }
                                        return (
                                            <span 
                                                style={{ marginRight: 2, backgroundColor: !isActive ? '#fff' : '#CBE4FA', cursor: 'pointer' }} 
                                                onClick={() => setClickedTime(start)}
                                                key={i}
                                            >
                                                {`${a.word} `}
                                            </span>
                                        )
                                    })}
                                </p>
                            </Grid>
                        </Grid>
                    ))
                }
                </div>
        </div>
    );
}

const mapStateToProps = ({ audio }) => {
    const { audioSpeed, forward, rewind } = audio;
    return {
        audioSpeed,
        forward,
        rewind
    } 
}

export default connect(
    mapStateToProps,
    {
        setForward,
        setRewind,
        clearForwardRewind,
        setAudioSpeed 
    }
)(Audio);
