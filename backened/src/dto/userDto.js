export class UserDTO {
    constructor(user){
        this.id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.mobile = user.mobile
        this.role = user.role
        if(user.rollNumber){
        this.rollNumber = user.rollNumber
        }
    }
}
