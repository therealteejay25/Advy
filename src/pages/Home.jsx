import { Link } from 'react-router-dom';
import Logo from '../../Logo Pack/logo.svg'
const Home = () => {
    return ( 
        <div className='bg-light h-screen'>
        <div className='p-2'>
        <img className='h-12' src={Logo} alt="" />
        </div>
        <div>
          <div className='text-center pt-24 md:pt-20'>
            <h2 className='text-dark md:p-5 p-3 text-3xl md:text-5xl font-medium'>Life isn't easy without a <br /> <span className='text-main'>schedule.</span></h2>
            <p className='text-dark text-xl p-4'>Schedule your calls with <span className='text-accent font-medium'>Advy</span> and make life easier and <br />simplified.</p>
          </div>
          <div>
            <div className='justify-center items-center text-center flex flex-col md:flex-row'>
              <Link className='bg-main py-3 px-12 border border-main mx-5 md:my-5 text-lg text-light rounded-full' to='/schedule'>Schedule a Call</Link>
              <Link className='bg-transparent py-3 px-12 text-lg text-accent border mx-5 md:my-5 my-4 border-accent rounded-full' to='/retreive'>Retreive your ticket</Link>
            </div>
          </div>
        </div>
        <div className='bg-accent text-main text-center text-3xl font-medium p-5 md:mt-[6.7rem] mt-[20.5rem]'>
            <p>Brought to you by TMD.</p>
        </div>
      </div>
     );
}
 
export default Home;