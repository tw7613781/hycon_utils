import { log4js } from './utils'

const logger = log4js.getLogger(__filename)

function jabiruGetTarget(p: number, length: number = 32): Buffer {
    // Consensus Critical
    if (p > 1) {
        logger.warn(`Difficulty(${p.toExponential()}) is too low, anything is possible. (　＾∇＾)`)
        p = 1
    }
    if (p < Math.pow(0x100, -length)) {
        logger.warn(`Difficulty(${p.toExponential()}) is too high, give up now. (╯°□°）╯︵ ┻━┻`)
        p = Math.pow(0x100, -length)
    }
    const target = Buffer.allocUnsafe(length)
    let carry = p
    for (let i = target.length - 1; i >= 0; i--) {
        // 16进制的100
        carry *= 0x100
        // 取整
        target[i] = Math.floor(carry)
        // 剩零头
        carry -= target[i]
    }
    for (let i = 0; i < target.length; i++) {
        target[i]--
        if (target[i] !== 0xFF) {
            break
        }
    }
    return target
}

function ghostGetTarget(p: number, length: number = 32): Buffer {
    // Consensus Critical
    if (p > 1) {
        logger.warn(`Difficulty(${p.toExponential()}) is too low, anything is possible. (　＾∇＾)`)
        p = 1
    }
    if (p < Math.pow(0x100, -length)) {
        logger.warn(`Difficulty(${p.toExponential()}) is too high, give up now. (╯°□°）╯︵ ┻━┻`)
        p = Math.pow(0x100, -length)
    }
    const target = Buffer.allocUnsafe(length)
    let carry = p
    for (let i = target.length - 1; i >= 0; i--) {
        carry *= 0x100
        target[i] = Math.floor(carry)
        carry -= target[i]
    }
    logger.info(target)
    for (let i = 0; i < target.length; i++) {
        target[i]--
        if (target[i] !== 0xFF) {
            break
        }
    }
    return target
}

function test(d) {
    logger.info(`Difficulty is ${d.toExponential()}`)
    const jabiruTarget = jabiruGetTarget(d)
    logger.info(`Jabiru consensus target: ${jabiruTarget.toString('hex')}`)
    logger.info(`Jabiru consensus target: ${jabiruTarget.slice(24).toString('hex')}`)
    // const ghostTarget = ghostGetTarget(d)
    // logger.info(`Ghost consensus target:  ${ghostTarget.toString('hex')}`)
}

function main() {
    test(0.1)
    test(0.01)
    test(0.001)
    test(0.0001)
    test(0.00001)
    test(0.000001)
    test(0.0000001)
    test(0.00000001)
    test(0.000000001)
    test(0.0000000001)
    test(0.00000000001)
    test(0.000000000001)
}

main()
