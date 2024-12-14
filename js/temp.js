var v = {
    currentTab: "p0_0",
    force: new Decimal(0)
}

function updateTemp(){
    v.force = player.mass.div(1000).mul(player.speed)
}