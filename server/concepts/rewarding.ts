import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface Badge extends BaseDoc {
  name: string;
  logo: string;
  threshold: number;
  hashtags?: string[];
}

export interface BadgeProgress {
  badgeId: ObjectId;
  points: number;
  earned: boolean;
}

export interface UserBadgesDoc extends BaseDoc {
  userId: ObjectId;
  badges: BadgeProgress[];
}

/**
 * Concept: Rewarding [User, Post]
 */
export default class RewardingConcept {
  public readonly usersBadges: DocCollection<UserBadgesDoc>;
  public readonly badgeDefinitions: DocCollection<Badge>;

  /**
   * Make an instance of Rewarding.
   */
  constructor(userBadgesCollection: string, badgeDefinitionsCollection: string) {
    this.usersBadges = new DocCollection<UserBadgesDoc>(userBadgesCollection);
    this.badgeDefinitions = new DocCollection<Badge>(badgeDefinitionsCollection);
  }

  /**
   * add points to userId's badgeProcess's badgeId in userBadges doc
   * if badge does not exist in user's badgeProcess, add it
   */
  async addPoints(userId: ObjectId, badgeId: ObjectId, pointsToAdd: number) {
    const userBadges = await this.usersBadges.readOne({ userId });
    const badgeProgress = userBadges?.badges.find((b) => b.badgeId.toString() === badgeId.toString());

    if (!userBadges) {
      throw new NotFoundError(`User badges not found for user ${userId}.`);
    }

    const badge = await this.badgeDefinitions.readOne({ _id: badgeId });

    if (!badge) {
      throw new NotFoundError(`Badge not found for badge Id ${badgeId}.`);
    }

    if (badgeProgress) {
      badgeProgress.points += pointsToAdd;
      if (!badgeProgress.earned && badgeProgress.points >= badge.threshold) {
        badgeProgress.earned = true;
      }
    } else {
      // user starts badge for the first time
      userBadges.badges.push({
        badgeId: badge._id,
        points: pointsToAdd,
        earned: false,
      });
    }

    await this.usersBadges.partialUpdateOne({ userId }, { badges: userBadges.badges });

    return { msg: "Points added and badge progress updated!" };
  }

  /**
   * Given a list of hashtags, maps it to badge and updates points
   * @param userId userId from post
   * @param hashtags list of hashtags from post
   */
  async addPointsHashtag(userId: ObjectId, hashtags: string[]) {
    for (const hashtag of hashtags) {
      const relatedBadges = await this.badgeDefinitions.readMany({ hashtags: hashtag });
      for (const badge of relatedBadges) {
        await this.addPoints(userId, badge._id, 1);
      }
    }
    return { msg: "Points added based on hashtags!" };
  }

  /**
   * Get all badges in badgeDefinitions
   */
  async getAllDefinedBadges() {
    return this.badgeDefinitions.readMany({});
  }

  /**
   * Add a new badge to badgeDefinitions
   */
  async addBadge(name: string, logo: string, threshold: number, hashtags?: string[]) {
    const newBadge = { name, logo, threshold, hashtags: hashtags || [] };
    const _id = await this.badgeDefinitions.createOne(newBadge);
    return { msg: "Badge added successfully!", badgeId: _id };
  }

  /**
   * Delete an existing badge to badgeDefinitions
   */
  async deleteBadge(badgeId: ObjectId) {
    await this.badgeDefinitions.deleteOne({ _id: badgeId });
    return { msg: "Badge deleted successfully!" };
  }

  /**
   * Update a badge's details
   */
  async updateBadge(badgeId: ObjectId, updates: Partial<Badge>) {
    await this.badgeDefinitions.partialUpdateOne({ _id: badgeId }, updates);
    return { msg: "Badge updated successfully!" };
  }

  /**
   * Get list of badgeProgresses user has started
   */
  async getUserBadges(userId: ObjectId) {
    const existingUserBadges = await this.usersBadges.readOne({ userId });
    return existingUserBadges?.badges;
  }

  /**
   * Add a new user to usersBadges. REQUIRED when a new user is created.
   */
  async addUserToUsersBadges(userId: ObjectId) {
    const existingUserBadges = await this.usersBadges.readOne({ userId });
    if (existingUserBadges) {
      throw new NotAllowedError(`User ${userId} already exists in usersBadges.`);
    }

    await this.usersBadges.createOne({ userId, badges: [] });
    return { msg: "User added to usersBadges successfully!" };
  }

  /**
   * Delete a user from usersBadges. REQUIRED when a user is deleted.
   */
  async deleteUserFromUsersBadges(userId: ObjectId) {
    await this.usersBadges.deleteOne({ userId });
    return { msg: "User deleted from usersBadges successfully!" };
  }
}
