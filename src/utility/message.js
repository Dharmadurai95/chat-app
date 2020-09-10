function addMessageToTime(username, text) {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    addMessageToTime
}