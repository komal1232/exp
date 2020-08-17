import React,{useState,useContext} from 'react'
import {Link , useHistory} from 'react-router-dom'
//import {useContext} from "../../App"
import M from 'materialize-css'
import { userContext } from "../../App"

    const   Signin = ()=>{
    const {state,dispatch} = useContext(userContext)
    const history=useHistory()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const PostData = ()=> { 
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
           return M.toast({html:"invalid email",classes:"#c62828 red darken-3"})
    }
        fetch("/signin",{
            method:"post",
            headers:{
                  "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
               
            })
            })
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                   M.toast({html:data.error})
                }
                else{
                   
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    
                    dispatch({type:"USER",payload:data.user})
                    M.toast({html:"signed in"})
                    history.push('/')
                }
            })
            .catch(err=>{ console.log(err)})
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">

                <h2> Instagram </h2>
                <input 
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                 <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>PostData()}
                >LOGIN</button>
                <h5>
                    <Link to ="signup">dont have account?
                    </Link>
                </h5>
        
            </div>
        </div>
    )
}
export default Signin