import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiResponse, State, ImageData, ApiResponseImg } from '../../types/types';
import { DragDropContext, Droppable, Draggable, DraggableLocation } from "react-beautiful-dnd";
import { ToastContainer, toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import _ from "lodash";
import './ResultPage.css'
import { AuthenticatedUserContext } from '../App/App';
import APIClient from '../../api/client';

function Result() {
    useEffect(() => {
        fetchData(state);
    }, []);

    useEffect(() => {
        fetchDataImg(state);
    }, []);

    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthenticatedUserContext);
    // const { setIsLoading } = useContext(LoadingContext);
    const [isLoading, setIsLoading] = useState(false);

    const itinerary = typeof location.state.response === 'string'
        ? JSON.parse(location.state.response)
        : location.state.response;
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

    const [addingPlace, setAddingPlace] = useState<{ [key: string]: boolean }>({});
    const [newPlaceName, setNewPlaceName] = useState<string>("");
    const [images, setImages] = useState<{ [key: string]: ImageData[] }>({});
    const [imageURL, setImageURL] = useState<ImageData[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        summary: '',
        bestTime: '',
        visitDuration: ''
    });

    async function postAPICall(prompt: object): Promise<ApiResponse> {
        const apiClient = new APIClient();
        const apiRoute = '/api/summary';
        const response = await apiClient.post(apiRoute, prompt, {});
        return response;
    }

    async function getAPICallImg(city: object): Promise<ApiResponseImg> {
        const apiClient = new APIClient();
        const apiRoute = '/api/image';
        const response = await apiClient.post(apiRoute, city, {});
        return response;
    }

    async function fetchData(state: State) {
        try {
            const promises = _.flatMap(state, (data) => {
                return data.places.map(async (el) => {
                    const resImg = await getAPICallImg({ city: el.name });
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

    async function postAPICallItinerary(prompt: object, route: string = '/itinerary/saveItinerary'): Promise<ApiResponse> {
        const apiClient = new APIClient();
        const response = await apiClient.post(route, prompt, {});
        return response;
    }

    async function fetchDataImg(state: State) {
        try {
            const promises = _.flatMap(state, (data) => {
                return data.places.map(async (el) => {
                    const resImg = await getAPICallImg({ city: el.name });
                    return { [el.name]: resImg?.body.results };
                });
            });

            const results = await Promise.all(promises);
            const updatedImages = results.reduce((acc, curr) => {
                return { ...acc, ...curr };
            }, {});

            setImages((prevImages) => ({ ...prevImages, ...updatedImages }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleDelete = (dayKey: string, index: number) => {
        setState(prev => {
            const newState = { ...prev };
            newState[dayKey].places.splice(index, 1);
            return newState;
        });
        toast.success("Place removed from itinerary");
    };

    const handleStartAddPlace = (dayKey: string) => {
        setAddingPlace(prev => ({ ...prev, [dayKey]: true }));
        setNewPlaceName("");
    };

    const handleAddPlace = (dayKey: string) => {
        if (newPlaceName.trim()) {
            setState(prev => {
                const newState = { ...prev };
                newState[dayKey].places.push({
                    name: newPlaceName.trim(),
                    id: Date.now(),
                    description: ''
                });
                return newState;
            });
            setAddingPlace(prev => ({ ...prev, [dayKey]: false }));
            toast.success("New place added to itinerary");
        }
    };

    const handleDragEnd = ({ destination, source }: { destination: any, source: DraggableLocation }) => {
        if (!destination) return;
        if (destination.index === source.index && destination.droppableId === source.droppableId) return;

        const itemCopy = { ...state[source.droppableId].places[source.index] };
        setState(prev => {
            prev = { ...prev };
            prev[source.droppableId].places.splice(source.index, 1);
            prev[destination.droppableId].places.splice(destination.index, 0, itemCopy);
            return prev;
        });
    };

    const handleMapsDirections = async (dayKey: string) => {
        const places = state[dayKey].places.map((place) => place.name);

        if (places.length < 2) {
            toast.error("At least two places are required to generate directions.");
            return;
        }

        navigate('/routeDirections', { state: { places: places, destinationCity: destinationCity } });
    };

    const handleExtraInfo = async (placeName: string) => {
        setIsModalOpen(true);  // Open the modal first
        setIsLoading(true);    // Show loading spinner
        try {
            const req = { placeName };
            const res = await postAPICall(req);

            if (res?.body) {
                const { summary, visitDurationOutput, bestTimeOutput } = res.body as {
                    summary: string;
                    visitDurationOutput: string;
                    bestTimeOutput: string;
                };

                setModalContent({
                    summary: summary,
                    bestTime: bestTimeOutput,
                    visitDuration: visitDurationOutput
                });
            }
        } catch (error) {
            console.error('Error fetching extra info:', error);
        } finally {
            setIsLoading(false);  // Hide spinner and show content
        }
    };


    const handleSaveIntinerary = async (isAuthenticated: any) => {
        const userId = isAuthenticated.id;
        let cityImageUrl = "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg ";

        try {
            const img = await getAPICallImg({ city: destinationCity });
            cityImageUrl = img.body.results[0].urls.regular;
        } catch {
            console.log('Error getting city image');
        }

        try {
            const input = {
                user_id: userId,
                saved_itinerary: itinerary,
                number_of_days: numberDays,
                city_name: destinationCity,
                image_url: cityImageUrl,
            };

            const itineraryCall = await postAPICallItinerary(input);

            if (itineraryCall?.status === 200) {
                navigate("/userpage");
            }
        } catch {
            console.log('Error posting itinerary');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // setModalContent({});
    };

    const saveBody = isAuthenticated === null ? (
        <button className='dirButton' id='loginButton'>
            <Link to='/login'>
                Login to save your itinerary
            </Link>
        </button>
    ) : (
        <button onClick={() => handleSaveIntinerary(isAuthenticated)} className='dirButton'>
            Save Itinerary
        </button>
    );

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
                                    <div className="header-content">
                                        <h3>{data.title}</h3>
                                        <button onClick={() => handleStartAddPlace(key)} className='smallButton'>
                                            +
                                        </button>
                                    </div>
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

                                                                onClick={() => {
                                                                    handleExtraInfo(el.name);
                                                                    setImageURL(images[el.name]);
                                                                }}

                                                            >
                                                                <h4>{el.name}</h4>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(key, index);
                                                                    }}
                                                                    id='deleteIcon'
                                                                    className='smallButton'
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                {addingPlace[key] && (
                                    <div id='addPlace'>
                                        <input
                                            type="text"
                                            value={newPlaceName}
                                            onChange={(e) => setNewPlaceName(e.target.value)}
                                            placeholder="Enter place name"
                                        />
                                        <div id='buttons'>
                                            <button onClick={() => handleAddPlace(key)}>
                                                Add
                                            </button>
                                            <button onClick={() => setAddingPlace(prev => ({ ...prev, [key]: false }))}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <button onClick={() => handleMapsDirections(key)} className='dirButton'>Generate directions</button>
                            </div>
                        ))}
                    </DragDropContext>
                </div>
            )}

            {saveBody}

            {/* Modal */}
            {isModalOpen && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        {isLoading ? (
                            <div className="loadingSpinner">
                                <div className="spinner"></div>
                                <p>Loading information...</p>
                            </div>
                        ) : (
                            <>
                                <div className='modalImg'>
                                    {imageURL && (<img src={imageURL[0]?.urls.regular} />)}
                                </div>
                                <div className='modalText'>
                                    <p>{modalContent.summary}</p> <br/>
                                    <p><b>What is the best time to visit?</b> {modalContent.bestTime}</p> <br/>
                                    <p><b>How long should you spend here?</b> {modalContent.visitDuration}</p>
                                    <button onClick={closeModal}>Close</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

export default Result;