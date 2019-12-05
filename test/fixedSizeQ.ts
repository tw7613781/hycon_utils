import { log4js } from '../src/utils'
const logger = log4js.getLogger(__filename)

export class FixedSizeQ<T> {

    private capacity: number
    private queue: T[]
    constructor(capacity: number) {
        this.capacity = capacity
        this.queue = []
    }

    public enqueue(ele: T) {
        const length = this.queue.length
        if (length >= this.capacity) {
            this.queue.splice(0, (length - this.capacity) + 1)
        }
        return this.queue.push(ele)
    }

    public getCapacity() {
        return this.capacity
    }

    public getUsage() {
        return this.queue.length
    }

    public toMap() {
        const mapData = new Map()
        for (const ele of this.queue) {
            let count = mapData.get(ele)
            logger.warn(count)
            if (count === undefined) {
                mapData.set(ele, 1)
            } else {
                mapData.set(ele, ++count)
            }
        }
        return mapData
    }
}

// test

const q = new FixedSizeQ<number> (100)
for (let i = 0; i < 20; i++) {
    q.enqueue(i)
}
logger.info(q)

q.enqueue(14)

q.enqueue(17)

logger.info(q)

const rt = q.toMap()

logger.info(rt)
