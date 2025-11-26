import {IonAlert, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import './Home.css';
import List from "../components/List";
import {createList, deleteList, fetchListsIndex} from "../services/listService";
import React, {useEffect, useState} from "react";
import {ListMetaData} from "../types/lists.types";

const Home: React.FC = () => {
    const [lists, setLists] = useState<ListMetaData[]>();
    const [selectedList, setSelectedList] = useState<ListMetaData | null>();
    const [showAlert, setShowAlert] = useState<boolean>(false);

    useEffect(() => {
        const loadLists = async () => {
            const fetchedLists = await fetchListsIndex();
            setLists(fetchedLists);
            if (fetchedLists.length > 0) {
                setSelectedList(fetchedLists[0]);
            }
        };
        loadLists();
    }, []);

    const handleCreateNew = () => {
        setShowAlert(true);
    };

    const createNewList = async (listName: string) => {
        await createList(listName);

        const updatedLists = await fetchListsIndex();
        setLists(updatedLists);

        const newList = updatedLists.find(l => l.name === listName);
        if (newList) {
            setSelectedList(newList);
        }

        setShowAlert(false);
    }

    const handleDeleteList = async () => {
        await deleteList(selectedList!.fileName);

        const updatedLists = await fetchListsIndex();
        setLists(updatedLists);
        setSelectedList(updatedLists.length > 0 ? updatedLists[0] : null);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary-tint">
                    <IonTitle>List-App</IonTitle>
                    <IonButton slot="end" onClick={handleCreateNew}>Create New</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className="list-selector">
                    {lists && lists.map((list, index) => (
                        <IonButton
                            key={index}
                            fill={selectedList === list ? 'solid' : 'outline'}
                            size="small"
                            onClick={() => setSelectedList(list)}
                        >
                            {list.name}
                        </IonButton>
                    ))}
                </div>
                {selectedList && (
                    <>
                        <List
                            name={selectedList.name}
                            fileName={selectedList.fileName}
                        />
                        <IonButton onClick={handleDeleteList} size="default" color="danger"
                                   className="delete-button">Delete</IonButton>
                    </>
                )}
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Create New List"
                    inputs={[
                        {
                            name: 'listName',
                            type: 'text',
                            placeholder: 'Enter list name'
                        }
                    ]}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel'
                        },
                        {
                            text: 'Create',
                            handler: (data) => {
                                if (data.listName.trim()) {
                                    createNewList(data.listName);
                                }
                            }
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    )
        ;
};

export default Home;
