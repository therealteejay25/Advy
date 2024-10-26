import { Link } from 'react-router-dom';
import Logo from '../../Logo Pack/logo.svg'
const Download = () => {
    return ( 
        <div className='bg-light h-screen'>
        <div className='p-2'>
        <img className='h-12' src={Logo} alt="" />
        </div>
        <div className='my-28 md:my-16'> 
            <h2 className='py-20 text-center text-2xl text-dark '>Your download should start very soon... <br />Thank you for using <span className='text-accent font-medium'>Advy.</span></h2>
            <div className='justify-center items-center text-center'> 
                <Link to='/' className='border-main py-3 px-4 text-lg text-main m-3 rounded-md border-[2px]'>Back to Home</Link>
                <a href='https://wa.link/bfxzhe' target='_blank' className='border-[2px] border-main bg-main text-light text-lg rounded-md py-3 px-4 m-3'>Contact TMD.</a>
            </div>
        </div>
        </div>
     );
}
 
export default Download;