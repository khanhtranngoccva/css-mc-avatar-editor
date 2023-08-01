import React from "react";
import {z} from "zod";
import useMemoizedObject from "@/hooks/useMemoizedObject";

export const AVATAR_EDITOR_MODES = z.enum(["paint", "view", "erase"]);
export type AvatarEditorMode = z.infer<typeof AVATAR_EDITOR_MODES>

export interface AvatarEditorContext {
    mode: AvatarEditorMode;
    setMode: (mode: AvatarEditorMode) => void;
    colorHistory: string[];
    setCurrentColor: (color: string) => void;
    currentColor: string;
}

interface AvatarEditorProviderProps {
    maxHistoryLength?: number;
    initialColor?: string;
    children?: React.ReactNode;
}

export const AvatarEditorContext = React.createContext<AvatarEditorContext>({
    mode: "view",
    setMode: () => {
    },
    colorHistory: [],
    setCurrentColor: () => {
    },
    currentColor: "#FFFFFF",
});

function useColorHistory(maxHistoryLength: number, defaultColor: string) {
    const [history, setHistory] = React.useState<(string|undefined)[]>(() => {
        return Array.from({length: maxHistoryLength}, () => defaultColor);
    });

    const pushColorToHistory = React.useCallback((color: string) => {
        setHistory(oldHistory => {
            const newArray = Array.from(new Set([color, ...oldHistory])).slice(0, maxHistoryLength);
            newArray.length = maxHistoryLength;
            Object.freeze(newArray);
            return newArray;
        });
    }, [maxHistoryLength]);

    const transformedHistory = React.useMemo(() => {
        return Array.from(history, (value) => value || defaultColor);
    }, [history, defaultColor]);

    return useMemoizedObject([transformedHistory, pushColorToHistory] as [typeof transformedHistory, typeof pushColorToHistory]);
}

export default function AvatarEditorProvider(props: AvatarEditorProviderProps) {
    const initialColor = props.initialColor ?? "#FFFFFF";
    const maxHistoryLength = props.maxHistoryLength ?? 5;
    const [colorHistory, pushColorToHistory] = useColorHistory(maxHistoryLength, initialColor);
    const [currentColor, _setCurrentColor] = React.useState(initialColor);
    const [mode, setMode] = React.useState<AvatarEditorMode>("view");
    const timeoutRef = React.useRef<number|undefined>();

    const setCurrentColor = React.useCallback((color: string) => {
        _setCurrentColor(color);
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            pushColorToHistory(color);
        }, 1000);
    }, [pushColorToHistory]);

    const value: AvatarEditorContext = useMemoizedObject({
        mode,
        setMode,
        colorHistory,
        setCurrentColor,
        currentColor
    });

    return <AvatarEditorContext.Provider value={value}>
        {props.children}
    </AvatarEditorContext.Provider>;
}
