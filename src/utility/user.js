let users = []
const addUser = ({ id, username, room }) => {

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    //name and room are reauired
    if (!(username || room)) {
        return {
            error: 'user name and room are required'
        }
    }

    //if username already exist

    const isUserNameExist = users.find((user, val) => {
        return user.username === username && user.room === room;
    })

    if (isUserNameExist) {
        return {
            error: 'User is already exist in the chat room'
        }
    }

    //store user

    let user = { id, username, room };
    users.push(user);

    return { user };
};

//remove user

const removeUser = (id) => {
    //find user
    const isMatch = users.findIndex((user) => user.id === id);

    if (isMatch !== -1) {
        return users.splice(isMatch, 1)[0]
    }
}


//get user 
const getUser = (id) => {
    return users.find(user => {
        return user.id === id
    })
}


//get users inside room
const getRoomUser = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

// let l = addUser({ id: 1, username: 'dharmadurai', room: 'myroom' })
// let m = addUser({ id: 2, username: 'dharmaiurai', room: 'myroom' })

// let n = addUser({ id: 2, username: 'dharmaduri', room: 'myroom' })

// console.log(add)
// let rem = removeUser(1);

// let user = getRoomUser('myroom')
// console.log(user)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getRoomUser
}