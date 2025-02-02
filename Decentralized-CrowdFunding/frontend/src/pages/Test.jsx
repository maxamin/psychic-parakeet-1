import React, { useState } from 'react'
import { Web3Storage } from 'web3.storage'

function Test() {
  const client = new Web3Storage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY4YTcwOGY0NTI5MTdlZGMwNDU2N0Q2MzlDZjlmMEYxMTlFYjAwOTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzkxNjUxNjQ0NDMsIm5hbWUiOiJDcm93ZEZ1bmRpbmcifQ.iUossDvt3UX5-QCoZHG5wqCBzUaoRauFFNx4FfNnwwk'
  })

  const [file, setFile] = useState(null)
  const [imageName, setImageName] = useState('')

  // async function uploadFile(file) {
  //   const { cid } = await client.put(file);
  //   console.log(`File uploaded with CID: ${cid}`);
  // }

  function handleFileInput(e) {
    setFile(e.target.files)
    setImageName(e.target.files[0].name)
  }

  const handleUploadClick = async () => {
    try {
      const cid = await client.put(file)
      // console.log(`File link: https://dweb.link/ipfs/${cid}`);
      const slug = encodeURIComponent(imageName)
      console.log(`File link: ${cid}.ipfs.dweb.link/${slug}`)
    } catch (error) {
      console.log('No file selected', error)
    }
  }
  return (
    <div className="bg-white">
      <input type="file" onChange={handleFileInput} />
      <button onClick={handleUploadClick}>Upload</button>
    </div>
  )
}

export default Test
