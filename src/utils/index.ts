export const timestampToTime = (timestamp: number) => {
    if (!timestamp) {
        return ''
    }
    if (timestamp && timestamp.toString().length < 13) {
        timestamp = timestamp * 1000
    }
    const date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
}

export const timeToTimestamp = (timeString: string) => {
    if (!timeString) {
        return null
    }
    const dateObject = new Date(timeString)
    if (!isNaN(dateObject.getTime())) {
        return Math.round(dateObject.getTime() * 0.001)
    }
    throw new Error('invalid timestamp')
}

export const maxInArray = (target: any) => {
    // @ts-ignore
    return target.reduce((a: number, b: number) => Math.max(a, b))
}
