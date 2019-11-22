import { log4js } from '../src/utils'
const logger = log4js.getLogger(__filename)

async function main() {
    return new Promise( (resolve, reject) => {
        errorAsync((err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })

}

function errorSync() {
    throw new Error('sync error')
}

function errorAsync(callback) {
    setImmediate( () => {
        callback(new Error('async error'))
    })
}

main().catch((e) => {
    logger.error(e)
    logger.info('程序没有崩溃把')
})
