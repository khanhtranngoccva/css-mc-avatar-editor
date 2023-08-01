import React, {RefObject} from "react";
import useActiveElement from "@/hooks/useActiveElement";


export default function useActiveEvent(ref: React.RefObject<HTMLElement>) {
    const element = useActiveElement(ref);

    React.useEffect(() => {
        if (!element) return;

        element.dispatchEvent(new Event("active", {
            bubbles: true,
        }));

        return () => {
            element.dispatchEvent(new Event("inactive", {
                bubbles: true,
            }));
        };
    }, [element]);
}
