const { formatter } = require("../error.js");
const connectionModel = require("../models/rtc.js");

const addOrUpdateOffer = async ({ sender, reciever, offer }) => {
  let model = await connectionModel.findOne({
    $or: [
      { $and: [{ callerEmail: sender }, { answererEmail: reciever }] },
      { $and: [{ callerEmail: reciever }, { answererEmail: sender }] },
    ],
  });

  console.log("model is empty", model);
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
  console.log("model here", JSON.stringify(model.toObject()));
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

const removeOffer = async ({ sender, reciever }) => {
  await connectionModel.findOneAndDelete({
    $or: [
      { $and: [{ callerEmail: sender }, { answererEmail: reciever }] },
      { $and: [{ callerEmail: reciever }, { answererEmail: sender }] },
    ],
  });
};

module.exports = {
  addOrUpdateOffer,
  addOrUpdateCandidate,
  removeOffer,
};
