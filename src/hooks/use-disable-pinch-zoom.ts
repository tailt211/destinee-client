import { useEffect } from 'react';

export default function useDisablePinchZoomEffect() {
    useEffect(() => {
        const disablePinchZoom = (e: any) => {
            if (e.touches.length > 1)
                e.preventDefault();
        };
        document.addEventListener('touchmove', disablePinchZoom, { passive: false });
        return () => {
            document.removeEventListener('touchmove', disablePinchZoom);
        };
    }, []);
}
