function ProfilePicture() {
    const imageURL = "./src/assets/Griddle-Tacos.jpg";

    const handleClick = (e) => e.target.style.display = "none";
    // too many damn type errors

    return (<img onClick={(e) => handleClick(e)} src={imageURL} alt="image of a taco"></img>);
}

export default ProfilePicture;