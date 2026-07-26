function Button() {
    const styles = {
        backgroundColor: "hsl(200, 100%, 50%)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer"
    }

    // This is inline, consider putting in a module if required
    // Optionally we could update global styles

    let count = 0;

    const handleClick = (e: Event) => e.target.textContent = "OUCH!";
    // Fix these type errors

    return(
        <button onClick={(e) => handleClick(e)} style={styles}>Click me</button>
        // if you put () after a function it will be called right away, so you handle it with an arrow function
    );
}

export default Button;