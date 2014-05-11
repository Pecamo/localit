using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.SqlServer;
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
        private const double EarthRadius = 6373; // km

        private readonly ApplicationDbContext _context = new ApplicationDbContext();

        [HttpGet]
        [Route( "" )]
        public IEnumerable<Post> GetPostsNear( [FromUri] double latitude, [FromUri] double longitude, [FromUri] double range, [FromUri] long? userFacebookId = null )
        {
            var results = ( from p in _context.Posts
                            let dlon = p.Location.Longitude - longitude // haversine
                            let dlat = p.Location.Latitude - latitude
                            let a = SqlFunctions.Square( SqlFunctions.Sin( dlat / 2 ) ) + SqlFunctions.Cos( latitude ) * SqlFunctions.Cos( p.Location.Latitude ) * SqlFunctions.Square( SqlFunctions.Sin( dlon / 2 ) )
                            let c = 2 * SqlFunctions.Atan2( SqlFunctions.SquareRoot( a ), SqlFunctions.SquareRoot( 1 - a ) )
                            let dist = c * EarthRadius
                            where dist <= range
                            orderby p.Score descending
                            select p ).Include( p => p.Creator );

            if ( userFacebookId == null )
            {
                return results;
            }

            var user = _context.Users.FirstOrDefault( u => u.FacebookId == userFacebookId );
            if ( user == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            var immRes = results.ToArray();
            foreach ( var res in immRes )
            {
                res.HasUserVoted = _context.Votes.Any( v => v.UserId == user.UserId && v.PostId == res.PostId );
            }
            return immRes;
        }

        [HttpGet]
        [Route( "{id}" )]
        public Post GetPost( int id )
        {
            var post = _context.Posts.Include( p => p.Creator ).FirstOrDefault( p => p.PostId == id );
            if ( post == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            return post;
        }

        [HttpPost]
        [Route( "add" )]
        public Post CreatePost( [FromBody] PostCreationInfo info )
        {
            if ( info == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            var user = _context.Users.FirstOrDefault( u => u.FacebookId == info.UserFacebookId );
            if ( user == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            var post = _context.Posts.Add( new Post
            {
                Title = info.Title,
                Content = info.Content,
                Creator = user,
                Location = info.Location,
                Score = 1,
                CreationDate = DateTime.Now
            } );

            _context.SaveChanges();

            _context.Votes.Add( new Vote
            {
                PostId = post.PostId,
                UserId = user.UserId
            } );

            _context.SaveChanges();

            post.HasUserVoted = true;
            return post;
        }

        [HttpDelete]
        [Route( "" )]
        public void DeletePost( [FromBody] PostDeleteInfo info )
        {
            if ( info == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            var post = _context.Posts.FirstOrDefault( p => p.PostId == info.PostId );
            var user = _context.Users.FirstOrDefault( u => u.FacebookId == info.UserFacebookId );
            if ( post == null || user == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            if ( post.Creator != user )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            _context.Posts.Remove( post );
            _context.SaveChanges();
        }

        [HttpPost]
        [Route( "upvote" )]
        public Post Upvote( [FromBody] UpvoteInfo info )
        {
            if ( info == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            var post = _context.Posts.FirstOrDefault( p => p.PostId == info.PostId );
            var user = _context.Users.FirstOrDefault( u => u.FacebookId == info.UserFacebookId );
            if ( post == null || user == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            var vote = _context.Votes.FirstOrDefault( v => v.UserId == user.UserId && v.PostId == post.PostId );

            if ( vote == null )
            {
                vote = new Vote { UserId = user.UserId, PostId = post.PostId };
                _context.Votes.Add( vote );
                post.Score++;
                _context.SaveChanges();
            }

            return post;
        }

        [HttpDelete]
        [Route( "upvote" )]
        public Post DeleteUpvote( [FromBody] UpvoteInfo info )
        {
            if ( info == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            var post = _context.Posts.FirstOrDefault( p => p.PostId == info.PostId );
            var user = _context.Users.FirstOrDefault( u => u.FacebookId == info.UserFacebookId );
            if ( post == null || user == null )
            {
                throw new HttpResponseException( HttpStatusCode.BadRequest );
            }

            var vote = _context.Votes.FirstOrDefault( v => v.UserId == user.UserId && v.PostId == post.PostId );

            if ( vote != null )
            {
                _context.Votes.Remove( vote );
                post.Score--;
                _context.SaveChanges();
            }

            return post;
        }
    }
}