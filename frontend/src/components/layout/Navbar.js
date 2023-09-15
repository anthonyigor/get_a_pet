import { Link } from "react-router-dom"
import { useContext } from "react"

import Logo from '../../assets/img/logo.png'
import styles from './Navbar.module.css'

import { Context } from "../../context/UserContext"


function Navbar() {

    const {authenticated, logout} = useContext(Context)

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt="get a pet"></img>
                <h2>Get a Pet</h2>
            </div>
            <ul>
                <li><Link to='/'>Home</Link></li>
                {authenticated ? (
                <>
                    <li><Link to='/user/profile'>Perfil</Link></li>
                    <li><Link to='/pet/mypets'>Meus pets</Link></li>
                    <li onClick={logout}>Sair</li>
                </>
                ) : (
                    <>
                        <li><Link to='/login'>Login</Link></li>
                        <li><Link to='/register'>Cadastrar</Link></li>
                    </>
                )}
                
            </ul>
        </nav>
    )
}

export default Navbar