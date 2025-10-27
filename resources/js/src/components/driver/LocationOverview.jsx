import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
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

const LocationOverview = () => {
    const { t } = useTranslation();
    const [locations, setLocations] = useState([]);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const infoWindowRef = useRef(null);

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
        const map_api_key = localStorage.getItem("map_api_key");
        if (!window.google) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${map_api_key}&libraries=places`;
            script.async = true;
            document.body.appendChild(script);
            script.onload = initMap;
            return () => document.body.removeChild(script);
        } else {
            initMap();
        }
    }, []);

    useEffect(() => {
        const locationArray = locations;
        if (window.google && locationArray.length > 0) {
            showMarkers();
        }
    }, [locations]);

    function initMap() {
        const coords = localStorage.getItem("lat_long");

        if (coords) {
            const [latStr, lonStr] = coords.split(",");
            const lat = parseFloat(latStr);
            const lon = parseFloat(lonStr);

            mapInstanceRef.current = new window.google.maps.Map(
                mapRef.current,
                {
                    center: { lat, lng: lon },
                    zoom: 13,
                }
            );
        }

        infoWindowRef.current = new window.google.maps.InfoWindow();
    }

    function showMarkers() {
        if (!mapInstanceRef.current) return;
        const bounds = new window.google.maps.LatLngBounds();
        console.log(locations);
        locations.forEach((loc) => {
            if (loc.lat && loc.lon) {
                const position = {
                    lat: parseFloat(loc.lat),
                    lng: parseFloat(loc.lon),
                };

                const marker = new window.google.maps.Marker({
                    position,
                    map: mapInstanceRef.current,
                    title: loc.location_name,
                });

                marker.addListener("click", () => {
                    infoWindowRef.current.setContent(
                        `<div><strong>${loc.location_name}</strong></div>`
                    );
                    infoWindowRef.current.open(mapInstanceRef.current, marker);
                });

                bounds.extend(position);
            }
        });

        // ✅ Automatically fit map to show all markers
        mapInstanceRef.current.fitBounds(bounds);
    }

    return (
        <>
            <Card mb={5}>
                <CardBody>
                    <Breadcrumb fontSize={{ base: "sm", md: "md" }}>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                as={ReactRouterLink}
                                to={DRIVER_DASHBOARD_PATH}
                            >
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
                        <Box
                            ref={mapRef}
                            height="500px"
                            width="100%"
                            borderRadius="md"
                        />
                    </CardBody>
                </Card>
            </Box>
        </>
    );
};

export default LocationOverview;
