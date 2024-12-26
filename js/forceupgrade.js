const UPGRADES = {
    UPGRADE_DESC: {
        1: {
            power(x) {return `+${formatLength(x)}`},
            effect(x) {return `+${formatLength(x)} to speed`},
        },
        2: {
            power(x) {return `+${formatMass(x)}`},
            effect(x) {return `+${formatMass(x)} to object mass`},
        },
        3: {
            power(x) {return `+${formatMass(x)}`},
            effect(x) {return `+${formatMass(x)} to 重量器 power`},
        },
        4: {
            power(x) {return `+${formatLength(x)}`},
            effect(x) {return `+${formatLength(x)} to 推进器 power`},
        },
        5: {
            power(x) {return `+${formatMass(x)}/s`},
            effect(x) {return `+${formatMass(x)} 额外物体质量/s`},
        },
        6: {
            power(x) {return `+×${notation(x)}`},
            effect(x) {return `×${notation(x)} to 推进器 I 和 推进器 II power`},
        },
    },
    getUpgradeCost(id, x=this.getUpgradeCount()){
        this.fixUpgrade(id);
        if ((id==1 || id== 2)&&this.getUpgradeCount(id).eq(0)){
            return Decimal.dZero
        }
        let a = Decimal.dInf;
        if (id==1){
            a = new Decimal(1e-72).mul(
                Decimal.pow(1.5, this.getUpgradeCount(id))
            )
        }
        if (id==2){
            a = new Decimal(1e-72).mul(
                Decimal.pow(1.7, this.getUpgradeCount(id))
            )
        }
        if (id==3){
            a = new Decimal(5e-71).mul(
                Decimal.pow(1.5, this.getUpgradeCount(id))
            )
        }
        if (id==4){
            a = new Decimal(1e-67).mul(
                Decimal.pow(1.5, this.getUpgradeCount(id))
            )
        }
        if (id==5){
            a = this.getUpgradeCount(id).add(1).pow(2)
        }
        if (id==6){
            a = new Decimal(4e-59).mul(
                Decimal.pow(2, this.getUpgradeCount(id))
            )
        }
        a = a.mul(this.getUpgradeCostMultiplier(id))
        return a
    },
    getUpgradeBulk(id){
        this.fixUpgrade(id);
        if (id == 1){
            return player.force.div(this.getUpgradeCostMultiplier(1)).div(1e-72).log(1.5).ceil().max(1);
        }
        if (id == 2){
            return player.force.div(this.getUpgradeCostMultiplier(2)).div(1e-72).log(1.7).ceil().max(1);
        }
        if (id == 3){
            return player.force.div(this.getUpgradeCostMultiplier(3)).div(5e-71).log(1.5).ceil();
        }
        if (id == 4){
            return player.force.div(this.getUpgradeCostMultiplier(4)).div(1e-67).log(1.5).ceil();
        }
        if (id == 5){
            return player.prestigePoints.div(this.getUpgradeCostMultiplier(5)).sub(1).root(2).ceil();
        }
        if (id == 6){
            return player.force.div(this.getUpgradeCostMultiplier(6)).div(4e-59).log(2).ceil();
        }
        return Decimal.dZero

    },
    getUpgradePower(id){
        this.fixUpgrade(id);
        let a = Decimal.dZero
        if (id==1){
            a = new Decimal(1.6e-35);
            a = a.add(this.getUpgradeEffect(4))
            a = a.mul(player.prestigePoints.add(1).root(3))
            a = a.mul(this.getUpgradeEffect(6))
        }
        if (id==2){
            a = new Decimal(1e-35);
            a = a.add(this.getUpgradeEffect(3))
        }
        if (id==3){
            a = new Decimal(1e-35);
            a = a.mul(upgEffect(1,3,new Decimal(1)))
        }
        if (id==4){
            a = new Decimal(3.2e-35);
            a = a.mul(player.prestigePoints.add(1).root(3))
            a = a.mul(this.getUpgradeEffect(6))
        }
        if (id==5){
            a = new Decimal(1e-36);
        }
        if (id==6){
            a = new Decimal(2);
        }
        return a

    },
    getUpgradeEffect(id){
        this.fixUpgrade(id);
        let a = Decimal.dZero
        if (id==1||id==2||id==3||id==4||id==5){
            a = this.getUpgradePower(id).mul(this.getUpgradeCount(id).add(this.getUpgradeCountMore(id)));
        }
        if (id==6){
            a = this.getUpgradePower(id).mul(this.getUpgradeCount(id).add(this.getUpgradeCountMore(id))).add(1);
        }
        if (id==4 && a.lt(1) && hasUpgrade("pt", 6)){
            a = a.pow(0.7875)
        }
        if (id==3 && a.lt(1) && hasUpgrade("pt", 7)){
            a = a.pow(0.5)
        }
        return a

    },
    getUpgradeCount(id){
        this.fixUpgrade(id);
        return player.upgrades[id]
    },
    getUpgradeCostMultiplier(id){
        let a = new Decimal(1);
        if ((id == 1 || id == 3)&& hasUpgrade("pt", 4)){
            a = a.mul(0.1)
        }
        return a;
    },
    getUpgradeCountMore(id){
        this.fixUpgrade(id);
        let countmore = Decimal.dZero;
        if (id==1 && hasUpgrade("pt", 1)){
            countmore = countmore.add(upgEffect(1, 1, new Decimal(0)));
        }
        return countmore;
    },
    hasAuto(id){
        this.fixUpgrade(id);
        if ((id==1 || id==2 || id==3 || id==4 )&& hasUpgrade("pt", 2)){
            return true;
        }

        return false;
        

    },
    getAutoid(id){
        return 0x100+id;
    },
    buyForceUpgrade(id, max=false){
        this.fixUpgrade(id);
        cost = this.getUpgradeCost(id);

        res = (function(){
            if (id==1||id==2||id==3||id==4||id==6){
                return player.force
            } else{
                return player.prestigePoints
            }
        })()

        if (res.lt(cost)) return
        if (max){
            let bulk = this.getUpgradeBulk(id);
            if (bulk.lte(this.getUpgradeCount(id))) return;
            else player.upgrades[id] = bulk;
            cost = this.getUpgradeCost(id, bulk.sub(1));

        }else{
            player.upgrades[id] = player.upgrades[id].add(1)
        }

    },
    fixUpgrade(id){
        if (player.upgrades[id] === void 0){
            player.upgrades[id] = new Decimal(0)
        }

    },
    unlockedForceUpgrade(id){
        if (id<6) return true;

        if (id==6 && hasUpgrade("pt",5)) return true;
        return false;
    },
    generateUpgradeObject(id, name){
        return {
            id: `building_${id}`,
            name,
            amount: `${notation(this.getUpgradeCount(id))}${
                this.getUpgradeCountMore(id).equals(0) ? "" : (`+${notation(this.getUpgradeCountMore(id))}`)
            }`,
            cost: notation(this.getUpgradeCost(id)),
            currency: (id<5||id==6)?"N":"声望点数",
            power: this.UPGRADE_DESC[id].power(this.getUpgradePower(id)),
            effect: this.UPGRADE_DESC[id].effect(this.getUpgradeEffect(id)),
            hasauto: this.hasAuto(id),
            autoid: this.getAutoid(id),
            hide: !this.unlockedForceUpgrade(id),
        }
    }
}


function buyForceUpgrade(id){
    UPGRADES.buyForceUpgrade(id)
}
function buyForceUpgradeMax(id){
    UPGRADES.buyForceUpgrade(id, 1)
}
/*
updateBuildRow({
        id: "building_1",
        name: "推进器",
        amount: "0",
        cost: "0",
        currency: "N",
        power: "+5555 anck length",
        effect: "+0.000 planck length",
    }) */