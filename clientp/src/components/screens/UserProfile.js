import React ,{useEffect,useState,useContext} from 'react'
import {userContext} from "../../App"
import {useParams} from 'react-router-dom'
//import { use } from '../../../../server/routes/user'
const UserProfile = ()=>{
    
    const [userProfile,setProfile] =useState(null)
    const [showfollow,setShowfollow]=useState(true) 
    const {state,dispatch}=useContext(userContext)
    const {userid} = useParams()
    //console.log(userid)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
           
            console.log(result)
            setProfile(result)
        })
    },[])

    const followUser= ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")

            },
            body:JSON.stringify({
                followId:userid

            })
                
            
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
        })
        setShowfollow(false)
    }
    const unfollowUser= ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")

            },
            body:JSON.stringify({
                unfollowId:userid

            })
                
            
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))

            setProfile((prevState)=>{
                const newfollwer=prevState.user.followers.filter(item=> item!=data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newfollwer
                    }
                }
            })
        })
        setShowfollow(true)
        
    }
    
    return (
        <>
        {userProfile ? 
        <div style={{ maxWidth:"1000px",margin:"0px auto"}}>
        <div style={{
           display:"flex",
            justifyContent:"space-around",
            margin:"18px 0px",
           // borderBottom:"1px solid grey"
        }}>
            <div>
              <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                src="https://images.unsplash.com/photo-1569124589354-615739ae007b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                />
            </div>
            <div>
                <h4>{userProfile.user.name}</h4>
                <h5>{userProfile.user.emal}</h5>
                <div style={{
                    display:"flex",justifyContent:"space-between",width:"120%"
                }}
                >
                    <h6> {userProfile.posts.length} posts </h6>
                    <h6> {userProfile.user.followers.length} followers </h6>
                    <h6> {userProfile.user.following.length} following </h6>
                </div>

                {
                showfollow?
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>followUser()}
                >follow</button>:
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>unfollowUser()}
                >unfollow</button>

                }
               
                 


            </div>

        </div>
    <div className ="gallary">
        {
            userProfile.posts.map(item=>{
                return (
                    < img key={item._id} className="item" src={item.photo } alt={item.title} />
                )
            })
        }
        
      
    </div>
    </div>
        : 
        <h2> loading..</h2>
    }
        
        </>
    )
    
}
export default UserProfile