import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Input,
} from "@oykos-development/devkit-react-ts-styled-components";
import { Loader } from "@googlemaps/js-api-loader";

interface FormData {
  origin: string;
  destination: string;
  stops: string[];
}

const initialValues: FormData = { origin: "", destination: "", stops: [] };

export const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: initialValues,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const stops = watch("stops", []);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyAkZiYSmZPco_peBYUZhALpKofFyojCTRs",
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then((google) => {
      const googleMap = new google.maps.Map(
        mapContainerRef.current as Element,
        {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        },
      );
      setMap(googleMap);
    });
  }, []);

  const addStop = () => {
    const newStopArray = [...stops, ""];
    // Triggering an input update in react-hook-form
    newStopArray.forEach((stop, index) => {
      setValue(`stops.${index}`, stop);
    });
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Clear previous markers
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const stopsArray = Array.isArray(data.stops) ? data.stops : [];

    const waypoints = stopsArray
      .filter((stop) => stop)
      .map((stop) => ({
        location: stop,
        stopover: true,
      }));

    // Requesting route data from the Directions API
    directionsService.route(
      {
        origin: data.origin,
        destination: data.destination,
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
      <div ref={mapContainerRef} style={{ height: "400px" }} />{" "}
      {/* Map container */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("origin", { required: true })}
          placeholder="Origin"
        />
        {errors.origin && <span>This field is required</span>}

        <Input
          {...register("destination", { required: true })}
          placeholder="Destination"
        />
        {errors.destination && <span>This field is required</span>}

        {stops.map((_, index) => (
          <div key={index}>
            <Input
              {...register(`stops.${index}`)}
              placeholder={`Stop ${index + 1}`}
            />
          </div>
        ))}

        <Button onClick={addStop} content={"Add Stop"} />
        <Button type="submit" content={"Show Route"} />
      </form>
    </div>
  );
};
