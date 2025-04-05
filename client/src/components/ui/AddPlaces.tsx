import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import axiosInstance from "../../service/axiosInstance";
import { useForm, SubmitHandler } from "react-hook-form";
import Label from "@/ui/common/atoms/Label";
import InputField from "@/ui/common/atoms/InputField";
import Button from "@/ui/common/atoms/Button";
import { useMessage } from "../../contexts/MessageContext";
import axios from "axios";
import L from "leaflet";
import { Clock, DollarSign, MapPin, FileImage } from "lucide-react";

const tealIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-teal.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface FormData {
  name: string;
  description: string;
  duration: string;
  price: string;
  location: string;
  longitude: string;
  latitude: string;
  image: FileList;
}

const AddPlaces: React.FC = () => {
  const { setMessage } = useMessage();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormData>();

  const [latitude, setLatitude] = useState<number>(27.7172);
  const [longitude, setLongitude] = useState<number>(85.324);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("duration", data.duration);
      formData.append("price", data.price);
      formData.append("location", data.location);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("type", "PLACE");

      if (data.image) {
        Array.from(data.image).forEach((image) =>
          formData.append("image", image)
        );
      }

      const response = await axiosInstance.post("/admin/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(formData, "------------")
      setMessage(response.data.message, "success");
      setPreviewImages([]);
    } catch (error) {
      setMessage(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "An error occurred"
          : "Required fields should not be empty",
        "error"
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(imageUrls);
    }
  };

  const SearchControl = () => {
    const map = useMap();

    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const searchControl = new (GeoSearchControl as any)({
        provider,
        position: "topright",
        style: "bar",
        showMarker: false,
        showPopup: false,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: false,
        searchLabel: "Search for places...",
      });

      map.addControl(searchControl);
      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });
    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} icon={tealIcon} />
    ) : null;
  };

  return (
    <div className="min-h-screen bg-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-8">Add New Destination</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label name="name" label="Place Name" required />
                <InputField
                  setValue={setValue}
                  type="text"
                  name="name"
                  register={register}
                  className="mt-1 block w-full rounded-lg border-teal-100 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  placeholder="Enter place name"
                  error={errors.name}
                />
              </div>

              <div>
                <Label name="location" label="Location" required />
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
                  <InputField
                    setValue={setValue}
                    type="text"
                    name="location"
                    register={register}
                    className="pl-10 mt-1 block w-full rounded-lg border-teal-100 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    placeholder="Enter location"
                    error={errors.location}
                  />
                </div>
              </div>

              <div>
                <Label name="duration" label="Duration" required />
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
                  <InputField
                    setValue={setValue}
                    type="text"
                    name="duration"
                    register={register}
                    className="pl-10 mt-1 block w-full rounded-lg border-teal-100 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    placeholder="e.g., 2 hours"
                    error={errors.duration}
                  />
                </div>
              </div>

              <div>
                <Label name="price" label="Price" required />
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
                  <InputField
                    setValue={setValue}
                    type="text"
                    name="price"
                    register={register}
                    className="pl-10 mt-1 block w-full rounded-lg border-teal-100 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    placeholder="Enter price"
                    error={errors.price}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label name="description" label="Description" />
              <textarea
                {...register("description")}
                rows={4}
                className="mt-1 block w-full rounded-lg border-teal-100 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                placeholder="Enter place description"
              />
            </div>

            <div>
              <Label name="map" label="Location on Map" required />
              <div className="mt-2 rounded-lg overflow-hidden border-2 border-teal-100">
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={13}
                  style={{ height: "400px", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <SearchControl />
                  <LocationMarker />
                </MapContainer>
              </div>
              <p className="mt-2 text-sm text-blue-600">
                Click on the map to set location or use the search bar
              </p>
            </div>

            <div>
              <Label name="images" label="Images" />
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileImage className="w-10 h-10 mb-3 text-blue-500" />
                      <p className="mb-2 text-sm text-blue-700">
                        <span className="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-blue-500">
                        PNG, JPG or JPEG (MAX. 800x400px)
                      </p>
                    </div>
                  
                    <input
          id="image"
          type="file"
          name="image"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleImageChange(e);
            if (e.target.files) {
              setValue("image", e.target.files);
            }
          }} 
        />
                  </label>
                </div>
              </div>

              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {previewImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-blue-50 border-2 border-blue-100"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                name="submit"
                buttonText={isSubmitting ? "Adding Place..." : "Add Destination"}
                className="px-6 py-3 text-white rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlaces;