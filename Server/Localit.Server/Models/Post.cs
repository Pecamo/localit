using System.Collections.Generic;

namespace Localit.Server.Models
{
    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public Location Location { get; set; }
        public ApplicationUser Creator { get; set; }
        public ICollection<ApplicationUser> InterestedUsers { get; set; }
    }
}