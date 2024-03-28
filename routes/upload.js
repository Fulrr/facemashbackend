const express = require("express");
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage'); 
const multer = require('multer');

const config = require("../config/firebase");

const router = express.Router();

initializeApp(config.firebaseConfig); 

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("filename"), async (req, res) => { 
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded' });
        }

        const storageRef = ref(storage, `files/${req.file.originalname}`); 

        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const downloadURL = await getDownloadURL(snapshot.ref); 

        console.log('File uploaded successfully');

        return res.send({
            message: 'File uploaded to Firebase', 
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL 
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).send({ error: 'Error uploading file' });
    }
});

module.exports = router;
