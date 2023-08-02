import PaintablePixelBox, {PaintablePixelBoxProps, SideType} from "../PaintablePixelBox";
import React from "react";
import {useAvatarState} from "@/contexts/AvatarStateContext";
import {BoxName} from "@/constants/setup";
import Group from "@/components/react-dimension-css/components/Group";
import classes from "./styles.module.css"
import {AvatarEditorContext} from "@/contexts/AvatarEditorContext";

function _AvatarPixelBox(props: {
    variant: BoxName,
}) {
    const {avatarCanWalk} = React.useContext(AvatarEditorContext);
    const {boxes, activateTile, setup} = useAvatarState()
    const setupInfo = setup[props.variant];

    const updateCb = React.useCallback((...args: Parameters<PaintablePixelBoxProps["onTileActive"]>) => {
        activateTile(props.variant, ...args);
    }, [activateTile, props.variant]);

    const walking = avatarCanWalk && setupInfo.canSwing;

    const style: React.CSSProperties = walking ? {
        animationDelay: `calc(${setupInfo.swingDelayMultiplier} * var(--swingDuration))`,
        transformOrigin: `0 calc(${setupInfo.baseUnit} * ${setupInfo.swingCenterY}) 0`
    } : {};

    return <Group
        x={`calc(${setupInfo.x} * ${setupInfo.baseUnit})`}
        y={`calc(${setupInfo.y} * ${setupInfo.baseUnit})`}
        z={`calc(${setupInfo.z} * ${setupInfo.baseUnit})`}
    >
        <PaintablePixelBox
            width={`calc(${setupInfo.width} * ${setupInfo.baseUnit} + ${setupInfo.wrapSize})`}
            height={`calc(${setupInfo.height} * ${setupInfo.baseUnit} + ${setupInfo.wrapSize})`}
            length={`calc(${setupInfo.length} * ${setupInfo.baseUnit} + ${setupInfo.wrapSize})`}
            grids={boxes[props.variant]}
            style={style}
            className={walking ? classes.swing : ''}
            onTileActive={updateCb}
        />
    </Group>
}

const AvatarPixelBox = React.memo(_AvatarPixelBox);

export default AvatarPixelBox;
