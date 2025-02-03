import { USER_REQUESTS_FOR_TRAVEL } from '@/mutation/queries'
import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'

interface TravelBooking {
  id: string;
  from: string,
  to: string;
  totalDays: string;
  totalPeople: string;
  travel: Travel
}
interface Travel {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  vehicleType: string;
  gender: string;
}
const TravelBookingHistory = () => {
  const [travelBooking, setTravelBooking] = useState<TravelBooking[] | null>(null)
        const { data, loading, error } = useQuery(USER_REQUESTS_FOR_TRAVEL)
        console.log("🚀 ~ TravelBookingHistory ~ data:", data)
        
  useEffect(() => {
      if(data) setTravelBooking(data.getOwnTravelRequest);
    })
  return (
    <>
      <div>
        {travelBooking?.map((book) => (
          <div>
            <p> id:{book.id}</p>
            <p>from : {book.from}</p>
            <p> to: {book.to}</p>
            <p>Total Days: {book.totalDays}</p>
            <p>Total People: {book.totalPeople}</p>
            <p>Travels name:
              {book.travel.firstName} {book.travel.middleName}{" "}
              {book.travel.lastName}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default TravelBookingHistory;