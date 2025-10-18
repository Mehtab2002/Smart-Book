import React from 'react'

const Login = () => {
  return (
    <div>
        {/* create a login form */}
        <form>
            <label>
                Username:
                <input type="text" name="username" />
            </label>
            <label>
                Password:
                <input type="password" name="password" />
            </label>
            <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default Login