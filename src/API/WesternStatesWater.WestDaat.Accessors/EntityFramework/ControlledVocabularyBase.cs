namespace WesternStatesWater.WestDaat.Accessors.EntityFramework;

public abstract class ControlledVocabularyBase
{
    public string Name { get; set; }
    public string Term { get; set; }
    public string Definition { get; set; }
    public string State { get; set; }
    public string SourceVocabularyUri { get; set; }
    public string WaDEName { get; set; }
}