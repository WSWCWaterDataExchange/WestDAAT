namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class User
{
    public Guid Id { get; set; }

    public string Email { get; set; }

    public string ExternalAuthId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
}
