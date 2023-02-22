import { postsCollection } from "./_mongodb-connect";
import {
  MongoPostModel,
} from "../../models/mongodb/MongoPostModel";
import { ObjectId } from "mongodb";
import {MongoPostModelWithId} from "../../models/mongodb/MongoPostModelWithId";
import {
  MongoPostModelWithStringId
} from "../../models/mongodb/MongoPostModelWithStringId";

export const postsRepository = {
  // Return all posts
  async findAllPosts(): Promise<MongoPostModelWithId[]> {
    return postsCollection.find({}).toArray();
  },

  // Return post by ID
  async findPostById(
    _id: ObjectId
  ): Promise<boolean | MongoPostModelWithStringId> {
    const foundPost = await postsCollection.findOne({ _id });

    if (!foundPost) {
      return false;
    }

    return {
      id: foundPost._id.toString(),
      title: foundPost.title,
      shortDescription: foundPost.shortDescription,
      content: foundPost.content,
      blogId: foundPost.blogId,
      blogName: foundPost.blogName,
      createdAt: foundPost.createdAt,
    };
  },

  // Create new post
  async createNewPost(
    newPost: MongoPostModel
  ): Promise<boolean | MongoPostModelWithStringId> {
    const insertedPost = await postsCollection.insertOne(newPost);

    return {
      id: insertedPost.insertedId.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
    };
  },

  // Update existing post
  async updatePost(
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    const result = await postsCollection.updateOne(
      { _id },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
        },
      }
    );

    return result.matchedCount === 1;
  },

  // Delete existing post
  async deletePost(_id: ObjectId): Promise<boolean> {
    const result = await postsCollection.deleteOne({ _id });
    return result.deletedCount === 1;
  },

  // Delete all post
  async deleteAll(): Promise<boolean> {
    await postsCollection.deleteMany({});
    return (await postsCollection.countDocuments()) === 0;
  },
};