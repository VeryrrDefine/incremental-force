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
    if (v.currentTab.slice(0, 2) != tab.slice(0,2)){
        $(`[${v.currentTab.slice(0,2)}-subtab]`).addClass("hide")

    }
    v.currentTab = tab;

}
// 5 6 1 2 21 12 33 2 21 123 3 2 21 12 3 3 3 5 3532 1 3
function updateHTML(){
    setHTML("[mass-dis]", formatMass(player.mass))
    setHTML("[speed-dis]", formatLength(player.speed))
    setHTML("[force-dis]", notation(v.force))
    setHTML("[player-force-dis]", notation(player.force))
    
    setHTML("[prestige-points-gain]", notation(PRESTIGE.gain()))
    setHTML("[prestige-points-dis]", notation(player.prestigePoints))
    setHTML("[prestige-points-effect]", notation(player.prestigePoints.add(1).root(3)))
    $(`#${v.currentTab}, [${v.currentTab.slice(0,2)}-subtab]`).removeClass("hide")

    if (player.prestiged){
        $("[after-prestiged]").removeClass("hide")
    }
    /*updateBuildRow({
        id: "building_1",
        name: "推进器",
        amount: "0",
        cost: "0",
        currency: "N",
        power: "+1/10 planck length",
        effect: "+0.000 planck length",
    })*/
    updateBuildRow(UPGRADES.generateUpgradeObject(1, "推进器"))
    updateBuildRow(UPGRADES.generateUpgradeObject(2, "重量器"))
    updateBuildRow(UPGRADES.generateUpgradeObject(3, "重量器 II"))
    updateBuildRow(UPGRADES.generateUpgradeObject(4, "推进器 II"))
    updateBuildRow(UPGRADES.generateUpgradeObject(5, "额外物体质量 I"))
    updateBuildRow(UPGRADES.generateUpgradeObject(6, "推进器 III"))

    mainupghtml = getMainUpgradeHTML()
    setHTML("#main_upg_table", mainupghtml[0])
    setHTML("#main_upg_msg", mainupghtml[1])

	for (let x = 1; x <= OTU.main.cols; x++) {
		let id = OTU.main.ids[x]
		let upg = OTU.main[x]
		let unl = upg.unl()
		if (unl) {
			for (let y = 1; y <= upg.lens; y++) {
				let unl2 = upg[y].unl ? upg[y].unl() : true
                ele = $(`#main_upg_${x}_${y}`)
				if (!unl2) ele.addClass("hide")
                else ele.removeClass("hide")
			}
			/*v.el["main_upg_"+x+"_auto"].setDisplay(upg.auto_unl ? upg.auto_unl() : false)
			v.el["main_upg_"+x+"_auto"].setTxt(player.auto_mainUpg[id]?"ON":"OFF")*/
		}
	}
}
function updateBuildRow(options){
    if (options.hide) $(`#${options.id}`).addClass('hide')
    else $(`#${options.id}`).removeClass('hide')
    setHTML(`#${options.id}_effect`, `力量：${options.power}<br>效果：${options.effect}`)
    setHTML(`#${options.id}_amount`, `${options.name} [${options.amount}]`)
    setHTML(`#${options.id}_cost`, `价格: ${options.cost} ${options.currency}`)
    setHTML(`#${options.id}_auto`, `自动: ${autoState(options.autoid)?"开":"关"}`)
    if (!options.hasauto) $(`#${options.id}_auto`).addClass('hide')
    else $(`#${options.id}_auto`).removeClass('hide')

}
function initHTML() {
    setHTML("#building_1", generateBuildRow({
        id: "building_1",
        name: "推进器",
        amount: "0",
        cost: "0",
        currency: "N",
        power: "+1/10 planck length",
        effect: "+0.000 planck length",
        buy: "buyForceUpgrade(1)",
        buymax: "buyForceUpgradeMax(1)",
        toggleauto: "toggleForceUpgradeAuto(1)",
    }))
    setHTML("#building_2", generateBuildRow({
        id: "building_2",
        name: "重量器",
        amount: "0",
        cost: "0",
        currency: "N",
        power: "+1/1e36 g",
        effect: "+0.000 g",
        buy: "buyForceUpgrade(2)",
        buymax: "buyForceUpgradeMax(2)",
        toggleauto: "toggleForceUpgradeAuto(2)",
    }))
    setHTML("#building_3", generateBuildRow({
        id: "building_3",
        name: "重量器 II",
        amount: "0",
        cost: "0",
        currency: "N",
        power: "+1/1e36 g",
        effect: "+0.000 g",
        buy: "buyForceUpgrade(3)",
        buymax: "buyForceUpgradeMax(3)",
        toggleauto: "toggleForceUpgradeAuto(3)",
    }))
    setHTML("#building_4", generateBuildRow({
        id: "building_4",
        name: "推进器 II",
        amount: "0",
        cost: "0",
        currency: "N",
        power: "+1/1e36 g",
        effect: "+0.000 g",
        buy: "buyForceUpgrade(4)",
        buymax: "buyForceUpgradeMax(4)",
        toggleauto: "toggleForceUpgradeAuto(4)",
    }))
    setHTML("#building_5", generateBuildRow({
        id: "building_5",
        name: "额外物体质量",
        amount: "0",
        cost: "0",
        currency: "声望点数",
        power: "+1/1e36 g",
        effect: "+0.000 g",
        buy: "buyForceUpgrade(5)",
        buymax: "buyForceUpgradeMax(5)",
        toggleauto: "toggleForceUpgradeAuto(5)",
    }))
    setHTML("#building_6", generateBuildRow({
        id: "building_6",
        name: "推进器 III",
        currency: "N",
        buy: "buyForceUpgrade(6)",
        buymax: "buyForceUpgradeMax(6)",
        toggleauto: "toggleForceUpgradeAuto(6)",
    }))
}
function currentObjectSpeed(){
    let a = Decimal.dZero
    a = a.add(UPGRADES.getUpgradeEffect(1))
    return a
}
function currentObjectMass(){
    let a = Decimal.dZero
    a = a.add(UPGRADES.getUpgradeEffect(2))
    a = a.add(player.objMass1)
    return a

}
function getMainUpgradeHTML(){
    table = ""
	for (let x = 1; x <= OTU.main.cols; x++) {
		let id = OTU.main.ids[x]
		table += `<div id="main_upg_${x}_div" style="width: 230px; margin: 0px 10px;"><b>${OTU.main[x].title}</b><br><br><div style="font-size: 13px; min-height: 50px" id="main_upg_${x}_res"></div><br><div class="table_center" style="justify-content: start;">`
		for (let y = 1; y <= OTU.main[x].lens; y++) {
			let key = OTU.main[x][y]
            classt = ""
            let upg = OTU.main[x]
            let unl2 = upg[y].unl ? upg[y].unl() : true
            if (upg.can===void 0||!upg.can(y)) classt += " locked"
            if (player.mainUpg[id].includes(y)) classt += " bought"
			table += `<img onclick="buyUpgrade('${id}', ${y})" onmouseover="OTU.main.over(${x},${y})" onmouseleave="OTU.main.reset()" style="margin: 3px;" class="img_btn${classt}" id="main_upg_${x}_${y}" src="${key.noImage?`images/upgrades/main_upg_placeholder.png`:`images/upgrades/main_upg_${id+y}.png`}">`
		}	
        table += `</div><br></div>`
	
	}
    message = ""
    if (v.upgs.msg[0] != 0){
		let upg1 = OTU.main[v.upgs.msg[0]]
		let upg2 = OTU.main[v.upgs.msg[0]][v.upgs.msg[1]]
        message = "<span class='sky'>"+(typeof upg2.desc == "function" ? upg2.desc() : upg2.desc)+"</span><br><span>Cost: "+(notation)(upg2.cost,0)+" "+upg1.resName+"</span>"
        if (upg2.effDesc !== undefined) message += "<br><span class='green'>Currently: "+upg2.effDesc(v.upgs[v.upgs.msg[0]][v.upgs.msg[1]].effect)+"</span>"
    }
    return [table, message];
}
toggleForceUpgradeAuto = (x)=>{toggleAuto(0x100+x)}
function loop() {
    diff = Date.now()-date;
    
    updateTemp()
    OTU.main.temp();

    
    updateHTML()

    player.force = player.force.add(v.force.mul(diff/1000))
    player.mass = currentObjectMass()
    player.speed = currentObjectSpeed()

    PRESTIGE.prestigeLoop(diff/1000)
    for (let i = 1; i<5; i++){
        if (autoState(i+0x100) && UPGRADES.hasAuto(i)){
            buyForceUpgrade(i)
            buyForceUpgradeMax(i)
        }
    }
    date = Date.now()
    player.latest_time = date;
}
function toggleAuto(i){
    player.auto = [...(new Set(player.auto))]
    let temp1 = player.auto.indexOf(i)
    if (temp1 == -1) {
        player.auto.push(i)
    } else {
        player.auto.splice(temp1, 1)
    }
}
function autoState(id){
    player.auto = [...(new Set(player.auto))]
    return player.auto.includes(id)
}
bool = {
    a:0,
    valueOf() {
        this.a++
        return !!(this.a%2)
    }
}