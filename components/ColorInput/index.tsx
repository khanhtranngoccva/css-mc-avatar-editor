import {ComponentProps} from "react";
import classes from './styles.module.css'

export default function ColorInput(props: ComponentProps<"input">) {
    return <input {...props} type="color" className={`${classes.colorInput} ${props.className ?? ''}`}></input>
}
