import React from "react";
import './Play.css';

const Play = props => {

    function handleTrig(){
        props.back(false);
    }

    return (props.trig) ? (
        <div className="video_all">
                <div className="video_back" onClick={handleTrig}>{"<Back"}</div>
                <div className="video">
                <iframe src={"https://drive.google.com/file/d/"+props.video.tag+"/preview"} width={"70%"} height={"100%"} allow="autoplay" title={props.video.season+"x"+props.video.episode}></iframe>
                </div>
            </div>
    ): "";
}

export default Play;