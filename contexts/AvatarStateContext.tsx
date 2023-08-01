import React from "react";
import useBoxesWithGrids, {Grids} from "@/hooks/useBoxesWithGrids";
import {SideType} from "@/components/PaintablePixelBox";
import useMemoizedObject from "@/hooks/useMemoizedObject";


const SETUP_INFO = {
    head: {width: 8, height: 8, length: 8, x: 0, y: -10, z: 0, baseUnit: "20px"},
    torso: {width: 4, height: 12, length: 8, x: 0, y: 0, z: 0, baseUnit: "20px"},
    leftArm: {width: 4, height: 12, length: 4, x: 6, y: 0, z: 0, baseUnit: "20px"},
    rightArm: {width: 4, height: 12, length: 4, x: -6, y: 0, z: 0, baseUnit: "20px"},
    leftLeg: {width: 4, height: 12, length: 4, x: 2, y: 12, z: 0, baseUnit: "20px"},
    rightLeg: {width: 4, height: 12, length: 4, x: -2, y: 12, z: 0, baseUnit: "20px"},
};

Object.freeze(SETUP_INFO);
Object.values(SETUP_INFO).forEach(i => Object.freeze(i));

export type BoxName = keyof typeof SETUP_INFO;
export type AvatarBlockSetupInfo = typeof SETUP_INFO[BoxName];

export interface AvatarStateContext {
    setup: Record<BoxName, AvatarBlockSetupInfo>;
    boxes: Record<BoxName, Grids>;
    updateBox: (boxName: BoxName, sideType: SideType, coordinates: { x: number, y: number }, color: string) => void;
}

const AvatarStateContext = React.createContext<AvatarStateContext | null>(null);

export function useAvatarState() {
    const contextData = React.useContext(AvatarStateContext);
    if (!contextData) {
        throw new Error("Missing context data!");
    }
    return contextData;
}

export default function AvatarStateProvider({children}: {children?: React.ReactNode}) {
    const [boxes, updateBox] = useBoxesWithGrids(SETUP_INFO, {},  "#0000");

    const ctxValue: AvatarStateContext = useMemoizedObject({
        boxes, setup: SETUP_INFO, updateBox
    });

    return <AvatarStateContext.Provider value={ctxValue}>
        {children}
    </AvatarStateContext.Provider>;
}
