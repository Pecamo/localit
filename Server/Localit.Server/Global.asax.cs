using System.Data.Entity;
using System.Web.Http;
using Localit.Server.Models;

namespace Localit.Server
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Database.SetInitializer( new DropCreateDatabaseAlways<ApplicationDbContext>() );
            GlobalConfiguration.Configure( WebApiConfig.Register );
        }
    }
}