import React from "react";
import {AvatarEditorContext} from "@/contexts/AvatarEditorContext";
import classes from "./styles.module.css";
import ColorInput from "@/components/ColorInput";

export default function ColorPicker() {
    const editorContext = React.useContext(AvatarEditorContext);

    return <div className={classes.colorPicker}>
        <ColorInput value={editorContext.currentColor} onChange={e => {
            editorContext.setCurrentColor(e.currentTarget.value);
        }}></ColorInput>
        <ul role={"menuitem"} className={classes.menubarList}>
            {[...editorContext.colorHistory].map((color, index) => {
                return <button onClick={() => {
                    editorContext.setCurrentColor(color);
                }} className={classes.colorHistoryButton} key={index} style={{
                    background: color
                }}></button>
            })}
        </ul>
    </div>
}
