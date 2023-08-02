import {Grids} from "@/hooks/useBoxesWithGrids";
import {BoxName} from "@/constants/setup";

export function deepWriteToMatrix(destMatrix: string[][], srcMatrix: string[][], coords: { x: number, y: number }) {
    srcMatrix.forEach((row, rowIndex) => {
        row.forEach((item, colIndex) => {
            destMatrix[coords.y + rowIndex][coords.x + colIndex] = item;
        });
    });
}

export function extractMatrix(srcMatrix: string[][], coords: { x: number, y: number, sw: number, sh: number }) {
    return Array.from({length: coords.sh}, (_, rowIndex) => {
        return Array.from({length: coords.sw}, (_, colIndex) => {
            return srcMatrix[coords.y + rowIndex][coords.x + colIndex];
        });
    });
}

export function imageDataToArray(imageData: ImageData): string[][] {
    const array = imageData.data;
    const pixelCount = imageData.width * imageData.height;
    const result = Array.from({length: imageData.height}, () => {
        return Array.from({length: imageData.width}, () => {
            return "#0000";
        })
    })
    for (let i = 0; i < pixelCount; i++) {
        const slice = [...array.slice(i * 4, i * 4 + 4)];
        const hex = `#${slice.map(i => i.toString(16).padStart(2, "0")).join("")}`;
        result[Math.floor(i / imageData.height)][i % imageData.width] = hex;
    }
    return result;
}

