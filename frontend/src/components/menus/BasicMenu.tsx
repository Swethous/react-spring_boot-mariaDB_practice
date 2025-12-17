import type { FC } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

const BasicMenu: FC = () => {

  const { email, isLogin } = useAppSelector(state => state.loginSlice);

  return (
    <nav id="navbar" className="flex bg-blue-300">
      <div className="w-4/5 bg-gray-500">
        <ul className="flex p-4 text-white font-bold">
          <li className="pr-6 text-2xl">
            <Link to="/">Main</Link>
          </li>
          <li className="pr-6 text-2xl">
            <Link to="/about">About</Link>
          </li>

          {isLogin ?
          <>
          
            
          <li className="pr-6 text-2xl">
            <Link to="/todo/">Todo</Link>
          </li>
          <li className="pr-6 text-2xl">
            <Link to="/products/">Products</Link>
          </li>
          </>
          :
          <></>
          }      
        </ul>
      </div>
      <div className="w-1/5 flex justify-end bg-orange-300 p-4 font-medium">
      { !isLogin ?
            <div className="text-white text-m m-1 rounded">
                <Link to={'/member/login'}>Login</Link>
            </div>
      :
            <div className="text-white text-m m-1 rounded">
                <Link to={'/member/logout'}>Logout</Link>
            </div>
      }
      </div>
    </nav>
  );
};

export default BasicMenu;
