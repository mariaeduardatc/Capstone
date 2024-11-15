import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiResponse, State } from '../../types/types';
import { DragDropContext, Droppable, Draggable, DraggableLocation } from "react-beautiful-dnd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from "lodash";
import './ResultPage.css'
import { AuthenticatedUserContext, LoadingContext } from '../App/App';
import APIClient from '../../api/client';

function Result() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthenticatedUserContext)
    const { setIsLoading } = useContext(LoadingContext);

    const itinerary = typeof location.state.response === 'string'
        ? JSON.parse(location.state.response)
        : location.state.response
    const destinationCity = location.state && location.state.city;
    const numberDays = location.state && location.state.days;
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

    const handleMapsDirections = async (dayKey: string) => {
        const places = state[dayKey].places.map((place) => place.name);

        if (places.length < 2) {
            toast.error("At least two places are required to generate directions.");
            return;
        }

        navigate('/routeDirections', { state: { places: places, destinationCity: destinationCity } })
    };
    async function postAPICall(prompt: object): Promise<ApiResponse> {
        const apiClient = new APIClient();
        const apiRoute = '/itinerary/saveItinerary';
        const response = await apiClient.post(apiRoute, prompt, {});
        return response;
    }

    const handleSaveIntinerary = async (isAuthenticated: any) => {
        const userId = isAuthenticated.id;

        // post itinerary to database
        try {
            const input = {
                user_id: userId,
                saved_itinerary: itinerary,
                number_of_days: numberDays,
                city_name: destinationCity,
            }

            console.log(input)

            const itineraryCall = await postAPICall(input);

            if (itineraryCall?.status === 200) {
                setIsLoading(false);
                navigate("/userpage");
            }
            console.log('Itinerary posted');
        } catch {
            console.log('Error posting itinerary');
        }

    }

    const saveBody = isAuthenticated === null ? (
        <>
            <button>
                <Link to='/login'>
                    Login to save your itinerary
                </Link>
            </button>
        </>
    ) : (
        <button onClick={() => handleSaveIntinerary(isAuthenticated)}>
                Save Itinerary
        </button>
    )

    return (
        <div className='resultPage'>
            <header className='background'>
                <h1>Here is your itinerary, to {destinationCity}</h1>
            </header>

            <ToastContainer position="top-right" autoClose={6000} hideProgressBar={false} />

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
                                                const draggableId = el.id != null ? el.id.toString() : index.toString();
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
                                <button onClick={() => handleMapsDirections(key)}>Generate directions</button>
                            </div>
                        ))}
                    </DragDropContext>
                </div>
            )}
            {saveBody}
        </div>
    );
}

export default Result;
