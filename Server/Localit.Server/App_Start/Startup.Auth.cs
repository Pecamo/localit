﻿using System;
using Localit.Server.Models;
using Localit.Server.Providers;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace Localit.Server
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth( IAppBuilder app )
        {
            // Configure the db context and user manager to use a single instance per request
            app.CreatePerOwinContext( ApplicationDbContext.Create );
            app.CreatePerOwinContext<ApplicationUserManager>( ApplicationUserManager.Create );

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication( new CookieAuthenticationOptions() );
            app.UseExternalSignInCookie( DefaultAuthenticationTypes.ExternalCookie );

            const string TokenPath = "/api/Account/GetToken";
            // Configure the application for OAuth based flow
            PublicClientId = "self";
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString( TokenPath ),
                Provider = new ApplicationOAuthProvider( PublicClientId ),
                AuthorizeEndpointPath = new PathString( "/api/Account/ExternalLogin" ),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays( 14 ),
                AllowInsecureHttp = true
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens( OAuthOptions );

            app.Use( async ( context, next ) =>
            {
                IOwinRequest req = context.Request;
                IOwinResponse res = context.Response;
                if ( req.Path.StartsWithSegments( new PathString( "/api/Account/GetToken" ) ) )
                {
                    var origin = req.Headers.Get( "Origin" );
                    if ( !string.IsNullOrEmpty( origin ) )
                    {
                        res.Headers.Set( "Access-Control-Allow-Origin", origin );
                    }
                    if ( req.Method == "OPTIONS" )
                    {
                        res.StatusCode = 200;
                        res.Headers.AppendCommaSeparatedValues( "Access-Control-Allow-Methods", "GET", "POST" );
                        res.Headers.AppendCommaSeparatedValues( "Access-Control-Allow-Headers", "authorization", "content-type" );
                        return;
                    }
                }
                await next();
            } );

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //    consumerKey: "",
            //    consumerSecret: "");

            //app.UseFacebookAuthentication(
            //    appId: "",
            //    appSecret: "");

            app.UseGoogleAuthentication();
        }
    }
}