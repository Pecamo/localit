using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;
using Localit.Server.Models;

namespace Localit.Server.Controllers
{
    [EnableCors( origins: "*", headers: "*", methods: "*" )]
    [RoutePrefix( "api/posts" )]
    public class PostsController : ApiController
    {
        private readonly ApplicationDbContext _context = new ApplicationDbContext();

        [HttpGet]
        [Route( "" )]
        public /*ICollection<Post>*/ string GetPostsNear( [FromUri] float latitude, [FromUri] float longitude )
        {
            Debug.WriteLine( "GET /posts: latitude={0}, longitude={1}", latitude, longitude );
            return "You requested posts near " + latitude + " / " + longitude + ". What am I supposed to do?";
        }

        [HttpGet]
        [Route( "{id}" )]
        public Post GetPost( int id )
        {
            var post = _context.Posts.FirstOrDefault( p => p.PostId == id );
            if ( post == null )
            {
                throw new HttpResponseException( HttpStatusCode.NotFound );
            }

            return post;
        }

        [HttpPost]
        [Route( "add" )]
        public Post CreatePost( [FromUri] string title, [FromUri] Location location )
        {
            throw new HttpResponseException( HttpStatusCode.NotImplemented );
        }

        [HttpPut]
        [Route( "update" )]
        public Post UpdatePost( [FromBody] Post post )
        {
            throw new HttpResponseException( HttpStatusCode.NotImplemented );
        }

        [HttpPost]
        [Route( "upvote" )]
        public Post UpvotePost( [FromBody] int postId )
        {
            throw new HttpResponseException( HttpStatusCode.NotImplemented );
        }
    }
}