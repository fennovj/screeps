const constructionSite = {

    create_close: function(spawner, structure_type=STRUCTURE_EXTENSION, nearby=5) {
        // (attempt to) Create a structure nearby another structure
        // Return true if succesful, false if not
        const x = spawner.pos.x;
        const y = spawner.pos.y;

        let errCode = -7;
        const room = spawner.room;

        let timeoutCounter = 0;

        // It tries every single tick to create a new one (usually gives -14, so we just exit then)
        while (errCode == -7 && timeoutCounter < 100) {
            // -7 means invalid target, so we try again
            const newX = x + Math.floor(Math.random() * (2*nearby+1) - nearby);
            const newY = y + Math.floor(Math.random() * (2*nearby+1) - nearby);
            errCode = room.createConstructionSite(newX, newY, structure_type);
            // console.log("Attempting " + structure_type + " at " + newX + ", " +
            //             newY + ", code ", err_code, ", counter " + timeout_counter);
            timeoutCounter += 1;
        }

        return errCode == 0;
    },

};

module.exports = constructionSite;
