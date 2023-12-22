import React, {useState, useEffect} from "react";
import axios from "axios";
import Play from "../Play/Play";
import './Home.css';

const Home = () => {
    const server = "http://jlmyall.lat/api"
    const [connected, setConnected] = useState(true);
    const [log, setLog] = useState(true);
    const [episodes, setEpisodes] = useState([]);
    const [onEpisode, setEpisode] = useState("");
    const [trig, setTrig] = useState(false);
    const [video, setVideo] = useState({});
    const [edges, setEdges] = useState({1: 21, 2: 22, 3: 20, 4: 24, 5: 24, 6: 24, 7: 24, 8: 24, 9: 24});

//Check for connection
    useEffect(() => {
        async function fetch(){
            try{
                const res = await axios.get(server+"/check");
                if (res.data){setConnected(true);}
            }
            catch{setConnected(false);}
        }
        fetch();
        if (window.sessionStorage.getItem("username") !== null){
            setLog(false); getSeasonEpisodes(window.sessionStorage.getItem("onSeason")); setEpisode(window.sessionStorage.getItem("onEpisode"));
        }
    }, []);

//Constantly check for connection 

    useEffect(() => {
        const interval = setInterval(() => {
            async function fetch(){
                try{
                    const res = await axios.get(server+"/check");
                    if (res.data){setConnected(true);}
                }
                catch{setConnected(false);}
            }
            fetch();
        }, 90000);
        return () => clearInterval(interval);
    }, []);

//Login Function
    async function login(e){
        e.preventDefault();
        if (!(connected)){alert("No Connection! Try Again Later");}
        else{
            const res = await axios.post(server+"/login", [e.target.username.value, e.target.password.value]);
            if (res.data === true){alert("User Not Found!");}
            else if (res.data === false){alert("Incorrect Password!");}
            else {
                window.sessionStorage.setItem("username", res.data.username);
                window.sessionStorage.setItem("password", e.target.password.value);
                window.sessionStorage.setItem("onEpisode", res.data.on_episode);
                window.sessionStorage.setItem("onSeason", res.data.on_season);
                getSeasonEpisodes(res.data.on_season);
                setEpisode(res.data.on_episode);
                setLog(false);
            }
        }
    }

    async function getSeasonEpisodes(s){
        const res = await axios.get(server+"/ep-from-season/"+s);
        if (res.status === 404){alert("Something Went Wrong");}
        else{
            let listEps = [];
            res.data.forEach(element => {
                listEps.push(element);
            });
            setEpisodes(listEps);
        }
    }

    function seasonSelection(e){
        window.sessionStorage.setItem("onSeason", e.target.value);
        getSeasonEpisodes(e.target.value);
        setEpisode("1");
    }

    function episodeSelection(e){
        setEpisode(e.target.value);
    }

    function handlePlay(e){
        e.preventDefault();
        window.sessionStorage.setItem("onEpisode", onEpisode);
        validPlay();
    }

    async function validPlay(){
        const us = {
            username: window.sessionStorage.getItem("username"),
            password: window.sessionStorage.getItem("password"),
            on_episode: window.sessionStorage.getItem("onEpisode"),
            on_season: window.sessionStorage.getItem("onSeason")
        }
        const res = await axios.post(server+"/specific-ep/"+window.sessionStorage.getItem("onSeason")+"/"+window.sessionStorage.getItem("onEpisode"), us);
        if (res === 404){alert("Something Went Wrong!");}
        else{
            setTrig(true);
            setVideo(res.data);
        }
    }

    async function backClick(){
        const s = window.sessionStorage.getItem("onSeason");
        if (onEpisode === "1"){
            window.sessionStorage.setItem("onSeason", String(Number(s)-1));
            setEpisode(String(edges[Number(s)-1]));
            window.sessionStorage.setItem("onEpisode", String(edges[Number(s)-1]));
            getSeasonEpisodes(String(Number(s)-1))
        }
        else{
            const e = window.sessionStorage.getItem("onEpisode");
            setEpisode(String(Number(e)-1));
            window.sessionStorage.setItem("onEpisode", String(Number(e)-1))
        }
        validPlay();
    }

    async function nextClick(){
        const s = window.sessionStorage.getItem("onSeason");
        const e = window.sessionStorage.getItem("onEpisode");
        if (e === String(edges[Number(s)])){
            window.sessionStorage.setItem("onSeason", String(Number(s)+1))
            setEpisode("1");
            window.sessionStorage.setItem("onEpisode", "1");
            getSeasonEpisodes(String(Number(s)+1))
        }
        else{
            setEpisode(String(Number(e)+1));
            window.sessionStorage.setItem("onEpisode", String(Number(e)+1));
        }
        validPlay();
    }


    if (log){
        return(
            <div className="entering">
                {
                    connected ? (<div className="connection_true">Connected</div>) : (<div className="connection_false">No Connection</div>)
                }
                <form onSubmit={login}>
                    <label className="password">User: </label>
                    <br/>
                    <input type="username" name="username" />
                    <br/>
                    <label className="password">Password: </label>
                    <br/>
                    <input type="password" name="password" />
                    <br/>
                    <input type="submit" value="Enter" />
                </form>
            </div>
        )
    }
    else{
        return(
            <div className="home_page">
                <div className="home_title">MyHIMYM</div>
                {
                    connected ?(<div className="connection_true">Connected</div>): (<div className="connection_false">No Connection</div>)
                }
                <form onSubmit={handlePlay}>
                    <div className="home_season_select">Select Season:</div>
                    <select name="season" id="season" value={window.sessionStorage.getItem("onSeason")} onChange={seasonSelection}>
                        <option value="1">Season 1</option>
                        <option value="2">Season 2</option>
                        <option value="3">Season 3</option>
                        <option value="4">Season 4</option>
                        <option value="5">Season 5</option>
                        <option value="6">Season 6</option>
                        <option value="7">Season 7</option>
                        <option value="8">Season 8</option>
                        <option value="9">Season 9</option>
                    </select>
                    <br/>
                    <div className="home_season_select">Select Episode:</div>
                    <select name="episode" id="episode" value={onEpisode} onChange={episodeSelection}>
                        {
                            episodes.map((ep, i) => {
                                return(
                                    <option value={ep}>{"Episode "+ep}</option>
                                );
                            })
                        }
                    </select>
                    <br/>
                    <input type="submit" value="Play" />
                </form>
                <Play trig={trig} back={setTrig} l={backClick} n={nextClick} video={video} />
            </div>
        );
    }
    /*
    else{
        return(
            <div className="home_page">
                <div className="home_title">MyHIMYM</div>
                {
                    connected ?(<div className="connection_true">Connected</div>): (<div className="connection_false">No Connection</div>)
                }
                <form onSubmit={handleSubmit}>
                    <div className="home_season_select">Select Season:</div>
                    <select name="season" id="season" value={season} onChange={seasonSelect}>
                        <option value="1">Season 1</option>
                        <option value="2">Season 2</option>
                        <option value="3">Season 3</option>
                        <option value="4">Season 4</option>
                        <option value="5">Season 5</option>
                        <option value="6">Season 6</option>
                        <option value="7">Season 7</option>
                        <option value="8">Season 8</option>
                        <option value="9">Season 9</option>
                    </select>
                    <br/>
                    <div className="home_season_select">Select Episode:</div>
                    <select name="episode" id="episode" value={onEpisode} onChange={episodeSelect}>
                        {
                            episodes.map((ep, i) => {
                                return(
                                    <option value={ep}>{"Episode "+ep}</option>
                                );
                            })
                        }
                    </select>
                    <br/>
                    <input type="submit" value="Play" />
                </form>
                <Play trig={trig} back={setTrig} past={quick_past} next={quick_next} video={video} />
            </div>
        );
    }
    */
}

export default Home;
