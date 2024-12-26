const OTU = {
    main: {
        temp(){
            v.upgs.unl = false
            for (let x = 1; x <= this.cols; x++) {
				let ut = v.upgs[x] = {}
                let unl = this[x].unl()
                if (!unl) continue

				v.upgs.unl = true
				for (let y = 1; y <= this[x].lens; y++) {
					let u = this[x][y]
					let unl = (u.unl ? u.unl() : true)
					ut[y] = { unl, has: unl && player.mainUpg[this.ids[x]].includes(y) }
					if (unl && u.effect) ut[y] = { ...ut[y], effect: u.effect() }
				}
            }
        },
        ids: [null, 'pt'],
        cols: 1,
        over(x, y) {v.upgs.msg = [x, y]},
        reset() {this.over(0, 0)},
        1: {
            title: "声望升级",
            resName: "声望点数",
            get res() { return player.prestigePoints },
            set res(x) { player.prestigePoints = new Decimal(x) },
            unl() { return player.prestiged },
            auto_unl() { return false },// auto buy upgrades
            lens: 7,
            1: {
                desc: "重力器增加推进器获取",
                cost: new Decimal(50),
                effect: () => player.upgrades[2],
                effDesc(x=this.effect()) {
                    return "+"+notation(x,0)+" 推进器"
                },
                noImage: true

            },
            2: {
                desc: "自动购买力升级1-4",
                cost: new Decimal(250),
                noImage: true
            },
            3: {
                desc: "声望点数加成重量器 II力量",
                cost: new Decimal(2000),
                noImage: true,
                effect: () => player.prestigePoints.max(1).log(10).add(1),
                effDesc(x=this.effect()) {
                    return "×"+notation(x,0)
                },

            },
            4: {
                desc: "推进器 重量器 II的价格×0.1",
                cost: new Decimal(10240),
                noImage: true,
            },
            5: {
                desc: "解锁推进器 III",
                cost: new Decimal(27000),
                noImage: true,
            },
            6: {
                desc: "推进器 II效果^0.7875（在效果超过1m后失效）",
                cost: new Decimal(5e9),
                noImage: true,
            },
            7: {
                desc: "重量器 II效果^0.5（在效果超过1g后失效）",
                cost: new Decimal(2.323e23),
                noImage: true,
            },
        }
    }
}

function canGetUpgrade(id, x){
    let idx = OTU.main.ids.indexOf(id), ud = OTU.main[idx], ut = v.upgs[idx][x]
	return ut?.unl && !ut.has && ud.res.gte(ud[x].cost)
}
function buyUpgrade(id,x) {
	if (!canGetUpgrade(id,x)) return
    let idx = OTU.main.ids.indexOf(id), ud = OTU.main[idx], ut = v.upgs[idx][x]
	ut.has = true
	player.mainUpg[id].push(x)
}

function hasUpgrade(id,x) { return v.upgs[OTU.main.ids.indexOf(id)]?.[x]?.has ?? false }
function upgEffect(id,x,def=new Decimal(1)) { return v.upgs[id][x]?v.upgs[id][x].effect:def }
function resetMainUpgs(id,keep=[]) {
    let k = []
    let id2 = OTU.main.ids[id], ut = v.upgs[id]
    for (let x of player.mainUpg[id2]) {
		if (keep.includes(x)) k.push(x)
		else if (ut !== undefined) ut[x].has = false
	}
    player.mainUpg[id2] = k
}