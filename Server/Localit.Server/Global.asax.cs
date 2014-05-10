using System;
using System.Data.Entity;
using System.Web.Http;
using System.Web.Mvc;
using Localit.Server.Models;

namespace Localit.Server
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Database.SetInitializer( new DropAndSeedData() );

            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure( WebApiConfig.Register );
            FilterConfig.RegisterGlobalFilters( GlobalFilters.Filters );

        }

        private sealed class DropAndSeedData : DropCreateDatabaseAlways<ApplicationDbContext>
        {
            protected override void Seed( ApplicationDbContext context )
            {
                var random = new Random();
                for ( int n = 0; n < 1000; n++ )
                {
                    context.Posts.Add( new Post
                    {
                        PostId = n,
                        Title = "Random #" + n,
                        Score = n,
                        Location = new Location { DisplayName = "Location #" + n, Latitude = random.NextDouble() * 180 - 90, Longitude = random.NextDouble() * 360 - 180 }
                    } );
                }

                context.Posts.Add( new Post
                {
                    PostId = 1,
                    Title = "Another test",
                    Score = 10000,
                    Location = new Location { DisplayName = "Somewhere over the rainbow", Latitude = 80, Longitude = 20 }
                } );

                context.Posts.Add( new Post
                {
                    PostId = 2,
                    Title = "Come help Santa!",
                    Score = 99,
                    Location = new Location { DisplayName = "North Pole", Latitude = 90, Longitude = 0 }
                } );
            }
        }
    }
}