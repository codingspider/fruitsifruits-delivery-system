import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Flex,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { DRIVER_DASHBOARD_PATH } from "../../router";
import { useTranslation } from "react-i18next";
import api from "../../axios";
import { useGoogleMaps } from "../../useGoogleMaps";

const LocationOverview = () => {
    const { t } = useTranslation();
    const [locations, setLocations] = useState([]);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const infoWindowRef = useRef(null);

    const map_api_key = localStorage.getItem("map_api_key");
    const googleMapsPromise = useGoogleMaps(map_api_key);

    const fetchLocations = async () => {
        try {
            const res = await api.get("/driver/assign/tasks");
            setLocations(res.data.data);
        } catch (err) {
            console.error("fetchLocations error:", err);
        }
    };

    useEffect(() => {
        const app_name = localStorage.getItem("app_name");
        document.title = `${app_name} | Location Overview`;
        fetchLocations();
    }, []);

    // Initialize map once Google Maps is loaded
    useEffect(() => {
        if (!googleMapsPromise) return;
        googleMapsPromise.then(() => initMap());
    }, [googleMapsPromise]);

    // Show markers when locations change
    useEffect(() => {
        if (mapInstanceRef.current && locations.length > 0) {
            showMarkers();
        }
    }, [locations]);

    function initMap() {
        infoWindowRef.current = new window.google.maps.InfoWindow();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    console.log("Device location:", currentLocation);

                    // Initialize map centered on device
                    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                        center: currentLocation,
                        zoom: 13,
                        minZoom: 10,
                        maxZoom: 15,
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    });

                    // Add marker for current location
                    new window.google.maps.Marker({
                        position: currentLocation,
                        map: mapInstanceRef.current,
                        title: "Your Location",
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: "#4c099f",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#4c099f",
                        },
                    });

                    // Now show all other markers
                    showMarkers(currentLocation);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Unable to access your device location.");
                    // fallback: initialize map at default coordinates if needed
                    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                        center: { lat: 0, lng: 0 },
                        zoom: 2,
                    });
                    showMarkers(); // still show other markers
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: 0, lng: 0 },
                zoom: 2,
            });
            showMarkers();
        }
    }

    function showMarkers(currentLocation = null) {
        if (!mapInstanceRef.current) return;
        const bounds = new window.google.maps.LatLngBounds();

        // Include current location in bounds if provided
        if (currentLocation) bounds.extend(currentLocation);

        locations.forEach((loc) => {
            if (loc.lat && loc.lon) {
                const position = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) };
                const marker = new window.google.maps.Marker({
                    position,
                    map: mapInstanceRef.current,
                    title: loc.location_name,
                });

                marker.addListener("click", () => {
                    infoWindowRef.current.setContent(`<div><strong>${loc.location_name}</strong></div>`);
                    infoWindowRef.current.open(mapInstanceRef.current, marker);
                });

                bounds.extend(position);
            }
        });

        // Fit bounds so all markers including current location are visible
        mapInstanceRef.current.fitBounds(bounds);
    }


    return (
        <>
            <Card mb={5}>
                <CardBody>
                    <Breadcrumb fontSize={{ base: "sm", md: "md" }}>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={ReactRouterLink} to={DRIVER_DASHBOARD_PATH}>
                                {t("dashboard")}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink>{t("list")}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </CardBody>
            </Card>

            <Box>
                <Card shadow="md" borderRadius="2xl">
                    <CardHeader>
                        <Flex mb={4} justifyContent="space-between">
                            <Heading size="md">Location Overview</Heading>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Box ref={mapRef} height="500px" width="100%" borderRadius="md" />
                    </CardBody>
                </Card>
            </Box>
        </>
    );
};

export default LocationOverview;
