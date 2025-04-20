console.log('lets write some js');
let currentmusic = new Audio();
let songs;
let currentfolder;

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

async function getsongs(folder) {
    currentfolder = folder
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let atag = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < atag.length; index++) {
        const element = atag[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }
    let songUL = document.querySelector(".leftlib").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const element of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                        <img src="img/music.svg" alt="">
                        <div class="info">${element.replaceAll("%20", " ")}</div>
                        <div class="smalltext">Play<img src="img/play-bar.svg" alt=""></div>
                        </li>`
    }

    Array.from(document.querySelector(".leftlib").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").innerHTML)
        })

    });
    return songs;

}

const playmusic = (track, pause = false) => {
    // let audio= new Audio("/songs/"+track);
    currentmusic.src = `/${currentfolder}/` + track;
    if (!pause) {
        currentmusic.play();
        play.src = "img/pause.svg"
    }



    document.querySelector(".playbar-left").innerHTML = decodeURI(track);
    document.querySelector(".duration").innerHTML = "00:00/00:00";

    
}

async function displayalbum() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let right = document.querySelector(".right");
    let div = document.createElement("div");
    div.innerHTML = response;
    let atag = div.getElementsByTagName("a");
    console.log(atag);
    let array = Array.from(atag);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];
            // get the metadata pf th efolder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            right.innerHTML = right.innerHTML +`<div data-folder="${folder}" class="cardholder">
                    <div class="card">
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        
                        <div class="title-card" <b >${response.title}</b></div>
                        <div class="cardtext multi-line-ellipsis"><b>${response.description}</b></div>
                        <div class="playbtn"><img src="img/play.svg" alt=""></div>
                    </div>
                </div>`
            
        }
    }
        Array.from(document.getElementsByClassName("cardholder")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
                playmusic(songs[0])
            })
        })

    

}




async function main() {
    
    await getsongs(`songs/Hindi`)
    // console.log(songs);
    playmusic(songs[0], true)


    displayalbum()

    // to play and pause down bar
    play.addEventListener("click", () => {
        if (currentmusic.paused) {
            currentmusic.play()
            play.src = "img/pause.svg"
        }
        else {
            currentmusic.pause()
            play.src = "img/play-bar.svg"
        }
    })

    currentmusic.addEventListener("timeupdate", () => {
        document.querySelector(".duration").innerHTML = `${secondsToMinutes(currentmusic.currentTime)}/${secondsToMinutes(currentmusic.duration)}`

        document.querySelector(".slide-circle").style.left = `${(currentmusic.currentTime / currentmusic.duration) * 100}%`

    })
    document.querySelector(".slide").addEventListener("click", e => {
        document.querySelector(".slide-circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width
        ) * 100 + "%";
        currentmusic.currentTime = ((e.offsetX / e.target.getBoundingClientRect().width
        ) * 100) * currentmusic.duration / 100;

    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".hamburger").addEventListener("dblclick", () => {
        document.querySelector(".left").style.left = "-130%";
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%";
    })
    previous.addEventListener("click", () => {
        currentmusic.pause();
        let index = songs.indexOf(currentmusic.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playmusic(songs[index - 1]);
        }
    })

    next.addEventListener("click", () => {
        currentmusic.pause();
        let index = songs.indexOf(currentmusic.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
        }
    })

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentmusic.volume = e.target.value / 100;
        if(currentmusic.volume>0){
            document.querySelector(".volume > img").src=document.querySelector(".volume > img").src.replace("mute.svg","volume.svg")
        }
    })
    
    document.querySelector(".volume > img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src= e.target.src.replace("volume.svg","mute.svg")
            currentmusic.volume = 0;
            document.querySelector(".volume").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentmusic.volume= .10;
            document.querySelector(".volume").getElementsByTagName("input")[0].value=10;
        }
    })
   
}
main()

