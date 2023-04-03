import { Router } from "express";
import { validationErrorCheck } from "../middlewares/validations/_validation-error-check";
import { validationCommentsFindByParamId } from "../middlewares/validations/find-by-id/validation-comments-find-by-param-id";
import { ValidationCommentsInput } from "../middlewares/validations/input/validation-comments-input";
import { authBearer } from "../middlewares/auth/auth-bearer";
import { validationCommentOwner } from "../middlewares/validations/validation-comment-owner";
import { authBasic } from "../middlewares/auth/auth-basic";
import { commentsController } from "../composition-root";

export const commentsRouter = Router({});

commentsRouter.get(
  "/:id",
  validationCommentsFindByParamId,
  validationErrorCheck,
  commentsController.getComment.bind(commentsController)
);

commentsRouter.put(
  "/:id",
  validationCommentsFindByParamId,
  authBearer,
  ValidationCommentsInput,
  validationErrorCheck,
  validationCommentOwner,
  commentsController.updateComment.bind(commentsController)
);

commentsRouter.delete(
  "/:id",
  validationCommentsFindByParamId,
  validationErrorCheck,
  authBearer,
  validationCommentOwner,
  commentsController.deleteComment.bind(commentsController)
);

commentsRouter.delete(
  "/",
  authBasic,
  commentsController.deleteComments.bind(commentsController)
);