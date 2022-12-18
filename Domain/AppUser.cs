using Microsoft.AspNetCore.Identity;



namespace Domain
{
    //
    // Summary: This Identity User Class use to authenticate app
    // 
    // Value: Whole Authentication System
    // 

    public class AppUser: IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<ActivityAttendee> Activities { get; set; }

    }
}