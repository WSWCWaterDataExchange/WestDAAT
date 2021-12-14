import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';

import './AllocationDetails.css';

mapboxgl.accessToken =
    'pk.eyJ1IjoiYW1hYmRhbGxhaCIsImEiOiJjazJnbno5ZHIwazVqM21xZzMwaWpsc2hqIn0.j6BmkJdp5O_9ITGm4Gwe0w';

function AllocationDetails() {
    const location = useLocation();

    const [allocationData, setAllocationData] = React.useState(null);

    useEffect(() => {
        fetchAllocationData(location.pathname.split('/').pop());
    }, []);

    useEffect(() => {
        if (allocationData) {
            let map = new mapboxgl.Map({
                container: 'allocationSiteMap',
                style: 'mapbox://styles/mapbox/dark-v10',
                center: [allocationData.longitude, allocationData.latitude],
                zoom: 5
            });

            // Load Data
            loadData(map);

            return () => map.remove();
        }
    }, [allocationData]);

    function loadData(map) {
        map.on('load', function () {
            map.resize();
            map.addSource('allocationSite', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [
                                    allocationData.longitude,
                                    allocationData.latitude
                                ]
                            }
                        },
                    ]
                }
            });

            map.addLayer({
                'id': 'site',
                'type': 'circle',
                'source': 'allocationSite',
                'paint': {
                    'circle-radius': 6,
                    'circle-color': '#B42222'
                },
            });
        });
    }

    function openJsonLd(id) {
        console.log(id);
        const win = window.open("/details/" + id + "/json-ld", "_blank");
        win.focus();
    }

    function fetchAllocationData(allocationArr) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-functions-key", "gbPgxR/Femue08YsLtEnmpAukABhpT26AxBPO6wavTkczFFoYJgdSA==");

        var raw = JSON.stringify(allocationArr);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        // fetch("http://localhost:7071/api/GetWaterAllocationSiteDetails", requestOptions)
        fetch("https://mapboxprototypeapi.azurewebsites.net/api/GetWaterAllocationSiteDetails", requestOptions)
            .then(response => response.text())
            .then(result => {
                let resultObj = JSON.parse(result);

                console.log(resultObj);
                if (resultObj.allocationBridgeSitesFacts.length === 0) {
                    resultObj.allocationBridgeSitesFacts.push({
                        allocationAmount: {
                            allocationVolumeAf: 0,
                            allocationFlowCfs: 0,
                            organization: {
                                organizationName: "",
                                organizationWebsite: "",
                                organizationContactName: "",
                                organizationPhoneNumber: "",
                                organizationContactEmail: ""
                            },
                            allocationBridgeBeneficialUsesFacts: [{
                                beneficialUseCvNavigation: {
                                    waDename: "",
                                }
                            }]
                        }
                    });
                }

                setAllocationData(resultObj);
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div className="">
            <div className="jumbotron jumbotron-fluid p-4">
                <h2 className="text-center">The Western States Water Data Access and Analysis Tool (WestDAAT) Prototype</h2>
                <br />
                <p className="lead">Water Data Exchange (WaDE) Program, Western States Water Council</p>
                <p className="lead"><b>Contact: </b>Adel Abdallah, Program Manager, <a href="mailto:adelabdallah@wswc.utah.gov">adelabdallah@wswc.utah.gov</a></p>
                <p className="lead danger"><b>DISCLAIMER:</b> This application is under construction, not for public use, and has not yet been fully approved by our member states. Individual states have unique water rights administration systems. Please check metadata before making any comparisons. The purpose of WaDE is to support regional water data and availability analysis. This data is not meant for localized decisions. Before drawing any conclusions or making comparisons, please consult the state's water rights agency and their used methods. Please also consult with the WaDE team before using this tool. We look forward to hearing your feedback.</p>
            </div>
            <div className="row min-vh-25 center-map table-container">
                <div className='detail-map' id="allocationSiteMap" style={{}} />
            </div>
            <div className="row min-vh-25 table-container">
                {
                    allocationData &&
                    <div className="container">
                        <div className="row">
                            <div class="col-md-12 d-flex mt-3">
                                <h2><b>WaDE Site ID:</b> {allocationData.siteUuid}</h2>
                                <button type="button" class="btn btn-primary ml-auto" onClick={() => openJsonLd(allocationData.siteUuid)}>JSON-LD</button>
                            </div>
                        </div>

                        <div className="row mt-3 mb-3">
                            {/* Site Info */}
                            <div className="col col-3">
                                <h4>Site Information</h4>
                                <div>UUID : {allocationData.siteUuid}</div>
                                <div>EPSG Code : {allocationData.epsgcodeCv}</div>
                                <div>Name : {allocationData.siteName}</div>
                                <div>POD or POU : {allocationData.podorPousite}</div>
                            </div>
                            {/* Organization Info */}
                            <div className="col col-3">
                                <h4>Managing Organization</h4>
                                <div>Name : {allocationData.allocationBridgeSitesFacts[0].allocationAmount.organization.organizationName}</div>
                                <div>Website : <a href={allocationData.allocationBridgeSitesFacts[0].allocationAmount.organization.organizationWebsite} target="_blank">{allocationData.allocationBridgeSitesFacts[0].allocationAmount.organization.organizationWebsite}</a></div>
                                <div>Contact Name : {allocationData.allocationBridgeSitesFacts[0].allocationAmount.organization.organizationContactName}</div>
                                <div>Contact Phone : {allocationData.allocationBridgeSitesFacts[0].allocationAmount.organization.organizationPhoneNumber}</div>
                                <div>Contact Email : {allocationData.allocationBridgeSitesFacts[0].allocationAmount.organization.organizationContactEmail}</div>
                            </div>
                            {/* Water Source Info */}
                            <div className="col col-3">
                                <h4>Water Source Info</h4>
                                <div>Water Source ID : {allocationData.waterSource.waterSourceUuid}</div>
                                <div>Water Source Name : {allocationData.waterSource.waterSourceName}</div>
                                <div>Water Source Type : {allocationData.waterSource.waterSourceTypeCv}</div>
                            </div>
                            {/* Allocation Info */}
                            <div className="col col-3">
                                <h4>Allocation Info</h4>
                                <div>Flow (CFS) : {allocationData.allocationBridgeSitesFacts[0].allocationAmount.allocationFlowCfs ?? "Unavailable"}</div>
                                <div>Volume (AF) : {allocationData.allocationBridgeSitesFacts[0].allocationAmount.allocationVolumeAf ?? "Unavailable"}</div>
                            </div>
                        </div>
                        {/* Allocation Info */}
                        <div className="row">
                            <h4>Allocation Information</h4>
                            <table className="table table-striped table-dark">
                                <thead>
                                    <tr>
                                        <th scope="col">WaDE ID</th>
                                        <th scope="col">Native ID</th>
                                        <th scope="col">Allocation Owner</th>
                                        <th scope="col">Beneficial Use</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allocationData.allocationBridgeSitesFacts.map((allocation) => (
                                        <>
                                            <tr key={allocation.allocationAmount.allocationAmountId}>
                                                <td>{allocation.allocationAmount.allocationAmountId}</td>
                                                <td>{allocation.allocationAmount.allocationNativeId}</td>
                                                <td>{allocation.allocationAmount.allocationOwner}</td>
                                                <td>{allocation.allocationAmount.allocationBridgeBeneficialUsesFacts[0].beneficialUseCvNavigation.waDename}</td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        </div >
    );
}

export default AllocationDetails;
