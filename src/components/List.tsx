import React, {useEffect} from "react";
import {ListItem} from "./ListItem";
import './List.css';
import {fetchList, updateList} from "../services/listService";
import {ListElement} from "../types/lists.types";
import {IonButton, IonInput} from "@ionic/react";
import {DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent} from '@dnd-kit/core';
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';


interface ListProps {
    name: string;
    fileName: string;
}

const List = (props: ListProps) => {
    const [input, setInput] = React.useState<string>('');
    const [items, setItems] = React.useState<ListElement[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    useEffect(() => {
        const loadList = async () => {
            const list = await fetchList(props.fileName);
            if (list) {
                sortAndUpdateItems(list.items);
            }
            console.log(list);
        }
        loadList();
    }, [props.fileName]);

    const sortAndUpdateItems = (newItems: ListElement[]) => {
        const sortedItems = [...newItems].sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);
        setItems(sortedItems);
        updateList(props.fileName, {name: props.name, items: sortedItems});
    }


    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);

            const isCompleted = items[oldIndex].completed;
            const groupStart = items.findIndex(item => item.completed === isCompleted);
            const groupEnd = items.length - 1 - [...items].reverse().findIndex(item => item.completed === isCompleted);

            const clampedIndex = Math.max(groupStart, Math.min(newIndex, groupEnd));

            if (oldIndex !== clampedIndex) {
                const newItems = arrayMove(items, oldIndex, clampedIndex);
                setItems(newItems);
                updateList(props.fileName, {name: props.name, items: newItems});
            }
        }
    }

    const handleAddItem = () => {
        const value = input.trim();
        if (value) {
            const newItems = [...items, {id: crypto.randomUUID(), task: value, completed: false}];
            sortAndUpdateItems(newItems);
            setInput('');
        }
    }

    const handleCompleteToggle = (index: number) => {
        const newItems = [...items];
        newItems[index].completed = !newItems[index].completed;
        sortAndUpdateItems(newItems);
    }

    const handleDeleteItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index)
        setItems(newItems);
        updateList(props.fileName, {name: props.name, items: newItems});
    }
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddItem();
        }
    }
    return (
        <div className="list-container">
            <h1 className="title">{props.name}</h1>
            <div className="input-container">
                <IonInput
                    placeholder="Enter new list item"
                    value={input}
                    onIonInput={(e) => setInput(e.detail.value!)}
                    onKeyPress={handleKeyPress}
                />
                <IonButton onClick={handleAddItem} size="default">Add Item</IonButton>

            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    <ul>
                        {items.map((item) => (
                            <ListItem
                                key={item.id}
                                id={item.id}
                                text={item.task}
                                complete={item.completed}
                                onCompleteToggle={() => handleCompleteToggle(items.findIndex(i => i.id === item.id))}
                                onDelete={() => handleDeleteItem(items.findIndex(i => i.id === item.id))}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default List;
