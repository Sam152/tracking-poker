function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sleepRandom(lower: number, upper: number): Promise<void> {
    const randomDuration = Math.random() * (upper - lower) + lower;
    await sleep(randomDuration * 1000);
}
