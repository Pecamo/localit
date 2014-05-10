using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Localit.Server.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync( UserManager<ApplicationUser> manager, string authenticationType )
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync( this, authenticationType );
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class UsersContext : IdentityDbContext<ApplicationUser>
    {
        public UsersContext()
            : base( "Localit" )
        {
        }


        protected override void OnModelCreating( DbModelBuilder modelBuilder )
        {
            modelBuilder.Entity<IdentityRole>().HasKey<string>( r => r.Id ).Property( p => p.Name ).IsRequired();
            modelBuilder.Entity<IdentityUserRole>().HasKey( r => new { r.RoleId, r.UserId } );
            modelBuilder.Entity<IdentityUserLogin>().HasKey( u => new { u.UserId, u.LoginProvider, u.ProviderKey } );

            base.OnModelCreating( modelBuilder );
        }

        public static UsersContext Create()
        {
            return new UsersContext();
        }
    }
}