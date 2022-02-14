using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class ImportError
    {
        public long Id { get; set; }
        public string Type { get; set; }
        public string RunId { get; set; }
        public string Data { get; set; }
    }
}
