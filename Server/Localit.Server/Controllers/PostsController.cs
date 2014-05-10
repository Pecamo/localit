using System;
using System.Collections.Generic;
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
        public IEnumerable<Post> GetPostsNear( [FromUri] double latitude, [FromUri] double longitude )
        {
            return _context.Posts.OrderBy( p => Math.Pow( p.Location.Latitude - latitude, 2 ) + Math.Pow( p.Location.Longitude - longitude, 2 ) ).Take( 10 );
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
        public Post CreatePost( [FromBody]PostCreationInfo info )
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