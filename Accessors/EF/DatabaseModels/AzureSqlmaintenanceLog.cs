using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class AzureSqlmaintenanceLog
    {
        public long Id { get; set; }
        public DateTime? OperationTime { get; set; }
        public string Command { get; set; }
        public string ExtraInfo { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string StatusMessage { get; set; }
    }
}
