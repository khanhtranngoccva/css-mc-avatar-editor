import {AvatarEditorMode} from "@/contexts/AvatarEditorContext";
import {FunctionComponent} from "react";
import {Eye, PenTool, IconProps} from "react-feather";
import classes from './styles.module.css';

const ICON_MAPPING: Record<AvatarEditorMode, FunctionComponent<IconProps>> = {
    view: Eye,
    paint: PenTool,
}
export default function AvatarEditorModeButton(props: {
    label: string;
    mode: AvatarEditorMode;
    onClick?: () => void;
    active?: boolean;
}) {
    const Icon = ICON_MAPPING[props.mode];

    return <button className={`${classes.button} ${props.active ? classes.active : ''}`} aria-label={props.label} onClick={props.onClick}>
        <Icon/>
    </button>
}
