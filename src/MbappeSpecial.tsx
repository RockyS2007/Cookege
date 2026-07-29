function MbappeSpecial() {
    const styles = {
        backgroundColor: "hsl(200, 100%, 50%)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer"
    }
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        (e.target as HTMLButtonElement).textContent = "Mbappe!";
        window.open("https://youtube.com/shorts/KrGQC4B2UlY?si=4WEQxuNwG23ZK-bD", "_blank");
    };

    return(
        <button onClick={handleClick} style={styles}>Click for Today's Special</button>
    );
}

export default MbappeSpecial;