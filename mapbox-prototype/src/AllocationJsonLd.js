import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';

import './AllocationJsonLd.css';

mapboxgl.accessToken =
    'pk.eyJ1IjoiYW1hYmRhbGxhaCIsImEiOiJjazJnbno5ZHIwazVqM21xZzMwaWpsc2hqIn0.j6BmkJdp5O_9ITGm4Gwe0w';

function AllocationJsonLd() {
    const location = useLocation();

    const [allocationData, setAllocationData] = React.useState(null);
    const [allocationJson, setAllocationJson] = React.useState(null);

    useEffect(() => {
        fetchAllocationData(location.pathname.split('/')[2]);
    }, []);

    useEffect(() => {
        if (allocationData) {
            let data = allocationData;

            let jsonLd = {
                "@context": [
                    {
                        "schema": "https://schema.org/",
                        "geojson": "https://purl.org/geojson/vocab#",
                        "Feature": "geojson:Feature",
                        "FeatureCollection": "geojson:FeatureCollection",
                        "Point": "geojson:Point",
                        "bbox": {
                            "@container": "@list",
                            "@id": "geojson:bbox"
                        },
                        "coordinates": {
                            "@container": "@list",
                            "@id": "geojson:coordinates"
                        },
                        "features": {
                            "@container": "@set",
                            "@id": "geojson:features"
                        },
                        "geometry": "geojson:geometry",
                        "id": "@id",
                        "properties": "geojson:properties",
                        "type": "@type"
                    },
                    {
                        "schema": "https://schema.org/",
                        "id": "schema:name",
                        "LINK": "schema:url"
                    },
                    {
                        "uri": "@id"
                    }
                ],
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        data.longitude,
                        data.latitude
                    ]
                },
                "properties": {
                    "fid": 101913,
                    "StateID": data.allocationBridgeSitesFacts[0].allocationAmount.organization.state,
                    "DataSourceOrganizationID": data.allocationBridgeSitesFacts[0].allocationAmount.organization.organizationUuid,
                    "id": "https://geoconnex.us/wade/sites/" + data.siteUuid,
                    "uri": "https://geoconnex.us/wade/sites/" + data.siteUuid,
                    "LINK": "https://wade-api-qa.azure-api.net/v1/SiteAllocationAmounts?SiteUUID=" + data.siteUuid
                },
                "id": "https://geoconnex.us/wade/sites/" + data.siteUuid
            };

            setAllocationJson(JSON.stringify(jsonLd));
        }
    }, [allocationData]);

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
                setAllocationData(JSON.parse(result));
            })
            .catch(error => console.log('error', error));
    }

    return (
        <>
            {allocationJson &&
                <div>
                    {allocationJson}
                </div>}
        </>
    );
}

export default AllocationJsonLd;
