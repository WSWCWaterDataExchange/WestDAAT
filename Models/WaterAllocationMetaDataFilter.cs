using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace MapboxPrototypeAPI.Models
{
    public class WaterAllocationMetaDataFilter
    {
        public List<string> BeneficialUses { get; set; }

        public List<string> WaterSourceType { get; set; }
        
        public List<string> BasinNames { get; set; }

        public List<string> AllocationOwnerClassification { get; set; }

        public List<string> States { get; set; }

        public string AllocationOwner { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
