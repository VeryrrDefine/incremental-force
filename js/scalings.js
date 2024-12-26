/*const SCALE_START = {
    super: {
        forceUpgs: new Decimal(100)
    }
}


const FULL_SCALE_NAME = ['Super',]
const SCALE_TYPE = ['super'] // super, hyper, ultra, meta, exotic

const SCALING_RES = {
    forceUpgs() {return new Decimal(0)}
}


const NAME_FROM_RES = {
    forceUpgs: "Force Upgrades"
}
function scalingActive(name, amt, type) {
	if (SCALE_START[type][name] === undefined) return false
	return Decimal.gte(amt, v.scaling_start[type][name]);
}


function getScalingStart(type, name) {
    let start = SCALE_START[SCALE_TYPE[type]][name]
    let t_name = SCALE_TYPE[name]

    return start.floor(0)
}

function noScalings(type,name) {

	return false
}
function updateScalingTemp() {
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		let st = SCALE_TYPE[x]

		v.scaling[st] = []
		v.no_scalings[st] = []

        v.scaling_power[st] ?? (v.scaling_power[st]={})
        v.scaling_start[st] ?? (v.scaling_start[st]={})

		let sp = v.scaling_power[st], ss = v.scaling_start[st], ns = v.no_scalings[st]
		let key = Object.keys(SCALE_START[st])

		for (let y = 0; y < key.length; y++) {
			let sn = key[y]

			sp[sn] = getScalingPower(x,sn)
			ss[sn] = getScalingStart(x,sn)
			if (noScalings(x,sn)) ns.push(sn)
			else {
                if (scalingActive(sn, SCALING_RES[sn](), st)) v.scaling[st].push(sn)
			}
		}
	}
}

function getScalingPower(type, name) {
    let power = new Decimal(1);

    return power
}*/