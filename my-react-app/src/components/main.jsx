import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "http://i.imgflip.com/1bij.jpg"
    });
    const [allMemes, setAllMemes] = useState([]);
    const memeRef = useRef(null);
    
    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes));
    }, []);
    
    function getNewMeme(){
        if (allMemes.length === 0 ) return;
        
        const randomIndex = Math.floor(Math.random() * allMemes.length);
        const randomMeme = allMemes[randomIndex];
        
        setMeme(prevMeme => ({
            ...prevMeme,
            imageUrl: randomMeme.url
        }));
    }
    
    function handleChange(event) {
        const {value, name} = event.currentTarget;
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }));
    }

    function downloadMeme() {
        if (!memeRef.current) return;
    
        html2canvas(memeRef.current, {
            useCORS: true, 
            backgroundColor: null, 
            scale: 1 
        }).then(canvas => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "meme.png";
            link.click();
        });
    }
    
    

    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handleChange}
                        value={meme.topText}
                    />
                </label>
                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        onChange={handleChange}
                        value={meme.bottomText}
                    />
                </label>
                <button onClick={getNewMeme}>Get a new meme image 🖼</button>
                <button onClick={downloadMeme}>Download Meme 📥</button>
            </div>
            <div className="meme" ref={memeRef} >
                <img src={meme.imageUrl} alt="meme"/>
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>
        </main>
    );
}
