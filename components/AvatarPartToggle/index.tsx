import React from "react";
import {useAvatarState} from "@/contexts/AvatarStateContext";
import classes from './styles.module.css';
import Menubar from "@/components/Menubar";
import {BoxName} from "@/constants/setup";

function Toggle(props: {
    className?: string;
    shown: boolean;
    onToggle: () => void;
}) {
    return <button onClick={props.onToggle} className={`${classes.toggle} ${props.className ?? ''} ${props.shown ? classes.shown : ''}`} role={"menuitemcheckbox"} aria-checked={props.shown}></button>
}

export default function AvatarPartToggle() {
    const {setup, shown, toggleShown} = useAvatarState();

    const group1: BoxName[] = ["head", "torso", "leftArm", "rightArm", "leftLeg", "rightLeg"];
    const group2: BoxName[] = ["headOuter", "torsoOuter", "leftArmOuter", "rightArmOuter", "leftLegOuter", "rightLegOuter"];


    return <Menubar variant={"column"} containerClassName={classes.menubarContainer} menulistClassName={classes.menulist}>
        <li role={"menu"} className={classes.grid}>
            {group1.map(boxName => {
                return <Toggle shown={shown[boxName]} onToggle={() => toggleShown(boxName)} className={classes[boxName]} key={boxName}></Toggle>
            })}
        </li>
        <li role={"menu"} className={classes.grid}>
            {group2.map(boxName => {
                return <Toggle shown={shown[boxName]} onToggle={() => toggleShown(boxName)} className={classes[boxName]} key={boxName}></Toggle>
            })}
        </li>
    </Menubar>
}
