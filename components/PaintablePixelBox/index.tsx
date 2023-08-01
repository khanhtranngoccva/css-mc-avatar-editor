import React from "react";
import Box from "@/components/react-dimension-css/components/Box";
import useActiveElement from "@/hooks/useActiveElement";
import classes from "./styles.module.css";
import _ from "lodash";
import useEventListener from "@/components/react-dimension-css/hooks/useEventListener";
import useActiveEvent from "@/hooks/useActiveEvent";
import {AvatarEditorContext, AvatarEditorMode} from "@/contexts/AvatarEditorContext";

export type SideType = "top" | "left" | "right" | "bottom" | "front" | "back";

export interface PaintablePixelBoxProps {
    width?: string;
    length?: string;
    height?: string;
    x?: string;
    y?: string;
    z?: string;
    defaultColor?: string;
    grids: Record<SideType, string[][]>;
    modifyGridContents: (type: SideType, coordinates: { x: number, y: number }, color: string) => void;
    hideFaces?: SideType[];
}

function _Tile(props: {
    onActive?: (coords: {x: number, y: number}) => void;
    onInactive?: (coords: {x: number, y: number}) => void;
    x: number;
    y: number;
    color: string;
}) {
    const {x, y, onActive, onInactive} = props;
    const tileRef = React.useRef<HTMLDivElement>(null);

    const active = React.useCallback(() => {
        onActive?.({x, y});
    }, [x, y, onActive]);

    const inActive = React.useCallback(() => {
        onInactive?.({x, y});
    }, [x, y, onInactive]);

    useEventListener(tileRef, "active", active);
    useEventListener(tileRef, "inactive", inActive);

    return <div style={{
        background: props.color,
    }} ref={tileRef}></div>;
}

const Tile = React.memo(_Tile);

function _Grid(props: {
    hidden: boolean;
    defaultColor: string;
    gridContents: string[][],
    paintable: boolean;
    onActive: (coordinates: { x: number, y: number }) => void,
}) {
    const gridTemplateRows = props.gridContents.length;
    const gridTemplateColumns = props.gridContents.length ? Math.max(...props.gridContents.map(row => row.length)) : 0;
    const {paintable, onActive} = props;

    const callback = React.useCallback(({x, y}: {x: number, y: number}) => {
        if (paintable) {
            onActive({x, y});
        }
    }, [paintable, onActive]);

    return <div className={classes.grid} style={{
        gridTemplateRows: `repeat(${gridTemplateRows}, 1fr)`,
        gridTemplateColumns: `repeat(${gridTemplateColumns}, 1fr)`,
        background: props.defaultColor,
        display: props.hidden ? "none" : "grid",
        cursor: props.paintable ? "crosshair" : undefined,
    }}>
        {_.range(0, gridTemplateRows).map((__, rowIndex) => {
            return _.range(0, gridTemplateColumns).map((__, colIndex) => {
                return <Tile
                    key={rowIndex * gridTemplateRows + colIndex}
                    color={props.gridContents[rowIndex][colIndex] ?? props.defaultColor}
                    x={colIndex}
                    y={rowIndex}
                    onActive={callback}
                />;
            });
        })}
    </div>;
}

const Grid = React.memo(_Grid);

function _PaintablePixelBox(props: PaintablePixelBoxProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    useActiveEvent(containerRef);
    const defaultColor = props.defaultColor ?? "#FFFFFF";
    const hideFaces = props.hideFaces ?? [];
    const editorContext = React.useContext(AvatarEditorContext);
    const paintable = editorContext.mode === "paint";
    const colorRef = React.useRef<string>(editorContext.currentColor);
    const {modifyGridContents} = props;

    // Hmmmm, nice.
    React.useEffect(() => {
        colorRef.current = editorContext.currentColor;
    }, [editorContext.currentColor]);

    const callbackMemo = React.useMemo(() => {
        const out: Record<SideType, (coordinates: { x: number, y: number }) => void> = {
            left: (...args) => modifyGridContents("left", ...args, colorRef.current),
            right: (...args) => modifyGridContents("right", ...args, colorRef.current),
            front: (...args) => modifyGridContents("front", ...args, colorRef.current),
            back: (...args) => modifyGridContents("back", ...args, colorRef.current),
            top: (...args) => modifyGridContents("top", ...args, colorRef.current),
            bottom: (...args) => modifyGridContents("bottom", ...args, colorRef.current),
        }

        return out;
    }, [modifyGridContents]);

    return <Box.Root width={props.width} height={props.height} length={props.length} x={props.x} y={props.y} z={props.z}
                     ref={containerRef}>
        <Box.Left>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.left}
                hidden={hideFaces.includes("left")}
                paintable={paintable}
                onActive={callbackMemo.left}
            />
        </Box.Left>
        <Box.Right>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.right}
                hidden={hideFaces.includes("right")}
                paintable={paintable}
                onActive={callbackMemo.right}
            />
        </Box.Right>
        <Box.Top>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.top}
                hidden={hideFaces.includes("top")}
                paintable={paintable}
                onActive={callbackMemo.top}
            />
        </Box.Top>
        <Box.Bottom>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.bottom}
                hidden={hideFaces.includes("bottom")}
                paintable={paintable}
                onActive={callbackMemo.bottom}
            />
        </Box.Bottom>
        <Box.Front>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.front}
                hidden={hideFaces.includes("front")}
                paintable={paintable}
                onActive={callbackMemo.front}
            />
        </Box.Front>
        <Box.Back>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.back}
                hidden={hideFaces.includes("back")}
                paintable={paintable}
                onActive={callbackMemo.back}
            />
        </Box.Back>
    </Box.Root>;
}

const PaintablePixelBox = React.memo(_PaintablePixelBox);
export default PaintablePixelBox;
