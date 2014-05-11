using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;
using Localit.Server.Models;

namespace Localit.Server.Controllers
{
    [EnableCors( origins: "*", headers: "*", methods: "*" )]
    [RoutePrefix( "api/auth" )]
    public class AuthController : ApiController
    {
        private ApplicationDbContext _context = new ApplicationDbContext();

        [HttpPost]
        [Route( "" )]
        public void Do( [FromBody] AuthInfo info )
        {
            if ( info == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            var user = _context.Users.FirstOrDefault( u => u.FacebookId == info.FacebookId );
            if ( user == null )
            {
                _context.Users.Add( new User { FacebookId = info.FacebookId, Name = info.Name } );
                _context.SaveChanges();
            }
        }
    }
}