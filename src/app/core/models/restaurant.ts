import { Beach } from "./beach";
import { User } from "./user";

export class Restaurant {
  declare id: number;
  declare name: string;
  declare code: string;
  declare owner: User | null;
  declare employees: User[];
  declare partners: Beach[];
}
