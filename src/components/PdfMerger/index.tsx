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

// Importamos todos os componentes visuais do arquivo de estilos.
// Cada um é um elemento HTML estilizado com styled-components.
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
  FeaturesGrid,
  FeatureCard,
  FeatureTitle,
  FeatureText,
  StatusMessage,
  Footer,
} from './styles'

// Lê a chave pública da iLoveAPI do arquivo .env
// No Vite, variáveis de ambiente precisam começar com VITE_ para
// ficarem acessíveis no frontend via import.meta.env
// Ex: VITE_ILOVEPDF_KEY=project_public_xxx
const PUBLIC_KEY = import.meta.env.VITE_ILOVEPDF_KEY as string

// ── Tipos ──────────────────────────────────────────────────────

// Os possíveis estados da mensagem de feedback para o usuário
type StatusType = 'idle' | 'info' | 'success' | 'error'

interface StatusState {
  type: StatusType
  message: string
}

// Estrutura que a iLoveAPI espera para cada arquivo no /process
// server_filename: nome interno que a API atribuiu após o upload
// filename: nome original do arquivo (para referência)
interface UploadedFile {
  server_filename: string
  filename: string
}

// ── Componente principal ───────────────────────────────────────

export function PdfMerger() {
  // Ref para o <input type="file"> oculto — usamos ref em vez de
  // state porque não precisamos re-renderizar ao mudar o valor
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Lista de arquivos PDF selecionados pelo usuário
  const [files, setFiles] = useState<File[]>([])

  // Índice do item sendo arrastado na reordenação da lista
  const [dragSrcIdx, setDragSrcIdx] = useState<number | null>(null)

  // Controla o visual da drop zone quando o usuário arrasta um arquivo sobre ela
  const [isDragOver, setIsDragOver] = useState(false)

  // Indica se o processo de merge está em andamento (bloqueia o botão)
  const [loading, setLoading] = useState(false)

  // Mensagem de feedback exibida abaixo do card (info, sucesso ou erro)
  const [status, setStatus] = useState<StatusState>({ type: 'idle', message: '' })

  // ── Helpers ──────────────────────────────────────────────────

  // Converte bytes para KB ou MB de forma legível
  function fmtSize(bytes: number): string {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  // ── Handlers de seleção de arquivos ──────────────────────────

  // Adiciona novos arquivos à lista, ignorando:
  //   - arquivos que não são PDF
  //   - duplicatas (mesmo nome e tamanho)
  // useCallback evita recriar essa função a cada render
  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => {
      const valid = newFiles.filter(f => f.type === 'application/pdf')
      const unique = valid.filter(f => !prev.find(x => x.name === f.name && x.size === f.size))
      return [...prev, ...unique]
    })
  }, [])

  // Remove um arquivo da lista pelo índice
  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }

  // Chamado quando o usuário solta arquivos na drop zone
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault() // evita o browser abrir o arquivo
    setIsDragOver(false)
    addFiles([...e.dataTransfer.files])
  }

  // Chamado quando o usuário seleciona arquivos pelo input nativo
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles([...e.target.files])
    e.target.value = '' // reseta o input para permitir selecionar o mesmo arquivo de novo
  }

  // ── Handlers de reordenação (drag & drop da lista) ────────────

  // Guarda qual item está sendo arrastado
  const handleDragStart = (idx: number) => setDragSrcIdx(idx)

  // Quando solta sobre outro item: reordena o array de arquivos
  // splice(idx, 1) remove o item da posição original
  // splice(targetIdx, 0, moved) insere na nova posição
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
    // Verifica se a chave foi configurada no .env
    if (!PUBLIC_KEY) {
      setStatus({ type: 'error', message: 'Chave da iLoveAPI não configurada. Verifique o arquivo .env.' })
      return
    }

    setLoading(true)

    try {
      // ── PASSO 1: Autenticação ──────────────────────────────
      // Enviamos a public_key e recebemos um token JWT temporário
      // Esse token é usado em todas as chamadas seguintes
      setStatus({ type: 'info', message: 'Autenticando...' })
      const authRes = await fetch('https://api.ilovepdf.com/v1/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_key: PUBLIC_KEY }),
      })
      if (!authRes.ok) throw new Error('Erro de autenticação com a iLoveAPI.')
      const { token } = await authRes.json()

      // ── PASSO 2: Iniciar tarefa de merge ───────────────────
      // A API retorna:
      //   server: qual servidor vai processar essa tarefa
      //   task: ID único que identifica essa operação
      setStatus({ type: 'info', message: 'Iniciando tarefa de merge...' })
      const startRes = await fetch('https://api.ilovepdf.com/v1/start/merge', {
        headers: { Authorization: 'Bearer ' + token },
      })
      if (!startRes.ok) throw new Error('Erro ao iniciar tarefa.')
      const { server, task } = await startRes.json()

      // ── PASSO 3: Upload dos arquivos ───────────────────────
      // Cada arquivo é enviado separadamente via FormData
      // A API retorna um server_filename para cada um —
      // precisamos guardar esses nomes para usar no /process
      const uploadedFiles: UploadedFile[] = []

      for (let i = 0; i < files.length; i++) {
        setStatus({ type: 'info', message: `Enviando arquivo ${i + 1} de ${files.length}...` })

        const form = new FormData()
        form.append('task', task)       // vincula o upload à task criada
        form.append('file', files[i])   // o arquivo em si

        const upRes = await fetch(`https://${server}/v1/upload`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token },
          body: form,
        })
        if (!upRes.ok) throw new Error(`Erro ao enviar ${files[i].name}`)

        // Guardamos o server_filename retornado — sem ele o /process retorna 400
        const upData = await upRes.json()
        uploadedFiles.push({
          server_filename: upData.server_filename,
          filename: files[i].name,
        })
      }

      // ── PASSO 4: Processar (executar o merge) ──────────────
      // Passamos a lista completa de arquivos upados.
      // A ordem do array define a ordem das páginas no PDF final.
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
        // Tentamos ler a mensagem de erro da API para exibir algo útil
        const errData = await procRes.json().catch(() => ({}))
        throw new Error(`Erro ao processar o merge: ${errData?.message ?? procRes.status}`)
      }

      // ── PASSO 5: Download do PDF mesclado ──────────────────
      // A resposta é um Blob (binário) — criamos uma URL temporária
      // e simulamos um clique num link para fazer o download
      setStatus({ type: 'info', message: 'Baixando arquivo final...' })
      const dlRes = await fetch(`https://${server}/v1/download/${task}`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      if (!dlRes.ok) throw new Error('Erro ao baixar o arquivo.')

      const blob = await dlRes.blob()
      const url = URL.createObjectURL(blob)   // cria URL temporária na memória
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()                               // dispara o download
      URL.revokeObjectURL(url)                // libera a memória

      setStatus({ type: 'success', message: `PDF mesclado com sucesso! (${files.length} arquivos combinados)` })

    } catch (e: unknown) {
      // Trata qualquer erro lançado acima
      const msg = e instanceof Error ? e.message : 'Erro inesperado.'
      setStatus({ type: 'error', message: msg })
    } finally {
      // Sempre desativa o loading, independente de sucesso ou erro
      setLoading(false)
    }
  }

  // ── Renderização ──────────────────────────────────────────────

  return (
    <>
      <Container>
        <Hero>
          <Title>Junte seus PDFs de forma simples e rápida</Title>
          <Subtitle>
            Combine múltiplos arquivos PDF em um único documento com apenas alguns cliques.
            Rápido, seguro e gratuito.
          </Subtitle>
        </Hero>

        <Card>
          {/* Área de drag & drop
              $isDragOver é uma prop para o styled-component mudar o visual */}
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

            {/* e.stopPropagation() evita que o clique no botão
                dispare também o onClick da DropZone */}
            <SelectButton
              type="button"
              onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}
            >
              Selecionar PDFs
            </SelectButton>

            {/* Input oculto — acionado programaticamente via ref */}
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
                  key={`${f.name}-${f.size}`} // chave única baseada em nome + tamanho
                  draggable                    // habilita drag nativo do HTML5
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={e => e.preventDefault()} // necessário para o onDrop funcionar
                  onDrop={() => handleDropItem(i)}
                  onDragEnd={() => setDragSrcIdx(null)} // limpa o índice ao soltar
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

              {/* Botão de merge — desabilitado se tiver menos de 2 arquivos ou estiver processando */}
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

        {/* Cards informativos no rodapé */}
        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>Rápido e fácil</FeatureTitle>
            <FeatureText>
              Junte seus PDFs em segundos com nossa interface intuitiva de arrastar e soltar
            </FeatureText>
          </FeatureCard>
          <FeatureCard>
            <FeatureTitle>100% seguro</FeatureTitle>
            <FeatureText>
              Seus arquivos são processados com criptografia de ponta a ponta e deletados após 2h
            </FeatureText>
          </FeatureCard>
          <FeatureCard>
            <FeatureTitle>Totalmente gratuito</FeatureTitle>
            <FeatureText>
              Sem limites, sem cadastro, sem custos. Use quantas vezes precisar
            </FeatureText>
          </FeatureCard>
        </FeaturesGrid>
      </Container>

      <Footer>© 2026 Flysmart. Todos os direitos reservados.</Footer>
    </>
  )
}
