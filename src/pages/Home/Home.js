import React, {useState, useEffect} from "react";
import axios from "axios";
import Play from "../Play/Play";
import './Home.css';

const Home = () => {
    const server = "https://myhimym-back.onrender.com"
    const [season, setSeason] = useState("1")
    const [episodes, setEpisodes] = useState([]);
    const [onEpisode, setEpisode] = useState("1");
    const [video, setVideo] = useState({});
    const [trig, setTrig] = useState(false);
    const [user, setUser] = useState(["",""]);
    const [userTrig, setUserTrig] = useState(true);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        async function fetch(){
            const res = await axios.get(server+"/ep-from-season/1");
            let onSeason = [];
            res.data.forEach(element => {
                onSeason.push(element);
                setConnected(true);
            });
            setEpisodes(onSeason);
        }
        fetch();
    }, []);

    function seasonSelect(e){
        e.preventDefault();
        setSeason(e.target.value);
        async function fetch(){
            const res = await axios.get(server+"/ep-from-season/"+e.target.value);
            let onSeason = [];
            res.data.forEach(element =>{
                onSeason.push(element);
            });
            setEpisodes(onSeason);
        }
        fetch();
    }

    function episodeSelect(e){
        e.preventDefault();
        setEpisode(e.target.value);
    }

    function handleSubmit(e){
        e.preventDefault();
        async function fetch(){
            const res = await axios.post(server+"/specific-ep/"+season+"/"+onEpisode, user);
            if (res.status !== 404){setTrig(true); setVideo(res.data);}
        }
        fetch()
    }

    function login(e){
        e.preventDefault();
        async function fetch(){
            const res = await axios.post(server+"/loging", [e.target.username.value, e.target.password.value]);
            if (res.data){setUser([e.target.username.value, e.target.password.value]); setUserTrig(false);}
            else{setUser([]);}
        }
        fetch();
    }

    if (userTrig && connected){
        return(
            <div className="entering">
                <div className="connection_true">Connected</div>
                <form onSubmit={login}>
                    <label className="password">User: </label>
                    <input type="username" name="username" />
                    <br/>
                    <label className="password">Password: </label>
                    <input type="password" name="password" />
                    <br/>
                    <input type="submit" value="Enter" />
                </form>
            </div>
        )
    }
    else if (userTrig){
        return(
            <div className="entering">
                <div className="connection_false">No Connection</div>
                <form onSubmit={login}>
                    <label className="password">User: </label>
                    <input type="username" name="username" />
                    <br/>
                    <label className="password">Password: </label>
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
                <form onSubmit={handleSubmit}>
                    <div className="home_season_select">Select Season:</div>
                    <select name="season" id="season" onChange={seasonSelect}>
                        <option value="1">Season 1</option>
                        <option value="2">Season 2</option>
                    </select>
                    <br/>
                    <select name="episode" id="episode" onChange={episodeSelect}>
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
                <Play trig={trig} back={setTrig} video={video} />
            </div>
        );
    }
    
}

export default Home;