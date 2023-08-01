import React from "react";
import useBoxesWithGrids, {Grids} from "@/hooks/useBoxesWithGrids";
import {SideType} from "@/components/PaintablePixelBox";
import useMemoizedObject from "@/hooks/useMemoizedObject";
import {AvatarEditorContext} from "@/contexts/AvatarEditorContext";


const SETUP_INFO = {
    head: {width: 8, height: 8, length: 8, x: 0, y: -10, z: 0, baseUnit: "20px"},
    torso: {width: 4, height: 12, length: 8, x: 0, y: 0, z: 0, baseUnit: "20px"},
    leftArm: {width: 4, height: 12, length: 4, x: 6, y: 0, z: 0, baseUnit: "20px"},
    rightArm: {width: 4, height: 12, length: 4, x: -6, y: 0, z: 0, baseUnit: "20px"},
    leftLeg: {width: 4, height: 12, length: 4, x: 2, y: 12, z: 0, baseUnit: "20px"},
    rightLeg: {width: 4, height: 12, length: 4, x: -2, y: 12, z: 0, baseUnit: "20px"},
    headOuter: {width: 8, height: 8, length: 8, x: 0, y: -10, z: 0, baseUnit: "21px"},
    torsoOuter: {width: 4, height: 12, length: 8, x: 0, y: 0, z: 0, baseUnit: "21px"},
    leftArmOuter: {width: 4, height: 12, length: 4, x: 6, y: 0, z: 0, baseUnit: "21px"},
    rightArmOuter: {width: 4, height: 12, length: 4, x: -6, y: 0, z: 0, baseUnit: "21px"},
    leftLegOuter: {width: 4, height: 12, length: 4, x: 2, y: 12, z: 0, baseUnit: "21px"},
    rightLegOuter: {width: 4, height: 12, length: 4, x: -2, y: 12, z: 0, baseUnit: "21px"},
};

Object.freeze(SETUP_INFO);
Object.values(SETUP_INFO).forEach(i => Object.freeze(i));

export type BoxName = keyof typeof SETUP_INFO;
export type AvatarBlockSetupInfo = typeof SETUP_INFO[BoxName];

export interface AvatarStateContext {
    setup: Record<BoxName, AvatarBlockSetupInfo>;
    boxes: Record<BoxName, Grids>;
    activateTile: (boxName: BoxName, sideType: SideType, coordinates: { x: number, y: number }) => void;
    shown: Record<BoxName, Boolean>;
    toggleShown: (boxName: BoxName) => void;
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
    const avatarEditorContext = React.useContext(AvatarEditorContext);
    const colorRef = React.useRef<string>(avatarEditorContext.currentColor);
    const [boxes, updateBox] = useBoxesWithGrids(SETUP_INFO, {},  "#0000");
    const [shown, setShown] = React.useState(() => {
        return Object.fromEntries(Object.keys(SETUP_INFO).map(key => {
            return [key, true];
        })) as Record<BoxName, boolean>;
    });

    React.useEffect(() => {
        colorRef.current = avatarEditorContext.currentColor;
    }, [avatarEditorContext.currentColor]);

    const activateTile = React.useCallback(function (boxName: BoxName, sideType: SideType, coordinates: { x: number, y: number }) {
        if (avatarEditorContext.mode === "erase") {
            updateBox(boxName, sideType, coordinates, "#00000000");
        } else if (avatarEditorContext.mode === "paint") {
            updateBox(boxName, sideType, coordinates, colorRef.current);
        }
    }, [avatarEditorContext.mode, updateBox]);

    const toggleShown = React.useCallback((boxName: BoxName) => {
        setShown((oldState) => {
            const newState = {...oldState};
            newState[boxName] = !newState[boxName];
            return newState;
        })
    }, []);

    const ctxValue: AvatarStateContext = useMemoizedObject({
        boxes, setup: SETUP_INFO, activateTile, toggleShown, shown,
    });

    return <AvatarStateContext.Provider value={ctxValue}>
        {children}
    </AvatarStateContext.Provider>;
}
