import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { AutocompleteInput } from "./components/AutoCompleteInput.tsx";
import {
  FormContainer,
  GlobalStyle,
  MapContainer,
  StyledButton,
} from "./styles";

interface AddressData {
  id: string;
  value: string;
  isValid: boolean;
}

interface FormData {
  origin: AddressData;
  destination: AddressData;
  stops: AddressData[];
}

export const App: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const initialAddressData = (value = ""): AddressData => ({
    id: Date.now().toString(),
    value,
    isValid: false,
  });

  const [formData, setFormData] = useState<FormData>({
    origin: initialAddressData(),
    destination: initialAddressData(),
    stops: [],
  });

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyAkZiYSmZPco_peBYUZhALpKofFyojCTRs",
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then((google) => {
      if (!mapContainerRef.current) return;

      const googleMap = new google.maps.Map(mapContainerRef.current, {
        center: { lat: 42.26, lng: 19.15 },
        zoom: 8,
      });
      setMap(googleMap);

      setAutocompleteService(new google.maps.places.AutocompleteService());
    });
  }, []);

  const handleAddressChange = (
    field: keyof FormData,
    id: string | null,
    value: string,
    isValid: boolean,
  ) => {
    setFormData((prev) => {
      if (field === "stops" && id) {
        return {
          ...prev,
          stops: prev.stops.map((stop) =>
            stop.id === id ? { ...stop, value, isValid } : stop,
          ),
        };
      } else {
        return {
          ...prev,
          [field]: { ...prev[field], value, isValid },
        };
      }
    });
  };

  const addStop = () => {
    setFormData((prev) => ({
      ...prev,
      stops: [...prev.stops, initialAddressData()],
    }));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!map) {
      alert("Map is not initialized yet.");
      return;
    }

    const areAllStopsValid = formData.stops.every((stop) => stop.isValid);

    if (!formData.origin.isValid || !formData.destination.isValid) {
      alert("Please select valid addresses for origin and destination.");
      return;
    }

    if (!areAllStopsValid) {
      alert("Please select valid addresses for all stops.");
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const waypoints = formData.stops
      .filter((stop) => stop.value.trim() !== "")
      .map((stop) => ({
        location: stop.value,
        stopover: true,
      }));

    directionsService.route(
      {
        origin: formData.origin.value,
        destination: formData.destination.value,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          alert("Error: " + status);
        }
      },
    );
  };

  return (
    <div>
      <GlobalStyle />
      <MapContainer ref={mapContainerRef} />
      <FormContainer onSubmit={onSubmit}>
        <AutocompleteInput
          placeholder="Origin"
          autocompleteService={autocompleteService}
          onChange={(value) =>
            handleAddressChange("origin", null, value, false)
          }
          onSelect={(value) => handleAddressChange("origin", null, value, true)}
        />

        <AutocompleteInput
          placeholder="Destination"
          autocompleteService={autocompleteService}
          onChange={(value) =>
            handleAddressChange("destination", null, value, false)
          }
          onSelect={(value) =>
            handleAddressChange("destination", null, value, true)
          }
        />

        {formData.stops.map((stop) => (
          <div key={stop.id}>
            <AutocompleteInput
              placeholder={`Stop ${stop.id}`}
              autocompleteService={autocompleteService}
              onChange={(value) =>
                handleAddressChange("stops", stop.id, value, false)
              }
              onSelect={(value) =>
                handleAddressChange("stops", stop.id, value, true)
              }
            />
          </div>
        ))}

        <StyledButton
          variant={"tertiary"}
          onClick={addStop}
          content={"Add Stop"}
        />
        <StyledButton type="submit" content={"Show Route"} />
      </FormContainer>
    </div>
  );
};
