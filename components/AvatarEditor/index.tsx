import Scene from "@/components/react-dimension-css/components/Scene";
import Camera from "@/components/react-dimension-css/components/Camera";
import AvatarEditorProvider, {AvatarEditorContext} from "@/contexts/AvatarEditorContext";
import React from "react";
import AvatarEditorPanel from "@/components/AvatarEditorPanel";
import classes from './styles.module.css';
import AvatarPixelBox from "../UnitPaintablePixelBox";
import AvatarStateProvider, {useAvatarState} from "@/contexts/AvatarStateContext";
import AvatarPartToggle from "@/components/AvatarPartToggle";

export default function AvatarEditor() {
    return <AvatarEditorProvider>
        <AvatarStateProvider>
            <div className={classes.editor}>
                <AvatarEditorPanel></AvatarEditorPanel>
                <div className={classes.workspace}>
                    <AvatarPartToggle></AvatarPartToggle>
                    <AvatarEditorView></AvatarEditorView>
                </div>
            </div>
        </AvatarStateProvider>
    </AvatarEditorProvider>
}

function AvatarEditorView() {
    const editorContext = React.useContext(AvatarEditorContext);
    const {boxes, shown} = useAvatarState();

    return <Scene perspective={"1200px"} perspectiveOriginY={"-100px"}>
        <Camera canRotate={editorContext.mode === "view"} rotationSensitivity={500} onRotate={e => {
        }}>
            {Object.keys(boxes).map((_key) => {
                const key = _key as keyof typeof boxes;
                return shown[key] ? <AvatarPixelBox key={key} variant={key}></AvatarPixelBox> : null;
            })}
        </Camera>
    </Scene>
}
