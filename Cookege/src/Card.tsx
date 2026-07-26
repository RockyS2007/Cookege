import tacoPic from './assets/Griddle-Tacos.jpg'

function Card() {
    return(
        <div className="card">
            <img className="card-image" src={tacoPic} alt="picture of a Taco"></img>
            <h2 className="card-title">Rocky</h2>
            <p className="card-text">I'm making a cooking app for uni students</p>
        </div>
    );
}

export default Card;