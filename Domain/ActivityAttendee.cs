namespace Domain
{
    public class ActivityAttendee
    {
        // This first two key is for foreign key relationship
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public Guid ActivityId { get; set; }
        public Activity Activity { get; set; }
        public bool  IsHost { get; set; }
    }
}