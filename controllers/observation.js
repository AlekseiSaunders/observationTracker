const cloudinary = require('../middleware/cloudinary');
const Observation = require('../models/Observation');

exports.getObservations = async (req, res) => {
  try {
    const observations = await Observation.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('observations/index', { observations });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
};

exports.addObservation = (req, res) => {
  res.render('observations/add');
};

exports.showSingleObservation = async (req, res) => {
  try {
    let observation = await Observation.findById(req.params.id)
      .populate('user')
      .lean();
    if (!observation) {
      return res.render('error/404');
    }
    res.render('observations/show', { observation });
  } catch (error) {
    console.error(error);
    res.redirect('error/404');
  }
};

exports.processObservation = async (req, res) => {
  console.log(req.file);
  try {
    // upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    await Observation.create({
      title: req.body.title,
      status: req.body.status,
      commonName: req.body.commonName,
      generalTaxa: req.body.generalTaxa,
      genus: req.body.genus,
      species: req.body.species,
      details: req.body.details,
      number: req.body.number,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      accuracy: req.body.accuracy,
      image: result.secure_url,
      cloudinaryId: result.public_id,
      user: req.user.id,
    });
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.redirect('error/500');
  }
};

exports.editObservation = async (req, res) => {
  try {
    let observation = await Observation.findOne({
      _id: req.params.id,
    }).lean();
    if (!observation) {
      res.render('error/404');
    }
    if (observation.user != req.user.id) {
      res.redirect('/observations');
    } else {
      res.render('observations/edit', { observation });
    }
  } catch (error) {
    console.error(error);
    res.redirect('error/500');
  }
};

exports.updateObservation = async (req, res) => {
  try {
    let observation = await Observation.findById(req.params.id).lean();
    if (!observation) {
      res.redirect('error/404');
    }
    if (observation.user != req.user.id) {
      res.redirect('/observations');
    } else {
      observation = await Observation.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.redirect('/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.redirect('error/500');
  }
};

exports.deleteObservation = async (req, res) => {
  try {
    await Observation.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.redirect('error/500');
  }
};

exports.showUserObservations = async (req, res) => {
  try {
    const observations = await Observation.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();
    res.render('observations/index', { observations });
  } catch (error) {
    console.error(error);
    res.redirect('/error/500');
  }
};
