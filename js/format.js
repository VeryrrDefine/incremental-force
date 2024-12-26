
function t(x) { console.log(notation(x));console.log(x.mag, x.layer);}
function notation(amount){
    let string = "";
    if (amount.sign == -1) {
        string = string + "-";
        amount.sign = 1;
    }
    if (amount.eq(0)){
        string = "0.000"
    }
    else if (amount.lt(0.001)){
        if (amount.layer == 0){
            let power = Math.floor(Math.log10(amount.mag))
            let mantissa = amount.mag / 10 ** power;

            string = string + mantissa.toFixed(3) + "e" + power;
        } else if (amount.gt("1e-999999")){
            let temp1 = Math.floor(-amount.mag)
            let temp2 = temp1 + amount.mag
            string = string + (10**temp2*10).toFixed(3) + "e-" + (temp1+1).toString();
        }else{
            let temp1 = Decimal.log10(amount).negate()
            let power = Decimal.floor(Decimal.log10(temp1));
            let mantissa = temp1.div(Decimal.pow(10, power));
            string = string + "e-"+mantissa.toFixed(3) + "e" + power;
        }
    }
    else if (amount.lt("ee6")) {
        let power = Decimal.floor(Decimal.log10(amount));
        let mantissa = amount.div(Decimal.pow(10, power));
        if (amount == 0) string = "0.000";
        else if (power < 1) string = string + amount.toFixed(3);
        else if (power < 2) string = string + amount.toFixed(2);
        else if (power < 3) string = string + amount.toFixed(1);
        else if (power < 6) string = string + amount.toFixed(0);
        else string = string + mantissa.toFixed(3) + "e" + power;
    }
    else if (amount.lt("eee6")) {
        let power2 = Decimal.floor(Decimal.log10(Decimal.log10(amount)));
        let mantissa2 = Decimal.floor(Decimal.log10(amount)).div(Decimal.pow(10, power2));
        string = string + "e" + mantissa2.toFixed(3) + "e" + power2;
    }
    else if (amount.lt("eeee6")) {
        let power3 = Decimal.floor(Decimal.log10(Decimal.log10(Decimal.log10(amount))));
        let mantissa3 = Decimal.floor(Decimal.log10(Decimal.log10(amount))).div(Decimal.pow(10, power3));
        string = string + "ee" + mantissa3.toFixed(3) + "e" + power3;
    }
    else if (amount.layer < 1.79e308) {
        let aF = 1;
        let Fb = amount.layer;
        if (amount.mag <  1e10) {
            aF = Decimal.log10(amount.mag);
            Fb = Fb + 1;
        }
        else {
            aF = Decimal.log10(Decimal.log10(amount.mag));
            Fb = Fb + 2;
        }
        string = string + aF.toFixed(3) + "f" + Fb;
    }
    else if (!isFinite(amount.mag) && !isFinite(amount.layer)) {
        string = "Infinity"
    }
    else if (isNaN(amount.mag) && isNaN(amount.layer)) {
        string = "NaN"
    }
    return string;

}


function formatMass(ex){
    if (ex.gte(1.5e56)) return notation(ex.div(1.5e56)) + ' uni'
    if (ex.gte(2.9835e45)) return notation(ex.div(2.9835e45)) + ' MMWG'
    if (ex.gte(1.989e33)) return notation(ex.div(1.989e33)) + ' M☉'
    if (ex.gte(5.972e27)) return notation(ex.div(5.972e27)) + ' M⊕'
    if (ex.gte(1.619e20)) return notation(ex.div(1.619e20)) + ' MME'
    if (ex.gte(1e6)) return notation(ex.div(1e6)) + ' t'
    if (ex.gte(1e3)) return notation(ex.div(1e3)) + ' kg'
    if (ex.gte(1)) return notation(ex.div(1)) + ' g'
    if (ex.gte(1e-3)) return notation(ex.div(1e-3)) + ' mg'
    if (ex.gte(1e-6)) return notation(ex.div(1e-6)) + ' μg'
    if (ex.gte(1e-9)) return notation(ex.div(1e-9)) + ' ng'
    if (ex.gte(1e-12)) return notation(ex.div(1e-12)) + ' pg'
    return notation(ex.div(1e-15)) + ' fg'
}

function formatLength(ex){

    if (ex.gte(1)) return notation(ex.div(1)) + ' m'
    if (ex.gte(1e-3)) return notation(ex.div(1e-3)) + ' mm'
    if (ex.gte(1e-6)) return notation(ex.div(1e-6)) + ' μm'
    if (ex.gte(1e-9)) return notation(ex.div(1e-9)) + ' nm'
    if (ex.gte(1e-12)) return notation(ex.div(1e-12)) + ' pm'
    if (ex.gte(1e-15)) return notation(ex.div(1e-15)) + ' fm'
    if (ex.gte(1e-18)) return notation(ex.div(1e-18)) + ' am'
    if (ex.gte(1e-21)) return notation(ex.div(1e-21)) + ' zm'
    if (ex.gte(1e-24)) return notation(ex.div(1e-24)) + ' ym'
    return notation(ex.div(1.6e-35)) + ' planck length'

}