import { Request, Response, Router } from "express";
import { blogsService } from "../domain/blogs-service";
import { ObjectId } from "mongodb";
import {
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../models/global/GlobalRequestModel";
import { GlobalQueryModel } from "../models/global/GlobalQueryModel";
import { authBasic } from "../middlewares/auth/auth-basic";
import { validationBlogsInput } from "../middlewares/validations/validation-blogs-input";
import { validationErrorCheck } from "../middlewares/validations/_validation-error-check";
import { validationBlogsFindByParamId } from "../middlewares/validations/validation-blogs-find-by-param-id";
import { postsService } from "../domain/posts-service";
import { validationPostsInput } from "../middlewares/validations/validation-posts-input";
import { GlobalIdStringModel } from "../models/global/GlobalIdStringModel";
import { blogsQueryRepository } from "../repositories/mongodb-blogs-query-repository";
import { postsQueryRepository } from "../repositories/mongodb-posts-query-repository";

export const blogsRouter = Router({});

blogsRouter.get(
  "/",
  async (req: RequestWithQuery<GlobalQueryModel>, res: Response) => {
    const foundBlogs = await blogsQueryRepository.findBlogs(
      req.query.searchNameTerm,
      req.query.sortBy,
      req.query.sortDirection,
      req.query.pageNumber,
      req.query.pageSize
    );
    res.json(foundBlogs);
  }
);

blogsRouter.get(
  "/:id",
  validationBlogsFindByParamId,
  validationErrorCheck,
  async (req: Request, res: Response) => {
    const foundBlog = await blogsQueryRepository.findBlogById(
      new ObjectId(req.params.id)
    );
    res.json(foundBlog);
  }
);

blogsRouter.get(
  "/:id/posts",
  validationBlogsFindByParamId,
  validationErrorCheck,
  async (
    req: Request &
      RequestWithParamsAndQuery<GlobalIdStringModel, GlobalQueryModel>,
    res: Response
  ) => {
    const foundPosts = await postsQueryRepository.findPosts(
      new ObjectId(req.params.id),
      null,
      req.query.sortBy,
      req.query.sortDirection,
      req.query.pageNumber,
      req.query.pageSize
    );
    res.json(foundPosts);
  }
);

blogsRouter.post(
  "/",
  authBasic,
  validationBlogsInput,
  validationErrorCheck,
  async (req: Request, res: Response) => {
    const newBlog = await blogsService.createNewBlog(req.body);
    res.status(201).json(newBlog);
  }
);

blogsRouter.post(
  "/:id/posts",
  authBasic,
  validationBlogsFindByParamId,
  validationPostsInput,
  validationErrorCheck,
  async (req: Request, res: Response) => {
    const newPost = await postsService.createNewPostByBlogId(
      new ObjectId(req.params.id),
      req.body
    );
    res.status(201).json(newPost);
  }
);

blogsRouter.put(
  "/:id",
  authBasic,
  validationBlogsFindByParamId,
  validationBlogsInput,
  validationErrorCheck,
  async (req: Request, res: Response) => {
    const isUpdated = await blogsService.updateBlog(
      new ObjectId(req.params.id),
      req.body
    );
    if (isUpdated) {
      const updatedBlog = await blogsQueryRepository.findBlogById(req.body.id);
      res.status(204).json(updatedBlog);
    }
  }
);

blogsRouter.delete(
  "/:id",
  authBasic,
  validationBlogsFindByParamId,
  validationErrorCheck,
  async (req: Request, res: Response) => {
    const isDeleted = await blogsService.deleteBlog(
      new ObjectId(req.params.id)
    );
    if (isDeleted) {
      res.sendStatus(204);
    }
  }
);

blogsRouter.delete("/", authBasic, async (req: Request, res: Response) => {
  const isDeleted = await blogsService.deleteAll();
  if (isDeleted) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});