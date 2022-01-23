export class User {
    declare id: number;
    declare firstname: string;
    declare lastname: string;
    declare email: string;
    declare isAdmin: boolean;
    declare restaurantOwnerId: number | null;
    declare restaurantEmployeeId: number | null;
    declare beachOwnerId: number | null;
    declare beachEmployeeId: number | null;
}
