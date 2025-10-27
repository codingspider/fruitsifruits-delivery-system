import React, { useEffect, useRef, useState } from "react";

const MapComponent = ({ search, onSelectLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    // Load Google Maps script dynamically
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDjb20izAR-trpI_UePYVNMeZkIOn1q6Ws&libraries=places`;
      script.async = true;
      document.body.appendChild(script);
      script.onload = initMap;
      return () => document.body.removeChild(script);
    } else {
      initMap();
    }

    function initMap() {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 23.8103, lng: 90.4125 }, // default center (Dhaka)
        zoom: 13,
      });
      setMap(mapInstance);

      // Create autocomplete

      const autocomplete = new window.google.maps.places.Autocomplete(search);
      autocomplete.bindTo("bounds", mapInstance);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        // Center map
        mapInstance.setCenter(place.geometry.location);
        mapInstance.setZoom(15);

        // Drop marker
        if (marker) marker.setMap(null); // remove old
        const newMarker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: mapInstance,
        });
        setMarker(newMarker);

        // Return lat/lng
        onSelectLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
        });
      });

      autocompleteRef.current = autocomplete;
    }
  }, [search]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%", marginTop: "10px" }} />;
};

export default MapComponent;
