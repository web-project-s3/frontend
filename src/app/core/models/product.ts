import { Beach } from "./beach";
import { Restaurant } from "./restaurant";
import { User } from "./user";

export class Product {
  declare id: number;
  declare name: string;
  declare imageUrl: string;
  declare restaurantId: number;
  declare restaurant: Restaurant;
  declare beaches: Beach[];
}
