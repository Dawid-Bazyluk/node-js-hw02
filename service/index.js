const Contact = require("./schemas/contact");

const listContacts = async () => {
  return Contact.find();
};

const getContactById = async (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const removeContact = (contactId) => {
  return Contact.findOneAndDelete({ _id: contactId });
};

const createContact = async ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};

const updateContact = async (contactId, body) => {
  await Contact.findByIdAndUpdate({ _id: contactId }, body);
};

const updateStatusContact = async (contactId, favorite) => {
  await Contact.updateOne({ _id: contactId }, { favorite: favorite });
};

module.exports = {
  createContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
  updateStatusContact,
};
