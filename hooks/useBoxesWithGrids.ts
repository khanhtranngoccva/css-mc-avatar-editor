import {useStateWithDeps} from "use-state-with-deps";
import {generate2DColorArray} from "@/helpers/arrays";
import React from "react";
import {SideType} from "@/components/PaintablePixelBox";

export type Grids = Record<SideType, string[][]>

export interface Dimension {
    width: number;
    height: number;
    length: number;
}

export default function useBoxesWithGrids<BoxName extends string>(boxesDimensions: Record<BoxName, Dimension>, boxesInitialData: Partial<Record<BoxName, Grids>>, defaultColor: string) {
    const [boxes, setBoxes] = useStateWithDeps<Record<BoxName, Grids>>(() => {
        return Object.fromEntries(Object.entries<Dimension>(boxesDimensions).map(([_key, dimension]) => {
            const key = _key as BoxName;
            return [
                key, {
                    top: boxesInitialData[key]?.top ?? generate2DColorArray({width: dimension.length, height: dimension.width}, defaultColor),
                    bottom: boxesInitialData[key]?.bottom ?? generate2DColorArray({width: dimension.length, height: dimension.width}, defaultColor),
                    left: boxesInitialData[key]?.left ?? generate2DColorArray({width: dimension.width, height: dimension.height}, defaultColor),
                    right: boxesInitialData[key]?.right ?? generate2DColorArray({width: dimension.width, height: dimension.height}, defaultColor),
                    front: boxesInitialData[key]?.front ?? generate2DColorArray({width: dimension.length, height: dimension.height}, defaultColor),
                    back: boxesInitialData[key]?.back ?? generate2DColorArray({width: dimension.length, height: dimension.height}, defaultColor),
                }
            ];
        })) as Record<BoxName, Grids>;
    }, [...Object.values(boxesDimensions), defaultColor]);

    const updateBox = React.useCallback((boxName: BoxName, sideType: SideType, coordinates: { x: number, y: number }, color: string) => {
        setBoxes(curBoxes => {
            // Shallow copy of all instances of boxes.
            const newBoxes = {...curBoxes};

            // Shallow copy of the targeted box.
            const newGrids = {...newBoxes[boxName]}
            newBoxes[boxName] = newGrids;

            // Shallow copy of grid rows.
            const newGrid = [...newGrids[sideType]];
            newGrids[sideType] = newGrid;

            // Clone the affected grid row.
            newGrid[coordinates.y] = [...newGrid[coordinates.y]];
            newGrid[coordinates.y][coordinates.x] = color;

            return newBoxes;
        });
    }, [setBoxes]);

    return [boxes, updateBox] as [typeof boxes, typeof updateBox];
}
