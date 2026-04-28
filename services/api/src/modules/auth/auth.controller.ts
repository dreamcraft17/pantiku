import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { successResponse } from "../../utils/response.js";

export const authController = {
  async register(req: Request, res: Response) {
    const data = await authService.register(req.body);
    return successResponse(res, data, "User registered", undefined, 201);
  },

  async login(req: Request, res: Response) {
    const data = await authService.login(req.body);
    return successResponse(res, data, "Login successful");
  },

  async google(req: Request, res: Response) {
    const data = await authService.google(req.body);
    return successResponse(res, data, "Google login successful");
  },

  async me(req: Request, res: Response) {
    const data = await authService.me(req.user!.userId);
    return successResponse(res, data, "Authenticated user");
  },

  async refresh(req: Request, res: Response) {
    const data = await authService.refresh(req.body);
    return successResponse(res, data, "Token refreshed");
  },

  async logout(req: Request, res: Response) {
    const data = await authService.logout(req.body.refreshToken);
    return successResponse(res, data, "Logout successful");
  }
};
