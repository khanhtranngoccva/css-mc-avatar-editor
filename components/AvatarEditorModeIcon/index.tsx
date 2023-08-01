import {AvatarEditorMode} from "@/contexts/AvatarEditorContext";
import {FunctionComponent} from "react";
import {IconBaseProps} from "react-icons";
import { AiOutlineEye } from "react-icons/ai";
import { BsBrush, BsEraser } from "react-icons/bs";
import classes from './styles.module.css';

const ICON_MAPPING: Record<AvatarEditorMode, FunctionComponent<IconBaseProps>> = {
    view: AiOutlineEye,
    paint: BsBrush,
    erase: BsEraser,
}
export default function AvatarEditorModeButton(props: {
    label: string;
    mode: AvatarEditorMode;
    onClick?: () => void;
    active?: boolean;
}) {
    const Icon = ICON_MAPPING[props.mode];

    return <button className={`${classes.button} ${props.active ? classes.active : ''}`} aria-label={props.label} onClick={props.onClick}>
        <Icon className={classes.icon}/>
    </button>
}
