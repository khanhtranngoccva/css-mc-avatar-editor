import {FunctionComponent} from "react";
import {IconBaseProps} from "react-icons";
import { AiOutlineEye } from "react-icons/ai";
import { BsBrush, BsEraser } from "react-icons/bs";
import {PiExport, PiFolder} from "react-icons/pi";
import {IoDocumentOutline} from "react-icons/io5";
import classes from './styles.module.css';
import {AvatarEditorStateAction} from "@/contexts/AvatarStateContext";
import {BiWalk} from "react-icons/bi";
import {AvatarEditorMode, AvatarEditorToggle} from "@/constants/setup";

type IconButtonMode = AvatarEditorMode | AvatarEditorStateAction | AvatarEditorToggle;

const ICON_MAPPING: Record<IconButtonMode, FunctionComponent<IconBaseProps>> = {
    view: AiOutlineEye,
    paint: BsBrush,
    erase: BsEraser,
    export: PiExport,
    new: IoDocumentOutline,
    import: PiFolder,
    walk: BiWalk,
}

export default function AvatarEditorButton(props: {
    label: string;
    mode: IconButtonMode;
    onClick?: () => void;
    active?: boolean;
}) {
    const Icon = ICON_MAPPING[props.mode];

    return <button className={`${classes.button} ${props.active ? classes.active : ''}`} aria-label={props.label} onClick={props.onClick}>
        <Icon className={classes.icon}/>
    </button>
}
