import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Field, Label, Switch } from '@headlessui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import config from '../config/config'
import { sanitizeFormData } from '../utils/sanitizer';

export default function RegisterPage() {
  const [agreed, setAgreed] = useState(false)
  
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [verificationUrl, setVerificationUrl] = useState('');

  const handleChange = ({currentTarget: input}) => {
    setData({...data, [input.name]: input.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${config.api.baseUrl}${config.api.endpoints.users}`;
      const sanitizedData = sanitizeFormData(data);
      
      console.log('Registration attempt with data:', {
        ...sanitizedData,
        password: '[HIDDEN]' 
      });
      
      const {data: res} = await axios.post(url, sanitizedData)
      console.log('Registration successful:', res);
      
      if (res.verificationUrl) {
        const verificationUrl = res.verificationUrl.replace('http://localhost:3000', config.api.baseUrl);
        setVerificationUrl(verificationUrl);
      } else {
        navigate('/login')
      }
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message)
      } else {
        setError('An unexpected error occurred during registration')
      }
    }
  }

  return (
    <div className="isolate bg-white px-8 py-28 sm:py-36 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Register an account</h2>
        <p className="mt-4 text-lg/8 text-gray-600">Fill out the form below to register an account for Next Stop.</p>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto mt-20 max-w-xl sm:mt-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm/6 font-semibold text-gray-900">
              First name
            </label>
            <div className="mt-3">
              <input
                id="firstName"
                name="firstName"
                placeholder="First name"
                value={data.firstName}
                onChange={handleChange}
                type="text"
                className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm/6 font-semibold text-gray-900">
              Last name
            </label>
            <div className="mt-3">
            <input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={data.lastName}
                onChange={handleChange}
                type="text"
                className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="username" className="block text-sm/6 font-semibold text-gray-900">
              Username
            </label>
            <div className="mt-3">
              <input
                id="username"
                name="username"
                placeholder="Username"
                value={data.username}
                onChange={handleChange}
                type="text"
                autoComplete="username"
                className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
              Email
            </label>
            <div className="mt-3">
              <input
                id="email"
                name="email"
                placeholder="Email"
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
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
                type="password"
                autoComplete="password"
                className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm/6"
              />
            </div>
          </div>
          <Field className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-8 items-center">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className="group flex w-11 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 data-[checked]:bg-green-600"
              >
                <span className="sr-only">Agree to policies</span>
                <span
                  aria-hidden="true"
                  className="h-5 w-5 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-6"
                />
              </Switch>
            </div>
            <Label className="text-sm/6 text-gray-600">
              By selecting this, you agree to our{' '}
              <a href="#" className="font-semibold text-green-600">
                privacy&nbsp;policy
              </a>
              .
            </Label>
          </Field>
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="mt-12">
          <button
            type="submit"
            className="block w-full rounded-md bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Get started
          </button>
        </div>
      </form>
      
      {verificationUrl && (
        <div className="mx-auto mt-4 max-w-xl">
          <div className="p-4 bg-green-50 rounded-md border border-green-200">
            <p className="text-green-700 mb-2">Account created successfully! Please click the link to verify your email.</p>
            <div className="break-all bg-white p-3 rounded border border-green-100">
              <a href={verificationUrl} className="text-green-600 hover:text-green-500 text-sm">
                {verificationUrl}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
