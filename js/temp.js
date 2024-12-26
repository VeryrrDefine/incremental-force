var v = {
    currentTab: "p0_0",
    force: new Decimal(0),
    scaling: {},
    scaling_power: {},
    scaling_start: {},
    no_scalings: {},
    upgs: {
        msg: [0, 0]
    }
}

function updateTemp(){
    v.force = player.mass.div(1000).mul(player.speed)
}