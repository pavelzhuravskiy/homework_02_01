import { postsCollection } from "../global/_mongodb-connect";
import { ObjectId } from "mongodb";
import { MongoPostModelWithStringId } from "../../models/posts/MongoPostModelWithStringId";
import { funcPostMapping } from "../../functions/posts/func-post-mapping";
import { funcFindManyWithQuery } from "../../functions/global/func-find-many-with-query";
import {
  MongoPostModelWithPagination
} from "../../models/posts/MongoPostModelWithPagination";

export const postsQueryRepository = {
  // Return blogs with query
  async findPosts(
    blogId: ObjectId | null,
    searchNameTerm: null | string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<MongoPostModelWithPagination> {
    return funcFindManyWithQuery(
      blogId,
      searchNameTerm,
      undefined,
      undefined,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      postsCollection,
      funcPostMapping
    );
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
};