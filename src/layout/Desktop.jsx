import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';

import Mobilebar from '../components/navigation/Mobilebar';
import Footer from '../components/Footer';

const DefaultLayout = () => {
    return (
        <div className="h-full min-h-screen">
            <div className="flex flex-col md:flex-row">
                
                <div className="hidden md:block">
                    <Navbar />
                </div>

                <main className=" mb-16 sm:mb-0 lg:mt-[-24px] sm:mt-5 w-full">
                    <div className="overflow-auto md:mt-20">
                        <Outlet />
                    </div>
                    <Footer/>
                </main>


                <div className="block md:hidden">
                    <Mobilebar />
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
