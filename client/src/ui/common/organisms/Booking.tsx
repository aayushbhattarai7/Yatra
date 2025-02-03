import { NavLink } from '@/components/ActiveNavLink';
const Booking = () => {

  return (
    <div>
      <div className='flex justify-around items-center '>
        <NavLink to='/travel-booking' label='Travel'/>
        <NavLink to='/guide-booking' label='Guide'/>
        
      </div>
    </div>
  );
}

export default Booking