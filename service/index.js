const Contact = require("../schemas/contact.schema");
const User = require("../schemas/users.schema");

const listContacts = async (owner) => {
  return Contact.find({ owner });
};

const getContactById = async (contactId, owner) => {
  return Contact.findOne({ _id: contactId, owner });
};

const removeContact = (contactId, owner) => {
  return Contact.findOneAndDelete({ _id: contactId, owner });
};

const createContact = async ({ name, email, phone }, owner) => {
  return Contact.create({ name, email, phone, owner });
};

const updateContact = async (contactId, body, owner) => {
  await Contact.findByIdAndUpdate({ _id: contactId, owner }, body);
};

const updateStatusContact = async (contactId, favorite, owner) => {
  await Contact.updateOne({ _id: contactId, owner }, { favorite: favorite });
};

const getFavoriteContacts = (owner, favorite) => {
  return Contact.find({ owner, favorite });
};

const getUser = (email) => {
  return User.findOne({ email });
};

const createtUser = (email, password) => {
  return User.create({ email, password });
};

const updateSubscription = (subscription, owner) => {
  return User.findByIdAndUpdate({ _id: owner }, { subscription: subscription });
};

const updateAvatar = (avatarURL, owner) => {
  return User.findByIdAndUpdate({ _id: owner }, { $set: { avatarURL } });
};

module.exports = {
  createContact,
  createtUser,
  getContactById,
  getFavoriteContacts,
  getUser,
  listContacts,
  removeContact,
  updateContact,
  updateStatusContact,
  updateSubscription,
  updateAvatar,
};
