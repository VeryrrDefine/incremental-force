function generateBuildRow(options){
    return `<div class="buildrow" style="font-size: 14px; width: 100%; margin-bottom: 5px;">
    <div style="width: 300px">
        <div class="resource">
            <span style="margin-left: 5px; text-align: left;" id="${options.id}_amount">${options.name} [${options.amount}]</span>
        </div>
    </div>
    <button class="btn" onclick='${options.buy}' id="${options.id}_cost">价格: ${options.cost} ${options.currency}</button>
    <button class="btn" onclick='${options.buymax}' style="width: 120px">购买最大</button>
    <button class="btn hide" onclick='${options.toggleauto}' id="${options.id}_auto" style="width: 70px">自动：关</button>
    <div style="margin-left: 5px; text-align: left; width: 400px"  id="${options.id}_effect">
        力量：${options.power}<br>
        效果：${options.effect}
    </div>
</div>`.replace("\n", "")
}
