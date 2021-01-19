using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapboxPrototypeAPI.Models
{
    public class AllocationSearchResult
    {
        [JsonProperty("allocationId")]
        public long AllocationId;
        
        [JsonProperty("allocationExpiration")]
        public string AllocationExpiration;

        [JsonProperty("organizationName")]
        public string OrganizationName;

        [JsonProperty("organizationPurview")]
        public string OrganizationPurview;

        [JsonProperty("organizationWebsite")]
        public string OrganizationWebsite;

        [JsonProperty("organizationPhoneNumber")]
        public string OrganizationPhoneNumber;

        [JsonProperty("organizationContactName")]
        public string OrganizationContactName;

        [JsonProperty("organizationContactEmail")]
        public string OrganizationContactEmail;

        [JsonProperty("organizationState")]
        public string OrganizationState;

        [JsonProperty("waterSourceName")]
        public string WaterSourceName;

        [JsonProperty("waterSourceUUID")]
        public string WaterSourceUUID;

        [JsonProperty("waterSourceType")]
        public string WaterSourceType;

        [JsonProperty("variableType")]
        public string VariableType;

        [JsonProperty("variableAmountUnit")]
        public string VariableAmountUnit;

        [JsonProperty("variableAggregationInterval")]
        public string VariableAggregationInterval;

        [JsonProperty("variableAggregationIntervalUnit")]
        public string VariableAggregationIntervalUnit;

        [JsonProperty("allocationOwner")]
        public string AllocationOwner;

        [JsonProperty("beneficialUseCV")]
        public string BeneficialUseCV;
    }
}
