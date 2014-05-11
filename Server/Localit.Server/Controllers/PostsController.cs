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
        public IEnumerable<Post> GetPostsNear( [FromUri] double latitude, [FromUri] double longitude, [FromUri( Name = "range" )] double? optionalRange = null, [FromUri( Name = "userFacebookId" )] long? userFbId = null )
        {
            IQueryable<Post> results;

            var stuff = from p in _context.Posts
                        let dlon = p.Location.Longitude - longitude
                        let dlat = p.Location.Latitude - latitude
                        let a = SqlFunctions.Square( SqlFunctions.Sin( dlat / 2 ) ) + SqlFunctions.Cos( latitude ) * SqlFunctions.Cos( p.Location.Latitude ) * SqlFunctions.Square( SqlFunctions.Sin( dlon / 2 ) )
                        let c = 2 * SqlFunctions.Atan2( SqlFunctions.SquareRoot( a ), SqlFunctions.SquareRoot( 1 - a ) )
                        where c != null
                        let distance = c * EarthRadius
                        select new { Distance = (double) distance, Post = p };

            if ( optionalRange.HasValue )
            {
                double range = optionalRange.Value;

                results = ( from o in stuff
                            where o.Distance <= 1.25 * range
                            orderby new[] { (double) SqlFunctions.Cos( ( ( o.Distance - 50 ) * Math.PI / 2 ) / ( range / 4.0 ) ) * 0.5, 1 - ( 0.5 / range ) * o.Distance }.Min() * o.Post.Score
                            select o.Post ).Include( p => p.Creator );
            }
            else
            {
                var avgx = from o in stuff
                           where o.Distance <= 10
                           where o.Post.Score != null
                           select o.Post.Score;


                double avg = avgx.Any() ? avgx.Average() : 0;

                results = ( from o in stuff
                            let popFact = new[] { ( o.Post.Score / 2.0 * avg ) * 0.5, 0.5 }.Min()
                            orderby SqlFunctions.Cos( o.Distance * Math.PI / 10 ) * ( 1 - popFact ) + popFact
                            select o.Post ).Include( p => p.Creator );
            }

            if ( userFbId == null )
            {
                return results;
            }

            var user = _context.Users.FirstOrDefault( u => u.FacebookId == userFbId );
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

            var post = new Post
            {
                Title = info.Title,
                Creator = user,
                Location = info.Location,
                Score = 1,
                CreationDate = DateTime.Now
            };

            post = _context.Posts.Add( post );

            var vote = new Vote
            {
                PostId = post.PostId,
                UserId = user.UserId
            };

            _context.Votes.Add( vote );
            _context.SaveChanges();

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