export async function exportIndexedDB() {
    return new Promise((resolve) => {
        const request = indexedDB.open('tt-data');
        request.onsuccess = (e: any) => {
            const db = e.target.result;
            const exportObject: any = {};
            const storeNames = Array.from(db.objectStoreNames);
            if(storeNames.length === 0) resolve({});
            let count = 0;
            storeNames.forEach((storeName: any) => {
                const store = db.transaction(storeName, 'readonly').objectStore(storeName);
                const allReq = store.getAll();
                const keysReq = store.getAllKeys();
                allReq.onsuccess = () => {
                    keysReq.onsuccess = () => {
                        exportObject[storeName] = { keys: keysReq.result, values: allReq.result };
                        count++;
                        if (count === storeNames.length) resolve(exportObject);
                    }
                }
            });
        };
    });
}

export async function importIndexedDB(data: any) {
    const request = indexedDB.open('tt-data', 1);
    request.onsuccess = (e: any) => {
        const db = e.target.result;
        Object.keys(data).forEach(storeName => {
            const store = db.transaction(storeName, 'readwrite').objectStore(storeName);
            data[storeName].keys.forEach((key: any, i: number) => {
                store.put(data[storeName].values[i], key);
            });
        });
        alert('Admin Session Loaded! Webpage will reload.');
        window.location.reload();
    };
}
