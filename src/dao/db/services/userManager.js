import UserDto from "../dto/user.js";

class UserManager {
    getUser(user) {
        const { id, name, email, age, role, cart } = user;
        return new UserDto(id, name, email, age, role, cart);
    }   
}

export default UserManager;