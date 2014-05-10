using System;
using System.Diagnostics;
using System.Web.Http;
using Localit.Server.Models;

namespace Localit.Server.Controllers
{
    [RoutePrefix( "api/posts" )]
    public class PostsController : ApiController
    {
        [HttpGet]
        [Route( "" )]
        public /*ICollection<Post>*/ string GetPostsNear( [FromUri] float latitude, [FromUri] float longitude )
        {
            Debug.WriteLine( "GET /posts: latitude={0}, longitude={1}", latitude, longitude );
            return "Fnu.";
        }

        [HttpPost]
        [Route( "add" )]
        public Post CreatePost( [FromUri] string title, [FromUri] Location location )
        {
            throw new NotImplementedException();
        }

        [HttpPut]
        [Route( "update" )]
        public Post UpdatePost( [FromBody] Post post )
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [Route( "upvote" )]
        public Post UpvotePost( [FromBody] int postId )
        {
            throw new NotImplementedException();
        }
    }
}