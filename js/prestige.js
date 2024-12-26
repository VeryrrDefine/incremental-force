const PRESTIGE = {
    reset(){
        player.prestigePoints = player.prestigePoints.add(PRESTIGE.gain())
        player.upgrades[1] = new Decimal(0);
        player.upgrades[2] = new Decimal(0);
        player.upgrades[3] = new Decimal(0);
        player.upgrades[4] = new Decimal(0);
        player.force = new Decimal(0);
        player.mass = new Decimal(0);
        player.speed = new Decimal(0);
        v.force = new Decimal(0);

        player.prestiged = true;
    },
    gain(){
        return player.force.mul(1e65).root(1.5).floor();
    },
    prestigeLoop(diff){
        player.objMass1 = player.objMass1.add(UPGRADES.getUpgradeEffect(5).mul(diff))
        setHTML("[extended-mass-display]", formatMass(player.objMass1))
    }
}

function prestigeReset(){
    if (player.force.lt(1e-65)) return ;
    createConfirmationPopup("你确定要声望重置吗? 这将会重置你的4个升级和你所拥有的力！",
        PRESTIGE.reset
    )
}
