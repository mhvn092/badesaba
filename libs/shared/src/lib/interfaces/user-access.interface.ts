import { BadgeEnum } from "../enums/badge.enum";


export interface UserAccessInterface {
  _id: string;
  type: BadgeEnum;
  name: string;
}
