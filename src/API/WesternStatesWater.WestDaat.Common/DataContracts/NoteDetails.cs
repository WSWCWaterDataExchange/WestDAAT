namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class NoteDetails
{
    public Guid Id { get; set; }

    public string SubmittedByFullName { get; set; } = null!;

    public string Text { get; set; } = null!;
}
