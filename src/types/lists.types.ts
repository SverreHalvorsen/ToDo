export interface ListElement {
    id: string;
    task: string;
    completed: boolean;
}

export interface ListData {
    name: string;
    items: ListElement[];
}

export interface ListMetaData {
    name: string;
    fileName: string;
}