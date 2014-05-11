using System.Linq;
using System.Web.Http;
using Localit.Server.Models;

namespace Localit.Server.Controllers
{
    [RoutePrefix( "api/auth" )]
    public class AuthController : ApiController
    {
        private ApplicationDbContext _context = new ApplicationDbContext();

        [HttpPost]
        [Route( "" )]
        public void Do( long id, string name )
        {
            var user = _context.Users.FirstOrDefault( u => u.Id == id );
            if ( user == null )
            {
                _context.Users.Add( new User { Id = id, Name = name } );
            }
        }
    }
}