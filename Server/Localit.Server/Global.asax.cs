using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using Localit.Server.Models;

namespace Localit.Server
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Database.SetInitializer( new DropAndSeedData() );
            GlobalConfiguration.Configure( WebApiConfig.Register );
        }

        private sealed class DropAndSeedData : DropCreateDatabaseAlways<ApplicationDbContext>
        {
            protected override void Seed( ApplicationDbContext context )
            {
                var user = context.Users.Add( new User { FacebookId = 0, Name = "Santa", PictureUrl = @"http://theory.epfl.ch/osven/Ola%20Svensson_files/Ola.jpg", ProfileLink = "http://people.epfl.ch/ola.svensson" } );

                var random = new Random();
                for ( int n = 0; n < 1000; n++ )
                {
                    var post = context.Posts.Add( new Post
                    {
                        PostId = n,
                        Title = "Random #" + n,
                        Content = string.Join( " ", Enumerable.Repeat( "Lorem ipsum dolor sit amet.", n / 10 + 1 ) ),
                        Score = n / 2,
                        Location = new Location { DisplayName = "Location #" + n, Latitude = random.NextDouble() * 180 - 90, Longitude = random.NextDouble() * 360 - 180 },
                        Creator = user,
                        CreationDate = DateTime.Now.AddHours( random.NextDouble() * -6 )
                    } );


                    context.Votes.Add( new Vote
                    {
                        UserId = user.UserId,
                        PostId = post.PostId
                    } );
                }
            }
        }
    }
}