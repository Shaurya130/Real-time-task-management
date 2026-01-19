import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../config/prisma.js";

passport.use(
  new GoogleStrategy(   // Google OAuth2 strategy
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        const user = await prisma.user.upsert({ // upsert user based on Google profile
          where: {
            provider_providerId: {
              provider: "GOOGLE",
              providerId: profile.id,
            },
          },
          update: {},
          create: {
            email,
            name: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value,
            provider: "GOOGLE",
            providerId: profile.id,
          },
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
