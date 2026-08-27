import { Link } from 'react-router-dom';

function Header() {

    return(
        <header>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1>Cookege</h1>
            </Link>
            <p>A cooking website for college and university students!</p>
            <hr></hr>
        </header>
    );
};

export default Header;