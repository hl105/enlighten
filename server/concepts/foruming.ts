import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ForumDoc extends BaseDoc {
  author: ObjectId;
  title: string;
  description: string;
}

export interface CommentDoc extends BaseDoc {
  author: ObjectId;
  forum: ObjectId;
  text: string;
}

/**
 * Concept: Foruming
 * Purpose: Users look at other users’ messages and can reply or add a message for a new topic.
 */
export default class ForumingConcept {
  public readonly forums: DocCollection<ForumDoc>;
  public readonly comments: DocCollection<CommentDoc>;

  /**
   * Make an instance of Foruming.
   */
  constructor(collectionName: string) {
    this.forums = new DocCollection<ForumDoc>(collectionName);
    this.comments = new DocCollection<CommentDoc>(collectionName + "_comments");
  }

  /**
   * Creates a forum and returns the forumId.
   */
  async createForum(author: ObjectId, title: string, description: string) {
    const forumDoc: Omit<ForumDoc, "_id" | "dateCreated" | "dateUpdated"> = { author, title, description };

    const _id = await this.forums.createOne(forumDoc);
    return {
      msg: "Forum successfully created!",
      forumId: _id.toString(),
    };
  }

  /**
   * Deletes a forum if the user is the author.
   */
  async deleteForum(user: ObjectId, forumId: ObjectId) {
    await this.assertAuthorIsUser(user, forumId);
    await this.forums.deleteOne({ _id: forumId });
    return { msg: "Forum deleted successfully!" };
  }

  /**
   * Edits a forum's title or description.
   */
  async editForum(user: ObjectId, forumId: ObjectId, title: string, description: string) {
    await this.assertAuthorIsUser(user, forumId);
    await this.forums.partialUpdateOne({ _id: forumId }, { title: title, description: description });
    return { msg: "Forum successfully updated!" };
  }

  /**
   * Creates a comment under a specific forum.
   */
  async createComment(author: ObjectId, forum: ObjectId, text: string) {
    const commentDoc: Omit<CommentDoc, "_id" | "dateCreated" | "dateUpdated"> = { author, forum, text };

    const _id = await this.comments.createOne(commentDoc);
    return {
      msg: "Comment successfully created!",
      commentId: _id.toString(),
    };
  }

  /**
   * Deletes a comment from a specific forum.
   */
  async deleteCommentFromForum(user: ObjectId, commentId: ObjectId) {
    await this.assertAuthorIsCommenter(user, commentId);
    await this.comments.deleteOne({ _id: commentId });
    return { msg: "Comment deleted successfully!" };
  }

  /**
   * Ensures that the user is the author of the forum.
   */
  async assertAuthorIsUser(user: ObjectId, forumId: ObjectId) {
    const forum = await this.forums.readOne({ _id: forumId });
    if (!forum) {
      throw new NotFoundError(`Forum ${forumId} does not exist!`);
    }
    if (forum.author.toString() !== user.toString()) {
      throw new ForumAuthorNotMatchError(user, forumId);
    }
  }

  /**
   * Ensures that the user is the commenter.
   */
  async assertAuthorIsCommenter(user: ObjectId, commentId: ObjectId) {
    const comment = await this.comments.readOne({ _id: commentId });
    if (!comment) {
      throw new NotFoundError(`Comment ${commentId} does not exist!`);
    }
    if (comment.author.toString() !== user.toString()) {
      throw new CommentAuthorNotMatchError(user, commentId);
    }
  }

  /**
   * Retrieves forums based on provided filters.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getForums(filters: any = {}) {
    // Returns posts matching the filters, sorted for better client performance
    return await this.forums.readMany(filters, { sort: { _id: -1 } });
  }

  /**
   * Retrieves forums created by a specific author.
   */
  async getByAuthor(author: ObjectId) {
    return await this.forums.readMany({ author });
  }

  /**
   * Retrieves comments based on provided filters.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getComments(filters: any = {}) {
    // Returns posts matching the filters, sorted for better client performance
    return await this.comments.readMany(filters, { sort: { _id: -1 } });
  }

  /**
   * Retrieves comments created by a specific author.
   */
  async getCommentByAuthor(author: ObjectId) {
    return await this.comments.readMany({ author });
  }

  /**
   * Retrieves comments created under a specific forum.
   */
  async getCommentByForum(forum: ObjectId) {
    return await this.comments.readMany({ forum });
  }

  /**
   * Retrieves comments with specified comment Id.
   */
  async getCommentById(id: ObjectId) {
    return await this.comments.readMany({ id });
  }
}

export class ForumAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of forum {1}!", author, _id);
  }
}

export class CommentAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of comment {1}!", author, _id);
  }
}
