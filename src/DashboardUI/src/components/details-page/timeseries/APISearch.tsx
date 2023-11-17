import { useState, useEffect, useRef } from "react";
import "./time.scss";
import { ApiData } from "./ApiInterface";

interface APISearchProps {
  onApiDataFetched?: (data: ApiData[] | null) => void;
  siteUUID?: string;
}

function APISearch({ onApiDataFetched }: APISearchProps) {
  const [siteUUID, setSiteUUID] = useState("");
  const [error, setError] = useState(""); // State for error message
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        fetchData();
      }
    };
    if (inputRef.current){
      inputRef.current.focus();
    }

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [siteUUID]);

  const fetchData = async() => {
    if (siteUUID) {
      fetch(
        `/v1/SiteVariableAmounts?SiteUUID=${siteUUID}&key=38f422d1ada34907a91aff4532fa4669`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          onApiDataFetched?.(data);
          if(Object(data).TotalSiteVariableAmountsCount !== 0){
            setError(""); 
          }
          else{
            setError("     Invalid input, Please Re-Enter."); 
          }
        })
        .catch((error) => {
          onApiDataFetched?.(null);
        });
    } else {
      onApiDataFetched?.(null);
    }
  };

  return (
    <>
      <div className="sqp-input">
        <header>SQP Input</header>
        <input
          ref = {inputRef}
          value={siteUUID}
          onChange={(e) => setSiteUUID(e.target.value)}
          placeholder="Enter Site UUID"
        />
        {error && <div className="error-message">{error}</div>} {/* Render error message */}
      </div>
    </>
  );
}

export default APISearch;