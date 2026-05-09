import React, { useContext, useEffect } from 'react'
import './VerifyEmail.css'
import { StoreContext } from '../../../context/StoreContext'
import {useNavigate, useSearchParams} from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const VerifyEmail = () => {
  const [searchParams,setSearchParams] = useSearchParams()
  const token = searchParams.get("token");
  const {url} = useContext(StoreContext)
  const navigate = useNavigate()

  const verifyEmail = async() =>{
    const response = await axios.post(url+"/api/user/verify",{token})
    if(response.data.success){
      navigate("/")
      toast.success(response.data.message)
    }else{
      navigate("/")
      toast.error(response.data.message)
    }
  }

  useEffect(()=>{
    verifyEmail()
  },[])
  return (
    <div className='verify'>
        <div className="spinner"></div>
    </div>
  )
}

export default VerifyEmail
