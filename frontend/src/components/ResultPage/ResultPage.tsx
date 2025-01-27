import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiResponse, State, ImageData, ApiResponseImg } from '../../types/types';
import { DragDropContext, Droppable, Draggable, DraggableLocation } from "react-beautiful-dnd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from "lodash";
import './ResultPage.css'
import APIClient from '../../api/client';

function Result() {
    useEffect(() => {
        fetchData(state);
    }, []);

    const location = useLocation();
    const navigate = useNavigate();

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
    const [images, setImages] = useState<{ [key: string]: ImageData[] }>({});
    const [imageURL, setImageURL] = useState<ImageData[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");

    async function postAPICall(prompt: object): Promise<ApiResponse> {
        const apiClient = new APIClient();
        const apiRoute = '/api/summary';
        const response = await apiClient.post(apiRoute, prompt, {});
        return response;
    }

    async function getAPICall(city: object): Promise<ApiResponseImg> {
        const apiClient = new APIClient();
        const apiRoute = '/api/image';
        const response = await apiClient.post(apiRoute, city, {});
        return response;
    }

    async function fetchData(state: State) {
        try {
            const promises = _.flatMap(state, (data) => {
                return data.places.map(async (el) => {
                    const resImg = await getAPICall({ city: el.name });
                    console.log("resimage", resImg?.body)
                    return { [el.name]: resImg?.body.results }; // Creating an object with key-value pair
                });
            });

            const results = await Promise.all(promises);


            // Merge the results into the images dic
            const updatedImages = results.reduce((acc, curr) => {
                return { ...acc, ...curr };
            }, {});

            // Update the images state with the new data
            setImages((prevImages) => ({ ...prevImages, ...updatedImages }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


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

    const handleExtraInfo = async (placeName: string) => {
        const req = { placeName };
        const res = await postAPICall(req);

        if (res?.body) {
            const completionResponse = (res.body as { completionResponse: string }).completionResponse;
            setModalContent(completionResponse); // Set modal content
            setIsModalOpen(true); // Show the modal
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent("");
    };

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
                                                                onClick={() => {handleExtraInfo(el.name), setImageURL(images[el.name])}}
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
            {/* Modal */}
            {isModalOpen && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <div className='modalImg'>
                            {imageURL && (<img src={imageURL[0] ?.urls.regular}/>)}
                        </div>
                        <div className='modalText'>
                            <p>{modalContent}</p>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Result;
