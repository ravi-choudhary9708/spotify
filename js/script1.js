let songs = [];
let currFolder;
let cardContainer=document.querySelector(".card-container")
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    try {
        currFolder = folder;
        let response = await fetch(`http://127.0.0.1:3000/${folder}/`);
        let textResponse = await response.text();
        let div = document.createElement("div");
        div.innerHTML = textResponse;
        let as = div.getElementsByTagName("a");
        

        songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href);
            }
        }

        if (songs.length > 0) {
            let songUl = document.querySelector(".songs-list ul");
            songUl.innerHTML = "";
            let songItems = "";

            for (const song of songs) {
                let songName = song.split("/").pop().replace(/%20/g, " ").slice(0, 10);

                songItems += `<li><div class="list">
                                <div class="song-card-1">
                                    <div class="music"><img class="filter" src="img/music.svg" alt=""></div>
                                    <div class="artist">
                                        <div class="song-name" data-url="${song}"> ${songName}</div>
                                        <div class="artist-name">ravi</div>
                                    </div>
                                </div>
                                <div class="play-music"><img src="img/play.svg" alt=""></div>
                            </div>
                        </li>`;
            }
            songUl.innerHTML = songItems;

            let liName = Array.from(document.querySelector(".songs-list").getElementsByTagName("li"));
            liName.forEach(e => {
                e.addEventListener("click", element => {
                    let trackUrl = e.querySelector(".song-name").getAttribute("data-url");
                    console.log(e.querySelector(".song-name").innerText);
                    playMusic(trackUrl);
                });
            });

        } else {
            console.log("No songs found.");
        }

    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = track;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".song-info").innerHTML = track.split("/").pop().replace(/%20/g, " ").slice(0, 10);
    document.querySelector(".song-time").innerHTML = "00:00/00:00";
}



async function displayAlbum(){
    console.log('im making mistakes');
    
    let response = await fetch(`http://127.0.0.1:3000/songs/`);
    let textResponse = await response.text();
    let div = document.createElement("div");
    div.innerHTML = textResponse;
    let anchors = div.getElementsByTagName("a")
    console.log(anchors);
   let array= Array.from(anchors)
       for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
      
        if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
            let coverFolder = e.href.split("/").slice(-2)[0];
            console.log(e.href)
            console.log(e.href.split("/").slice(-2)[0])
            console.log("coverfolder",coverFolder.innerHTML);
            
            //get the meta data of the 
            console.log('im 2');
            
            let response = await fetch(`songs/${coverFolder}/info.json`);
            let textResponse = await response.json();
            console.log("textresponse",textResponse);
            
console.log(textResponse);
cardContainer.innerHTML=cardContainer.innerHTML + ` <div data-folder="${coverFolder}" class="card ">
                        <img src="/songs/${coverFolder}/cover.jpeg" alt="">
                        <img class="play" src="img/play.svg" alt="">
                        <h2>${textResponse.tittle}</h2>
                        <h2>${textResponse.description}</h2>
                    </div>
                   `
        }
    }

// Load the playlist whenever a card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e => {
    console.log(e);
    e.addEventListener("click", async item => {
        console.log(item, item.currentTarget.dataset);
        await getsongs(`songs/${item.currentTarget.dataset.folder}`);
        if (songs.length > 0) {
            playMusic(songs[0]);
        }
    });
    
});

}




async function main() {
    await getsongs("songs/haryanvi songs");


//display all the album images
displayAlbum()

   
    if (songs.length > 0) {
        playMusic(songs[0], true);
    }

    // Attach an event listener to play, previous, and next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Listen for time update of the song
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });
}

// Add an event listener for seek bar
document.querySelector(".skeebar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
});

// Add an event listener for hamburger menu
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".box-left").style.left = "0";
});
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".box-left").style.left = "-100%";
});

// Add an event listener for previous and next
document.getElementById("previous").addEventListener("click", () => {
    if (!songs || songs.length === 0) {
        console.log("No songs loaded.");
        return;
    }

    let currentFileName = decodeURIComponent(currentSong.src.split("/").slice(-1)[0]); // Decode the current filename
    console.log("Current song filename:", currentFileName);

    // Decode each song URL in the songs array for comparison
    let decodedSongs = songs.map(song => decodeURIComponent(song.split("/").slice(-1)[0]));

    // Find the index of the current song in the decoded songs array
    let index = decodedSongs.indexOf(currentFileName);
    console.log("Index of current song in songs array:", index);

    if (index !== -1) {
        // Song found, do something with the index
        console.log("Song found at index:", index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    } else {
        console.log("Current song not found in the songs array.");
    }
});

document.getElementById("next").addEventListener("click", () => {
    if (!songs || songs.length === 0) {
        console.log("No songs loaded.");
        return;
    }

    let currentFileName = decodeURIComponent(currentSong.src.split("/").slice(-1)[0]); // Decode the current filename
    console.log("Current song filename:", currentFileName);

    // Decode each song URL in the songs array for comparison
    let decodedSongs = songs.map(song => decodeURIComponent(song.split("/").slice(-1)[0]));

    // Find the index of the current song in the decoded songs array
    let index = decodedSongs.indexOf(currentFileName);
    console.log("Index of current song in songs array:", index);

    if (index !== -1) {
        // Song found, do something with the index
        console.log("Song found at index:", index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    } else {
        console.log("Current song not found in the songs array.");
    }
});

// Add an event listener for volume control
document.querySelector(".volume-icon").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
});



main();

