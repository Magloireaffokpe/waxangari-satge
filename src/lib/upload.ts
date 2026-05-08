import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function uploadCV(file: File): Promise<string> {
  const storageType = process.env.STORAGE_TYPE || 'local'
  
  if (storageType === 'vercel-blob') {
    const { put } = await import('@vercel/blob')
    const blob = await put(`cv/${Date.now()}-${file.name}`, file, { access: 'public' })
    return blob.url
  }
  
  // Local storage (default)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filepath = path.join(uploadDir, filename)
  
  await writeFile(filepath, buffer)
  return `/uploads/${filename}`
}
