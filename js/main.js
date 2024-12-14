const FPS = 30;


var player = {}, date = Date.now(), diff = 0;

function updateHTML(){

}

function loop() {
    diff = Date.now()-date;
    
    updateHTML()

    date = Date.now()
    player.latest_time = date;
}