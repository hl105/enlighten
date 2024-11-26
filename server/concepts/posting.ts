import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface PostDoc extends BaseDoc {
  author: ObjectId;
  description: string;
  image: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  hashtag: string[];
  likes: number;
  posts: ObjectId[];
  boost: number;
}

/**
 * Concept: Posting
 * Purpose: Provide a feed of user-uploaded information in a convenient scrollable format with customizable filters.
 */
export default class PostingConcept {
  public readonly posts: DocCollection<PostDoc>;

  /**
   * Make an instance of Posting.
   */
  constructor(collectionName: string) {
    this.posts = new DocCollection<PostDoc>(collectionName);

    // Ensure geospatial index on location for geospatial queries
    void this.posts.collection.createIndex({ location: "2dsphere" });
  }

  /**
   * Creates a post and returns the postId.
   */
  async createPost(author: ObjectId, description: string, image: string, location: { x: number; y: number }, hashtags: string[] = []) {
    // Use provided hashtags or extract from description
    const extractedHashtags = this.extractHashtags(description);
    const combinedHashtags = Array.from(new Set([...extractedHashtags, ...hashtags]));

    const postDoc: Omit<PostDoc, "_id" | "dateCreated" | "dateUpdated"> = {
      author,
      description,
      image,
      hashtag: combinedHashtags,
      likes: 0,
      posts: [],
      boost: 0,
      location: {
        type: "Point",
        coordinates: [location.x, location.y],
      },
    };

    const _id = await this.posts.createOne(postDoc);
    return {
      msg: "Post successfully created!",
      postId: _id.toString(),
    };
  }

  /**
   * Deletes a post if the user is the author.
   */
  async deletePost(user: ObjectId, postId: ObjectId) {
    await this.assertAuthorIsUser(postId, user);
    await this.posts.deleteOne({ _id: postId });
    return { msg: "Post deleted successfully!" };
  }

  /**
   * Edits a post's description.
   */
  async editPost(user: ObjectId, postId: ObjectId, description: string, hashtags: string[] = []) {
    await this.assertAuthorIsUser(postId, user);
    const extractedHashtags = this.extractHashtags(description);
    const combinedHashtags = Array.from(new Set([...extractedHashtags, ...hashtags]));

    await this.posts.partialUpdateOne({ _id: postId }, { description, hashtag: combinedHashtags });
    return { msg: "Post successfully updated!" };
  }

  /**
   * Returns the number of likes for a post.
   */
  async getLikes(postId: ObjectId) {
    const post = await this.posts.readOne({ _id: postId });
    if (!post) {
      throw new NotFoundError(`Post ${postId} does not exist!`);
    }
    return post.likes;
  }

  /**
   * Boosts a post by moving it earlier in the posts by 2 spots.
   */
  async boostPost(postId: ObjectId) {
    const post = await this.posts.readOne({ _id: postId });
    if (!post) {
      throw new NotFoundError(`Post ${postId} does not exist!`);
    }
    const newBoost = (post.boost || 0) + 2;
    await this.posts.partialUpdateOne({ _id: postId }, { boost: newBoost });
    return { msg: "Post boosted successfully!" };
  }

  /**
   * Returns the hashtags from the post.
   */
  async getHashtags(postId: ObjectId) {
    const post = await this.posts.readOne({ _id: postId });
    if (!post) {
      throw new NotFoundError(`Post ${postId} does not exist!`);
    }
    return post.hashtag;
  }

  /**
   * Helper method to extract hashtags from a description.
   */
  private extractHashtags(description: string): string[] {
    const regex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;
    while ((match = regex.exec(description)) !== null) {
      hashtags.push(match[1]);
    }
    return hashtags;
  }

  /**
   * Ensures that the user is the author of the post.
   */
  async assertAuthorIsUser(postId: ObjectId, user: ObjectId) {
    const post = await this.posts.readOne({ _id: postId });
    if (!post) {
      throw new NotFoundError(`Post ${postId} does not exist!`);
    }
    if (post.author.toString() !== user.toString()) {
      throw new PostAuthorNotMatchError(user, postId);
    }
  }

  /**
   * Retrieves posts based on provided filters.
   */
  async getPosts(filters: any = {}) {
    // Returns posts matching the filters, sorted for better client performance
    return await this.posts.readMany(filters, { sort: { boost: -1, _id: -1 } });
  }

  /**
   * Retrieves posts by a specific author.
   */
  async getByAuthor(author: ObjectId) {
    return await this.posts.readMany({ author });
  }
}

export class PostAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}
