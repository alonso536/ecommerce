class UserDto {
    constructor(id, name, email, age, role, cart) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.role = role;
        this.cart = cart;
        this.isAdmin = false;
        this.isPremium = false;
        this.isUser = false;

        if(role == "ROLE_ADMIN") {
            this.isAdmin = true;
        }

        if(role == "ROLE_PREMIUM") {
            this.isPremium = true;
        }

        if(role == "ROLE_USER") {
            this.isUser = true;
        }
    }
}

export default UserDto;