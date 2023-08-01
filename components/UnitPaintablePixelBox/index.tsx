import PaintablePixelBox, {PaintablePixelBoxProps, SideType} from "../PaintablePixelBox";
import React from "react";
import {BoxName, useAvatarState} from "@/contexts/AvatarStateContext";

function _AvatarPixelBox(props: {
    variant: BoxName,
}) {
    const {boxes, updateBox, setup} = useAvatarState()
    const setupInfo = setup[props.variant];

    const updateCb = React.useCallback((...args: Parameters<PaintablePixelBoxProps["modifyGridContents"]>) => {
        updateBox(props.variant, ...args);
    }, [updateBox, props.variant]);

    return <PaintablePixelBox
        width={`calc(${setupInfo.width} * ${setupInfo.baseUnit})`}
        height={`calc(${setupInfo.height} * ${setupInfo.baseUnit})`}
        length={`calc(${setupInfo.length} * ${setupInfo.baseUnit})`}
        x={`calc(${setupInfo.x} * ${setupInfo.baseUnit})`}
        y={`calc(${setupInfo.y} * ${setupInfo.baseUnit})`}
        z={`calc(${setupInfo.z} * ${setupInfo.baseUnit})`}
        grids={boxes[props.variant]}
        modifyGridContents={updateCb}
    />
}

const AvatarPixelBox = React.memo(_AvatarPixelBox);

export default AvatarPixelBox;
