using System.Data.Entity;

namespace Localit.Server.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() : base( "name=Localit" ) { }

        public DbSet<Post> Posts { get; set; }
        public DbSet<User> Users { get; set; }
    }
}