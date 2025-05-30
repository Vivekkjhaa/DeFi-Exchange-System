
import { useState } from 'react';
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';

import logo from '../../images/logo.png';

const NavbarItem = ({title}) => {
    return (
        <li  className={'mx-4 cursor-pointer'}>
        {title}
        </li>
    );
}
const Navbar = () => {
    const[toggleMenu, setToggleMenu] = useState(false);
    return (
        <nav className="w-full flex md:justify-center justify-between  p-4 items-center">
            <div className='md:flex-[0.5] flex-initial justify-center items-center'>
                <img src={logo} alt="logo" className='w-32 cursor-pointer' align="left"/>
            </div>
            <ul className='text-white md:flex hidden list-none flex-row justify-between flex-initial items-center'>
                {["Market","Exchange","Tutorials","Wallets"].map((item,index) => (
                    <NavbarItem key={ item + index} title={item} />
                ))}
                
            </ul>
            <div className='flex relative'>
                {toggleMenu
                    ? <AiOutlineClose className="text-white md:hidden cursor-pointer " onClick={() => setToggleMenu(false)}/>
                    : <HiMenuAlt4 className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)}/>
                }
                {toggleMenu && (
                    <ul
                        className='fixed top-0 right-0 p-3 w-[75%] h-screen shadow-2x1 mid:hidden list-none
                        flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in'
                    >
                        <li className='text-x1 w-full my-2'>
                            <AiOutlineClose onClick={() => setToggleMenu(false)}/>
                        </li>
                        {["Market","Exchange","Tutorials","Wallets"].map((item,index) => (
                    <NavbarItem key={ item + index} title={item}/>
                ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default Navbar; 