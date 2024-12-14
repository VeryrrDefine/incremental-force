const FPS = 30;


var player = {}, date = Date.now(), diff = 0;
function setHTML(query, html){
    let ele = $(query)

    if (ele.html()!=html){
        ele.html(html)
    }
}

function changeTab(tab){
    if (v.currentTab==tab) return;
    $(`#${v.currentTab}`).addClass("hide")
    v.currentTab = tab;

}

function updateHTML(){
    setHTML("[mass-dis]", formatMass(player.mass))
    setHTML("[speed-dis]", formatLength(player.speed))
    setHTML("[force-dis]", notation(v.force))
    $(`#${v.currentTab}`).removeClass("hide")
}

function loop() {
    diff = Date.now()-date;
    
    updateTemp()
    updateHTML()
    date = Date.now()
    player.latest_time = date;
}

bool = {
    a:0,
    valueOf() {
        this.a++
        return !!(this.a%2)
    }
}