import LoginSimple from '../components/loginSimple';



export default function Home() {
  
  
    return (
      <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <img
            class="mx-auto w-auto"
            src="/img/Screen Capture_select-area_20201221163707.png"
            alt="Workflow"
          />
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in
          </h2>
        </div>
        <LoginSimple/>
        </div>
      </div>
    )
  }