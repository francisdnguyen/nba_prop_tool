import React from 'react';
import { useTheme } from './ThemeContext';

const SetLine = ({lineValue, setLineValue}) => {
    const increment = () => {
        setLineValue(lineValue + 0.5);
    }

    const decrement = () => {
        setLineValue(lineValue - 0.5)
    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        const numericValue = Number(value);
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
            setLineValue(numericValue);
        }
    };
    const { colors } = useTheme();

    return (
        <div className="mt-6">
            <label className={`block text-xl mb-3 font-semibold ${colors.textSecondary}`} htmlFor="set-line">
                Set Line
            </label>
            <div className="flex items-center bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                <input
                    type="number"
                    min="0"
                    max="100"
                    id="set-line"
                    value={lineValue}
                    onChange={handleInputChange}
                    className="flex-1 py-4 px-4 bg-transparent text-white focus:outline-none text-lg font-semibold"
                />
                <div className="flex items-center">
                    <button
                        onClick={decrement}
                        className="text-white py-2 px-4 hover:bg-red-500/20 transition-all duration-200 font-bold text-xl hover:scale-110 active:scale-95"
                    >
                        -
                    </button>
                    <div className="w-px h-8 bg-gray-600/50" />
                    <button
                        onClick={increment}
                        className="text-white py-2 px-4 hover:bg-green-500/20 transition-all duration-200 font-bold text-xl hover:scale-110 active:scale-95"
                    >
                        +
                    </button>
                </div>
            </div>
            <style jsx>{`
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"] {
                    -moz-appearance: textfield;
                }
            `}</style>
        </div>
    );
};

export default SetLine;