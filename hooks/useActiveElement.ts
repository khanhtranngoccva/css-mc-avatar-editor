import React from "react";
import useMousedown from "@/components/react-dimension-css/hooks/useMousedown";
import useTouch from "@/components/react-dimension-css/hooks/useTouch";

export default function useActiveElement(ref: React.RefObject<HTMLElement>) {
    const mousedown = useMousedown(ref);
    const touchInfo = useTouch(ref);
    const [activeElement, setActiveElement] = React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
        if (!touchInfo.touchdown) {
            setActiveElement(null);
        }
    }, [touchInfo.touchdown]);

    React.useEffect(() => {
        const element = ref.current;
        if (!element) return;

        function handleMouseover(e: MouseEvent) {
            const target = e.target;
            if (target instanceof HTMLElement) setActiveElement(target);
        }

        function handleTouch(e: TouchEvent) {
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            if (target instanceof HTMLElement && element?.contains(target)) {
                setActiveElement(target);
            } else {
                setActiveElement(null)
            }
        }

        function handleMouseout() {
            setActiveElement(null);
        }

        element.addEventListener("mouseover", handleMouseover);
        element.addEventListener("mouseout", handleMouseout);
        element.addEventListener("touchmove", handleTouch);
        element.addEventListener("touchstart", handleTouch);

        return () => {
            element.removeEventListener("mouseover", handleMouseover);
            element.removeEventListener("mouseout", handleMouseout);
            element.removeEventListener("touchmove", handleTouch);
            element.removeEventListener("touchstart", handleTouch);
        };
    }, [ref]);

    return mousedown || touchInfo.touchdown ? activeElement : null;
}
