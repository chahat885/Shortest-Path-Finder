import React, { useState } from 'react';
import './App.css';
import Routes from './routes'; // assuming you still have this component
import WelcomePage from './component/Welcome'; // assuming you still have this component

// Nodes array for the dropdown menus
const nodes = [
    { id: 1, name: "cse" },
    { id: 3, name: "AI & IT Dept." },
    { id: 4, name: "LHC C" },
    { id: 6, name: "Sbi Gate" },
    { id: 2, name: "main gate" },
    { id: 5, name: "Centre main gate" },
    { id: 7, name: "Beach" },
    { id: 8, name: "LHC D" },
    // Add other nodes here as needed
    
];

const App = () => {
    // State to hold the selected source and destination IDs
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');

    const [data, setData] = useState(null); // Initialize data as null instead of empty array
    const [display, setDisplay] = useState(false);

    const onsubmitHandler = async (e) => {
        e.preventDefault();
        
        // Reset data and display state on new submission
        setData(null);
        setDisplay(false);
        
        // Use the state variables for source and destination, which hold the integer IDs
        const a = source;
        const b = destination;
        
        try {
            const response = await fetch(`http://localhost:5000/shortd/${a}/${b}`);
            const jsonData = await response.json();
            
            // Check if the response is valid before setting the state
            if (response.ok && jsonData) {
                setData(jsonData);
                setDisplay(true);
            } else {
                console.error('Error fetching data:', jsonData.error || response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='mainContainer'>
            <div className='projectHeader'>Shortest-Path-Finder</div>

            <div className='Maps'>
                <div className='nitk'></div>
                <div className='outMap'></div>
            </div>

            <div className='formInput'>
                <form method='post' onSubmit={onsubmitHandler} className='formGroup'>
                    <div className='sourceForm'>
                        {/* Use htmlFor instead of for for React labels */}
                        <label htmlFor='source'>Source</label>
                        {/* Use a select dropdown instead of an input field */}
                        <select
                            id='source'
                            name='a'
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className='sourceInput'
                            required
                        >
                            <option value="">Source</option>
                            {nodes.map(node => (
                                <option key={node.id} value={node.id}>{node.id} - {node.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='destinationForm'>
                        {/* Use htmlFor instead of for for React labels */}
                        <label htmlFor='destination'>Destination</label>
                        {/* Use a select dropdown instead of an input field */}
                        <select
                            id='destination'
                            name='b'
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className='destinationInput'
                            required
                        >
                            <option value="">Destination</option>
                            {nodes.map(node => (
                                <option key={node.id} value={node.id}>{node.id} - {node.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type='submit' className='formButton'>Submit</button>
                </form>
            </div>

            <div className='projectDisplay'>
                {/* Ensure data and data.path exist before rendering Routes */}
                {display && data && data.path && <Routes dataPoint={data} />}
            </div>
        </div>
    );
};

export default App;
