using System.Data.Entity;

namespace Localit.Server.Models
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext() : base( "Localit" ) { }

        public DbSet<Post> Posts { get; set; }
    }
}