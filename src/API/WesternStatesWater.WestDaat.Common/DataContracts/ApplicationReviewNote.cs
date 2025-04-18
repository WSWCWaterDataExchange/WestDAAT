﻿namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationReviewNote
{
    public Guid Id { get; set; }

    public DateTimeOffset SubmittedDate { get; set; }

    public Guid SubmittedByUserId { get; set; }

    public string SubmittedByFullName { get; set; } = null!;

    public string Note { get; set; } = null!;
}
