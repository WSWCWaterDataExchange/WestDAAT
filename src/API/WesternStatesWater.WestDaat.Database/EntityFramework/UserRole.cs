namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class UserRole
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Role { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
