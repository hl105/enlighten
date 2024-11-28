import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Friending, Posting, Rewarding, Sessioning } from "./app";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";
import { Badge } from "./concepts/rewarding";

import multer from "multer";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    // Use the original filename or generate a unique one
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    const response = await Authing.create(username, password);
    if (response.user) {
      await Rewarding.addUserToUsersBadges(response.user._id);
    }
    return response;
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    await Rewarding.deleteUserFromUsersBadges(user);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  // Updated Posting routes

  // @Router.post("/upload")
  // async uploadImage(req: any, res: any) {
  //   // Since we're using multer, the file will be available in req.file
  //   if (!req.file) {
  //     res.status(400).json({ error: "No file uploaded" });
  //     return;
  //   }
  //   // Construct the image URL (adjust based on your setup)
  //   const imageUrl = `/uploads/${req.file.filename}`;
  //   res.json({ imageUrl });
  // }

  @Router.post("/posts")
  async createPost(session: SessionDoc, description: string, image: string, location: { x: string; y: string }, hashtags?: string) {
    const user = Sessioning.getUser(session);
    const loc = { x: parseFloat(location.x), y: parseFloat(location.y) };
    let hashtagsArray: string[] = [];

    if (hashtags) {
      // Split the hashtags string into an array
      hashtagsArray = hashtags.split(",").map((tag) => tag.trim());
    }
    const created = await Posting.createPost(user, description, image, loc, hashtagsArray);
    const stargazerBadge = new ObjectId("6747e3736bb51059bcc33fd6"); // id of stargazer badge (given for posting)
    const response = await Rewarding.addPoints(user, stargazerBadge, 5); // 5 points for testing purposes for now
    const responseHashtag = await Rewarding.addPointsHashtag(user, hashtagsArray);

    const earned = response.earned === "updated" || responseHashtag.earned === "updated" ? "updated" : "no change";
    const started = response.started === "start new badge" || responseHashtag.started === "start new badge" ? "start new badge" : "no change";

    return { msg: created.msg, postId: created.postId, earned: earned, started: started };
  }

  @Router.delete("/posts/:postId")
  async deletePost(session: SessionDoc, postId: string) {
    const user = Sessioning.getUser(session);
    const postObjectId = new ObjectId(postId);
    await Posting.deletePost(user, postObjectId);
    return { msg: "Post deleted successfully!" };
  }

  @Router.patch("/posts/:postId")
  async editPost(session: SessionDoc, postId: string, description: string, hashtags?: string) {
    const user = Sessioning.getUser(session);
    const postObjectId = new ObjectId(postId);

    let hashtagsArray: string[] = [];
    if (hashtags) {
      hashtagsArray = hashtags.split(",").map((tag) => tag.trim());
    }

    await Posting.editPost(user, postObjectId, description, hashtagsArray);
    return { msg: "Post successfully updated!" };
  }

  // @Router.get("/posts")
  // async viewPosts(key: string, value: string) {
  //   const parsedValue = this.parseValue(value);
  //   const posts = await Posting.viewPosts(key, parsedValue);
  //   return Responses.posts(posts);
  // }

  @Router.get("/posts/:author?")
  @Router.validate(z.object({ author: z.string().optional() }))
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else {
      posts = await Posting.getPosts();
    }
    return Responses.posts(posts);
  }

  @Router.get("/posts/:postId/likes")
  async getLikes(postId: string) {
    const postObjectId = new ObjectId(postId);
    const likes = await Posting.getLikes(postObjectId);
    return { likes };
  }

  @Router.post("/posts/:postId/likes")
  async changePostNumLikes(postId: string, num: number) {
    const postObjectId = new ObjectId(postId);
    const likes = await Posting.changePostNumLikes(postObjectId, num);
    return { likes };
  }

  // might not need?
  @Router.post("/posts/:postId/boost")
  async boostPost(postId: string) {
    const postObjectId = new ObjectId(postId);
    await Posting.boostPost(postObjectId);
    return { msg: "Post boosted successfully!" };
  }

  @Router.get("/posts/:postId/hashtags")
  async getHashtags(postId: string) {
    const postObjectId = new ObjectId(postId);
    const hashtags = await Posting.getHashtags(postObjectId);
    return { hashtags };
  }

  @Router.get("/friends")
  async getFriends(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.idsToUsernames(await Friending.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: SessionDoc, friend: string) {
    const user = Sessioning.getUser(session);
    const friendOid = (await Authing.getUserByUsername(friend))._id;
    return await Friending.removeFriend(user, friendOid);
  }

  @Router.get("/friend/requests")
  async getRequests(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Responses.friendRequests(await Friending.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.sendRequest(user, toOid);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.removeRequest(user, toOid);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.acceptRequest(fromOid, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.rejectRequest(fromOid, user);
  }

  @Router.get("/badges")
  async getDefinedBadges() {
    return await Rewarding.getAllDefinedBadges();
  }

  @Router.post("/badges")
  async defineBadge(content: Partial<Badge>) {
    const { name, logo, threshold, hashtags } = content;
    if (!name || !logo || !threshold) {
      throw new Error("Missing required fields: name, logo, or threshold.");
    }
    return await Rewarding.addBadge(name, logo, threshold, hashtags);
  }

  @Router.patch("/badges/:badgeId")
  async updateBadge(badgeId: string, updates: Partial<Badge>) {
    const oid = new ObjectId(badgeId);
    return await Rewarding.updateBadge(oid, updates);
  }

  @Router.delete("/badges/:badgeId")
  async deleteBadge(badgeId: string) {
    const oid = new ObjectId(badgeId);
    return await Rewarding.deleteBadge(oid);
  }

  @Router.get("/user/:userId/badges")
  async getUserBadges(userId: string) {
    try {
      const oid = new ObjectId(userId);
      // Get the user's badge statuses
      const response = await Rewarding.getUserBadges(oid);
      // Initialize arrays for earned and not earned badges
      const earnedBadges = [];
      const notEarnedBadges = [];
      // Iterate through badge statuses
      if (!response) {
        return;
      }
      for (const badgeStatus of response) {
        const badge = await Rewarding.getBadge(badgeStatus.badgeId); // Fetch badge details
        if (badgeStatus.earned) {
          earnedBadges.push(badge);
        } else {
          notEarnedBadges.push(badge);
        }
      }

      // Return both earned and not earned badges ()
      return {
        earnedBadges,
        notEarnedBadges,
      };
    } catch (error) {
      console.error("Error fetching user badges:", error);
      throw new Error("Unable to fetch user badges");
    }
  }

  @Router.post("/user/:userId/badges/:badgeId")
  async addPoints(userId: string, badgeId: string, pointsToAdd: { points: number }) {
    if (!pointsToAdd || typeof pointsToAdd.points === "undefined") {
      throw new Error("Invalid request: 'points' is required in the JSON body.");
    }
    const { points } = pointsToAdd;
    if (!points) {
      throw new Error("Missing required field points");
    }
    const uid = new ObjectId(userId);
    const bid = new ObjectId(badgeId);
    return await Rewarding.addPoints(uid, bid, points);
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
