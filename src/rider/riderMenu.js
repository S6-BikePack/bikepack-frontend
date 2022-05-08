import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {auth, logout} from "../firebase";
import {useRecoilState, useRecoilValue} from "recoil";
import {riderState, userState} from "../states";
import {HiLogout, HiSwitchHorizontal} from "react-icons/hi";
import {useNavigate} from "react-router-dom";
import Map, {Marker, Source, Layer} from 'react-map-gl';
import axios from "axios";
import {useAuthState} from "react-firebase-hooks/auth";
import {useGeolocation, useUnmount} from "react-use";
import ParcelListItem from "../customer/parcelListItem";
import CreateParcel from "../customer/createParcel";
import Parcel from "../customer/parcel";
import CreateDelivery from "../customer/createDelivery";
import {CubeGrid} from "styled-loaders-react";
import Delivery from "./delivery";
import DeliveryListItem from "./deliveryListItem";
import * as turf from "@turf/turf";
import {eindhoven} from "../eindhoven";

const Content = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`

const Title = styled.h1`
  margin: 20px auto 10px 20px;
`

const SeparatorLine = styled.div`
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 0;
  height: 2px;
  background: #878787;
`

const Horizontal = styled.div`
  display: flex;
`

const IconButton = styled.button`
  height: ${props => props.size ? props.size : '200px'};
  width: ${props => props.size ? props.size : '200px'};
  margin-top: auto;
  margin-bottom: 0;
  font-size: 2rem;
  border: none;
  background: none;

  svg {
    text-align: center;
    display: table-cell;
    vertical-align: middle;
  }

  transition: 200ms;

  :hover {
    opacity: .5;
  }
`

const MenuButton = styled.button`
  background: ${props => props.color || '#53B94A'};
  padding: 10px;
  margin: 20px;
  font-size: 1.8rem;
  width: calc(100% - 40px);
  font-family: 'Roboto Slab', sans-serif;
  color: white;
  border: none;
  transition: 100ms;

  &:hover {
    opacity: .9;
  }
`

const SubTitle = styled.h2`
  margin: 10px 0 5px 30px;
`

const InactiveBox = styled.div`
  background: #fafafa;
  margin: 20px;
  width: calc(100% - 40px);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const MenuText = styled.p`
  font-size: 1.4rem;
  text-align: center;
  margin-left: 50px;
  margin-right: 50px;
`

const Rider = styled.div`
  width: 25vw;
  min-width: 25vw;
  background: white;
  display: flex;
  flex-direction: column;
`

const OverviewMap = styled(Map)`
  width: 75vw;
  height: 100vh;
`

const Loader = styled.div`
  margin: auto;
`

