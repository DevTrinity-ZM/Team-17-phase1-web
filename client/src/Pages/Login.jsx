import './Login.css';
function Login() {
    return (
        <div className='tab'>
            <p className='welcome'>// Welcome</p>
            <h1>Sign In</h1>
            <p>Enter your credentials to continue tracking</p>
            <form>
                <div className="field-group">
                    <label htmlFor="email">EMAIL ADDRESS</label>
                    <div className="input-wrapper">
                        <input type="email" id="email" placeholder="you@example.com" autocomplete="email" />
                        <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </div>
                </div>
                <div className="field-group">
                    <label htmlFor="pass">PASSWORD</label>
                    <div className="input-wrapper">
                        <input type="password" id="password" placeholder="••••••••" autocomplete="current-password" />
                        <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                </div>
                <div className='sign-details'>
                    <div className='remember'>
                        <input type="checkbox" name="check" id="" />
                        <p>KEEP ME SIGNED IN</p>
                    </div>
                    <p>[ forgot? ]</p>
                </div>
                <br />
                <button className="btn-login">[ Sign In → ]</button>
 
                <div className="divider">or continue with</div>
 
                <button className="btn-alt">
                    <svg className="alt-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                </button>
                 <div className="form-footer">
                    Don't have an account? <a href="#">Create one →</a>
                </div>
            </form>
        </div>
    );
}

export default Login