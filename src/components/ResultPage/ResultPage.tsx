import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DraggableLocation } from "react-beautiful-dnd";
import _ from "lodash";
import './ResultPage.css'

function Result() {
    interface State {
        [key: string]: {
            title: string;
            places: { id: number; name: string; description: string }[];
        };
    }

    const location = useLocation();
    const itinerary = typeof location.state.response === 'string'
        ? JSON.parse(location.state.response)
        : location.state.response
    const destinationCity = location.state && location.state.city;
    const hasResponseData = itinerary && Object.keys(itinerary).length > 0;
    const initialState: State = hasResponseData
        ? Object.entries(itinerary).reduce((acc, [key, value]) => {
            if (key.startsWith('day')) {
                acc[key] = {
                    title: (value as any).title || `Day ${key.slice(3)}`,
                    places: (value as any).places || [],
                };
            }
            return acc;
        }, {} as State)
        : {};

    const [state, setState] = useState<State>(initialState);

    const handleDragEnd = ({ destination, source }: { destination: any, source: DraggableLocation }) => {
        if (!destination) {
            return
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return
        }
        // Creating a copy of item before removing it from state
        const itemCopy = { ...state[source.droppableId].places[source.index] }

        setState(prev => {
            prev = { ...prev }
            // Remove from previous places array
            prev[source.droppableId].places.splice(source.index, 1)
            // Adding to new places array location
            prev[destination.droppableId].places.splice(destination.index, 0, itemCopy)

            return prev
        })
    }

    return (
        <div className='resultPage'>
            <header>
                <h1>Here is your itinerary, to {destinationCity}</h1>
            </header>

            {!hasResponseData ? (
                <div>No itinerary available. Please check back later or try a different destination.</div>
            ) : (
                <div className="resultBlock">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {_.map(state, (data, key) => (
                            <div key={key} className="column">
                                <div className='columnHeader'>
                                    <h3>{data.title}</h3>
                                </div>
                                <Droppable droppableId={key}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="droppableCol"
                                        >
                                            {data.places.map((el, index) => {
                                                console.log(el.id, index)
                                                const draggableId = el.id != null ? el.id.toString() : index.toString();
                                                console.log('dragid', draggableId)
                                                return (
                                                    <Draggable
                                                        key={draggableId}
                                                        index={index}
                                                        draggableId={draggableId}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                className={`item ${snapshot.isDragging && "dragging"}`}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                {el.name}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </DragDropContext>
                </div>
            )}
        </div>
    );
}

export default Result;
