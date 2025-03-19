import React from 'react';

const SetLine = ({lineValue, setLineValue}) => {
    const increment = () => {
        setLineValue(lineValue + 0.5);
    }

    const decrement = () => {
        setLineValue(lineValue - 0.5)
    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        // Convert the value to a number to remove leading zeros
        const numericValue = Number(value);
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
            setLineValue(numericValue);
        }
    };

    return (
        <div className="mt-6">
            <label className="block text-sm mb-2" htmlFor="set-line">
                Set Line
            </label>
            <div className="flex items-center justify-between bg-gray-700 rounded ">
            <input
                type="number"
                min="0"
                max="100"
                id="set-line"
                value={lineValue}
                onChange={handleInputChange}
                className="rounded w-full py-2 px-3 bg-gray-700 text-white focus:outline-none"
            />
            <div className="flex items-center gap-2">
                    <button
                        onClick={decrement}
                        className="bg-gray-700 text-lg text-white py-1 px-3 hover:bg-gray-500"
                    >
                        -
                    </button>
                    <button
                        onClick={increment}
                        className="bg-gray-700 text-lg text-white py-1 px-3 rounded hover:bg-gray-500"
                    >
                        +
                    </button>
                </div>
            </div>
            <style>
                {`
                /* Hide the spin wheel for number input */
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                /* Firefox */
                input[type="number"] {
                    -moz-appearance: textfield;
                }
                `}
            </style>
        </div>
    );
};

export default SetLine;