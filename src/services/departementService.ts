import { departmentsService } from "./departments";
import type { Department } from "@/types/department";

export type { Department };

export const getDepartments = departmentsService.getAll;
