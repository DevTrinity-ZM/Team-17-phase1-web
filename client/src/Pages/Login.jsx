import './Login.css';
function Login() {
    return (
        <div className='tab'>
            <p className='welcome'>// Welcome</p>
            <h1>Sign In</h1>
            <p>Enter your credentials to continue tracking</p>
            <form>
                <label htmlFor="email">EMAIL ADDRESS</label><br />
                <input type="email" name="email" id="" placeholder='you@example.com'/>
                <br />
                <label htmlFor="pass">PASSWORD</label><br />
                <input type="password" name="pass" id="" placeholder='........'/>
                <br />
                <div>
                    <div>
                        <label htmlFor="check">KEEP ME SIGNED IN</label>
                        <input type="checkbox" name="check" id="" />
                    </div>
                    <p>forgot?</p>
                </div>
                <br />
                <input type="submit" value="[ SIGN IN → ]" />
                <fieldset>
                    <legend>or continue with</legend>
                    <button>Sign in with google</button>
                </fieldset>
            </form>
        </div>
    );
}

export default Login