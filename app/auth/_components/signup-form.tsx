"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, MutableRefObject, useContext, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { User, UserContext } from "../../../context/UserContext";
import { ArrowBack } from "../../_components/icons/ArrowBack";

type SignUpResponseData = {
  success: boolean
  user: string
  code: string
}

export function SignUpForm() {
  const [name, setName] = useState("")
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  
  const router = useRouter()

  const { saveUser, setIsUserAuthenticated } = useContext(UserContext)

  const onSubmit = async(event: FormEvent) => {
    event.preventDefault()

    if(!name || !username || !password) return toast("Preencha os campos")

    try {
      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        body: JSON.stringify({ name, username, password })
      })

      if(!response.ok) {
        throw response
      }
      
      const data = await response.json() as SignUpResponseData
      const user = JSON.parse(data.user) as User
      saveUser(user)
      setIsUserAuthenticated(true)
      router.push("/articles")
    } catch (error: any) {
      if(error instanceof Response) {
        if(error.status === 400) {
          return toast.error("Usuário já existe")
        }
      }
      return toast.error("Erro inesperado")
    }
  }
  
  const passwordInput: MutableRefObject<HTMLInputElement> = useRef(null)
  const handlePassInputVisibility = () => {
    const currentType = passwordInput.current.type
    currentType === "password" 
      ? passwordInput.current.type = "text" 
      : passwordInput.current.type = "password"
  }

  return (
    <div className="bg-zinc-950 w-full max-w-lg p-10 shadow-zinc-950/50 shadow-lg flex flex-col h-screen relative lg:h-auto lg:rounded-lg">
      <div onClick={() => router.back()} className="block w-10 absolute top-3 left-3 lg:hidden">
        <ArrowBack />
      </div>
      <h1 className="text-zinc-100 text-2xl font-bold lg:font-semibold text-center mt-5 lg:mt-0">Crie uma conta agora</h1>
      <form onSubmit={e => onSubmit(e)} className="flex flex-col gap-3.5 w-full mt-10">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-zinc-300 font-semibold text-sm mb-1.5">Seu nome</label>
          <input
            type="text" 
            name="name" 
            id="name"
            className="h-11 bg-zinc-800 rounded-md px-3 outline-none font-sans text-zinc-100 outline focus:outline-indigo-700 transition-all"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="username" className="text-zinc-300 font-semibold text-sm mb-1.5">Nome de usuário</label>
          <div className="relative w-full">
            <svg className="absolute top-2.5 left-1.5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="currentColor" d="M222-255q63-40 124.5-60.5T480-336q72 0 134 20.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm257.814-195Q422-450 382.5-489.686q-39.5-39.686-39.5-97.5t39.686-97.314q39.686-39.5 97.5-39.5t97.314 39.686q39.5 39.686 39.5 97.5T577.314-489.5q-39.686 39.5-97.5 39.5Zm-.219 370q-83.146 0-156.275-31.5t-127.225-86Q142-252 111-324.841 80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.5q-54 54.5-127.129 86T479.595-80Z"/></svg>
            <input
              type="text" 
              name="username" 
              id="username"
              className="h-11 bg-zinc-800 rounded-md pl-9 outline-none font-sans text-zinc-100 w-full outline focus:outline-indigo-700 transition-all"
              value={username}
              onChange={e => setUserName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-zinc-300 font-semibold text-sm mb-1.5">Senha</label>
          <div className="relative w-full">
            <svg className="absolute top-2.5 left-1.5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22"><path fill="currentColor" d="M220-80q-24.75 0-42.375-17.625T160-140v-434q0-24.75 17.625-42.375T220-634h70v-96q0-78.85 55.606-134.425Q401.212-920 480.106-920T614.5-864.425Q670-808.85 670-730v96h70q24.75 0 42.375 17.625T800-574v434q0 24.75-17.625 42.375T740-80H220Zm260.168-200Q512-280 534.5-302.031T557-355q0-30-22.668-54.5t-54.5-24.5Q448-434 425.5-409.5t-22.5 55q0 30.5 22.668 52.5t54.5 22ZM350-634h260v-96q0-54.167-37.882-92.083-37.883-37.917-92-37.917Q426-860 388-822.083 350-784.167 350-730v96Z"/></svg>
            <input 
              type="password" 
              name="password"
              id="password"
              className="h-11 bg-zinc-800 rounded-md px-9 outline-none font-sans text-zinc-100 w-full outline focus:outline-indigo-700 transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              ref={passwordInput}
            />
            <svg onClick={handlePassInputVisibility} className="absolute top-2.5 right-1.5 text-zinc-950 cursor-pointer hover:text-indigo-700 transition" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="currentColor" d="M480.118-330Q551-330 600.5-379.618q49.5-49.617 49.5-120.5Q650-571 600.382-620.5q-49.617-49.5-120.5-49.5Q409-670 359.5-620.382q-49.5 49.617-49.5 120.5Q310-429 359.618-379.5q49.617 49.5 120.5 49.5Zm-.353-58Q433-388 400.5-420.735q-32.5-32.736-32.5-79.5Q368-547 400.735-579.5q32.736-32.5 79.5-32.5Q527-612 559.5-579.265q32.5 32.736 32.5 79.5Q592-453 559.265-420.5q-32.736 32.5-79.5 32.5ZM480-200q-146 0-264-83T40-500q58-134 176-217t264-83q146 0 264 83t176 217q-58 134-176 217t-264 83Z"/></svg>
          </div>
        </div>
        <div className="mt-8">
          <button type="submit" className="bg-indigo-700 w-full h-11 rounded-md text-white font-bold hover:bg-indigo-800 transition">Entrar</button>
        </div>
      </form>
      <span className="text-white text-sm mt-5">
        Já possui conta? <Link href="/auth/login" className="text-indigo-700 font-bold">Entrar</Link>
      </span>
      <Toaster />
    </div>
  )
}