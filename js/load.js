function loadGame(start=true, gotNaN=false){
    if (!gotNaN) prevSave = localStorage.getItem(SAVE_ID)
    player = getPlayerData()
    load(prevSave)

    if (start){
        setTimeout(() => {
            
            setInterval(loop, 1000/FPS)
        }, 100)
    }
}