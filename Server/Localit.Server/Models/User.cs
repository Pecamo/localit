
using Newtonsoft.Json;

namespace Localit.Server.Models
{
    public class User
    {
        [JsonIgnore]
        public int UserId { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
        public string ProfileLink { get; set; }
        public long FacebookId { get; set; }
    }
}