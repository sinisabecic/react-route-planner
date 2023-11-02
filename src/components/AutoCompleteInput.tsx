import React, { useState } from "react";
import {
  InputWrapper,
  PredictionItem,
  PredictionsDropdown,
  StyledInput,
} from "../styles.ts";

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
    setValue(prediction);
    setPredictions([]);
  };

  return (
    <InputWrapper>
      <StyledInput
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      {predictions.length > 0 && (
        <PredictionsDropdown>
          {predictions.map((prediction, index) => (
            <PredictionItem
              key={index}
              onClick={() => handlePredictionClick(prediction)}
            >
              {prediction}
            </PredictionItem>
          ))}
        </PredictionsDropdown>
      )}
    </InputWrapper>
  );
};
