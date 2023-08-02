import React from "react";
import pickFiles from "@/helpers/ephemeralElements";

export default function Test() {
    return <>
        <button onClick={() => {
            pickFiles({multiple: true}).then(f => {
                console.log(f);
            });
        }}>Pick one file</button>
        <input type={"file"}/>
    </>
}
