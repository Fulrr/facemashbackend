const Image = require('../models/img');

exports.fetchAll = async (req, res, next) => {
    try {
        const allImages = await Image.fetchAll(); 
        res.status(200).json(allImages); 
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updatePoints = async (req, res, next) => {
    const imageId = req.params.id;
    const newPoints = req.body.points;
  
    try {
      const result = await Image.updatePoints(imageId, newPoints);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Points updated successfully' });
      } else {
        res.status(404).json({ message: 'Image not found' });
      }
    } catch (error) {
      next(error);
    }
  };
  

exports.fetchTopTen = async (req, res, next) => {
    try {
        const topTenImages = await db.execute('SELECT image_id, facemash_id, image_url, points FROM images ORDER BY points DESC LIMIT 10');
        res.status(200).json(topTenImages[0]);
    } catch (error) {
        console.error("Failed to fetch top ten images:", error);
        res.status(500).json({ message: "Failed to fetch top ten images" });
    }
};

exports.fetchTopTenUser = async (req, res, next) => {
    try {
        const allImages = await Image.fetchTopTenUser(); 
        res.status(200).json(allImages); 
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.onlyone = async (req, res, next) => {
    const aid = req.params.aid;
  
    try {
        const allImages = await Image.onlyone(aid); 
        res.status(200).json(allImages); 
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
 };
