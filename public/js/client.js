let socket = io();
let $message = document.querySelector('#message');
let $sideBar = document.querySelector('#sidebar');
let disable = document.querySelector("#btn");

//template 
let messageTemplate = document.querySelector('#message-template').innerHTML;
let locationTemplate = document.querySelector('#location-template').innerHTML;
let userList = document.querySelector('#roomUsers-template').innerHTML;
//option
let { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
    //auto scrolling
const autoScrolling = () => {

        const $newMessage = $message.lastElementChild;
        const newMessageStyle = getComputedStyle($newMessage);
        const newMessageMargin = parseInt(newMessageStyle.marginBottom);
        const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

        //visible height
        const visibleHeight = $message.offsetHeight;

        //container height
        const containerHeight = $message.scrollHeight;

        //scroll offset
        const scrollOffset = $message.scrollTop + visibleHeight;
        if (containerHeight - newMessageHeight <= scrollOffset) {
            $message.scrollTop = $message.scrollHeight;
        }


    }
    //msg template

socket.on('server msg', (message) => {
    let html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $message.insertAdjacentHTML('beforeend', html);
    autoScrolling()
})

//location temp
socket.on('Locationurl', (url) => {
    console.log(url)
    let html = Mustache.render(locationTemplate, { username: url.username, url: url.text, createdAt: moment(url.createdAt).format('h:mm a') });

    $message.insertAdjacentHTML('beforeend', html)
    autoScrolling()
})

//room user template 
socket.on('roomData', ({ room, users }) => {
    let html = Mustache.render(userList, { room, users });
    $sideBar.innerHTML = html;
})

//sen message
document.getElementById('form').addEventListener('submit', (e) => {

    e.preventDefault();
    let message = e.target.elements.message.value;

    disable.setAttribute('disabled', 'disabled')
    socket.emit('client msg', message, () => {

        disable.removeAttribute('disabled')
        e.target.elements.message.value = '';
        e.target.elements.message.focus();

    })
})

//send location
let locationSend = document.getElementById('sendLocation');
locationSend.addEventListener('click', () => {
    locationSend.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((postion) => {
        socket.emit('sendLocation', {
            latitude: postion.coords.latitude,
            longitude: postion.coords.longitude
        }, () => {
            locationSend.removeAttribute('disabled')
        })
    })
})

//send username and room name
socket.emit('join', { username, room }, (error) => {

    if (error) {
        alert('error');
        location.href = '/'
    }
})

socket.on('server msg', (msg) => console.log(msg));