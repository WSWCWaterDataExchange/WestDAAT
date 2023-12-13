import React, { useEffect, useContext } from "react";
import "./time.scss";
import { ApiData } from "./ApiInterface";
import { SiteUUIDContext } from "./Context/SiteUUIDContext";

interface APISearchProps {
  onApiDataFetched?: (data: ApiData[] | null) => void;
}

function APISearch({ onApiDataFetched }: APISearchProps) {
  const contextValue = useContext(SiteUUIDContext);
  const { storedSiteUUID = "" } = contextValue || {};

  useEffect(() => {
    fetchData();
  }, [storedSiteUUID]);

  const fetchData = async () => {
    if (storedSiteUUID) {
      try {
        const response = await fetch(
          `/v1/SiteVariableAmounts?SiteUUID=${storedSiteUUID}&key=38f422d1ada34907a91aff4532fa4669`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        onApiDataFetched?.(data);

        if (Object(data).TotalSiteVariableAmountsCount !== 0) {
        } else {
        }
      } catch (error) {
        onApiDataFetched?.(null);
      }
    } else {
      onApiDataFetched?.(null);
    }
  };

  return (
    <>
    </>
  );
}

export default APISearch;
