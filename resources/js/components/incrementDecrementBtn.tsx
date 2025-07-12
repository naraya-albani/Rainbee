import { useState } from 'react';

export default function QuantitySelector({
  initialQuantity = 1,
  min = 1,
  max = 99,
  onChange = () => {},
}) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > min) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onChange;
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      onChange;
    }
  };

  return (
    <div className="inline-flex">
      <div className="inline-flex items-center border border-gray-300 rounded px-2 space-x-2">
        <button
          onClick={handleDecrease}
          className="text-gray-500 hover:text-gray-800 text-lg"
        >
          &minus;
        </button>
        <span className="w-4 text-center">{quantity}</span>
        <button
          onClick={handleIncrease}
          className="text-orange-500 hover:text-orange-700 text-lg"
        >
          &#43;
        </button>
      </div>
    </div>
  );
}
