using System.Data.Entity;

namespace Localit.Server.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() : base( "name=Localit" ) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
    }
}