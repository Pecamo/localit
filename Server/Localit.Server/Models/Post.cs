
namespace Localit.Server.Models
{
    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public Location Location { get; set; }
        public int Score { get; set; }
        public User Creator { get; set; }
    }
}