

const storage = {
    get: async (key) => {

        const response = await fetch(`https://hey.yraytestings.com.ng/api/v2/getchain/${key}`)
        const res = await response.json()
        if (res.chain) {
            return res.chain;
        } else {
            console.log("No such name!");
            return null;
        }
    },

    set: async (key, value) => {

        const form = new FormData();
        form.append('username', key);
        form.append('chain', value);

        const response = await fetch(`https://hey.yraytestings.com.ng/api/v2/saveId`, {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)"
            }
            ,
            body: form,
        })

        const res = await response.text()
        console.log(res);
        if (res.status == "OK") {
            console.log(`db (delete) ${key}`);
        }

    },

    delete: async (key) => {
        const response = await fetch(`https://hey.yraytestings.com.ng/api/v2/deletechain/${key}`)
        const res = await response.json()
        if (res.status == "OK") {
            console.log(`db (delete) ${key}`);
        }
    },
};

export default storage;