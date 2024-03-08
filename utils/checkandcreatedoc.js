const checkandcreatedoc = async (Modal, data) => {
  let [outputDoc] = await Modal.find(data).lean()
  if (!outputDoc) {
    outputDoc = await Modal.create(data);
  }
  return outputDoc;
};
module.exports = checkandcreatedoc;
