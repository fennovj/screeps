const constructionSite = {

    create_close: function(structure, structure_type=STRUCTURE_EXTENSION, nearby=5) {
        // (attempt to) Create a constructionSite nearby another structure
        // The structure must have `.pos` and `.room` attributes
        // Return true if succesful, false if not

        let errCode = -7;
        let timeoutCounter = 0;

        // It tries every single tick to create a new one (usually gives -14, so we just exit then)
        while (errCode == -7 && timeoutCounter < 100) {
            // -7 means invalid target, so we try again
            const newX = structure.pos.x + Math.floor(Math.random() * (2*nearby+1) - nearby);
            const newY = structure.pos.y + Math.floor(Math.random() * (2*nearby+1) - nearby);
            errCode = structure.room.createConstructionSite(newX, newY, structure_type);
            timeoutCounter += 1;
        }

        return errCode == 0;
    },

};

module.exports = constructionSite;
