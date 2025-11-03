import { useEffect } from "react";

let googleMapsPromise;

export function useGoogleMaps(apiKey) {
    useEffect(() => {
        if (!googleMapsPromise) {
            googleMapsPromise = new Promise((resolve) => {
                if (window.google) {
                    resolve(window.google);
                } else {
                    const script = document.createElement("script");
                    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                    script.async = true;
                    script.defer = true;
                    script.onload = () => resolve(window.google);
                    document.body.appendChild(script);
                }
            });
        }
    }, [apiKey]);

    return googleMapsPromise;
}
