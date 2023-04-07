import { param } from "express-validator";
import { ObjectId } from "mongodb";
import { blogsQueryRepository } from "../../../composition-root";

export const validationBlogsFindByParamId = param("id").custom(
  async (value) => {
    const result = await blogsQueryRepository.findBlogById(new ObjectId(value));
    if (!result) {
      throw new Error("ID not found");
    }
    return true;
  }
);