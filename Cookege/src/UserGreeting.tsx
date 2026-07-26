interface greetingProps {
    isLoggedIn: boolean,
    username: string
}

function UserGreeting(props: greetingProps) {
    if (props.isLoggedIn) {
        return(
            <h2 className="welcome-message">Welcome {props.username}</h2>
        );
    } else {
        return <h2 className="login-prompt">Please login to continue</h2>;
    }
}

export default UserGreeting;