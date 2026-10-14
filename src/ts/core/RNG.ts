export class RNG {
    private state: number;

    constructor(seed?: number | Date ) {
        if (seed === undefined) {
            seed = Math.random() * 4294967296;
        }

        if (seed instanceof Date) {
            seed = parseInt(`${seed.getDay()}${seed.getMonth()}${seed.getFullYear()}`)
        }
        this.state = Math.floor(seed);
    }

    // mulberry between 0 and 1
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    getRandom(): number {
        let t = (this.state += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    getRandomInt(min: number, max: number): number {
        const start = Math.ceil(min);
        const end = Math.floor(max);
        return Math.floor(this.getRandom() * (end - start + 1)) + start;
    }

    getRandomElement<T>(array: T[]): T {
        const index = this.getRandomInt(0, array.length);
        return array[index];
    }
}
