import classes from './styles.module.css';
import {AvatarEditorContext} from "@/contexts/AvatarEditorContext";
import React from "react";
import AvatarEditorButton from "../AvatarEditorButton";
import ColorPicker from "@/components/ColorPicker";
import Menubar from "@/components/Menubar";
import {useAvatarState} from "@/contexts/AvatarStateContext";
import {AVATAR_EDITOR_MODES} from "@/constants/setup";

function ModeToggle() {
    const editorContext = React.useContext(AvatarEditorContext);

    return <ul role={"menuitem"} className={classes.menubarList}>
        {AVATAR_EDITOR_MODES._def.values.map(value => {
            return <li role={"menuitemradio"} aria-checked={value === editorContext.mode} key={value}>
                <AvatarEditorButton active={value === editorContext.mode} label={value.toUpperCase()} mode={value}
                                    onClick={() => editorContext.setMode(value)}></AvatarEditorButton>
            </li>;
        })}
    </ul>;
}

function StateButtons() {
    const stateContext = useAvatarState();

    return <ul role={"menuitem"} className={classes.menubarList}>
        <li role={"menuitem"}>
            <AvatarEditorButton label={"New"} mode={"new"} onClick={stateContext.resetState}></AvatarEditorButton>
        </li>
        <li role={"menuitem"}>
            <AvatarEditorButton label={"Export"} mode={"export"}
                                onClick={stateContext.exportStateToImage}></AvatarEditorButton>
        </li>
        <li role={"menuitem"}>
            <AvatarEditorButton label={"Import"} mode={"import"}
                                onClick={stateContext.importStateFromImage}></AvatarEditorButton>
        </li>
    </ul>;
}

function EditorButtons() {
    const editorContext = React.useContext(AvatarEditorContext);

    return <ul role={"menuitem"} className={classes.menubarList}>
        <li role={"menuitemcheckbox"} aria-checked={editorContext.avatarCanWalk}>
            <AvatarEditorButton active={editorContext.avatarCanWalk} label={"Toggle avatar walking"} mode={"walk"}
                            onClick={editorContext.toggleAvatarCanWalk}></AvatarEditorButton>
        </li>
    </ul>;
}


export default function AvatarEditorPanel() {
    return <Menubar variant={"row"} containerClassName={classes.menubarContainer}>
        <li>
            <StateButtons></StateButtons>
        </li>
        <li>
            <ModeToggle></ModeToggle>
        </li>
        <li>
            <EditorButtons></EditorButtons>
        </li>
        <li>
            <ColorPicker></ColorPicker>
        </li>
    </Menubar>;
}
