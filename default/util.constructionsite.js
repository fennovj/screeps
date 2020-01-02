const constructionSite = {

    /**
     * (attempt to) Create a constructionSite nearby a roomObject
     * Return true if succesful, false if not
     * @param {RoomObject} structure The RoomObject to try to build nearby
     * @param {String} structure_type The type of constructionSite to build
     * @param {Int} nearby The radius of the square around the object to try to build
     * @return {Boolean} If the construction succeeded or not
     */
    create_close: function(structure, structure_type=STRUCTURE_EXTENSION, nearby=5) {
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
