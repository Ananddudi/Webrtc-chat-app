const { formatter } = require("../error.js");
const connectionModel = require("../models/rtc.js");

const addOrUpdateOffer = async ({ sender, reciever, offer }) => {
  let model = await connectionModel.findOne({
    $or: [
      { $and: [{ callerEmail: sender }, { answererEmail: reciever }] },
      { $and: [{ callerEmail: reciever }, { answererEmail: sender }] },
    ],
  });

  if (!model) {
    model = await connectionModel.create({
      callerEmail: sender,
      answererEmail: reciever,
    });
  }

  if (model.callerEmail == sender) {
    model.callerSdpOffer = offer;
  } else {
    model.answererSdpOffer = offer;
  }
  model.save();
  return model.toObject();
};

const addOrUpdateCandidate = async ({ sender, reciever, iceCandidate }) => {
  const model = await connectionModel.findOne({
    $or: [
      { $and: [{ callerEmail: sender }, { answererEmail: reciever }] },
      { $and: [{ callerEmail: reciever }, { answererEmail: sender }] },
    ],
  });
  if (model.callerEmail == sender) {
    model.callerIceCandidates.push(iceCandidate);
  } else {
    model.answererIceCandidates.push(iceCandidate);
  }
  model.save();
  return model.toObject();
};

module.exports = {
  addOrUpdateOffer,
  addOrUpdateCandidate,
};
