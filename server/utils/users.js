
class Users
{
    constructor()
    {
        this.users = [];
    }
    addUser(id,name,room)
    {
        var user = {id,name,room};
        this.users.push(user);
        return user;

    }
    removeUser(id)
    {
        var foundUser = this.getUser(id);
        if(foundUser)
        {
            this.users = this.users.filter( (user)=>{
                return user.id !== id;
            });
        }
        return foundUser;
    }
    getUser(id)
    {
        var foundUser = this.users.filter( (user) =>{
            return user.id === id;
        });
        return foundUser[0];
    }
    getUserList(room)
    {
        var users = this.users.filter( (user)=>{
            return user.room === room;
        });
        var namesArray = users.map( (user)=>{
            return user.name;
        });
        return namesArray;
    }
}

module.exports = {Users};