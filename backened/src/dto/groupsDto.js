import { UserDTO } from "./userDto.js";

export class GroupsDTO {
    constructor(group){
        this.id = group._id;
        this.name = group.name;
        this.description = group.description;
        this.owner = new UserDTO(group.owner);
        this.studentsList = group.studentsList
    }
}