export async function performImportFromImage(data: File): Promise<Partial<Record<BoxName, Grids>>> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = 64;
    canvas.height = 64;

    const bitmap = await createImageBitmap(data);
    ctx.drawImage(bitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const matrix = imageDataToArray(imageData);

    const result: Partial<Record<BoxName, Grids>> = {};


    result.head = {
        left: extractMatrix(matrix, {x: 0, y: 8, sw: 8, sh: 8}),
        front: extractMatrix(matrix, {x: 8, y: 8, sw: 8, sh: 8}),
        right: extractMatrix(matrix, {x: 16, y: 8, sw: 8, sh: 8}),
        back: extractMatrix(matrix, {x: 24, y: 8, sw: 8, sh: 8}),
        top: extractMatrix(matrix, {x: 8, y: 0, sw: 8, sh: 8}),
        bottom: extractMatrix(matrix, {x: 16, y: 0, sw: 8, sh: 8})
    };

    result.headOuter = {
        left: extractMatrix(matrix, {x: 32, y: 8, sw: 8, sh: 8}),
        front: extractMatrix(matrix, {x: 40, y: 8, sw: 8, sh: 8}),
        right: extractMatrix(matrix, {x: 48, y: 8, sw: 8, sh: 8}),
        back: extractMatrix(matrix, {x: 56, y: 8, sw: 8, sh: 8}),
        top: extractMatrix(matrix, {x: 40, y: 0, sw: 8, sh: 8}),
        bottom: extractMatrix(matrix, {x: 48, y: 0, sw: 8, sh: 8})
    };

    result.rightLeg = {
        left: extractMatrix(matrix, {x: 0, y: 20, sw: 4, sh: 12}),
        front: extractMatrix(matrix, {x: 4, y: 20, sw: 4, sh: 12}),
        right: extractMatrix(matrix, {x: 8, y: 20, sw: 4, sh: 12}),
        back: extractMatrix(matrix, {x: 12, y: 20, sw: 4, sh: 12}),
        top: extractMatrix(matrix, {x: 4, y: 16, sw: 4, sh: 4}),
        bottom: extractMatrix(matrix, {x: 8, y: 16, sw: 4, sh: 4}),
    };

    result.rightLegOuter = {
        left: extractMatrix(matrix, {x: 0, y: 36, sw: 4, sh: 12}),
        front: extractMatrix(matrix, {x: 4, y: 36, sw: 4, sh: 12}),
        right: extractMatrix(matrix, {x: 8, y: 36, sw: 4, sh: 12}),
        back: extractMatrix(matrix, {x: 12, y: 36, sw: 4, sh: 12}),
        top: extractMatrix(matrix, {x: 4, y: 32, sw: 4, sh: 4}),
        bottom: extractMatrix(matrix, {x: 8, y: 32, sw: 4, sh: 4}),
    };

    result.torso = {
        left: extractMatrix(matrix, {x: 16, y: 20, sw: 4, sh: 12}),
        front: extractMatrix(matrix, {x: 20, y: 20, sw: 8, sh: 12}),
        right: extractMatrix(matrix, {x: 28, y: 20, sw: 4, sh: 12}),
        back: extractMatrix(matrix, {x: 32, y: 20, sw: 8, sh: 12}),
        top: extractMatrix(matrix, {x: 20, y: 16, sw: 8, sh: 4}),
        bottom: extractMatrix(matrix, {x: 28, y: 16, sw: 8, sh: 4}),
    };

    result.torsoOuter = {
        left: extractMatrix(matrix, {x: 16, y: 36, sw: 4, sh: 12}),
        front: extractMatrix(matrix, {x: 20, y: 36, sw: 8, sh: 12}),
        right: extractMatrix(matrix, {x: 28, y: 36, sw: 4, sh: 12}),
        back: extractMatrix(matrix, {x: 32, y: 36, sw: 8, sh: 12}),
        top: extractMatrix(matrix, {x: 20, y: 32, sw: 8, sh: 4}),
        bottom: extractMatrix(matrix, {x: 28, y: 32, sw: 8, sh: 4}),
    };

    result.rightArm = {
        left: extractMatrix(matrix, {x: 40, y: 20, sw: 4, sh: 12}),
        front: extractMatrix(matrix, {x: 44, y: 20, sw: 4, sh: 12}),
        right: extractMatrix(matrix, {x: 48, y: 20, sw: 4, sh: 12}),
        back: extractMatrix(matrix, {x: 52, y: 20, sw: 4, sh: 12}),
        top: extractMatrix(matrix, {x: 44, y: 16, sw: 4, sh: 4}),
        bottom: extractMatrix(matrix, {x: 48, y: 16, sw: 4, sh: 4}),
    };

    result.rightArmOuter = {
        left: extractMatrix(matrix, {x: 40, y: 36, sw: 4, sh: 12}),
        front: extractMatrix(matrix, {x: 44, y: 36, sw: 4, sh: 12}),
        right: extractMatrix(matrix, {x: 48, y: 36, sw: 4, sh: 12}),
        back: extractMatrix(matrix, {x: 52, y: 36, sw: 4, sh: 12}),
        top: extractMatrix(matrix, {x: 44, y: 32, sw: 4, sh: 4}),
        bottom: extractMatrix(matrix, {x: 48, y: 32, sw: 4, sh: 4}),
    };

    result.leftLeg = {
        left: extractMatrix(matrix, {x: 16, y: 52, sw: 4, sh: 12}),
        front: extractMatrix(matrix, {x: 20, y: 52, sw: 4, sh: 12}),
        right: extractMatrix(matrix, {x: 24, y: 52, sw: 4, sh: 12}),
        back: extractMatrix(matrix, {x: 28, y: 52, sw: 4, sh: 12}),
        top: extractMatrix(matrix, {x: 20, y: 48, sw: 4, sh: 4}),
        bottom: extractMatrix(matrix, {x: 24, y: 48, sw: 4, sh: 4}),
    };

    result.leftLegOuter = {
        left: extractMatrix(matrix, {x: 0, y: 52, sw: 4, sh: 12}),
        front: extractMatrix(matrix, {x: 4, y: 52, sw: 4, sh: 12}),
        right: extractMatrix(matrix, {x: 8, y: 52, sw: 4, sh: 12}),
        back: extractMatrix(matrix, {x: 12, y: 52, sw: 4, sh: 12}),
        top: extractMatrix(matrix, {x: 4, y: 48, sw: 4, sh: 4}),
        bottom: extractMatrix(matrix, {x: 8, y: 48, sw: 4, sh: 4}),
    };

    result.leftArm = {
        left: extractMatrix(matrix, {x: 32, y: 52, sw: 4, sh: 12}),
        front: extractMatrix(matrix, {x: 36, y: 52, sw: 4, sh: 12}),
        right: extractMatrix(matrix, {x: 40, y: 52, sw: 4, sh: 12}),
        back: extractMatrix(matrix, {x: 44, y: 52, sw: 4, sh: 12}),
        top: extractMatrix(matrix, {x: 36, y: 48, sw: 4, sh: 4}),
        bottom: extractMatrix(matrix, {x: 40, y: 48, sw: 4, sh: 4}),
    };

    result.leftArmOuter = {
        left: extractMatrix(matrix, {x: 48, y: 52, sw: 4, sh: 12}),
        front: extractMatrix(matrix, {x: 52, y: 52, sw: 4, sh: 12}),
        right: extractMatrix(matrix, {x: 56, y: 52, sw: 4, sh: 12}),
        back: extractMatrix(matrix, {x: 60, y: 52, sw: 4, sh: 12}),
        top: extractMatrix(matrix, {x: 52, y: 48, sw: 4, sh: 4}),
        bottom: extractMatrix(matrix, {x: 56, y: 48, sw: 4, sh: 4}),
    };


    return result;
}

