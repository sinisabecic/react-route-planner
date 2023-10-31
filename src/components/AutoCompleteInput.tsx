import React, { useState } from "react";

interface AutocompleteInputProps {
  placeholder: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  autocompleteService: google.maps.places.AutocompleteService | null;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  placeholder,
  onChange,
  onSelect,
  autocompleteService,
}) => {
  const [value, setValue] = useState<string>("");
  const [predictions, setPredictions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    console.log("Input changed:", inputValue);
    onChange(inputValue);

    if (autocompleteService) {
      autocompleteService.getPlacePredictions(
        { input: inputValue },
        (results) => {
          const newPredictions =
            results?.map((result) => result.description) || [];
          setPredictions(newPredictions);
        },
      );
    }
  };

  const handlePredictionClick = (prediction: string) => {
    console.log("Prediction clicked:", prediction);
    onSelect(prediction);
    setValue(prediction); // update the input value when a prediction is selected
    setPredictions([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      {predictions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            width: "100%",
            zIndex: 1000,
            border: "1px solid #ccc",
            backgroundColor: "white",
          }}
        >
          {predictions.map((prediction, index) => (
            <button
              key={index}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "8px",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
              onClick={() => handlePredictionClick(prediction)}
            >
              {prediction}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
