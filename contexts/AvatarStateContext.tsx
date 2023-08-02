import React from "react";
import useBoxesWithGrids, {Grids} from "@/hooks/useBoxesWithGrids";
import {SideType} from "@/components/PaintablePixelBox";
import useMemoizedObject from "@/hooks/useMemoizedObject";
import {AvatarEditorContext} from "@/contexts/AvatarEditorContext";
import {performExportToImage, performImportFromImage} from "@/helpers/formatConverter";
import {z} from "zod";
import pickFiles from "@/helpers/ephemeralElements";
import {BoxName, SETUP_INFO} from "@/constants/setup";

Object.freeze(SETUP_INFO);
Object.values(SETUP_INFO).forEach(i => Object.freeze(i));

export type AvatarBlockSetupInfo = typeof SETUP_INFO[BoxName];
export const AVATAR_EDITOR_STATE_ACTION = z.enum(["export", "import", "new"]);
export type AvatarEditorStateAction = z.infer<typeof AVATAR_EDITOR_STATE_ACTION>;

export interface AvatarStateContext {
    setup: Record<BoxName, AvatarBlockSetupInfo>;
    boxes: Record<BoxName, Grids>;
    activateTile: (boxName: BoxName, sideType: SideType, coordinates: { x: number, y: number }) => void;
    shown: Record<BoxName, boolean>;
    toggleShown: (boxName: BoxName) => void;
    exportStateToImage: () => void;
    importStateFromImage: () => void;
    resetState: () => void;
}

const AvatarStateContext = React.createContext<AvatarStateContext | null>(null);

export function useAvatarState() {
    const contextData = React.useContext(AvatarStateContext);
    if (!contextData) {
        throw new Error("Missing context data!");
    }
    return contextData;
}

export default function AvatarStateProvider({children}: { children?: React.ReactNode }) {
    const avatarEditorContext = React.useContext(AvatarEditorContext);
    const colorRef = React.useRef<string>(avatarEditorContext.currentColor);
    const [boxes, updateBox, reloadBoxes] = useBoxesWithGrids(SETUP_INFO, {}, "#0000");
    const [shown, setShown] = React.useState(() => {
        return Object.fromEntries(Object.keys(SETUP_INFO).map(key => {
            return [key, true];
        })) as Record<BoxName, boolean>;
    });

    const importStateFromImage = React.useCallback(() => {
        async function main() {
            const file = await pickFiles({
                accept: "image/png",
            });

            if (!file) return;
            const data = await performImportFromImage(file);
            reloadBoxes(data);
        }

        main();
    }, [reloadBoxes]);

    const resetState = React.useCallback(() => {
        reloadBoxes({});
    }, [reloadBoxes]);

    const exportStateToImage = React.useCallback(() => {
        performExportToImage(boxes).then();
    }, [boxes]);

    React.useEffect(() => {
        colorRef.current = avatarEditorContext.currentColor;
    }, [avatarEditorContext.currentColor]);

    const activateTile = React.useCallback(function (boxName: BoxName, sideType: SideType, coordinates: {
        x: number,
        y: number
    }) {
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
        });
    }, []);

    const ctxValue: AvatarStateContext = useMemoizedObject({
        boxes, setup: SETUP_INFO, activateTile, toggleShown, shown, exportStateToImage, importStateFromImage, resetState
    });

    return <AvatarStateContext.Provider value={ctxValue}>
        {children}
    </AvatarStateContext.Provider>;
}
