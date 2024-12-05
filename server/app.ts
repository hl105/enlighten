import AuthenticatingConcept from "./concepts/authenticating";
import ForumingConcept from "./concepts/foruming";
import FriendingConcept from "./concepts/friending";
import PostingConcept from "./concepts/posting";
import RewardingConcept from "./concepts/rewarding";
import SessioningConcept from "./concepts/sessioning";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts");
export const Friending = new FriendingConcept("friends");
export const Rewarding = new RewardingConcept("userBadges", "badgeDefinitions");
export const Foruming = new ForumingConcept("forums");
