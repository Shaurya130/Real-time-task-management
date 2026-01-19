import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { prisma } from "../config/prisma.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await prisma.user.upsert({
          where: {
            provider_providerId: {
              provider: "GITHUB",
              providerId: profile.id,
            },
          },
          update: {},
          create: {
            email: profile.emails?.[0]?.value ?? `${profile.id}@github.com`,
            name: profile.username,
            avatarUrl: profile.photos?.[0]?.value,
            provider: "GITHUB",
            providerId: profile.id,
          },
        });

        done(null, user);  // Successfully authenticated user
      } catch (err) {
        done(err, null);
      }
    }
  )
);
