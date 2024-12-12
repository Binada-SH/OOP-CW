import React, { useState, useEffect } from 'react';

function TicketSystemApp() {
    const [config, setConfig] = useState({
        totalTickets: 0,
        ticketReleaseRate: 0,
        customerRetrievalRate: 0,
        maxTicketCapacity: 0
    });

    const [rounds, setRounds] = useState([]);
    const [isSystemRunning, setIsSystemRunning] = useState(false);
    const [error, setError] = useState(null);

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: parseInt(value, 10)
        }));
    };

    const initializeSystem = async () => {
        try {
            const response = await fetch('http://localhost:5000/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error('Initialization failed');
            }

            setIsSystemRunning(true);
            setError(null);
        } catch (error) {
            console.error('Initialization failed', error);
            setError('Invalid configuration or server error');
        }
    };

    const executeRound = async () => {
        try {
            const response = await fetch('http://localhost:5000/execute-round', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Round execution failed');
            }

            const roundData = await response.json();
            setRounds(prev => [...prev, roundData]);

            if (roundData.isComplete) {
                setIsSystemRunning(false);
            }
        } catch (error) {
            console.error('Round execution failed', error);
            setError('Failed to execute round');
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Ticket System Simulator</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {!isSystemRunning && (
                <div className="space-y-4">
                    <div>
                        <label className="block">Total Tickets:</label>
                        <input 
                            type="number" 
                            name="totalTickets"
                            value={config.totalTickets}
                            onChange={handleConfigChange}
                            className="w-full border p-2"
                        />
                    </div>
                    <div>
                        <label className="block">Ticket Release Rate:</label>
                        <input 
                            type="number" 
                            name="ticketReleaseRate"
                            value={config.ticketReleaseRate}
                            onChange={handleConfigChange}
                            className="w-full border p-2"
                        />
                    </div>
                    <div>
                        <label className="block">Customer Retrieval Rate:</label>
                        <input 
                            type="number" 
                            name="customerRetrievalRate"
                            value={config.customerRetrievalRate}
                            onChange={handleConfigChange}
                            className="w-full border p-2"
                        />
                    </div>
                    <div>
                        <label className="block">Max Ticket Capacity:</label>
                        <input 
                            type="number" 
                            name="maxTicketCapacity"
                            value={config.maxTicketCapacity}
                            onChange={handleConfigChange}
                            className="w-full border p-2"
                        />
                    </div>
                    <button 
                        onClick={initializeSystem}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Initialize System
                    </button>
                </div>
            )}

            {isSystemRunning && (
                <div>
                    <button 
                        onClick={executeRound}
                        className="bg-green-500 text-white p-2 rounded mb-4"
                    >
                        Execute Round
                    </button>

                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-2">Rounds</h2>
                        {rounds.map((round, index) => (
                            <div key={index} className="border p-2 mb-2">
                                <p>Round: {round.round}</p>
                                <p>Vendor Tickets Released: {round.vendorTicketsReleased}</p>
                                <p>Customer Tickets Retrieved: {round.customerTicketsRetrieved}</p>
                                <p>Remaining Tickets: {round.remainingTickets}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TicketSystemApp;