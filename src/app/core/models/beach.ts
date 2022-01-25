import { Restaurant } from "./restaurant";
import { User } from "./user";

export class Beach {
  declare id: number;
  declare name: string;
  declare code: string;
  declare owner: User | null;
  declare employees: User[];
  declare partners: Restaurant[];
}
