import {Form} from 'remix'

export default function NewSecret() {
  return (
    <main className='mt-5'>
      <p className='text-lg text-blue opacity-80'>Add a new</p>
      <h1 className='text-6xl font-semibold text-white'>Secret</h1>
      <Form method='post'>
        <input
          type='text'
          name='secret'
          placeholder='type a name, e.g another secret'
          className='w-full h-12 p-3 mt-3 text-white rounded-md outline-none bg-black2 focus:outline-blue'
        />
        <button
          type='submit'
          className='flex px-3 py-2 mt-5 font-medium text-black rounded-md bg-blue active:scale-95 disabled:bg-gray'
        >
          Submit
        </button>
      </Form>
    </main>
  )
}
