const service = require("../service");

const get = async (_, res, next) => {
  try {
    const contacts = await service.listContacts();
    return res.json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await service.getContactById(contactId);
    if (result) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    const result = await service.createContact({ name, email, phone });

    return res.status(201).json({
      status: "success",
      code: 201,
      data: { contact: result },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await service.removeContact(contactId);
    if (result) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact: result },
        message: "Contact removed. File saved with updated contacts list",
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  if (name === undefined || email === undefined || phone === undefined) {
    res.status(400).json({ message: "missing required name - field" });
    return;
  }

  try {
    const contacts = await service.getContactById(contactId);

    if (contacts) {
      await service.updateContact(contactId, {
        name,
        email,
        phone,
      });
      return res.json({
        status: "success",
        code: 200,
        data: { name, email, phone },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const favouriteStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: "Missing field favorite" });
  }
  try {
    const contacts = await service.getContactById(contactId);

    if (contacts) {
      await service.updateStatusContact(contactId, favorite);
      return res.json({
        status: "success",
        code: 200,
        data: { favorite },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  get,
  getById,
  remove,
  create,
  update,
  favouriteStatus,
};
