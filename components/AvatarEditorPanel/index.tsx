import classes from './styles.module.css';
import {AVATAR_EDITOR_MODES, AvatarEditorContext} from "@/contexts/AvatarEditorContext";
import React from "react";
import AvatarEditorModeButton from "@/components/AvatarEditorModeIcon";
import ColorPicker from "@/components/ColorPicker";

function ModeToggle() {
    const editorContext = React.useContext(AvatarEditorContext);

    return <ul role={"menuitem"} className={classes.menubarList}>
        {AVATAR_EDITOR_MODES._def.values.map(value => {
            return <li role={"menuitemradio"} aria-checked={value === editorContext.mode} key={value}>
                <AvatarEditorModeButton active={value === editorContext.mode} label={value.toUpperCase()} mode={value} onClick={() => editorContext.setMode(value)}></AvatarEditorModeButton>
            </li>
        })}
    </ul>
}


export default function AvatarEditorPanel() {
    return <div className={classes.menubarContainer}>
        <div className={classes.menubar}>
            <ul role={"menubar"} className={classes.menubarOuterList}>
                <li>
                    <ModeToggle></ModeToggle>
                </li>
                <li>
                    <ColorPicker></ColorPicker>
                </li>
            </ul>
        </div>
    </div>
}
