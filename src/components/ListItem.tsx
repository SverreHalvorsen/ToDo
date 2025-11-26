// @flow
import * as React from 'react';
import './ListItem.css';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

type Props = {
    id: string;
    text: string;
    complete: boolean;
    onCompleteToggle: () => void;
    onDelete: () => void;
};
export const ListItem = (props: Props) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="list-item-container">
            <label className="checkmark-text-container">
                <input type="checkbox" checked={props.complete} onChange={props.onCompleteToggle}/>
                <p>{props.text}</p>
            </label>
            <button onClick={props.onDelete} className="delete-button">X</button>
        </div>
    );
};