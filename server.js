var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path');

var port = 8080;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

var menu = [
    { item: 'Burger', price: 5 },
    { item: 'Cola', price: 2 },
    { item: 'Fries', price: 3 },
    { item: 'Nuggets', price: 4 }
];

io.on('connection', function (socket) {
    console.log('user connected to socket');

    socket.emit('menu', menu);

    socket.on('order', function (data) {
        const { item, quantity } = data;
        let selectedItem = null;

        for (let i = 0; i < menu.length; i++) {
            if (menu[i].item.toLowerCase() === item.toLowerCase()) {
                selectedItem = menu[i];
                break;  
            }
        }


        if (selectedItem) {
            const total = selectedItem.price * quantity;
            console.log(`Client ordered ${quantity} x ${selectedItem.item} for a total of $${total}`);
            socket.emit('orderConfirmation', `You ordered ${quantity} x ${selectedItem.item}. Total: $${total}`);
        } else {
            socket.emit('orderError', 'Item not found in the menu.');
        }
    });
});

server.listen(port, function () {
    console.log('app running on port ' + port);
});
