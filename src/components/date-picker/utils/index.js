import fecha from './fecha'

export const isPlainObject = function (obj) { 
    return Object.prototype.toString.call(obj) === '[object Object]'
}

export const isDateObject = function (value) { 
    return value instanceof Date
}

export const isValidDate = function (date) { 
    if (date === null || date === undefined) {
        return false
    }
    return !isNaN(new Date().getTime())
}

export const isValidRange = function (date) { 
    return (
        Array.isArray(date) &&
        date.length === 2 &&
        isValidDate(date[0]) &&
        isValidDate(date[1]) &&
        (new Date(date[1]).getTime() >= new Date(date[0]).getTime())
    )
}

export const parseTime = function (time) { 
    let values = time.split(':')
    if (values.length >= 2) {
        let hours = parseInt(values[0], 10)
        let minutes = parseInt(values[1], 10)
        return { hours, minutes }
    }
    return null
}

export const formatTime = function (time, type = '24', a = 'a') { 
    let { hours, minutes } = time
    hours = (type === '24') ? hours : (hours % 12 || 12)
    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    let result = hours + ':' + minutes
    if (type === '12') {
        let suffix = time.hours >= 12 ? '下午' : '上午'
        if (a === 'A') {
            suffix = suffix.toUpperCase()
        }
        result = `${result} ${suffix}`
    }
    return result
}

export const parseDate = function (str, format) {  
    return fecha.parse(str, format)
}

export const formatDate = function(date, format) {
    try {
        return fecha.format(new Date(date), format)
    } catch (e) {
        return ''
    }
}

export const throttle = function (action, delay) {  
    let lastRun = 0
    let timeout = null

    return function () {
        if (timeout) return
        let elapsed = Date.now() - lastRun

        let callBack = () => {
            lastRun = Date.now()
            timeout = null
            action.apply(this, arguments)
        }
        if (elapsed >= delay) {
            callBack()
        } else {
            timeout = setTimeout(callBack, delay)
        }
    }
}