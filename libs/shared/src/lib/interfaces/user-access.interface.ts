import { BadgeEnum } from "../enums/badge.enum";


export interface UserAccessInterface {
  id: string;
  type: BadgeEnum;
  name: string;
}
