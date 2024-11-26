import { useState, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Field, Label, Switch } from '@headlessui/react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import config from '../config/config'
import { sanitizeFormData } from '../utils/sanitizer';

export default function LoginPage() {
  const [agreed, setAgreed] = useState(false)
  const [searchParams] = useSearchParams();
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setVerificationSuccess(true);
      const timer = setTimeout(() => {
        setVerificationSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const [error, setError] = useState('')
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const navigate = useNavigate()

  const handleChange = ({currentTarget: input}) => {
    setData({...data, [input.name]: input.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedData = sanitizeFormData(data);
      console.log('Login attempt for email:', sanitizedData.email);
      const url = `${config.api.baseUrl}${config.api.endpoints.auth}`;
      const {data: res} = await axios.post(url, sanitizedData)
      
      if (res.needsVerification) {
        setNeedsVerification(true);
        setVerificationToken(res.verificationToken);
        setError('Please verify your email before logging in');
        return;
      }
      
      console.log('Login successful, token received');
      localStorage.setItem("token", res.data)
      localStorage.setItem("email", sanitizedData.email)
      window.location = '/'
    } catch (error) {
      console.error('Login failed:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.message
      });
      
      if (error.response?.data?.needsVerification) {
        setNeedsVerification(true);
        setVerificationToken(error.response.data.verificationToken);
        setError('Please verify your email before logging in');
      } else if (error.response?.data?.isDisabled) {
        setError(error.response.data.message);
      } else {
        setError('Login was unsuccessful');
      }
    }
  }

  return (
    <div className="isolate bg-white px-8 py-28 sm:py-36 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        {verificationSuccess && (
          <div className="mb-6 p-4 bg-green-50 rounded-md border border-green-200">
            <p className="text-green-700">Email verified successfully! You can now log in.</p>
          </div>
        )}
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Log in to existing account</h2>
        <p className="mt-4 text-lg/8 text-gray-600">Enter your Next Stop account details.</p>
      </div>
      <form action="#" method="POST" className="mx-auto mt-20 max-w-xl sm:mt-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
              Email
            </label>
            <div className="mt-3">
              <input
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                type="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="password" className="block text-sm/6 font-semibold text-gray-900">
              Password
            </label>
            <div className="mt-3">
              <input
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                type="password"
                autoComplete="password"
                className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm/6"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Field className="flex gap-x-4">
            <Label className="text-sm/6 text-gray-600">
              Don't have an account? {' '}
              <Link to="/register" className="font-semibold text-green-600">
                Create&nbsp;one
              </Link>
              .
            </Label>
          </Field>
        </div>

        {error && (
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>
        )}

        {needsVerification && verificationToken && (
          <div className="mx-auto mt-4 max-w-xl">
            <div className="p-4 bg-green-50 rounded-md border border-green-200">
              <p className="text-green-700 mb-2">Please click the link to verify your email.</p>
              <div className="break-all bg-white p-3 rounded border border-green-100">
                <a 
                  href={`${config.api.baseUrl}/api/users/verify/${verificationToken}`}
                  className="text-green-600 hover:text-green-500 text-sm"
                >
                  ${config.api.baseUrl}/api/users/verify/${verificationToken}
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <button
            type="submit"
            onClick={handleSubmit}
            className="block w-full rounded-md bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}
