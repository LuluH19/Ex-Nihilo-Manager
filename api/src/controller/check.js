const isValidEmail = (email) => {
    if (typeof email != "string") {
        return false
    }
    if (email.trim() == "") {
        return false
    }
    const pattern = /[a-zA-Z0-9._\-]{1,30}[@][a-zA-Z0-9._\-]{4,12}[.]{1}[a-zA-Z]{2,4}/gm
    const match = email.match(pattern) || undefined
    if (match == undefined) {
        return false
    }
    return match.length == 1 && match[0].length == email.length
}

const isValidTel = (tel) => {
    if (typeof tel != "string") {
        return false
    }
    if (tel.trim() == "") {
        return false
    }
    const pattern = /^0[6-7]\d{8}$/gm
    const match = tel.match(pattern) || undefined
    if (match == undefined) {
        return false
    }
    return match.length == 1 && match[0].length == tel.length
}

const isValidPosInt = (num) => {
    if(typeof num == "number"){
        return num > 0 && Number.isInteger(num)
    }
    if(typeof num == "string"){
        return /^\+?[1-9]\d*$/.test(age)
    }
    return false
}

const isValidDataObject = (object) => {
    return Object.values(object).every(
        item => {
            if (typeof item == "string") {
                return item.trim() != ""
            }
            if (typeof item == "number") {
                return !isNaN(item)
            }
            return true
        }
    )
}

const isValidPassword = (password) => {
    return password.length >= 6 && password.length <= 30 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
}

module.exports = { isValidEmail, isValidTel, isValidPassword, isValidDataObject, isValidPosInt }