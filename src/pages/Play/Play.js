import React from "react";
import './Play.css';

const Play = props => {

    function handleTrig(){
        props.back(false);
    }

    function ocb(){
        props.l();
    }

    function onb(){
        props.n();
    }

    return (props.trig) ? (
        <div className="video_all">
                <div className="video_back" onClick={handleTrig}>{"<Back"}</div>
                <div className="show_on_episode">{props.video.season+"x"+props.video.episode}</div>
                <div className="video">
                <iframe src={"https://drive.google.com/file/d/"+props.video.tag+"/preview"} width={"70%"} height={"100%"} allow="autoplay" title={props.video.season+"x"+props.video.episode}></iframe>
                <br/><br/>
                {
                    (props.video.season === 1 && props.video.episode === 1) ? "":(<div className="quick_button_pad"><div className="quick_button" onClick={ocb}>{"<"}</div></div>)
                }
                {
                    (props.video.season === 9 && props.video.episode === 24) ? "":(<div className="quick_button_pad"><div className="quick_button" onClick={onb}>{">"}</div></div>)
                }
                </div>
            </div>
    ): "";
}

export default Play;