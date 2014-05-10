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
            Database.SetInitializer( new DropCreateDatabaseAlways<ApplicationDbContext>() );

            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure( WebApiConfig.Register );
            FilterConfig.RegisterGlobalFilters( GlobalFilters.Filters );

        }
    }
}