const Box = styled.div`
  background: #e8e8e8;
  margin: 20px;
  width: calc(100% - 40px);
  height: 80%;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const RiderMenu = ({className, children}) => {
    const [, forceRender] = useState({});
    const user = useRecoilValue(userState);
    const [menu, setMenu] = useState(0)
    const [rider, setRider] = useRecoilState(riderState);
    const [authUser] = useAuthState(auth);
    const [availableDeliveries, setAvailableDeliveries] = useState([])
    const [selectedDelivery, setSelectedDelivery] = useState(null)
    const navigate = useNavigate()
    const [packageCircle, setPackageCircle] = useState(null)
    const mapRef = useRef();
    const [mask, setMask] = useState(null)

    const [markers, setMarkers] = useState([])

    useUnmount(() => becomeInactive());

    useEffect(() => {
        if (rider.Status === 2) {
            if (menu < 2) {
                setMenu(2)
            }

            authUser.getIdToken(false).then(token => {
                axios.get(`http://localhost/api/deliveries/around/${rider.UserID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        service_area: "ehv"
                    }
                }).then(response => {
                    console.log(response)
                        setAvailableDeliveries(response.data.deliveries)
                        setPackageCircle(turf.lineString(...turf.circle([rider.Location.Longitude, rider.Location.Latitude], response.data.radius, {
                            steps: 50,
                            units: "meters"
                        }).geometry.coordinates))
                    }
                ).catch(error => {
                    console.log(error)
                })
            })
        } else {
            becomeInactive()
        }
    }, [rider]);

    useEffect(() => {
        setDeliveryMarkers()
    }, [availableDeliveries]);

    useEffect(() => {
        axios.get(`http://localhost/api/service-areas/` + rider.ServiceArea.ID)
            .then(response => {
                    var mask = turf.polygon(response.data.area.coordinates)
                    var center = turf.centroid(mask)
                    var bboxPoly = turf.bboxPolygon(bounds);
                    setMask(turf.difference(bboxPoly, mask));
                }
            ).catch(error => {
            console.log(error)
        })
    }, [])

    const setDeliveryMarkers = () => {
        const deliveryMarkers = [];

        availableDeliveries.forEach(x => {
            const radius = turf.circle([x.pickup.coordinates.longitude, x.pickup.coordinates.latitude], 200, {
                steps: 50,
                units: "meters"
            });
            deliveryMarkers.push({
                latitude: x.pickup.coordinates.latitude,
                longitude: x.pickup.coordinates.longitude,
                image: "box_marker.svg",
                name: x.id,
                radius: radius
            })
        })

        setMarkers(deliveryMarkers)
    }

    const becomeActive = () => {
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
        } else {
            setMenu(1)
            navigator.geolocation.getCurrentPosition(success, error, {maximumAge: 10000});
        }
    }

    var bounds = [1.9772748625581997, 50.19657612319983, 9.032615983538662, 53.82405232118753];

    const becomeInactive = () => {
        setAvailableDeliveries([])
        setMenu(0)
        clearMarkers()

        if (rider.Status !== 1) {
            authUser.getIdToken(false).then(token => {
                axios.put(`http://localhost/api/riders/${rider.UserID}`, {Status: 1}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        service_area: "ehv"
                    }
                }).then(response => {

                        setRider(response.data)
                    }
                ).catch(error => {
                    console.log(error)
                })
            })
        }
    }

    const clearMarkers = () => {
        setMarkers([])
        forceRender({})
    }

    const setMarker = (lat, lng, img, name) => {
        const exists = markers.find(x => x.name === name);

        if (exists) {
            const m = markers;
            m[markers.indexOf(exists)] = {latitude: lat, longitude: lng, image: img, name: name}
            setMarkers(m)
            forceRender({})
        } else {
            setMarkers([...markers, {latitude: lat, longitude: lng, image: img, name: name}])
        }
    }

    const success = (position) => {

        // const latitude = 51.43842498105066;
        // const longitude = 5.47487112068152
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        updateRiderPosition(latitude, longitude)

        mapRef.current?.flyTo({center: [longitude, latitude], duration: 5000, zoom: 14});

        authUser.getIdToken(false).then(token => {
            axios.put(`http://localhost/api/riders/${rider.UserID}`, {Status: 2}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    service_area: "ehv"
                }
            }).then(response => {
                    setRider(response.data)
                }
            ).catch(error => {
                console.log(error)
            })
        })
    }

    const error = () => {
        console.log('Unable to retrieve your location');
    }

    const updateRiderPosition = (lat, lng) => {
        authUser.getIdToken(false).then(token => {
            axios.put(`http://localhost/api/riders/${rider.UserID}/location`, {latitude: lat, longitude: lng}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    service_area: "ehv"
                }
            }).then(response => {
                    setRider(response.data)
                }
            ).catch(error => {
                console.log(error)
            })
        })
    }

    const RenderMenu = (menu) => {
        switch (menu) {
            default:
                return (
                    <>
                        <InactiveBox>
                            <MenuText>You are currently inactive. Press the button below to become active again and see
                                possible
                                deliveries.</MenuText>
                            <MenuButton onClick={becomeActive}>Start</MenuButton>
                        </InactiveBox>
                    </>
                )
            case 1:
                return (
                    <Loader><CubeGrid color="#53B94A" size="100px" duration="1s"/></Loader>
                )
            case 2:
                return (
                    <>
                        <SubTitle>Available deliveries</SubTitle>
                        <SeparatorLine/>
                        <Box>
                            {availableDeliveries
                                .map(x => {
                                    return {
                                        ...x,
                                        distance: turf.distance([rider.Location.Longitude, rider.Location.Latitude], [x.pickup.coordinates.longitude, x.pickup.coordinates.latitude], {units: "meters"})
                                    }
                                })
                                .sort((a, b) => a.distance - b.distance)
                                .map(x => <DeliveryListItem onClick={() => {
                                    setSelectedDelivery(x)
                                    setMenu(3)
                                }} delivery={x} distance={x.distance}/>)}
                        </Box>
                    </>
                )
            case 3:
                return <Delivery
                    setMarkers={setMarkers}
                    onBack={() => {
                        setMenu(2)
                        setDeliveryMarkers()
                    }}
                    delivery={selectedDelivery}
                />
        }
    }

    return (
        <Content>
            <Rider>
                <Horizontal>
                    <Title>{user.Name && user.Name + "'s"} delivery center</Title>
                    <IconButton size='50px' onClick={() => navigate("/select-type")}>
                        <HiSwitchHorizontal/>
                    </IconButton>
                    <IconButton size='50px' onClick={() => logout()}>
                        <HiLogout/>
                    </IconButton>
                </Horizontal>
                <SeparatorLine/>
                {RenderMenu(menu)}
            </Rider>
            <OverviewMap
                maxBounds={bounds}
                ref={mapRef}
                initialViewState={{
                    longitude: rider.Location.Longitude,
                    latitude: rider.Location.Latitude,
                    zoom: 12.8
                }}
                mapStyle="mapbox://styles/rensb/cl1kft7vy000f15mca3yz8f0l"
                mapboxAccessToken='pk.eyJ1IjoicmVuc2IiLCJhIjoiY2s2a2xpNmg0MDU2dzNscnI5cjRnaG1uciJ9.GKmyEyKDRJCTuLe2elJ0Pw'
            >
                {
                    mask &&
                    <Source id="city_mask" type="geojson" data={mask}>
                        <Layer
                            id="city_mask_layer"
                            type="fill"
                            paint={{
                                "fill-color": "black",
                                'fill-opacity': 0.2
                            }}
                        />
                    </Source>
                }

                <Marker draggable onDragEnd={(e) => updateRiderPosition(e.lngLat.lat, e.lngLat.lng)}
                        longitude={rider.Location.Longitude} latitude={rider.Location.Latitude}>
                    <svg width="40" height="40">
                        <image href={rider.Status === 2 ? "rider_marker.svg" : "rider_inactive_marker.svg"} width="40"
                               height="40"/>
                    </svg>
                </Marker>
                {
                    packageCircle &&
                    <>
                        <Source id="rider_circle" type="geojson" data={packageCircle}>
                            <Layer
                                id="rider_circle_layer"
                                type="line"
                                paint={{
                                    "line-color": "#008802",
                                    "line-width": 2
                                }}
                            />
                        </Source>
                    </>
                }
                {markers && markers.map((x, index) =>
                    <>
                        <Marker longitude={x.longitude} latitude={x.latitude}>
                            <svg width="30" height="30">
                                <image href={x.image} width="30" height="30"/>
                            </svg>
                        </Marker>
                        {x.radius &&
                            <Source id={index.toString()} type="geojson" data={x.radius}>
                                <Layer
                                    id={index + "_layer"}
                                    type="fill"
                                    paint={{
                                        "fill-color": "#008802",
                                        "fill-opacity": 0.2
                                    }}
                                />
                            </Source>
                        }
                    </>)}
            </OverviewMap>
        </Content>
    );
};

export default RiderMenu;