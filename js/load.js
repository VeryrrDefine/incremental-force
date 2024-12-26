function loadGame(start=true, gotNaN=false){
    if (!gotNaN) prevSave = localStorage.getItem(SAVE_ID)
    player = getPlayerData()
    load(prevSave)

    if (start){
        setTimeout(() => {
            setInterval(save, 1000*5)
            setInterval(loop, 1000/FPS)
            updatenews()
            initHTML()
        }, 100)
    }
}