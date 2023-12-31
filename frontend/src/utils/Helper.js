import {jwtDecode} from "jwt-decode";

function convertStringToDateWithoutTimezone(dateInString) {
    const date = new Date(dateInString)
    const computedDate = 60000 * date.getTimezoneOffset()
    return new Date(date.getTime() + computedDate)
}

function convertDateTimeToDate(date) {
    const weekend = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ]
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
    ]
    return weekend[date.getDay()]
        + " "
        + months[date.getMonth()]
        + " "
        + date.getDate()
        + " "
        + date.getFullYear()
}

function convertDateTimeToTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function omitLongString(str, len) {
    if (str.length > len)
        return str.substring(0, len - 3) + "..."
    return str
}

function getToastDataFromResponse(response) {
    const toastDataTemp = {}
    switch (response?.status) {
        case 201:
        case 200:
            toastDataTemp.message = "Success!";
            toastDataTemp.alertType = "success";
            break;
        default:
            toastDataTemp.message = "Error!"
            toastDataTemp.alertType = "error"
            break;
    }
    return toastDataTemp
}

function checkTokenValidity(token) {
    if (typeof token === "string") {
        token = parseJWT(token)
    }
    return token.exp > Math.floor(new Date().getTime() / 1000)
}

function removeEverythingFromDateString(str) {
    str = str.replaceAll(" UTC+03:30", "")
    const splitStr = str.split('/')
    if (splitStr[1].length === 1)
        splitStr[1] = '0' + splitStr[1]
    const secondSplitStr = splitStr[2].split(",")
    if (secondSplitStr[0].length === 1)
        splitStr[2] = "0" + secondSplitStr.join(",")
    const timeSplitStr = splitStr[2].split(",")[1].split(":")[0].trim()
    if (timeSplitStr.length === 1)
        splitStr[2] = splitStr[2].split(",")[0] + "0" + splitStr[2].split(",")[1].split(":")[0].trim()
    str = splitStr.join('/')
    return str
        .replaceAll("/", '')
        .replaceAll(" ", '')
        .replaceAll(":", "")
        .replaceAll(",", "")
}

function parseJWT(token) {
    try {
        return jwtDecode(token)
    } catch (exception) {
        throw new Error("Failed to parse token: Invalid token")
    }
}

export const Helper = {
    convertStringToDateWithoutTimezone,
    convertDateTimeToDate,
    convertDateTimeToTime,
    omitLongString,
    getToastDataFromResponse,
    removeEverythingFromDateString,
    checkTokenValidity,
    parseJWT,
}