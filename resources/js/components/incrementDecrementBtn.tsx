type QuantitySelectorProps = {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
};

export default function QuantitySelector({ value, min, max, onChange }: QuantitySelectorProps) {
    const handleChange = (newValue: number) => {
        if (newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    };

    return (
        <div className="inline-flex">
            <div className="inline-flex items-center space-x-2 rounded border border-gray-300 px-2">
                <button onClick={() => handleChange(value - 1)} className="text-lg text-gray-500 hover:text-gray-800">
                    &minus;
                </button>
                <span className="w-4 text-center">{value}</span>
                <button onClick={() => handleChange(value + 1)} className="text-lg text-orange-500 hover:text-orange-700">
                    &#43;
                </button>
            </div>
        </div>
    );
}
