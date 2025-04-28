import fs from "fs";

const storage = {
    get: (key) => {
        const fileContent = fs.readFileSync("./db.json", "utf-8");
        const db = JSON.parse(fileContent);
        console.log("db (get)", db[key]);
        return db[key];
    },
    set: (key, value) => {
        const fileContent = fs.readFileSync("./db.json", "utf-8");
        const db = JSON.parse(fileContent);
        db[key] = value;
        const addedDb = JSON.stringify(db, null, 2);
        fs.writeFileSync("./db.json", addedDb, "utf-8");
    },
    delete: (key) => {
        const fileContent = fs.readFileSync("./db.json", "utf-8");
        const db = JSON.parse(fileContent);
        delete db[key];
        const deleteDb = JSON.stringify(db, null, 2);
        fs.writeFileSync("./db.json", deleteDb, "utf-8");
    },
    clearAll: () => {
        fs.writeFileSync("./db.json", JSON.stringify({}, null, 2), "utf-8");
    }
};

export default storage;
