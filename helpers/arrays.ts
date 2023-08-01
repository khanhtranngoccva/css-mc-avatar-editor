export function generate2DColorArray(dimension: { width: number, height: number }, initialColor: string) {
    return Array.from({length: dimension.height}, () => {
        return Array.from({length: dimension.width}, () => {
            return initialColor;
        });
    });
}
