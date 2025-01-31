namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class UserProfile
{
    public Guid Id { get; set; }
    
    required public Guid UserId { get; set; }
    
    public string FirstName { get; set; } = null!;
    
    public string LastName { get; set; } = null!;
    
    public virtual User User { get; set; } = null!;
}