const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
app.use(cors());

const io = require("socket.io")(server, {
	cors: {
		origin: "https://video-meeting-client-ivv6.vercel.app/",
		methods: [ "GET", "POST" ]
	}
});


const PORT = process.env.PORT || 5000;

app.get('/',cors(), (req, res) => {
	res.send('Runnings');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		console.log('test1',from);
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		console.log('test3', data.signal)
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
