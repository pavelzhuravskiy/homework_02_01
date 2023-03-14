"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationPostsFindByParamId = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const mongodb_posts_query_repository_1 = require("../../../repositories/query-repos/mongodb-posts-query-repository");
exports.validationPostsFindByParamId = (0, express_validator_1.param)("id").custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mongodb_posts_query_repository_1.postsQueryRepository.findPostById(new mongodb_1.ObjectId(value));
    if (!result) {
        throw new Error("ID not found");
    }
    return true;
}));
