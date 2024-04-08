const { formatter } = require("../error");
const { parsetoken } = require("../utils/parseToken");
const parseCookie = require("../utils/parseCookie");
const {
  addOrUpdateOffer,
  addOrUpdateCandidate,
} = require("../controllers/rtc.js");

// {
//   callerEmail: "",
//   answererEmail: "",
//   callerSdpOffer: "",
//   answererSdpOffer: "",
//   callerIceCandidates: "",
//   answererIceCandidates: "",
// }

const handleConnection = (socket, onlineUsers) => {
  socket.on("add-offer", async ({ sender, reciever, offer }) => {
    try {
      // const token = parseCookie(socket.request);
      // const sender = parsetoken(token);
      const callerOffer = await addOrUpdateOffer({
        sender,
        reciever,
        offer,
      });
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("recieve-offer", callerOffer);
    } catch (error) {
      console.log("error", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("add-ice-candidate", async ({ sender, reciever, iceCandidate }) => {
    try {
      // const token = parseCookie(socket.request);
      // const sender = parsetoken(token);
      const offer = await addOrUpdateCandidate({
        sender,
        reciever,
        iceCandidate,
      });
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("recieve-offer", offer);
    } catch (error) {
      console.log("error in comple", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });
};

module.exports = { handleConnection };
