import './header.css'
import logo from '../../assets/image/logo-ex-nihilo.png'
import { Link } from 'react-router-dom';

const HeaderComponent = () => {
    return (
        <div className='header-main'>
            <div className='header-main-logo-title'> 
                <Link to="/">
                    <img src={logo} alt="logo"/>
                </Link>
                <h1>Ex Nihilo Manager</h1>
            </div>
        </div>
    )
}

export default HeaderComponent