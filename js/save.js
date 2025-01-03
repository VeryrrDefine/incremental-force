const VERSION = 1
const SAVE_ID = "inc_force_save"
var prevSave = "", autosave


function getPlayerData() {
    let s = {
        latest_time: Date.now(),
        VERSION: VERSION,

        mass: new Decimal(0),
        speed: new Decimal(0),
        force: new Decimal(0),

        upgrades: {
            1: new Decimal(0),
            2: new Decimal(0),
            3: new Decimal(0),
            4: new Decimal(0),
            5: new Decimal(0),
            6: new Decimal(0),
        },
        prestigePoints: new Decimal(0),
        prestiged: false,

        objMass1: new Decimal(0),

        mainUpg: {
            pt: []
        },
        auto: [],

        options: {
            formatDisplay: 0
        }
    }


    return s
}

function wipe(reload, start, keepoption=true){
    if (!start) formatDisplay = player.options.formatDisplay;
	player = getPlayerData()
    if (!start) player.formatDisplay = formatDisplay
    if (start) return
	if (reload) {
        save()
        location.reload()
    }
    
}

function clonePlayer(obj,data) {
    let unique = {}

    for (let k in obj) {
        if (data[k] == null || data[k] == undefined) continue
        unique[k] = Object.getPrototypeOf(data[k]).constructor.name == "Decimal"
        ? new Decimal(obj[k])
        : typeof obj[k] == 'object'
        ? clonePlayer(obj[k],data[k])
        : obj[k]
    }

    return unique
}

function deepNaN(obj, data) {
    for (let k in obj) {
        if (typeof obj[k] == 'string') {
            if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(new Decimal(obj[k]).mag)) obj[k] = data[k]
        } else {
            if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k]
            if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k])
        }
    }
    return obj
}

function deepUndefinedAndDecimal(obj, data) {
    if (obj == null) return data
    for (let k in data) {
        if (obj[k] === null) continue
        if (obj[k] === undefined) obj[k] = data[k]
        else {
            if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = new Decimal(obj[k])
            else if (typeof obj[k] == 'string') {
                if (!Decimal.isNaN(new Decimal(data[k]))) 
                    obj[k] = new Decimal(obj[k])
            }
            else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
        }
    }
    return obj
}


function save(auto=false) {
    if (auto) return
    let str = btoa(JSON.stringify(player))
    if (findNaN(str, true)) return
    if (localStorage.getItem(SAVE_ID) == '') wipe()
    localStorage.setItem(SAVE_ID,str)
    prevSave = str
}

function autosave(){
    save(true)
}

function load(x){
    if(typeof x == "string" && x != ''){
        loadPlayer(JSON.parse(atob(x)))
    } else {
        wipe(false,true)
    }
}

function exporty() {
    let str = btoa(JSON.stringify(player))
    save();
    let file = new Blob([str], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "Incremental Force Save - "+new Date().toGMTString()+".txt"
    a.click()
}

function copyToClipboard(text) {
    let copyText = document.getElementById('copy')
    copyText.value = text
    copyText.style.visibility = "visible"
    copyText.select();
    document.execCommand("copy");
    copyText.style.visibility = "hidden"
}

function export_copy() {
    copyToClipboard(btoa(JSON.stringify(player)))
}

function importy() {
    createPromptPopup("导入存档", loadgame=>{
        if (loadgame != null) {
            let keep = player
            try {
                if (findNaN(loadgame, true)) {
                    error("Error Importing, because it got NaNed")
                    return
                }
                localStorage.setItem(SAVE_ID, loadgame)
                location.reload()
            } catch (error) {
                error("Error Importing")
                player = keep
            }
        }
    })
}

function importy_file() {
    let a = document.createElement("input")
    a.setAttribute("type","file")
    a.click()
    a.onchange = ()=>{
        let fr = new FileReader();
        fr.onload = () => {
            let loadgame = fr.result
            if (findNaN(loadgame, true)) {
				error("Error Importing, because it got NaNed")
				return
			}
            localStorage.setItem(SAVE_ID, loadgame)
			location.reload()
        }
        fr.readAsText(a.files[0]);
    }
}


function checkNaN() {
    let naned = findNaN(player)
    if (naned) {
        warn("Game Data got NaNed because of "+naned.bold())
        resetTemp()
        loadGame(false, true)
        tmp.start = 1
        tmp.pass = 1
    }
}

function isNaNed(val) {
    return typeof val == "number" ? isNaN(val) : Object.getPrototypeOf(val).constructor.name == "Decimal" ? isNaN(val.mag) : false
}

function findNaN(obj, str=false, data=getPlayerData(), node='player') {
    if (str ? typeof obj == "string" : false) obj = JSON.parse(atob(obj))
    for (let k in obj) {
        if (typeof obj[k] == "number") if (isNaNed(obj[k])) return node+'.'+k
        if (str) {
            if (typeof obj[k] == "string") if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(new Decimal(obj[k]).mag)) return node+'.'+k
        } else {
            if (obj[k] == null || obj[k] == undefined ? false : Object.getPrototypeOf(obj[k]).constructor.name == "Decimal") if (isNaN(new Decimal(obj[k]).mag)) return node+'.'+k
        }
        if (typeof obj[k] == "object") {
            let node2 = findNaN(obj[k], str, data[k], (node?node+'.':'')+k)
            if (node2) return node2
        }
    }
    return false
}


function loadPlayer(load) {
    const DATA = getPlayerData()
    player = deepNaN(load, DATA)
    player = deepUndefinedAndDecimal(player, DATA)

    checkVersion()
}
function checkVersion() {
    player.VERSION = Math.max(player.VERSION, VERSION)
}

function hardreset() {
    createPromptPopup("你确定要硬重置吗? 这将会重置一切！<br>输入\"狂笑的蛇将写散文\"以确认",
     function(x){
        
        if (x=="狂笑的蛇将写散文") wipe(1)
    }
     )
}