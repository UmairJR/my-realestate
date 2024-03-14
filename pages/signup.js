'use client'
import {useState} from 'react';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {ref, get, push,set} from "firebase/database";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { auth, database } from './utils/firebaseConfig';


const SignUp = () => {
    const aadhaarapiKey = 'Dre2ALObTyldvWG3Gr0WWNSQP5W1xqkF';
    const[inputAadhaarNumber, setinputAadhaarNumber] = useState('')
    const [aadhaarPhoto, setAadhaarPhoto] = useState('');
    const [transaction_id, setTransactionID] = useState('');
    const [otp, setOtp] = useState('');
    const [aadhaarData, setAadhaarData] = useState(null);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [accountAddress, setAccountAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [aadhaarName, setAadhaarName] = useState('');
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

    const router = useRouter()
    
    async function sendOtp(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const options = {
            method: 'POST',
            url: 'https://api.gridlines.io/aadhaar-api/boson/generate-otp',
            headers: {
                'X-Auth-Type': 'API-Key',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-API-Key': aadhaarapiKey
            },
            data: { aadhaar_number: inputAadhaarNumber, consent: 'Y' }
        };
        try {
            const { data } = await axios.request(options);
            console.log(data.data.transaction_id);
            setTransactionID(data.data.transaction_id);
            setAadhaarData(null);
            setAadhaarName('');
            setStep(2);
        } catch (error) {
            console.error(error);
            setError('Failed to send OTP. Please try again.');
            alert('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function submitOtp(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        const options = {
            method: 'POST',
            url: 'https://api.gridlines.io/aadhaar-api/boson/submit-otp',
            headers: {
                'X-Auth-Type': 'API-Key',
                'X-Transaction-ID': transaction_id,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-API-Key': aadhaarapiKey
            },
            data: { otp: otp, include_xml: true, share_code: '1234' }
        };
        try {
            const { data } = await axios.request(options);
            setAadhaarData(data.data.aadhaar_data);
            setAadhaarName(data.data.aadhaar_data.name);
            setAadhaarPhoto(data.data.aadhaar_data.photo_base64);
            console.log(data.data.aadhaar_data);
    
            setStep(3);
        } catch (error) {
            console.error(error);
            setError('Incorrect OTP. Please try again.');
            alert('Incorrect OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    }


    async function userRegister(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
      
        try {
            if (password !== confirmPassword) {
                setError('Passwords do not match. Please enter matching passwords.');
                alert('Passwords do not match. Please enter matching passwords.');
                setPassword('');
                setConfirmPassword('');
                console.log(password);
                return;
            }
            else {
                console.log(aadhaarName, inputAadhaarNumber, accountAddress, password);

                const res = await createUserWithEmailAndPassword(email, password)
                console.log({res})
                const user = auth.currentUser;
                // sessionStorage.setItem('user', true)


                const userData = {
                    Name : aadhaarName,
                    AadhaarNumber : inputAadhaarNumber,
                    AccountAddress : accountAddress,
                    Password : password
                }
      

                set(ref(database, 'users/' + user.uid), userData);

                setEmail('');
                setPassword('')
                alert("User Successfully Registered");
                router.push('/login')
              
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            
        }
      }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900'>
        <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        {step === 1 && (
            <>
            <input
            type='number'
            value={inputAadhaarNumber}
            placeholder='Enter Aadhaar Number'
            onChange={(e) => setinputAadhaarNumber(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
            />

            <button 
            onClick={sendOtp} disabled={loading}
            className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500">SUBMIT</button>

            {error && <p className="error">{error}</p>}
            </>
        )}
        {step === 2 && (
            <>
            <h2 className="text-white text-2xl mb-5" >OTP</h2>
            <input
            type = "number"
            value={otp}
            placeholder='Enter OTP'
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
            />
            <button 
            onClick={submitOtp} disabled={loading}
            className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500">Submit OTP</button>
            {error && <p className="error">{error}</p>}
            </>
        )}
        {step === 3 && (
            <>
            {aadhaarData ? (
                    <>
                        {aadhaarPhoto && (
                            <img src={`data:image/jpeg;base64,${aadhaarPhoto}`} alt="Aadhar Photo" />
                        )}
                        <h4>Aadhaar Name: {aadhaarData.name || 'N/A'}</h4>
                        <h4>Locality: {aadhaarData.locality || 'N/A'}</h4>
                        <h4>DOB: {aadhaarData.date_of_birth || 'N/A'}</h4>
                    </>
                ) : (
                    <>
                        <h4>Aadhaar Name: N/A</h4>
                        <h4>Locality: N/A</h4>
                        <h4>DOB: N/A</h4>
                    </>
                )}
                    <h2 className="text-white text-2xl mb-5" >Registration Form</h2>
                    
                    <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    />

                    <input type="text" value={accountAddress} onChange={(e) => setAccountAddress(e.target.value)} 
                    placeholder="Account Address"
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password" 
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                    />
                    <button 
                    onClick={userRegister} disabled={loading}
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500">Register</button>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
            </>
        )}
        </div>
    </div>
  );
};

export default SignUp;