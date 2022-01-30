import { Beach } from "./beach";
import { Product } from "./product";
import { User } from "./user";

export class Order {
  declare id: number;
  declare note: string;
  declare active: boolean;
  declare userId: number;
  declare beachId: number;
  declare createdAt: string;
  timeElapsed: string = "";
  declare user: User;
  declare beach: Beach;
  declare contains: (Product & { details: { ready: boolean, sent : boolean, quantity: number } })[];
}
