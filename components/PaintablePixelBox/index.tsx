import React from "react";
import Box from "@/components/react-dimension-css/components/Box";
import classes from "./styles.module.css";
import _ from "lodash";
import useEventListener from "@/components/react-dimension-css/hooks/useEventListener";
import useActiveEvent from "@/hooks/useActiveEvent";
import {AvatarEditorContext, AvatarEditorMode} from "@/contexts/AvatarEditorContext";
import {z} from "zod";

export const SIDE_TYPES = z.enum(["top", "back", "bottom", "front", "right", "left"]);
export type SideType = z.infer<typeof SIDE_TYPES>;

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
    onActive?: (coords: { x: number, y: number }) => void;
    onInactive?: (coords: { x: number, y: number }) => void;
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
    mode: AvatarEditorMode;
    onActive: (coordinates: { x: number, y: number }) => void,
}) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const gridTemplateRows = props.gridContents.length;
    const gridTemplateColumns = props.gridContents.length ? Math.max(...props.gridContents.map(row => row.length)) : 0;
    const {onActive} = props;
    useActiveEvent(containerRef);

    const cursor: Record<AvatarEditorMode, string | undefined> = {
        erase: "crosshair",
        paint: "crosshair",
        view: undefined,
    };

    const callback = React.useCallback(({x, y}: { x: number, y: number }) => {
        onActive({x, y});
    }, [onActive]);

    return <div ref={containerRef} className={classes.grid} style={{
        gridTemplateRows: `repeat(${gridTemplateRows}, 1fr)`,
        gridTemplateColumns: `repeat(${gridTemplateColumns}, 1fr)`,
        background: props.defaultColor,
        display: props.hidden ? "none" : "grid",
        cursor: cursor[props.mode],
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
    const defaultColor = props.defaultColor ?? "#0002";
    const hideFaces = props.hideFaces ?? [];
    const editorContext = React.useContext(AvatarEditorContext);
    const colorRef = React.useRef<string>(editorContext.currentColor);
    const {modifyGridContents} = props;

    // Hmmmm, nice.
    React.useEffect(() => {
        colorRef.current = editorContext.currentColor;
    }, [editorContext.currentColor]);

    const callbackMemo = React.useMemo(() => {
        return Object.fromEntries(SIDE_TYPES._def.values.map(sideType => {
            return [sideType, function (coordinates: { x: number, y: number }) {
                if (editorContext.mode === "paint") {
                    modifyGridContents(sideType, coordinates, colorRef.current);
                } else if (editorContext.mode === "erase") {
                    modifyGridContents(sideType, coordinates, "#00000000");
                }
            }]
        })) as Record<SideType, (coordinates: { x: number, y: number }) => void>;
    }, [modifyGridContents, editorContext.mode]);

    return <Box.Root width={props.width} height={props.height} length={props.length} x={props.x} y={props.y}
                     z={props.z}>
        <Box.Left>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.left}
                hidden={hideFaces.includes("left")}
                mode={editorContext.mode}
                onActive={callbackMemo.left}
            />
        </Box.Left>
        <Box.Right>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.right}
                hidden={hideFaces.includes("right")}
                mode={editorContext.mode}
                onActive={callbackMemo.right}
            />
        </Box.Right>
        <Box.Top>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.top}
                hidden={hideFaces.includes("top")}
                mode={editorContext.mode}
                onActive={callbackMemo.top}
            />
        </Box.Top>
        <Box.Bottom>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.bottom}
                hidden={hideFaces.includes("bottom")}
                mode={editorContext.mode}
                onActive={callbackMemo.bottom}
            />
        </Box.Bottom>
        <Box.Front>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.front}
                hidden={hideFaces.includes("front")}
                mode={editorContext.mode}
                onActive={callbackMemo.front}
            />
        </Box.Front>
        <Box.Back>
            <Grid
                defaultColor={defaultColor}
                gridContents={props.grids.back}
                hidden={hideFaces.includes("back")}
                mode={editorContext.mode}
                onActive={callbackMemo.back}
            />
        </Box.Back>
    </Box.Root>;
}

const PaintablePixelBox = React.memo(_PaintablePixelBox);
export default PaintablePixelBox;
