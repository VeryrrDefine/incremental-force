var popups = []
var popupVisibled = false
/*
Popup Types:
- Normal
- Confirmation
- Prompt
*/

function createPopup(text, type="normal", options={}) {
    popups.push({
        type,
        html: text,
        ...options,
    })
    
    updatePopup()
}

function createNormalPopup(text,buttonName="确认",buttonFunction) {
    createPopup(text, "normal", {
        buttonName: [buttonName],
        buttonFunction: [buttonFunction],
    })
}

function createConfirmationPopup(text,acceptFunc,rejectFunc) {
    createPopup(text, "normal", {
        buttonName: ["是", "否"],
        buttonFunction: [acceptFunc,rejectFunc],
    })
}

function createPromptPopup(text,acceptFunc,rejectFunc) {
    createPopup(text, "prompt", {
        buttonName: ["确认", "取消"],
        buttonFunction: [acceptFunc,rejectFunc],
    })
}

function updatePopup() {
    var popup_el = $("#popup")

    if (popups.length > 0 && !popupVisibled) {
        var p = popups[0]

        popupVisibled = true

        popup_el.addClass('popup-show')
        $("#popup-html").html(
            p.html + (p.type == 'prompt' ? '<br><textarea id="popup-input" placeholder="'+'prompt-placeholder'+'" rows="5"></textarea>' : '')
        )
        $("#popup-btns").html(
            p.buttonName.map((b,i) => `<button id="popup-btn${i}">${b}</button>`).join('')
        )

        var closePopup = () => {
            popups.splice(0,1)

            popupVisibled = false
            popup_el.removeClass("popup-show")
            
            setTimeout(updatePopup,500)
        }

        p.buttonName.forEach((b, i)=> {
            $("#popup-btn"+i).click(() => {
                p.buttonFunction?.[i]?.($("#popup-input").val())
                closePopup()
            })
        })
    }
}