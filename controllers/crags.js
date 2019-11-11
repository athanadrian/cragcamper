//@desc         Get all Crags
//@route        GET /api/v1/Crags
//@access       Public
exports.getCrags = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Get all Crags.' });
};

//@desc         Get single Crag
//@route        GET /api/v1/Crags/:id
//@access       Public
exports.getCrag = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Get Crag ${req.params.id}` });
};

//@desc         Create a Crag
//@route        POST /api/v1/Crags
//@access       Private
exports.createCrag = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create a Crag' });
};

//@desc         Update Crag
//@route        PUT /api/v1/Crags/:id
//@access       Private
exports.updateCrag = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update Crag ${req.params.id}` });
};

//@desc         Delete a Crag
//@route        GET /api/v1/Crags/:id
//@access       Private
exports.deleteCrag = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete Crag ${req.params.id}` });
};
