const songs =  {
    happyhits: [

        { src: "songs/song-1.mp3", title: "West Coast- Lana Del Rey" },
        { src: "songs/song-3.mp3", title: "The Stranglers- Golden Brown" },
    ],
    romantichits: [
        { src: "songs/song-4.mp3", title: "Bukhaar- Aroob Khan" },
        { src: "songs/song-5.mp3", title: "Sad Girlz Luv Money- Kali Uchis" },
    ],
    retrohits: [
        { src: "songs/song-2.mp3", title: "They Call This Love- Matthew Ifield" },
    ],
    monsoonhits: [

        { src: "songs/song-6.mp3", title: "Jalebi Baby- Tesher" },
    ],
    partyhits: [
        { src: "songs/song-7.mp3", title: "Aao Kabhi Haveli Pe" },
    ],
    softhits: [

        { src: "songs/song-8.mp3", title: "Ajeeb Dasta- Lata Mangeshkar" },
    ],
    lovehits: [
        { src: "songs/song-9.mp3", title: "Pehli Dafa- Atif Aslam" },
        { src: "songs/song-10.mp3", title: "Tum Se Hi- Mohit Chauhan" },
    ],
    oldhits: [
        { src: "songs/song-11.mp3", title: "Haan Ke Haan- Monali Thakur" }
    ]
};
let currentPlaylist = "happyhits"
function loadPlaylist(playlist) {
    const libraryList = document.getElementById("library-list")
    libraryList.innerHTML = ""
    songs[playlist].forEach((song, index) => {
        const li = document.createElement("li")
        li.innerHTML = `<span>${song.title}</span>
   <div class="run">
    <span class="playText">Play Now</span>
    <img class="playRun" src="pngegg (3).png" >
    </div>`
        const playText = li.querySelector(".playText")
        const playImg = li.querySelector(".playRun")
        const playHandler = () => {
            currentSongIndex = index
            loadSong(currentSongIndex)
        }
        playText.style.cursor = "pointer"
        playImg.style.cursor = "pointer"
        playText.addEventListener("click", playHandler)
        playImg.addEventListener("click", playHandler)

        libraryList.appendChild(li)
    });
}


let currentSongIndex = 0
// get the auido element in my html
const audio = document.querySelector("audio")
const seekbar = document.querySelector(".seekbar")
const circle = document.querySelector(".circle")
const nowPlaying = document.querySelector(".now-playing")
const currentTimeEl = document.querySelector(".current-time")
const totalDurationEl = document.querySelector(".total-duration")

// move circle as song plays
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return
    const percent = (audio.currentTime / audio.duration) * 100
    circle.style.left = `calc(${percent}% - 8px)` // -8px centers the 15px circle
    currentTimeEl.textContent = formatTime(audio.currentTime)
})
audio.addEventListener("loadedmetadata", () => {
    totalDurationEl.textContent = formatTime(audio.duration)
})

// click anywhere on seekbar to jump to that point
seekbar.addEventListener("click", (e) => {
    const rect = seekbar.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width

    audio.currentTime = percent * audio.duration
})
let isDragging = false

circle.addEventListener("mousedown", () => isDragging = true)
document.addEventListener("mouseup", () => isDragging = false)
document.addEventListener("mousemove", (e) => {
    if (!isDragging) return
    const rect = seekbar.getBoundingClientRect()
    let percent = (e.clientX - rect.left) / rect.width
    percent = Math.min(Math.max(percent, 0), 1)
    audio.currentTime = percent * audio.duration
})
// function to format time
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}
// function to load and play a song
function loadSong(index) {
    audio.src = songs[currentPlaylist][index].src
    audio.play()
    nowPlaying.textContent = songs[currentPlaylist][index].title
}
// previous button
document.getElementById("prev-btn").addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs[currentPlaylist].length) % songs[currentPlaylist].length
    loadSong(currentSongIndex)
})
// next button
document.getElementById("next-btn").addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs[currentPlaylist].length
    loadSong(currentSongIndex)
})
// pause or play the song
const playBtn = document.getElementById("play-btn")
document.getElementById("play-btn").addEventListener("click", () => {
    if (audio.paused) {
        audio.play()
    } else {
        audio.pause()
    }
})
audio.addEventListener("play", () => {
    playBtn.src = "pngegg (4).png"
    playBtn.style.width = "25px"
    playBtn.style.height = "25px"
})
audio.addEventListener("pause", () => {
    playBtn.src = "pngegg (6).png"
    playBtn.style.width = "25px"
    playBtn.style.height = "25px"
})
// auto-play next song when current one ends
audio.addEventListener("ended", () => {
    currentSongIndex = (currentSongIndex + 1) % songs[currentPlaylist].length
    loadSong(currentSongIndex)
})
// play buttons on cards
document.querySelectorAll(".play").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();// prevent the card click event from firing
        const card = btn.closest(".card");
        currentPlaylist = card.dataset.playlist;
        loadPlaylist(currentPlaylist);
        currentSongIndex = 0;
        loadSong(currentSongIndex);
    })
})

document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent the card click event from firing
        currentPlaylist = card.dataset.playlist;
        loadPlaylist(currentPlaylist);
        currentSongIndex = 0;
        loadSong(currentSongIndex);
    });
});
// load the first song on page load
loadPlaylist(currentPlaylist)
loadSong(currentSongIndex)