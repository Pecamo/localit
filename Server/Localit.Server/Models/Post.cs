
using System;
using System.ComponentModel.DataAnnotations.Schema;
namespace Localit.Server.Models
{
    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public Location Location { get; set; }
        public int Score { get; set; }
        public User Creator { get; set; }
        public DateTime CreationDate { get; set; }

        [NotMapped]
        public bool HasUserVoted { get; set; }
    }
}