export async function performExportToImage(data: Record<BoxName, Grids>) {
    const matrix = Array.from({length: 64}, () => {
        return Array.from({length: 64}, () => {
            return '#0000';
        });
    });

    deepWriteToMatrix(matrix, data.head.left, {x: 0, y: 8});
    deepWriteToMatrix(matrix, data.head.front, {x: 8, y: 8});
    deepWriteToMatrix(matrix, data.head.right, {x: 16, y: 8});
    deepWriteToMatrix(matrix, data.head.back, {x: 24, y: 8});
    deepWriteToMatrix(matrix, data.head.top, {x: 8, y: 0});
    deepWriteToMatrix(matrix, data.head.bottom, {x: 16, y: 0});

    deepWriteToMatrix(matrix, data.headOuter.left, {x: 32, y: 8});
    deepWriteToMatrix(matrix, data.headOuter.front, {x: 40, y: 8});
    deepWriteToMatrix(matrix, data.headOuter.right, {x: 48, y: 8});
    deepWriteToMatrix(matrix, data.headOuter.back, {x: 56, y: 8});
    deepWriteToMatrix(matrix, data.headOuter.top, {x: 40, y: 0});
    deepWriteToMatrix(matrix, data.headOuter.bottom, {x: 48, y: 0});

    deepWriteToMatrix(matrix, data.rightLeg.left, {x: 0, y: 20});
    deepWriteToMatrix(matrix, data.rightLeg.front, {x: 4, y: 20});
    deepWriteToMatrix(matrix, data.rightLeg.right, {x: 8, y: 20});
    deepWriteToMatrix(matrix, data.rightLeg.back, {x: 12, y: 20});
    deepWriteToMatrix(matrix, data.rightLeg.top, {x: 4, y: 16});
    deepWriteToMatrix(matrix, data.rightLeg.bottom, {x: 8, y: 16});

    deepWriteToMatrix(matrix, data.rightLegOuter.left, {x: 0, y: 36});
    deepWriteToMatrix(matrix, data.rightLegOuter.front, {x: 4, y: 36});
    deepWriteToMatrix(matrix, data.rightLegOuter.right, {x: 8, y: 36});
    deepWriteToMatrix(matrix, data.rightLegOuter.back, {x: 12, y: 36});
    deepWriteToMatrix(matrix, data.rightLegOuter.top, {x: 4, y: 32});
    deepWriteToMatrix(matrix, data.rightLegOuter.bottom, {x: 8, y: 32});

    deepWriteToMatrix(matrix, data.torso.left, {x: 16, y: 20});
    deepWriteToMatrix(matrix, data.torso.front, {x: 20, y: 20});
    deepWriteToMatrix(matrix, data.torso.right, {x: 28, y: 20});
    deepWriteToMatrix(matrix, data.torso.back, {x: 32, y: 20});
    deepWriteToMatrix(matrix, data.torso.top, {x: 20, y: 16});
    deepWriteToMatrix(matrix, data.torso.bottom, {x: 28, y: 16});

    deepWriteToMatrix(matrix, data.torsoOuter.left, {x: 16, y: 36});
    deepWriteToMatrix(matrix, data.torsoOuter.front, {x: 20, y: 36});
    deepWriteToMatrix(matrix, data.torsoOuter.right, {x: 28, y: 36});
    deepWriteToMatrix(matrix, data.torsoOuter.back, {x: 32, y: 36});
    deepWriteToMatrix(matrix, data.torsoOuter.top, {x: 20, y: 32});
    deepWriteToMatrix(matrix, data.torsoOuter.bottom, {x: 28, y: 32});

    deepWriteToMatrix(matrix, data.rightArm.left, {x: 40, y: 20});
    deepWriteToMatrix(matrix, data.rightArm.front, {x: 44, y: 20});
    deepWriteToMatrix(matrix, data.rightArm.right, {x: 48, y: 20});
    deepWriteToMatrix(matrix, data.rightArm.back, {x: 52, y: 20});
    deepWriteToMatrix(matrix, data.rightArm.top, {x: 44, y: 16});
    deepWriteToMatrix(matrix, data.rightArm.bottom, {x: 48, y: 16});

    deepWriteToMatrix(matrix, data.rightArmOuter.left, {x: 40, y: 36});
    deepWriteToMatrix(matrix, data.rightArmOuter.front, {x: 44, y: 36});
    deepWriteToMatrix(matrix, data.rightArmOuter.right, {x: 48, y: 36});
    deepWriteToMatrix(matrix, data.rightArmOuter.back, {x: 52, y: 36});
    deepWriteToMatrix(matrix, data.rightArmOuter.top, {x: 44, y: 32});
    deepWriteToMatrix(matrix, data.rightArmOuter.bottom, {x: 48, y: 32});

    deepWriteToMatrix(matrix, data.leftLeg.left, {x: 16, y: 52});
    deepWriteToMatrix(matrix, data.leftLeg.front, {x: 20, y: 52});
    deepWriteToMatrix(matrix, data.leftLeg.right, {x: 24, y: 52});
    deepWriteToMatrix(matrix, data.leftLeg.back, {x: 28, y: 52});
    deepWriteToMatrix(matrix, data.leftLeg.top, {x: 20, y: 48});
    deepWriteToMatrix(matrix, data.leftLeg.bottom, {x: 24, y: 48});

    deepWriteToMatrix(matrix, data.leftLegOuter.left, {x: 0, y: 52});
    deepWriteToMatrix(matrix, data.leftLegOuter.front, {x: 4, y: 52});
    deepWriteToMatrix(matrix, data.leftLegOuter.right, {x: 8, y: 52});
    deepWriteToMatrix(matrix, data.leftLegOuter.back, {x: 12, y: 52});
    deepWriteToMatrix(matrix, data.leftLegOuter.top, {x: 4, y: 48});
    deepWriteToMatrix(matrix, data.leftLegOuter.bottom, {x: 8, y: 48});

    deepWriteToMatrix(matrix, data.leftArmOuter.left, {x: 48, y: 52});
    deepWriteToMatrix(matrix, data.leftArmOuter.front, {x: 52, y: 52});
    deepWriteToMatrix(matrix, data.leftArmOuter.right, {x: 56, y: 52});
    deepWriteToMatrix(matrix, data.leftArmOuter.back, {x: 60, y: 52});
    deepWriteToMatrix(matrix, data.leftArmOuter.top, {x: 52, y: 48});
    deepWriteToMatrix(matrix, data.leftArmOuter.bottom, {x: 56, y: 48});

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext("2d")!;

    matrix.forEach((row, rowIndex) => {
        row.forEach((item, colIndex) => {
            ctx.fillStyle = item;
            ctx.fillRect(colIndex, rowIndex, 1, 1);
        });
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                return reject(new Error("Blob not found!"));
            }
            resolve(blob);
        });
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "export.png";
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
}
