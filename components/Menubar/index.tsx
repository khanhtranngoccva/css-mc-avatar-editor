import classes from "./styles.module.css";
import React from "react";

export default function Menubar(props: {variant?: "row" | "column", children?: React.ReactNode, containerClassName?: string, menulistClassName?: string}) {
    return <div className={`${classes.menubarContainer} ${classes[props.variant ?? "row"]} ${props.containerClassName ?? ''}`}>
        <div className={classes.menubar}>
            <ul role={"menubar"} className={`${classes.menubarOuterList} ${props.menulistClassName ?? ''}`}>
                {props.children}
            </ul>
        </div>
    </div>
}
