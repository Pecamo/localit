﻿using System.Data.Entity;

namespace Localit.Server.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() : base( "name=Localit" ) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Vote> Votes { get; set; }

        protected override void OnModelCreating( DbModelBuilder modelBuilder )
        {
            base.OnModelCreating( modelBuilder );

            modelBuilder.Entity<Vote>().HasKey( v => new { v.PostId, v.UserId } );
        }
    }
}