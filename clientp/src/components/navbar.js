import React,{ useContext,useRef,useEffect, useState} from 'react'
import {Link,useHistory} from 'react-router-dom' //refreshing problem
import {userContext} from "../App"
//import { render } from '@testing-library/react'
import M from 'materialize-css'
const NavBar = ()=>{
    const serchModal =useRef(null)
    const [search, setSearch]=useState("") 
    const [userDetails, setUserDetails]=useState([])
    const {state,dispatch} =useContext(userContext)
    const history =useHistory()
    useEffect(()=>{
        M.Modal.init(serchModal.current)//materialise

    },[])
    const renderList =()=>{
        if(state){
            return  [
                <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style ={{color:"black"}}>search</i></li>,
                <li  key="2"><Link to="/profile">Profile</Link></li>,
                <li  key="3"><Link to="/create">createpost</Link> </li>,
                <li  key="4"><Link to="/myfollowerposts">myhome</Link> </li>,
                <li  key="5">  <button className="btn waves-effect waves-light #880e4f pink darken-4"
                onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                    
                }}
                >logout</button>

                </li>
            ]
        }
        else{
            return [
            <li  key="6"><Link to="/signin">signin</Link></li>,
            <li  key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    const fetchusers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
            // body:query
        })
        .then(res=>res.json())
        .then(results=>{
            console.log(results)
          setUserDetails(results.user)
        })
        
    }
    return (
        <nav>
        <div className="nav-wrapper white">
            < Link to={state ? "/":"/signin"} className="brand-logo left">Instagram</Link>
            <ul id="nav-mobile" className="right">
               {renderList()}
                
            </ul>
        </div>
                <div id="modal1" className="modal" ref={serchModal} style={{color:"blue"}}>
                    <div className="modal-content">
                            <input 
                        type="text"
                        placeholder="serch users"
                        value={search}
                        onChange={(e)=>fetchusers(e.target.value)}
                        />

                   
                            <ul className="collection">
                            {
                                userDetails.map(item=>{
                                    return (
                                    <Link to={item._id !== state._id ?"/profile/"+item._id:"/profile"} onClick={()=>{
                                       M.Modal.getInstance(serchModal.current).close()
                                    }} > <li className ="collection-item" >{item.email}</li></Link>
                                    )
                                }
                                )
                            }
                            </ul>
                                
                    </div>
                    <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick ={()=>setSearch('')}>close</button>
                    </div>
                </div>
          
        </nav>
    )
}
export default NavBar