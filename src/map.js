import React, {useEffect, useRef, useState} from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';

const Map = ({ className, children }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(5.478290134294374);
    const [lat, setLat] = useState(51.44058200249487);
    const [zoom, setZoom] = useState(12.8);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/rensb/cl1kft7vy000f15mca3yz8f0l',
            center: [lng, lat],
            zoom: zoom
        });
    });

    return (
        <div ref={mapContainer} className={className} />
    );
};

export default Map;