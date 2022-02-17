using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class SchemaVersion
    {
        public int Id { get; set; }
        public string ScriptName { get; set; }
        public DateTime Applied { get; set; }
    }
}
