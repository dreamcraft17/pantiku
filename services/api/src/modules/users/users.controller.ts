import { Request, Response } from "express";
import { usersService } from "./users.service.js";
import { successResponse } from "../../utils/response.js";

export const usersController = {
  async list(_req: Request, res: Response) {
    const users = await usersService.listUsers();
    return successResponse(res, users, "Users fetched");
  }
};
