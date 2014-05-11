using System.Web.Http;

namespace Localit.Server
{
    public static class WebApiConfig
    {
        public static void Register( HttpConfiguration config )
        {
            var formatters = GlobalConfiguration.Configuration.Formatters;
            formatters.Remove( formatters.XmlFormatter );

            config.EnableCors();

            // Web API routes
            config.MapHttpAttributeRoutes();
        }
    }
}