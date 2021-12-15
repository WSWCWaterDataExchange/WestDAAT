using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapboxPrototypeAPI.Models
{
    [JsonObject(MemberSerialization.OptOut)]
    public class WaterAllocation
    {
        [JsonProperty("type")]
        public string Type;

        [JsonProperty("geometry")]
        public WaterAllocationGeometry Geometry;

        [JsonProperty("properties")]
        public WaterAllocationProperties Properties;
    }
    
    [JsonObject(MemberSerialization.OptOut)]
    public class WaterAllocationGeometry
    {
        [JsonProperty("type")]
        public string Type;

        [JsonProperty("coordinates")]
        public double[] Coordinates;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class WaterAllocationProperties
    {
        [JsonProperty("allocationId")]
        public long AllocationId;
        
        [JsonProperty("allocationFlowCfs")]
        public double AllocationFlowCfs;
        
        [JsonProperty("allocationVolumeAf")]
        public double AllocationVolumeAf;

        [JsonProperty("siteUuid")]
        public string SiteUuid;

        [JsonProperty("siteName")]
        public string SiteName;

        [JsonProperty("waterSourceType")]
        public string WaterSourceType;

        [JsonProperty("beneficialUseCV")]
        public string BeneficialUseCV;

        [JsonProperty("allocationOwner")]
        public string AllocationOwner;
        
        [JsonProperty("ownerClassification")]
        public string OwnerClassification;

        [JsonProperty("priorityDate")]
        public long PriorityDate;

        [JsonProperty("stateCv")]
        public string StateCv;
    }
}
