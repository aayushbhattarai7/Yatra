export interface Data {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
    gender:String
}