import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
import {ListMetaData, ListData} from '../types/lists.types';

const LISTS_DIRECTORY = 'lists';
const LISTS_INDEX_FILE = 'index.json';

const initStorage = async (): Promise<void> => {
    try {
        await Filesystem.readFile({
            path: `${LISTS_DIRECTORY}/${LISTS_INDEX_FILE}`,
            directory: Directory.Data,
        });
        console.log('Found existing index file, not overwriting');
        sessionStorage.setItem('storageInitialized', 'true');
    } catch {
        console.log('Index file not found, initializing storage');
        sessionStorage.removeItem('storageInitialized');

        await Filesystem.mkdir({
            path: LISTS_DIRECTORY,
            directory: Directory.Data,
            recursive: true,
        });

        const response = await fetch(`/lists/${LISTS_INDEX_FILE}`);
        const data = await response.text();

        await Filesystem.writeFile({
            path: `${LISTS_DIRECTORY}/${LISTS_INDEX_FILE}`,
            data,
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
        sessionStorage.setItem('storageInitialized', 'true');
    }
};


export const fetchListsIndex = async (): Promise<ListMetaData[]> => {
    await initStorage();

    try {
        const result = await Filesystem.readFile({
            path: `${LISTS_DIRECTORY}/${LISTS_INDEX_FILE}`,
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
        console.log('fetchListsIndex read:', JSON.parse(result.data as string).lists);
        return JSON.parse(result.data as string).lists;
    } catch (e) {
        console.log("An error occurred while fetching lists:", e);
        return [];
    }
}


export const fetchList = async (fileName: string): Promise<ListData | null> => {
    try {
        const result = await Filesystem.readFile({
            path: `${LISTS_DIRECTORY}/${fileName}`,
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
        return JSON.parse(result.data as string) as ListData;
    } catch {
        try {
            const response = await fetch(`/lists/${fileName}`);
            const data = await response.text();

            await Filesystem.writeFile({
                path: `${LISTS_DIRECTORY}/${fileName}`,
                data,
                directory: Directory.Data,
                encoding: Encoding.UTF8
            });

            return JSON.parse(data) as ListData;
        } catch (e) {
            console.log(`An error occurred while fetching list from '${fileName}':`, e);
            return null;
        }
    }
}


export const createList = async (name: string): Promise<void> => {
    const fileName = `${name.replace(/\s+/g, '_').toLowerCase()}.json`;
    const newList: ListData = {
        name,
        items: []
    };

    await Filesystem.writeFile({
        path: `${LISTS_DIRECTORY}/${fileName}`,
        data: JSON.stringify(newList, null, 2),
        directory: Directory.Data,
        encoding: Encoding.UTF8
    });
    console.log('Created new list file:', fileName);

    const result = await Filesystem.readFile({
        path: `${LISTS_DIRECTORY}/${LISTS_INDEX_FILE}`,
        directory: Directory.Data,
        encoding: Encoding.UTF8
    });
    const listsIndex: ListMetaData[] = JSON.parse(result.data as string).lists;
    console.log('Current index before update:', listsIndex);

    if (!listsIndex.find(l => l.fileName === fileName)) {
        listsIndex.push({name, fileName});
        console.log('Updated index:', listsIndex);

        await Filesystem.writeFile({
            path: `${LISTS_DIRECTORY}/${LISTS_INDEX_FILE}`,
            data: JSON.stringify({lists: listsIndex}, null, 2),
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
        console.log('Index file written successfully');
    } else {
        console.log('List already exists in index');
    }
}


export const updateList = async (fileName: string, list: ListData): Promise<void> => {
    await Filesystem.writeFile({
        path: `${LISTS_DIRECTORY}/${fileName}`,
        data: JSON.stringify(list),
        directory: Directory.Data,
        encoding: Encoding.UTF8
    })
}

export const deleteList = async (fileName: string): Promise<void> => {
    await Filesystem.deleteFile({
        path: `${LISTS_DIRECTORY}/${fileName}`,
        directory: Directory.Data
    });

    const result = await Filesystem.readFile({
        path: `${LISTS_DIRECTORY}/${LISTS_INDEX_FILE}`,
        directory: Directory.Data,
        encoding: Encoding.UTF8
    });
    const listsIndex: ListMetaData[] = JSON.parse(result.data as string).lists;

    const updatedIndex = listsIndex.filter(list => list.fileName !== fileName);

    await Filesystem.writeFile({
        path: `${LISTS_DIRECTORY}/${LISTS_INDEX_FILE}`,
        data: JSON.stringify({lists: updatedIndex}, null, 2),
        directory: Directory.Data,
        encoding: Encoding.UTF8
    });
}
