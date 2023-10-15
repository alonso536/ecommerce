class UserDto {
    constructor(id, name, email, age, role, cart) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.role = role;
        this.cart = cart;
        this.isAdmin = false;

        if(role == "ROLE_ADMIN") {
            this.isAdmin = true;
        }
    }
}

export default UserDto;