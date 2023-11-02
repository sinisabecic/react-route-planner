import React, { useState, useEffect, useCallback } from "react";
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
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Effect for debouncing value change
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500); // Adjust the delay for debouncing as needed

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  const fetchPredictions = useCallback(() => {
    if (autocompleteService && debouncedValue) {
      autocompleteService.getPlacePredictions(
        { input: debouncedValue },
        (results) => {
          setPredictions(results || []);
        },
      );
    }
  }, [autocompleteService, debouncedValue]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    onChange(inputValue);
  };

  const handlePredictionClick = (prediction: string) => {
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
          {predictions.map((prediction) => (
            <PredictionItem
              key={prediction.place_id} // Use place_id which is unique instead of the array index
              onClick={() => handlePredictionClick(prediction.description)}
            >
              {prediction.description}
            </PredictionItem>
          ))}
        </PredictionsDropdown>
      )}
    </InputWrapper>
  );
};
