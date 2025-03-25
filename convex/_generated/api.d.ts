/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as answers from "../answers.js";
import type * as http from "../http.js";
import type * as openai from "../openai.js";
import type * as questions from "../questions.js";
import type * as recursos from "../recursos.js";
import type * as savedItems from "../savedItems.js";
import type * as studyPlans from "../studyPlans.js";
import type * as subjects from "../subjects.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  answers: typeof answers;
  http: typeof http;
  openai: typeof openai;
  questions: typeof questions;
  recursos: typeof recursos;
  savedItems: typeof savedItems;
  studyPlans: typeof studyPlans;
  subjects: typeof subjects;
  subscriptions: typeof subscriptions;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
