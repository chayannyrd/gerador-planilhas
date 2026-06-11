// ─────────────────────────────────────────────────────────────
// PdfMerger/index.tsx
//
// Componente responsável por mesclar múltiplos arquivos PDF
// usando a API do iLovePDF (iLoveAPI).
//
// Fluxo da API:
//   1. POST /auth         → troca a public_key por um token JWT
//   2. GET  /start/merge  → cria uma "task" e retorna o servidor
//   3. POST /upload       → envia cada PDF para aquela task
//   4. POST /process      → manda processar (merge) os arquivos
//   5. GET  /download/:id → baixa o PDF final mesclado
// ─────────────────────────────────────────────────────────────

import { useRef, useState, useCallback } from 'react'

import {
  Container,
  Hero,
  Title,
  Subtitle,
  Card,
  DropZone,
  UploadIcon,
  DropTitle,
  DropHint,
  SelectButton,
  HiddenInput,
  FileListCard,
  FileListHeader,
  FileItem,
  FileIcon,
  FileInfo,
  FileName,
  FileSize,
  RemoveButton,
  MergeButton,
  StatusMessage,
} from './styles'

const PUBLIC_KEY = import.meta.env.VITE_ILOVEPDF_KEY as string

// ── Tipos ──────────────────────────────────────────────────────

type StatusType = 'idle' | 'info' | 'success' | 'error'

interface StatusState {
  type: StatusType
  message: string
}

interface UploadedFile {
  server_filename: string
  filename: string
}

// ── Componente principal ───────────────────────────────────────

export function PdfMerger() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [dragSrcIdx, setDragSrcIdx] = useState<number | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<StatusState>({ type: 'idle', message: '' })

  // ── Helpers ──────────────────────────────────────────────────

  function fmtSize(bytes: number): string {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  // ── Handlers de seleção de arquivos ──────────────────────────

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => {
      const valid = newFiles.filter(f => f.type === 'application/pdf')
      const unique = valid.filter(f => !prev.find(x => x.name === f.name && x.size === f.size))
      return [...prev, ...unique]
    })
  }, [])

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    addFiles([...e.dataTransfer.files])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles([...e.target.files])
    e.target.value = ''
  }

  // ── Handlers de reordenação (drag & drop da lista) ────────────

  const handleDragStart = (idx: number) => setDragSrcIdx(idx)

  const handleDropItem = (targetIdx: number) => {
    if (dragSrcIdx === null || dragSrcIdx === targetIdx) return
    setFiles(prev => {
      const arr = [...prev]
      const [moved] = arr.splice(dragSrcIdx, 1)
      arr.splice(targetIdx, 0, moved)
      return arr
    })
    setDragSrcIdx(null)
  }

  // ── Handler principal: merge via iLoveAPI ─────────────────────

  const handleMerge = async () => {
    if (!PUBLIC_KEY) {
      setStatus({ type: 'error', message: 'Chave da iLoveAPI não configurada. Verifique o arquivo .env.' })
      return
    }

    setLoading(true)

    try {
      // ── PASSO 1: Autenticação ──────────────────────────────
      setStatus({ type: 'info', message: 'Autenticando...' })
      const authRes = await fetch('https://api.ilovepdf.com/v1/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_key: PUBLIC_KEY }),
      })
      if (!authRes.ok) throw new Error('Erro de autenticação com a iLoveAPI.')
      const { token } = await authRes.json()

      // ── PASSO 2: Iniciar tarefa de merge ───────────────────
      setStatus({ type: 'info', message: 'Iniciando tarefa de merge...' })
      const startRes = await fetch('https://api.ilovepdf.com/v1/start/merge', {
        headers: { Authorization: 'Bearer ' + token },
      })
      if (!startRes.ok) throw new Error('Erro ao iniciar tarefa.')
      const { server, task } = await startRes.json()

      // ── PASSO 3: Upload dos arquivos ───────────────────────
      const uploadedFiles: UploadedFile[] = []

      for (let i = 0; i < files.length; i++) {
        setStatus({ type: 'info', message: `Enviando arquivo ${i + 1} de ${files.length}...` })

        const form = new FormData()
        form.append('task', task)
        form.append('file', files[i])

        const upRes = await fetch(`https://${server}/v1/upload`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token },
          body: form,
        })
        if (!upRes.ok) throw new Error(`Erro ao enviar ${files[i].name}`)

        const upData = await upRes.json()
        uploadedFiles.push({
          server_filename: upData.server_filename,
          filename: files[i].name,
        })
      }

      // ── PASSO 4: Processar (executar o merge) ──────────────
      setStatus({ type: 'info', message: 'Mesclando PDFs...' })
      const procRes = await fetch(`https://${server}/v1/process`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          tool: 'merge',
          files: uploadedFiles, // ← obrigatório! sem isso a API retorna 400
        }),
      })
      if (!procRes.ok) {
        const errData = await procRes.json().catch(() => ({}))
        throw new Error(`Erro ao processar o merge: ${errData?.message ?? procRes.status}`)
      }

      // ── PASSO 5: Download do PDF mesclado ──────────────────
      setStatus({ type: 'info', message: 'Baixando arquivo final...' })
      const dlRes = await fetch(`https://${server}/v1/download/${task}`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      if (!dlRes.ok) throw new Error('Erro ao baixar o arquivo.')

      const blob = await dlRes.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)

      setStatus({ type: 'success', message: `PDF mesclado com sucesso! (${files.length} arquivos combinados)` })

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro inesperado.'
      setStatus({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }

  // ── Renderização ──────────────────────────────────────────────

  return (
    <Container>
      <Hero>
        <Title>Junte seus PDFs de forma simples e rápida</Title>
        <Subtitle>
          Combine múltiplos arquivos PDF em um único documento com apenas alguns cliques.
          Rápido, seguro e gratuito.
        </Subtitle>
      </Hero>

      <Card>
        {/* Área de drag & drop */}
        <DropZone
          $isDragOver={isDragOver}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <UploadIcon>↑</UploadIcon>
          <DropTitle>Arraste seus PDFs aqui</DropTitle>
          <DropHint>ou clique para selecionar arquivos</DropHint>

          <SelectButton
            type="button"
            onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}
          >
            Selecionar PDFs
          </SelectButton>

          <HiddenInput
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileInput}
          />
        </DropZone>

        {/* Lista de arquivos — só aparece quando há pelo menos 1 arquivo */}
        {files.length > 0 && (
          <FileListCard>
            <FileListHeader>Arquivos selecionados ({files.length})</FileListHeader>

            {files.map((f, i) => (
              <FileItem
                key={`${f.name}-${f.size}`}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDropItem(i)}
                onDragEnd={() => setDragSrcIdx(null)}
              >
                <FileIcon>⠿</FileIcon>
                <FileInfo>
                  <FileName>{f.name}</FileName>
                  <FileSize>{fmtSize(f.size)}</FileSize>
                </FileInfo>
                <RemoveButton type="button" onClick={() => removeFile(i)}>
                  Remover
                </RemoveButton>
              </FileItem>
            ))}

            {/* Desabilitado se tiver menos de 2 arquivos ou estiver processando */}
            <MergeButton
              type="button"
              onClick={handleMerge}
              disabled={files.length < 2 || loading}
            >
              {loading ? 'Processando...' : `Juntar PDFs (${files.length} arquivos)`}
            </MergeButton>
          </FileListCard>
        )}
      </Card>

      {/* Mensagem de status — só renderiza quando não está idle */}
      {status.type !== 'idle' && (
        <StatusMessage $type={status.type}>
          {status.message}
        </StatusMessage>
      )}
    </Container>
  )
}
